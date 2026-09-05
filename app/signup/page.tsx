'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLoadingScreen } from '@/components/ui/auth-loading';

export default function SignupAliasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-up');
  }, [router]);

  return <AuthLoadingScreen message="Redirecting to Sign Up..." />;
}
