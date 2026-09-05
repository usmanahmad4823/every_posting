'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/providers/user-provider';
import { AuthLoadingScreen } from '@/components/ui/auth-loading';
import { HeroSection } from '@/components/landing/hero';
import { SocialProofSection } from '@/components/landing/social-proof';
import { HowItWorksSection } from '@/components/landing/how-it-works';
import { NicheFeaturesSection } from '@/components/landing/niche-features';
import { PricingSection } from '@/components/landing/pricing';
import { TestimonialsSection } from '@/components/landing/testimonials';
import { FAQSection } from '@/components/landing/faq';
import { FooterSection } from '@/components/landing/footer';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.loggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoading, user?.loggedIn, router]);

  if (isLoading) {
    return <AuthLoadingScreen message="Loading EveryPosting..." />;
  }

  if (user?.loggedIn) {
    return <AuthLoadingScreen message="Redirecting to your Creator Studio..." />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <SocialProofSection />
      <HowItWorksSection />
      <NicheFeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
