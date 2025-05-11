
import { PlanCard } from "./PlanCard";
import { MobilePlanCarousel } from "./MobilePlanCarousel";

interface SubscriptionPlansProps {
  subscriptionPlans: any[];
}

export function SubscriptionPlans({ subscriptionPlans }: SubscriptionPlansProps) {
  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold text-center mb-10">Monthly Subscription Plans</h3>
      
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {subscriptionPlans.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
      
      <MobilePlanCarousel plans={subscriptionPlans} />
    </div>
  );
}
