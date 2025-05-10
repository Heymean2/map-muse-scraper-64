
export interface PlanFeature {
  name: string;
  included: boolean;
}

export function getPlanFeatures(planName: string): PlanFeature[] {
  // Check for credit-based plan
  if (planName.toLowerCase().includes("credit")) {
    return [
      { name: "Pay per use (1 credit = 1 row)", included: true },
      { name: "All business data fields", included: true },
      { name: "Name, address, and website data", included: true },
      { name: "Review data", included: true },
      { name: "Export to all formats", included: true },
      { name: "Email support", included: true },
    ];
  }

  if (planName.toLowerCase().includes("free")) {
    return [
      { name: "Limited to 100 rows", included: true },
      { name: "Name, address, and website data", included: true },
      { name: "Export to CSV", included: true },
      { name: "Basic search filters", included: true },
      { name: "Email support", included: true },
      { name: "Review data", included: false },
      { name: "API access", included: false },
    ];
  }
  
  if (planName.toLowerCase().includes("premium")) {
    return [
      { name: "Unlimited rows", included: true },
      { name: "All business data fields", included: true },
      { name: "Review data", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true },
      { name: "Data API access", included: true },
      { name: "Dedicated account manager", included: true },
    ];
  }
  
  if (planName.toLowerCase().includes("standard")) {
    return [
      { name: "Unlimited rows", included: true },
      { name: "All business data fields", included: true },
      { name: "Review data", included: true },
      { name: "Basic analytics", included: true },
      { name: "Standard support", included: true },
      { name: "Data API access", included: false },
    ];
  }
  
  // Basic Pro plan (now without reviews)
  return [
    { name: "Unlimited rows", included: true },
    { name: "All business data fields", included: true },
    { name: "Review data", included: false },
    { name: "Advanced analytics", included: true },
    { name: "Priority support", included: true },
    { name: "Data API access", included: false },
  ];
}

// Helper function to determine if a plan is credit-based
export function isPlanCreditBased(planName: string | undefined): boolean {
  if (!planName) return false;
  return planName.toLowerCase().includes("credit");
}

// Helper function to determine if a plan is a subscription plan
export function isPlanSubscription(planName: string | undefined): boolean {
  if (!planName) return false;
  return !isPlanCreditBased(planName) && !planName.toLowerCase().includes("free");
}
