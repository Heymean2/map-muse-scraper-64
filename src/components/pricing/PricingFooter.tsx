import { Button } from "@/components/ui/button";
export function PricingFooter() {
  return <>
      <div className="mt-16 text-center max-w-xl mx-auto">
        <p className="text-slate-500 mb-4">
          Need a custom plan? Contact our sales team for a tailored solution.
        </p>
        <Button variant="outline" className="group">
          Contact Sales
        </Button>
      </div>
      
      
    </>;
}