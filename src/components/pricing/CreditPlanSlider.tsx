import { useState, useEffect } from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { withDelay, animationClasses } from "@/lib/animations";

interface CreditPlanSliderProps {
  creditPlans: any[];
}

export function CreditPlanSlider({ creditPlans }: CreditPlanSliderProps) {
  const [creditAmount, setCreditAmount] = useState(1000);
  const [estimatedCost, setEstimatedCost] = useState(1);
  const creditUnitPrice = 0.002; // $0.002 per credit
  
  // Calculate cost whenever credit amount changes
  useEffect(() => {
    // If credits <= 500, cost is 0 (free)
    // Otherwise calculate cost only for credits above 500
    const paidCredits = Math.max(0, creditAmount - 500);
    setEstimatedCost(Number((paidCredits * creditUnitPrice).toFixed(2)));
  }, [creditAmount]);
  
  // Slider marker values for better UX
  const sliderMarkers = [500, 1000, 5000, 10000, 25000, 50000];

  return (
    <div className="mt-20">
      <h3 className="text-2xl font-semibold text-center mb-6">Pay as You Go</h3>
      <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
        Only pay for what you use with our flexible credit system. Start with 500 free credits!
      </p>

      <div className={`bg-white rounded-xl shadow-soft p-8 mb-8 max-w-4xl mx-auto ${withDelay(animationClasses.fadeIn, 400)}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="mb-8">
              <Badge className="mb-2 bg-red-100 hover:bg-red-200 text-red-800 border-0">500 FREE CREDITS</Badge>
              <h4 className="text-2xl font-bold mb-2">Pay as You Go Plan</h4>
              <p className="text-slate-600">Perfect for occasional use or specific projects. One credit equals one business listing.</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {creditPlans[0]?.features.map((feature, idx) => (
                <div key={`credit-plan-feature-${idx}`} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5">
                    <Check className="h-5 w-5" />
                  </div>
                  <span className="ml-3 text-slate-600">
                    {feature.replace("Export to CSV and Excel", "Export to CSV")}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              variant="default"
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
            >
              Get 500 Free Credits
            </Button>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="mb-10">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-500">Credits</span>
                <span className="text-sm font-medium">{creditAmount.toLocaleString()}</span>
              </div>
              
              <div className="mb-8 relative">
                <Slider
                  value={[creditAmount]}
                  min={500}
                  max={50000}
                  step={100}
                  onValueChange={(value) => setCreditAmount(value[0])}
                  className="mb-6"
                />
                
                <div className="flex justify-between px-1 mt-2">
                  {sliderMarkers.map(marker => (
                    <div 
                      key={marker} 
                      className="text-xs text-slate-500 flex flex-col items-center"
                      style={{ 
                        position: 'absolute', 
                        left: `${((marker - 500) / (50000 - 500)) * 100}%`, 
                        transform: 'translateX(-50%)' 
                      }}
                    >
                      <span className="w-1 h-1 bg-slate-300 rounded-full mb-1"></span>
                      {marker === 500 ? (
                        <span className="font-bold text-green-600">FREE</span>
                      ) : (
                        marker.toLocaleString()
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-500">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <span>Estimated cost</span>
                </div>
                <div className="text-2xl font-bold">
                  {estimatedCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${estimatedCost}`
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              {creditAmount <= 500 ? "Get Free Credits" : "Buy Credits"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
