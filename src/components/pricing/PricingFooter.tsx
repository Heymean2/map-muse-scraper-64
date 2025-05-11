
import { Button } from "@/components/ui/button";

export function PricingFooter() {
  return (
    <>
      <div className="mt-16 text-center max-w-xl mx-auto">
        <p className="text-slate-500 mb-4">
          Need a custom plan? Contact our sales team for a tailored solution.
        </p>
        <Button variant="outline" className="group">
          Contact Sales
        </Button>
      </div>
      
      <div className="mt-16 p-6 border border-slate-200 rounded-xl bg-white shadow-soft max-w-4xl mx-auto">
        <h3 className="text-xl font-medium text-center mb-6">What Our Customers Say</h3>
        <div className="italic text-center text-slate-600">
          "This tool has saved our marketing team countless hours of manual research. We've increased our lead generation by 230% in just two months."
          <div className="mt-4 font-medium text-slate-900">— Sarah Johnson, Marketing Director at TechGrowth Inc.</div>
        </div>
      </div>
    </>
  );
}
