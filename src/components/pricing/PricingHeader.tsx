
import { withDelay, animationClasses } from "@/lib/animations";

export function PricingHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
        Simple, Transparent Pricing
      </h2>
      <p className={`text-lg text-slate-600 ${withDelay(animationClasses.slideUp, 200)}`}>
        Choose the plan that's right for your business. All plans include a 14-day free trial.
      </p>
    </div>
  );
}
