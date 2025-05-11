
import { Container } from "@/components/ui/container";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { PricingHeader } from "./pricing/PricingHeader";
import { SubscriptionPlans } from "./pricing/SubscriptionPlans";
import { CreditPlanSlider } from "./pricing/CreditPlanSlider";
import { PricingFooter } from "./pricing/PricingFooter";
import { DecorativeBackground } from "./pricing/DecorativeBackground";

export default function Pricing() {
  const { subscriptionPlans, creditPlans } = usePricingPlans();

  return (
    <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <DecorativeBackground />
      
      <Container className="relative">
        <PricingHeader />

        {/* Monthly Subscription Plans */}
        <SubscriptionPlans subscriptionPlans={subscriptionPlans} />

        {/* Pay as You Go Credit Plan with Slider */}
        <CreditPlanSlider creditPlans={creditPlans} />
        
        <PricingFooter />
      </Container>
    </section>
  );
}
