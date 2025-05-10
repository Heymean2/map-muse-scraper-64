
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getUserPlanInfo } from "@/services/scraper";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlanFeatures } from "@/components/dashboard/billing/PlanFeatures";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { purchaseCredits, subscribeToPlan } from "@/services/scraper";

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId");
  const planType = searchParams.get("planType") || "subscription";
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);

  // Get current user's plan info
  const { data: userPlan } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo
  });

  // Fetch the selected plan details from Supabase
  const { data: planData, isLoading: planLoading } = useQuery({
    queryKey: ['checkoutPlan', planId],
    queryFn: async () => {
      if (!planId) return null;
      
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('id', planId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!planId
  });
  
  // Features for the selected plan
  const planFeatures = planData ? getPlanFeatures(planData.name) : [];
  
  // Check if the user is trying to purchase the same plan they already have
  const isSamePlan = userPlan?.planId === planId && planType === 'subscription';

  // Calculate purchase details for credits
  const [creditQuantity, setCreditQuantity] = useState<number>(1);
  const creditPrice = planData?.price_per_credit || 0.001;
  const totalCredits = creditQuantity * 1000; // 1000 credits per package
  const totalAmount = planType === 'subscription' 
    ? planData?.price || 0 
    : (creditPrice * totalCredits);

  // Load PayPal script
  useEffect(() => {
    if (!paypalLoaded && planData) {
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=test&currency=USD";
      script.addEventListener('load', () => {
        setPaypalLoaded(true);
      });
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [paypalLoaded, planData]);

  // Render PayPal buttons once script is loaded
  useEffect(() => {
    if (paypalLoaded && !paypalButtonRendered && paymentMethod === 'paypal') {
      const paypalContainer = document.getElementById('paypal-button-container');
      
      if (paypalContainer && window.paypal) {
        // Clear any existing buttons
        paypalContainer.innerHTML = '';
        
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalAmount.toFixed(2)
                },
                description: planType === 'subscription' 
                  ? `${planData?.name} Subscription` 
                  : `${totalCredits} Credits Purchase`
              }]
            });
          },
          onApprove: async (data, actions) => {
            setIsProcessing(true);
            
            if (actions.order) {
              const order = await actions.order.capture();
              
              try {
                if (planType === 'subscription' && planId) {
                  const result = await subscribeToPlan(planId);
                  if (result.success) {
                    // Record transaction
                    await recordTransaction({
                      amount: totalAmount,
                      planId: planId ? parseInt(planId) : null,
                      paymentMethod: 'paypal',
                      paymentId: order.id,
                      status: 'completed',
                      billingPeriod: 'monthly',
                    });
                    
                    setPaymentSuccess(true);
                    toast.success('Subscription activated successfully!');
                  } else {
                    toast.error(result.error || 'Failed to activate subscription');
                  }
                } else if (planType === 'credits') {
                  const purchased = await purchaseCredits(creditQuantity);
                  
                  if (purchased) {
                    // Record transaction
                    await recordTransaction({
                      amount: totalAmount,
                      planId: planData?.id || null,
                      paymentMethod: 'paypal',
                      paymentId: order.id,
                      status: 'completed',
                      creditsPurchased: totalCredits,
                    });
                    
                    setPaymentSuccess(true);
                    toast.success(`Successfully purchased ${totalCredits} credits!`);
                  } else {
                    toast.error('Failed to purchase credits');
                  }
                }
              } catch (error: any) {
                toast.error(`Payment error: ${error.message || 'Unknown error'}`);
              } finally {
                setIsProcessing(false);
              }
            }
          },
          onCancel: () => {
            toast.info('Payment cancelled');
          },
          onError: (err) => {
            console.error('PayPal error:', err);
            toast.error('Payment failed. Please try again.');
          }
        }).render(paypalContainer);
        
        setPaypalButtonRendered(true);
      }
    }
  }, [paypalLoaded, paymentMethod, planData, planId, planType, paypalButtonRendered, creditQuantity, totalAmount, totalCredits]);

  // Reset the paypalButtonRendered state when payment method changes
  useEffect(() => {
    setPaypalButtonRendered(false);
  }, [paymentMethod]);

  // Function to record transaction in Supabase
  const recordTransaction = async ({
    amount, 
    planId, 
    paymentMethod,
    paymentId,
    status,
    billingPeriod,
    creditsPurchased
  }: {
    amount: number;
    planId: number | null;
    paymentMethod: string;
    paymentId?: string;
    status: string;
    billingPeriod?: string;
    creditsPurchased?: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Authentication required');
      return false;
    }
    
    const { error } = await supabase
      .from('billing_transactions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount,
        payment_method: paymentMethod,
        payment_id: paymentId,
        status,
        billing_period: billingPeriod,
        credits_purchased: creditsPurchased,
        metadata: {
          plan_type: planType
        }
      });
      
    if (error) {
      console.error('Error recording transaction:', error);
      return false;
    }
    
    return true;
  };
  
  // Handle credit card payment (simulated for this implementation)
  const handleCreditCardPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Here we'd normally integrate with a payment processor
      // For this implementation, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (planType === 'subscription' && planId) {
        const result = await subscribeToPlan(planId);
        
        if (result.success) {
          // Record transaction
          await recordTransaction({
            amount: totalAmount,
            planId: planId ? parseInt(planId) : null,
            paymentMethod: 'card',
            status: 'completed',
            billingPeriod: 'monthly',
          });
          
          setPaymentSuccess(true);
          toast.success('Subscription activated successfully!');
        } else {
          toast.error(result.error || 'Failed to activate subscription');
        }
      } else if (planType === 'credits') {
        const purchased = await purchaseCredits(creditQuantity);
        
        if (purchased) {
          // Record transaction
          await recordTransaction({
            amount: totalAmount,
            planId: planData?.id || null,
            paymentMethod: 'card',
            status: 'completed',
            creditsPurchased: totalCredits,
          });
          
          setPaymentSuccess(true);
          toast.success(`Successfully purchased ${totalCredits} credits!`);
        } else {
          toast.error('Failed to purchase credits');
        }
      }
    } catch (error: any) {
      toast.error(`Payment error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Success dialog that appears after successful payment
  const SuccessDialog = () => (
    <Dialog open={paymentSuccess} onOpenChange={(open) => {
      if (!open) navigate('/dashboard');
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-center mb-6">
            {planType === 'subscription' 
              ? `Your ${planData?.name} subscription has been activated successfully!` 
              : `You have successfully purchased ${totalCredits} credits!`}
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!planId) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No plan selected</h2>
            <p className="mb-6">Please select a plan from the pricing page.</p>
            <Button onClick={() => navigate('/dashboard/billing')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pricing
            </Button>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  if (isSamePlan) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">You already have this plan</h2>
            <p className="mb-6">You are already subscribed to the {userPlan?.planName} plan.</p>
            <Button onClick={() => navigate('/dashboard/billing')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pricing
            </Button>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-5 w-5" />
                      Credit / Debit Card
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="cursor-pointer">
                      <span className="font-bold text-blue-600">Pay</span>
                      <span className="font-bold text-blue-800">Pal</span>
                    </Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <input 
                          id="cardName"
                          type="text" 
                          placeholder="John Doe" 
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <input 
                          id="cardNumber"
                          type="text" 
                          placeholder="1234 5678 9012 3456" 
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <input 
                          id="expiry"
                          type="text" 
                          placeholder="MM/YY" 
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <input 
                          id="cvc"
                          type="text" 
                          placeholder="123" 
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleCreditCardPayment} 
                      className="w-full mt-4"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay ${totalAmount.toFixed(2)} USD`}
                    </Button>
                  </div>
                )}
                
                {paymentMethod === "paypal" && (
                  <div className="mt-6">
                    <div id="paypal-button-container" className="min-h-[150px] flex items-center justify-center">
                      {!paypalLoaded && <p className="text-center text-muted-foreground">Loading PayPal...</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {planType === 'credits' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Credit Package Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditPackages">Select Package Size</Label>
                      <select
                        id="creditPackages"
                        className="w-full p-2 border rounded"
                        value={creditQuantity}
                        onChange={(e) => setCreditQuantity(parseInt(e.target.value))}
                      >
                        <option value="1">1,000 credits (${(1000 * creditPrice).toFixed(2)})</option>
                        <option value="5">5,000 credits - 5% discount (${(5000 * creditPrice * 0.95).toFixed(2)})</option>
                        <option value="10">10,000 credits - 10% discount (${(10000 * creditPrice * 0.9).toFixed(2)})</option>
                        <option value="25">25,000 credits - 15% discount (${(25000 * creditPrice * 0.85).toFixed(2)})</option>
                      </select>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <p className="text-sm text-slate-700">
                        Each credit allows you to extract 1 row of data. Larger packages offer better value with volume discounts.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {planLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">{planData?.name}</span>
                      {planType === 'subscription' ? (
                        <span>${planData?.price}/{planData?.billing_period}</span>
                      ) : (
                        <span>${totalAmount.toFixed(2)} for {totalCredits} credits</span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <p className="text-sm font-medium">What's included:</p>
                      <ul className="space-y-2">
                        {planFeatures.map((feature, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            {feature.included ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <span className="h-4 w-4 text-gray-300">-</span>
                            )}
                            {feature.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
                
                <Button 
                  onClick={() => navigate('/dashboard/billing')} 
                  variant="outline"
                  className="w-full mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <SuccessDialog />
      </Container>
    </DashboardLayout>
  );
}
