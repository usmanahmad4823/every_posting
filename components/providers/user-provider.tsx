'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserSessionState, PlanType, PlanStatus } from '@/lib/types';
import { getUserProfile, supabase, isSupabaseConfigured } from '@/lib/supabase';

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
  id: 'user-1',
  email: 'usmanahmad4t12@gmail.com',
  fullName: 'Usman Ahmad',
  plan: 'free',
  planStatus: 'active',
  generationsUsedThisMonth: 0,
  monthlyGenerationLimit: 10,
  hasSeenReviewPrompt: false,
  loggedIn: true,
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

  // 1. Read stored session from localStorage
  const storedUserRaw = localStorage.getItem('everyposting_user');
  let storedUser: any = null;
  if (storedUserRaw) {
    try {
      storedUser = JSON.parse(storedUserRaw);
    } catch {}
  }

  // 2. Fetch fresh user profile & subscription tier from Supabase / DB backend
  try {
    const profile = await getUserProfile(storedUser?.id || 'demo-user-1');

    const mappedPlan: PlanType =
      profile.subscriptionTier || storedUser?.tier || 'free';
    const mappedStatus: PlanStatus = profile.planStatus || 'active';

    const cleanEmail = profile.email || storedUser?.email || 'usmanahmad4t12@gmail.com';
    const emailPrefixName = cleanEmail
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\d+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    const cleanFullName = profile.fullName || storedUser?.fullName || (emailPrefixName.length > 2 ? emailPrefixName : 'Usman Ahmad');

    const updatedSession: UserSessionState = {
      id: profile.id || storedUser?.id || 'user-1',
      email: cleanEmail,
      fullName: cleanFullName,
      plan: mappedPlan,
      planStatus: mappedStatus,
      generationsUsedThisMonth: profile.generationsUsedThisMonth ?? 0,
      monthlyGenerationLimit: mappedPlan === 'free' ? 10 : 9999,
      hasSeenReviewPrompt: profile.hasSeenReviewPrompt || false,
      loggedIn: true,
    };

    // Keep localStorage synced with latest fetched profile
    localStorage.setItem('everyposting_user', JSON.stringify(updatedSession));

    return updatedSession;
  } catch (err) {
    console.warn('[UserProvider] Error fetching live profile, using cached fallback:', err);
    return {
      id: storedUser?.id || 'user-1',
      email: storedUser?.email || 'usmanahmad4t12@gmail.com',
      fullName: storedUser?.fullName || 'Usman Ahmad',
      plan: storedUser?.tier || storedUser?.plan || 'free',
      planStatus: storedUser?.planStatus || 'active',
      generationsUsedThisMonth: 0,
      monthlyGenerationLimit: 10,
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
      const base = old || DEFAULT_USER;
      const updated = { ...base, ...partial };
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
