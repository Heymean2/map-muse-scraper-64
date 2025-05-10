
export interface PlanFeature {
  name: string;
  included: boolean;
}

export function getPlanFeatures(planName: string): PlanFeature[] {
  // Check for plan type
  if (planName.includes("Credit")) {
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
