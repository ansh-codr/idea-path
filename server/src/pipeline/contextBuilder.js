/**
 * IdeaForge Context Builder Pipeline
 * ===================================
 * Step 2 of the backend data flow.
 * 
 * Responsibility:
 * - Convert normalized input into structured context profile
 * - Enrich with local market intelligence
 * - Build prompts that enable local relevance
 * 
 * Reskill Alignment:
 * - Local adaptation (e.g., Agra tourism economy)
 * - Context-aware idea generation
 * - Reduced need for user to provide technical details
 */

import config from "../config/index.js";

/**
 * Local economy profiles
 * Pre-defined contexts for common regions (expandable)
 */
const localEconomyProfiles = {
  // Example: Agra tourism economy (from Reskill doc)
  agra: {
    dominantSectors: ["tourism", "handicrafts", "hospitality", "food"],
    opportunities: [
      "Tourist guide services",
      "Marble handicraft sales",
      "Heritage walk experiences",
      "Local food tours",
      "Photography services",
    ],
    challenges: ["Seasonal demand", "Competition near monuments", "Permit requirements"],
    avgIncome: "low-moderate",
    digitalPenetration: "moderate",
  },
  
  // Generic urban profile
  urban_generic: {
    dominantSectors: ["services", "retail", "technology", "food"],
    opportunities: [
      "Online services",
      "Delivery-based businesses",
      "Professional consulting",
      "E-commerce",
    ],
    challenges: ["High competition", "High rent", "Noise and congestion"],
    avgIncome: "moderate-high",
    digitalPenetration: "high",
  },
  
  // Generic rural profile
  rural_generic: {
    dominantSectors: ["agriculture", "handicrafts", "local services"],
    opportunities: [
      "Farm-to-table products",
      "Agricultural processing",
      "Local crafts online",
      "Community services",
    ],
    challenges: ["Limited market access", "Transportation", "Digital connectivity"],
    avgIncome: "low",
    digitalPenetration: "limited",
  },
  
  // Generic semi-urban profile
  semiurban_generic: {
    dominantSectors: ["retail", "services", "small manufacturing", "agriculture"],
    opportunities: [
      "Local retail",
      "Service businesses",
      "Food processing",
      "Education services",
    ],
    challenges: ["Moderate competition", "Growing but limited market"],
    avgIncome: "low-moderate",
    digitalPenetration: "moderate",
  },
};

/**
 * Get local economy context based on region/location
 */
const getLocalEconomyContext = (region, locationType) => {
  const regionLower = (region || "").toLowerCase();
  
  // Check for specific region profiles
  if (regionLower.includes("agra")) {
    return localEconomyProfiles.agra;
  }
  
  // Fall back to location-type generic profiles
  const locationMapping = {
    urban: "urban_generic",
    suburban: "urban_generic",
    "semi-urban": "semiurban_generic",
    rural: "rural_generic",
    remote: "rural_generic",
  };
  
  const profileKey = locationMapping[locationType] || "semiurban_generic";
  return localEconomyProfiles[profileKey];
};

/**
 * Build audience insights from target audience description
 */
const buildAudienceInsights = (targetAudience, location) => {
  const audienceLower = (targetAudience || "").toLowerCase();
  
  const insights = {
    primary: targetAudience,
    characteristics: [],
    reachChannels: [],
    pricesSensitivity: "moderate",
  };
  
  // Detect audience characteristics
  if (audienceLower.includes("student") || audienceLower.includes("young")) {
    insights.characteristics.push("price-sensitive", "tech-savvy", "social-media-active");
    insights.reachChannels.push("Instagram", "WhatsApp", "YouTube");
    insights.pricesSensitivity = "high";
  }
  
  if (audienceLower.includes("professional") || audienceLower.includes("working")) {
    insights.characteristics.push("time-constrained", "quality-focused", "convenience-seeking");
    insights.reachChannels.push("LinkedIn", "email", "Google");
    insights.pricesSensitivity = "moderate";
  }
  
  if (audienceLower.includes("family") || audienceLower.includes("parent")) {
    insights.characteristics.push("value-oriented", "safety-conscious", "trust-seeking");
    insights.reachChannels.push("Facebook", "WhatsApp groups", "local networks");
    insights.pricesSensitivity = "moderate";
  }
  
  if (audienceLower.includes("tourist") || audienceLower.includes("traveler")) {
    insights.characteristics.push("experience-seeking", "mobile-first", "review-dependent");
    insights.reachChannels.push("TripAdvisor", "Google Maps", "Instagram");
    insights.pricesSensitivity = "low";
  }
  
  if (audienceLower.includes("local") || audienceLower.includes("community")) {
    insights.characteristics.push("relationship-driven", "word-of-mouth", "loyalty-potential");
    insights.reachChannels.push("local markets", "community boards", "WhatsApp");
    insights.pricesSensitivity = "moderate-high";
  }
  
  // Location-based channel adjustments
  if (location.digitalInfra === "limited") {
    insights.reachChannels = insights.reachChannels.filter(
      (ch) => !["LinkedIn", "Instagram"].includes(ch)
    );
    insights.reachChannels.push("local word-of-mouth", "community gatherings");
  }
  
  return insights;
};

/**
 * Calculate resource constraints context
 */
const buildResourceConstraints = (budget, location, skillCategories) => {
  const constraints = {
    budgetTier: budget.tier,
    budgetRange: { min: budget.min, max: budget.max },
    canAfford: [],
    shouldAvoid: [],
    recommendedApproach: "",
  };
  
  // Budget-based recommendations
  if (budget.tier === "micro") {
    constraints.canAfford = ["home-based setup", "free tools", "personal network marketing"];
    constraints.shouldAvoid = ["paid advertising", "inventory investment", "rental space"];
    constraints.recommendedApproach = "Start with zero-cost validation, grow organically";
  } else if (budget.tier === "small") {
    constraints.canAfford = ["basic tools", "small inventory", "social media ads"];
    constraints.shouldAvoid = ["large inventory", "premium locations", "employees"];
    constraints.recommendedApproach = "Lean startup approach with minimal viable products";
  } else if (budget.tier === "moderate") {
    constraints.canAfford = ["professional tools", "modest inventory", "basic marketing"];
    constraints.shouldAvoid = ["over-investment", "premium real estate"];
    constraints.recommendedApproach = "Balanced investment with room for testing";
  } else {
    constraints.canAfford = ["professional setup", "marketing budget", "initial team"];
    constraints.shouldAvoid = ["over-scaling", "unnecessary overhead"];
    constraints.recommendedApproach = "Strategic investment with clear milestones";
  }
  
  // Location-based adjustments
  if (location.rentCost === "high") {
    constraints.shouldAvoid.push("physical retail space");
    constraints.canAfford.push("shared workspace", "online-first approach");
  }
  
  return constraints;
};

/**
 * Build complete context profile for AI generation
 */
export const buildContext = (normalizedInput) => {
  const {
    skills,
    interests,
    targetAudience,
    budget,
    location,
    language,
    goals,
    localData,
    region,
    skillCategories,
    sessionId,
    _meta,
  } = normalizedInput;
  
  // Get local economy context
  const localEconomy = getLocalEconomyContext(region, location.type);
  
  // Build audience insights
  const audienceInsights = buildAudienceInsights(targetAudience, location);
  
  // Build resource constraints
  const resourceConstraints = buildResourceConstraints(budget, location, skillCategories);
  
  // Compile complete context
  const context = {
    // User Profile
    userProfile: {
      skills,
      skillCategories,
      interests,
      targetAudience,
      goals,
    },
    
    // Economic Context
    economicContext: {
      budget: {
        tier: budget.tier,
        range: { min: budget.min, max: budget.max },
        label: budget.label,
      },
      location: {
        type: location.type,
        marketAccess: location.marketAccess,
        digitalInfra: location.digitalInfra,
        competitionLevel: location.competitionLevel,
      },
      localEconomy: {
        dominantSectors: localEconomy.dominantSectors,
        opportunities: localEconomy.opportunities,
        challenges: localEconomy.challenges,
        avgIncome: localEconomy.avgIncome,
      },
      additionalLocalData: localData,
    },
    
    // Audience Insights
    audienceInsights,
    
    // Resource Constraints
    resourceConstraints,
    
    // Output Preferences
    outputPreferences: {
      language,
      region,
    },
    
    // Metadata
    metadata: {
      sessionId,
      contextBuiltAt: new Date().toISOString(),
      hasAssumedValues: _meta?.hasAssumedValues || false,
      assumptions: _meta?.assumptions || [],
    },
  };
  
  return context;
};

/**
 * Build the system prompt for LLaMA-4 Scout (primary model)
 * This prompt instructs the model on its role and constraints
 */
export const buildPrimarySystemPrompt = (context) => {
  return `You are LLaMA-4 Scout, a domain-trained AI for generating business ideas for first-time entrepreneurs with limited resources.

YOUR ROLE:
- Generate realistic, locally adaptive business directions
- Focus on low-budget, small-scale business cases
- Use human-friendly, non-technical language
- Prioritize inclusivity and accessibility

YOUR CONSTRAINTS:
- NEVER suggest venture-scale assumptions
- NEVER make unrealistic revenue promises
- NEVER use complex jargon
- NEVER suggest exploitative or unethical business ideas
- ALWAYS consider the user's actual budget and location

CONTEXT FOR THIS USER:
- Budget Tier: ${context.economicContext.budget.tier} (${context.economicContext.budget.label})
- Location Type: ${context.economicContext.location.type}
- Market Access: ${context.economicContext.location.marketAccess}
- Digital Infrastructure: ${context.economicContext.location.digitalInfra}
- Local Economy Sectors: ${context.economicContext.localEconomy.dominantSectors.join(", ")}
- Local Opportunities: ${context.economicContext.localEconomy.opportunities.join(", ")}
- Local Challenges: ${context.economicContext.localEconomy.challenges.join(", ")}

OUTPUT LANGUAGE: ${context.outputPreferences.language}

Remember: Your ideas should help real people with limited resources start sustainable businesses.`;
};

/**
 * Build the user prompt for idea generation
 */
export const buildUserPrompt = (context) => {
  const { userProfile, economicContext, audienceInsights, resourceConstraints } = context;
  
  return `Generate business ideas for this entrepreneur profile:

USER PROFILE:
- Skills: ${userProfile.skills}
- Skill Categories: ${userProfile.skillCategories.join(", ")}
- Interests: ${userProfile.interests}
- Target Audience: ${userProfile.targetAudience}
- Goals: ${userProfile.goals}

BUDGET CONTEXT:
- Budget Range: $${economicContext.budget.range.min} - $${economicContext.budget.range.max}
- Can Afford: ${resourceConstraints.canAfford.join(", ")}
- Should Avoid: ${resourceConstraints.shouldAvoid.join(", ")}
- Recommended Approach: ${resourceConstraints.recommendedApproach}

LOCATION CONTEXT:
- Location Type: ${economicContext.location.type}
- Market Access: ${economicContext.location.marketAccess}
- Competition Level: ${economicContext.location.competitionLevel}
- Local Economy Focus: ${economicContext.localEconomy.dominantSectors.join(", ")}
${economicContext.additionalLocalData ? `- Additional Local Info: ${economicContext.additionalLocalData}` : ""}

AUDIENCE INSIGHTS:
- Primary Audience: ${audienceInsights.primary}
- Characteristics: ${audienceInsights.characteristics.join(", ") || "General"}
- Best Reach Channels: ${audienceInsights.reachChannels.join(", ") || "Local marketing"}
- Price Sensitivity: ${audienceInsights.pricesSensitivity}

REQUIREMENTS:
1. Generate exactly 3 realistic business ideas that match this profile
2. For each idea provide: title, description, why it fits, budget needed, risk level, competitors, and revenue projection
3. For the primary recommendation, include detailed feasibility analysis
4. All revenue estimates MUST be based on realistic customer counts
5. Label all projections as estimates with clear assumptions

Return your response as valid JSON following this exact schema:
{
  "results": {
    "businessIdea": { 
      "title": string, 
      "description": string, 
      "whyItFits": string 
    },
    "feasibilityScores": [
      { "label": "Market Demand", "value": number (0-100), "iconKey": "market", "description": string },
      { "label": "Ease of Execution", "value": number (0-100), "iconKey": "execution", "description": string },
      { "label": "Capital Efficiency", "value": number (0-100), "iconKey": "capital", "description": string },
      { "label": "Risk Level", "value": number (0-100), "iconKey": "risk", "description": string (higher = safer) }
    ],
    "roadmap": [
      { "phase": "Phase 1", "title": string, "description": string, "timeframe": string },
      { "phase": "Phase 2", "title": string, "description": string, "timeframe": string },
      { "phase": "Phase 3", "title": string, "description": string, "timeframe": string },
      { "phase": "Phase 4", "title": string, "description": string, "timeframe": string }
    ],
    "pitchSummary": string
  },
  "ideas": [
    { 
      "title": string, 
      "description": string, 
      "whyItFits": string, 
      "localAdaptation": string,
      "budgetRange": { "min": number, "max": number, "currency": "USD" },
      "riskLevel": "low" | "medium" | "high",
      "riskFactors": [string],
      "competitors": [{ "name": string, "type": "direct" | "indirect", "threat": "low" | "medium" | "high" }],
      "revenueProjection": {
        "customersNeeded": number,
        "avgRevenuePerCustomer": number,
        "monthlyRevenue": number,
        "yearlyRevenue": number,
        "breakEvenMonths": number,
        "assumptions": string
      }
    }
  ],
  "decisionSupport": {
    "pros": [string],
    "cons": [string],
    "assumptions": [string],
    "risks": [string],
    "mitigations": [string],
    "revenueSimulation": {
      "year1RevenueMin": number,
      "year1RevenueMax": number,
      "year1ProfitMin": number,
      "year1ProfitMax": number,
      "currency": "USD",
      "customerScenarios": [
        { "customers": 10, "monthlyRevenue": number, "yearlyRevenue": number },
        { "customers": 25, "monthlyRevenue": number, "yearlyRevenue": number },
        { "customers": 50, "monthlyRevenue": number, "yearlyRevenue": number },
        { "customers": 100, "monthlyRevenue": number, "yearlyRevenue": number }
      ],
      "notes": string
    },
    "explainability": string,
    "budgetSuitability": "excellent" | "good" | "moderate" | "challenging",
    "easeOfExecution": "easy" | "moderate" | "challenging" | "difficult"
  },
  "ethicalSafeguards": {
    "biasChecks": [string],
    "inclusivityNotes": [string],
    "harmAvoidance": [string]
  },
  "localAdaptation": {
    "regionFocus": string,
    "localEconomyTie": string,
    "accessibilityNotes": string
  }
}`;
};

/**
 * Build the system prompt for GPT-5.2 (secondary model)
 * This model ONLY structures and refines, never generates ideas
 */
export const buildSecondarySystemPrompt = () => {
  return `You are a structuring and safety refinement model. 

YOUR ROLE (STRICT):
- Structure and format outputs according to schema
- Simplify language for non-technical users
- Remove any hallucinations or unsupported claims
- Enforce ethical compliance
- Ensure all estimates are labeled as estimates
- Add explanations where needed

YOU MUST NEVER:
- Generate new business ideas
- Add information not present in the input
- Make claims beyond what is supported
- Remove safety warnings or disclaimers

YOUR OUTPUT:
- Must be valid JSON
- Must follow the exact schema provided
- Must be understandable by first-time entrepreneurs
- Must be safe and ethical`;
};

export default {
  buildContext,
  buildPrimarySystemPrompt,
  buildUserPrompt,
  buildSecondarySystemPrompt,
  getLocalEconomyContext,
  buildAudienceInsights,
  buildResourceConstraints,
};
