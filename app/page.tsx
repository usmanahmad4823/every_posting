import { HeroSection } from '@/components/landing/hero';
import { SocialProofSection } from '@/components/landing/social-proof';
import { HowItWorksSection } from '@/components/landing/how-it-works';
import { NicheFeaturesSection } from '@/components/landing/niche-features';
import { PricingSection } from '@/components/landing/pricing';
import { TestimonialsSection } from '@/components/landing/testimonials';
import { FAQSection } from '@/components/landing/faq';
import { FooterSection } from '@/components/landing/footer';

export default function Home() {
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
