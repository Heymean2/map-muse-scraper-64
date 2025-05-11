
import { useState, useEffect } from "react";
import { usePlanSelection } from "@/hooks/usePlanSelection";
import { getFeaturesList } from "@/components/pricing/utils";

export function usePricingPlans() {
  const { plansData, plansLoading } = usePlanSelection();
  
  // Default plans to use if data is still loading or empty
  const defaultPlans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for trying things out and small projects.",
      features: [
        "500 free credits to start",
        "Basic search filters",
        "Export to CSV",
        "Email support",
        "1 user account"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      billing_period: "credits"
    },
    {
      name: "Basic",
      price: 29,
      description: "Perfect for individuals and small businesses just getting started.",
      features: [
        "Up to 25,000 business listings per month",
        "Export to CSV",
        "Basic search filters",
        "Standard support",
        "1 user account"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      billing_period: "monthly"
    },
    {
      name: "Professional",
      price: 79,
      description: "Ideal for growing businesses with more data needs.",
      features: [
        "Unlimited business listings",
        "Advanced analytics dashboard",
        "All export formats",
        "Priority support",
        "3 user accounts"
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      billing_period: "monthly"
    },
    {
      name: "Enterprise",
      price: 199,
      description: "For larger organizations requiring maximum data and features.",
      features: [
        "Unlimited business listings",
        "Advanced analytics dashboard",
        "Customer reviews data",
        "Custom integrations",
        "Dedicated account manager",
        "Unlimited user accounts"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      billing_period: "monthly"
    },
    {
      name: "Pay as You Go",
      price: 0,
      description: "Perfect for one-time projects or occasional use.",
      price_per_credit: 0.002,
      features: [
        "Pay only for what you use",
        "$0.002 per business listing",
        "500 free credits to start",
        "All export formats",
        "Standard support"
      ],
      popular: false,
      buttonText: "Buy Credits",
      buttonVariant: "outline" as const,
      billing_period: "credits"
    }
  ];

  // Use real data if available, otherwise use default plans
  const plans = plansData && plansData.length > 0 
    ? plansData.map(plan => {
        // Clean up the features to remove Excel references
        const features = getFeaturesList(plan.features).map(feature => 
          feature.replace(/and Excel|Excel and |Excel/g, '')
        );

        return {
          name: plan.name,
          price: plan.price,
          description: `${plan.name} plan for business data extraction`,
          features: features,
          popular: plan.is_recommended,
          buttonText: plan.is_recommended ? "Start Free Trial" : 
                    plan.billing_period === "credits" ? "Buy Credits" :
                    plan.price > 100 ? "Contact Sales" : "Get Started",
          buttonVariant: plan.is_recommended ? "default" as const : "outline" as const,
          billing_period: plan.billing_period || "monthly",
          price_per_credit: plan.price_per_credit || 0
        };
      })
    : defaultPlans;

  // Make sure credit plan is included
  const allPlans = [...plans];
  const hasCreditPlan = allPlans.some(plan => plan.billing_period === "credits");
  
  if (!hasCreditPlan) {
    allPlans.push(defaultPlans[4]); // Add the Pay as You Go plan
  }

  // Separate subscription plans from credit-based plans
  const subscriptionPlans = allPlans.filter(plan => plan.billing_period === "monthly");
  const creditPlans = allPlans.filter(plan => plan.billing_period === "credits");

  return {
    subscriptionPlans,
    creditPlans,
    plansLoading
  };
}
