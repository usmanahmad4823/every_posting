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
  const successPlan = (urlParams.get('plan') as PlanType) || 'pro';

  // 2. Read stored session from localStorage
  const storedUserRaw = localStorage.getItem('everyposting_user');
  let storedUser: any = null;
  if (storedUserRaw) {
    try {
      storedUser = JSON.parse(storedUserRaw);
    } catch {}
  }

  // Handle post-checkout payment reconciliation
  if (isPaymentSuccess && storedUser && storedUser.loggedIn) {
    const updated: UserSessionState = {
      id: storedUser.id,
      email: storedUser.email,
      fullName: storedUser.fullName || storedUser.email?.split('@')[0] || 'Creator',
      plan: successPlan,
      planStatus: 'active',
      generationsUsedThisMonth: storedUser.generationsUsedThisMonth || 0,
      monthlyGenerationLimit: getGenerationLimit(successPlan),
      hasSeenReviewPrompt: false,
      loggedIn: true,
    };
    localStorage.setItem('everyposting_user', JSON.stringify(updated));
    return updated;
  }

  // 3. Fetch fresh user profile & subscription tier from database / profile backend
  try {
    const activeUserId = storedUser?.id || 'guest-user';
    const profile = await getUserProfile(activeUserId);

    const mappedPlan: PlanType =
      profile?.subscriptionTier || storedUser?.plan || storedUser?.tier || 'free';
    const mappedStatus: PlanStatus = profile?.planStatus || storedUser?.planStatus || 'active';

    const cleanEmail = profile?.email || storedUser?.email || 'usmanahmad4t12@gmail.com';
    const emailPrefixName = cleanEmail
      ? cleanEmail
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\d+/g, ' ')
          .trim()
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
      : 'Usman Ahmad';

    const cleanFullName = profile?.fullName || storedUser?.fullName || emailPrefixName;
    const currentUsage = profile?.generationsUsedThisMonth ?? storedUser?.generationsUsedThisMonth ?? 0;

    const updatedSession: UserSessionState = {
      id: profile?.id || storedUser?.id || 'guest-user',
      email: cleanEmail,
      fullName: cleanFullName,
      plan: mappedPlan,
      planStatus: mappedStatus,
      generationsUsedThisMonth: currentUsage,
      monthlyGenerationLimit: profile?.monthlyGenerationLimit || getGenerationLimit(mappedPlan),
      hasSeenReviewPrompt: profile?.hasSeenReviewPrompt || false,
      loggedIn: true,
    };

    // Keep localStorage synced with latest fetched profile
    localStorage.setItem('everyposting_user', JSON.stringify(updatedSession));

    return updatedSession;
  } catch (err) {
    console.warn('[UserProvider] Error fetching live profile, using cached fallback:', err);

    const fallbackUsage = storedUser?.generationsUsedThisMonth ?? 0;
    const fallbackPlan = storedUser?.plan || storedUser?.tier || 'free';
    return {
      id: storedUser?.id || 'guest-user',
      email: storedUser?.email || 'usmanahmad4t12@gmail.com',
      fullName: storedUser?.fullName || 'Usman Ahmad',
      plan: fallbackPlan,
      planStatus: storedUser?.planStatus || 'active',
      generationsUsedThisMonth: fallbackUsage,
      monthlyGenerationLimit: getGenerationLimit(fallbackPlan),
      hasSeenReviewPrompt: false,
      loggedIn: true,
    };
  }
}

function UserContextProviderInner({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user = DEFAULT_USER, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUser,
  });

  // SUPABASE REALTIME LISTENERS FOR INSTANT POSTGRES SYNC
  useEffect(() => {
    if (!user.loggedIn || !user.id || !isSupabaseConfigured()) return;

    // Subscribe to Postgres UPDATE events on users table for current user row
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

    // Subscribe to Postgres UPDATE events on subscriptions table for current user row
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

    // Cleanup realtime listeners on unmount
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
      const storedUserRaw = localStorage.getItem('everyposting_user');
      let storedUser: any = {};
      if (storedUserRaw) {
        try {
          storedUser = JSON.parse(storedUserRaw);
        } catch {}
      }

      const basePlan = partial.plan || old?.plan || storedUser.plan || storedUser.tier || 'free';
      const base = old && old.loggedIn ? old : {
        id: storedUser.id || 'user-1',
        email: storedUser.email || 'usmanahmad4t12@gmail.com',
        fullName: storedUser.fullName || 'Usman Ahmad',
        plan: basePlan,
        planStatus: storedUser.planStatus || 'active',
        generationsUsedThisMonth: 0,
        monthlyGenerationLimit: getGenerationLimit(basePlan),
        hasSeenReviewPrompt: false,
        loggedIn: true,
      };

      const updated: UserSessionState = {
        ...base,
        ...partial,
        monthlyGenerationLimit: partial.monthlyGenerationLimit || getGenerationLimit(partial.plan || base.plan),
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
