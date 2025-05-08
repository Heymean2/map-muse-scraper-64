
export interface PlanFeature {
  name: string;
  included: boolean;
}

export function getPlanFeatures(planName: string): PlanFeature[] {
  const features = {
    basic: [
      { name: "Unlimited scraping", included: true },
      { name: "Name and address data", included: true },
      { name: "Phone number and website data", included: true },
      { name: "City and state data", included: true },
      { name: "Review data", included: false },
      { name: "Priority support", included: false },
    ],
    pro: [
      { name: "Unlimited scraping", included: true },
      { name: "All business data fields", included: true },
      { name: "Review data access", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true },
      { name: "Data API access", included: true },
    ]
  };
  
  return planName.toLowerCase().includes("pro") ? features.pro : features.basic;
}
