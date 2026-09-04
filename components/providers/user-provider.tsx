'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserSessionState, PlanType, PlanStatus } from '@/lib/types';
import { getUserProfile, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getGenerationLimit } from '@/lib/plans';

// TanStack Query Client Singleton
const queryClientSingleton = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchInterval: 30000, // Background polling fallback every 30s for resilient sync
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

interface UserContextType {
  user: UserSessionState;
  isLoading: boolean;
  isError: boolean;
  invalidateUser: () => Promise<void>;
  updateUserLocally: (partial: Partial<UserSessionState>) => void;
}

const DEFAULT_USER: UserSessionState = {
  id: '',
  email: '',
  fullName: '',
  plan: 'free',
  planStatus: 'active',
  generationsUsedThisMonth: 0,
  monthlyGenerationLimit: getGenerationLimit('free'),
  hasSeenReviewPrompt: false,
  loggedIn: false,
};

const UserContext = createContext<UserContextType>({
  user: DEFAULT_USER,
  isLoading: false,
  isError: false,
  invalidateUser: async () => {},
  updateUserLocally: () => {},
});

async function fetchCurrentUser(): Promise<UserSessionState> {
  if (typeof window === 'undefined') return DEFAULT_USER;

  // 1. Check for payment success URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const isPaymentSuccess = urlParams.get('payment_success') === 'true';
  const successPlan = (urlParams.get('plan') as PlanType) || 'pro_monthly';

  // 2. Demo Mode (when Supabase is not configured)
  if (!isSupabaseConfigured()) {
    const storedUserRaw = localStorage.getItem('everyposting_user');
    if (!storedUserRaw) return DEFAULT_USER;
    try {
      const stored = JSON.parse(storedUserRaw);
      if (!stored || !stored.loggedIn) return DEFAULT_USER;

      const plan = isPaymentSuccess ? successPlan : (stored.plan || stored.tier || 'free');
      const updated: UserSessionState = {
        id: stored.id || 'demo-user-1',
        email: stored.email || 'demo@everyposting.com',
        fullName: stored.fullName || 'Demo User',
        plan,
        planStatus: stored.planStatus || 'active',
        generationsUsedThisMonth: stored.generationsUsedThisMonth || 0,
        monthlyGenerationLimit: getGenerationLimit(plan),
        hasSeenReviewPrompt: false,
        loggedIn: true,
      };
      localStorage.setItem('everyposting_user', JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_USER;
    }
  }

  // 3. Real Supabase Auth Mode: Check Active Session
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      // Unauthenticated state: clear any stale user data
      localStorage.removeItem('everyposting_user');
      return DEFAULT_USER;
    }

    const authUser = session.user;
    const profile = await getUserProfile(authUser.id);

    const mappedPlan: PlanType = isPaymentSuccess
      ? successPlan
      : (profile?.subscriptionTier || 'free');
    const mappedStatus: PlanStatus = profile?.planStatus || 'active';
    const cleanEmail = authUser.email || profile?.email || '';

    const emailPrefixName = cleanEmail
      ? cleanEmail
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\d+/g, ' ')
          .trim()
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
      : 'Creator';

    const cleanFullName =
      profile?.fullName ||
      authUser.user_metadata?.full_name ||
      emailPrefixName;

    const currentUsage = profile?.generationsUsedThisMonth ?? 0;

    const updatedSession: UserSessionState = {
      id: authUser.id,
      email: cleanEmail,
      fullName: cleanFullName,
      plan: mappedPlan,
      planStatus: mappedStatus,
      generationsUsedThisMonth: currentUsage,
      monthlyGenerationLimit: getGenerationLimit(mappedPlan),
      hasSeenReviewPrompt: profile?.hasSeenReviewPrompt || false,
      loggedIn: true,
    };

    localStorage.setItem('everyposting_user', JSON.stringify(updatedSession));
    return updatedSession;
  } catch (err) {
    console.warn('[UserProvider] Error checking auth session:', err);
    localStorage.removeItem('everyposting_user');
    return DEFAULT_USER;
  }
}

function UserContextProviderInner({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user = DEFAULT_USER, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUser,
  });

  // SUPABASE AUTH STATE LISTENER (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, INITIAL_SESSION)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          localStorage.removeItem('everyposting_user');
          queryClient.setQueryData(['user'], DEFAULT_USER);
          queryClient.invalidateQueries({ queryKey: ['user'] });
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          queryClient.invalidateQueries({ queryKey: ['user'] });
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, [queryClient]);

  // SUPABASE REALTIME DB LISTENERS FOR AUTHENTICATED USER
  useEffect(() => {
    if (!user.loggedIn || !user.id || !isSupabaseConfigured()) return;

    const userChannel = supabase
      .channel(`realtime-user-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['user'] });
        }
      )
      .subscribe();

    const subChannel = supabase
      .channel(`realtime-sub-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['user'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userChannel);
      supabase.removeChannel(subChannel);
    };
  }, [user.id, user.loggedIn, queryClient]);

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  const updateUserLocally = (partial: Partial<UserSessionState>) => {
    queryClient.setQueryData(['user'], (old: UserSessionState | undefined) => {
      if (!old || !old.loggedIn) return DEFAULT_USER;

      const basePlan = partial.plan || old.plan || 'free';
      const updated: UserSessionState = {
        ...old,
        ...partial,
        monthlyGenerationLimit: partial.monthlyGenerationLimit || getGenerationLimit(basePlan),
        loggedIn: true,
      };

      localStorage.setItem('everyposting_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isError,
      invalidateUser,
      updateUserLocally,
    }),
    [user, isLoading, isError]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClientSingleton}>
      <UserContextProviderInner>{children}</UserContextProviderInner>
    </QueryClientProvider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
