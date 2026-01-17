/**
 * IdeaForge Fallback System
 * =========================
 * Failure resilience for demo reliability.
 * 
 * Responsibility:
 * - Provide demo-safe responses during model failure
 * - Cached sample outputs by category
 * - Clear system states
 * 
 * Reskill Alignment:
 * - Trust is preserved even during failure
 * - Users always get actionable output
 * - Transparent about limitations
 */

import config from "../config/index.js";

/**
 * Cached fallback responses by budget tier and location type
 * These are pre-validated, safe outputs for demo reliability
 */
const fallbackResponses = {
  // Micro budget fallbacks
  micro: {
    urban: {
      results: {
        businessIdea: {
          title: "Local Service Marketplace",
          description: "Connect your skills with people in your neighborhood who need help. Whether it's tutoring, pet care, errand running, or handyman tasks—start with what you know and grow from there.",
          whyItFits: "Requires zero upfront investment. You can start with skills you already have and use free platforms like WhatsApp groups and local Facebook pages to find your first customers.",
        },
        feasibilityScores: [
          { label: "Market Demand", value: 78, iconKey: "market", description: "Strong demand for local services" },
          { label: "Ease of Execution", value: 85, iconKey: "execution", description: "Start with existing skills" },
          { label: "Capital Efficiency", value: 95, iconKey: "capital", description: "Minimal investment needed" },
          { label: "Risk Level", value: 72, iconKey: "risk", description: "Low risk, test and learn" },
        ],
        roadmap: [
          { phase: "Phase 1", title: "List Your Services", description: "Identify 2-3 services you can offer. Create simple posts for local groups.", timeframe: "Week 1" },
          { phase: "Phase 2", title: "First Customers", description: "Reach out to friends, family, and neighbors. Offer intro pricing.", timeframe: "Week 2-3" },
          { phase: "Phase 3", title: "Build Reputation", description: "Collect testimonials. Ask for referrals. Expand service area.", timeframe: "Month 1-2" },
          { phase: "Phase 4", title: "Grow & Specialize", description: "Focus on most profitable services. Consider hiring help.", timeframe: "Month 3-6" },
        ],
        pitchSummary: "Turn your everyday skills into income by serving your local community—starting today with zero investment.",
      },
      ideas: [
        {
          title: "Local Service Marketplace",
          description: "Offer your skills to neighbors through local social media groups.",
          whyItFits: "Zero startup cost, uses existing skills.",
          localAdaptation: "Urban areas have high density for quick customer acquisition.",
        },
        {
          title: "Content Creation Services",
          description: "Help local businesses create social media content using your smartphone.",
          whyItFits: "Requires only a smartphone and basic creativity.",
          localAdaptation: "Many urban businesses need affordable content help.",
        },
        {
          title: "Virtual Assistance",
          description: "Provide remote administrative support to busy professionals.",
          whyItFits: "Can be done from home with just internet access.",
          localAdaptation: "Urban professionals often need flexible support.",
        },
      ],
      decisionSupport: {
        pros: [
          "No upfront investment required",
          "Can start immediately with existing skills",
          "Flexible schedule",
          "Low risk—easy to pivot",
        ],
        cons: [
          "Income may be inconsistent initially",
          "Requires active marketing effort",
          "Limited scalability without investment",
        ],
        assumptions: [
          "You have at least one marketable skill",
          "You have access to smartphone and internet",
          "Local demand exists for services",
        ],
        risks: [
          "Customer acquisition may be slow",
          "Competition from established providers",
          "Seasonal demand fluctuations",
        ],
        mitigations: [
          "Start with friends and family network",
          "Differentiate through reliability and personal service",
          "Diversify service offerings",
        ],
        revenueSimulation: {
          year1RevenueMin: 2000,
          year1RevenueMax: 8000,
          year1ProfitMin: 1800,
          year1ProfitMax: 7200,
          currency: "USD",
          notes: "Estimates assume 10-20 hours per week of active work. Profit margins are high due to minimal overhead.",
          disclaimer: "Actual results depend on your effort, skills, and local market conditions.",
        },
        explainability: "This recommendation prioritizes zero-cost entry and immediate action potential, matching your micro budget and urban location.",
        budgetSuitability: "excellent",
        easeOfExecution: "easy",
      },
      ethicalSafeguards: {
        biasChecks: [
          "Ideas accessible regardless of gender, age, or background",
          "No assumptions about prior business experience",
          "Suitable for various skill levels",
        ],
        inclusivityNotes: [
          "Options work for people with limited resources",
          "No specialized equipment required",
          "Flexible for various life situations",
        ],
        harmAvoidance: [
          "All suggestions are legal and ethical",
          "No exploitative business models",
          "Realistic expectations set",
        ],
      },
      localAdaptation: {
        regionFocus: "Urban areas with high population density",
        localEconomyTie: "Service-based economy with strong demand for convenience",
        accessibilityNotes: "Leverages existing digital infrastructure and social networks",
      },
    },
    rural: {
      results: {
        businessIdea: {
          title: "Farm-to-Community Products",
          description: "Transform local agricultural products into value-added goods or create direct connections between farmers and consumers. This could include preserves, packaged produce, or community-supported agriculture coordination.",
          whyItFits: "Leverages rural advantages like agricultural access while requiring minimal capital. Can start with small batches and grow based on demand.",
        },
        feasibilityScores: [
          { label: "Market Demand", value: 72, iconKey: "market", description: "Growing interest in local, authentic products" },
          { label: "Ease of Execution", value: 68, iconKey: "execution", description: "Requires some learning but achievable" },
          { label: "Capital Efficiency", value: 88, iconKey: "capital", description: "Can start very small" },
          { label: "Risk Level", value: 65, iconKey: "risk", description: "Moderate risk with proper planning" },
        ],
        roadmap: [
          { phase: "Phase 1", title: "Identify Products", description: "Survey local farms. Find products with good margins.", timeframe: "Week 1-2" },
          { phase: "Phase 2", title: "Test & Package", description: "Create sample products. Get feedback from community.", timeframe: "Week 3-4" },
          { phase: "Phase 3", title: "Local Sales", description: "Sell at markets, to neighbors, local stores.", timeframe: "Month 2-3" },
          { phase: "Phase 4", title: "Expand Reach", description: "Online sales, regional markets, partnerships.", timeframe: "Month 4-6" },
        ],
        pitchSummary: "Bring the best of rural agriculture directly to consumers who value authenticity and local sourcing.",
      },
      ideas: [
        {
          title: "Farm-to-Community Products",
          description: "Value-added agricultural products for local and regional markets.",
          whyItFits: "Uses rural advantages, low startup cost.",
          localAdaptation: "Direct access to agricultural inputs reduces costs.",
        },
        {
          title: "Rural Skills Training",
          description: "Teach traditional crafts, farming techniques, or skills to visitors.",
          whyItFits: "Monetizes knowledge you already have.",
          localAdaptation: "Growing interest in rural experiences and traditional skills.",
        },
        {
          title: "Local Delivery Service",
          description: "Connect rural producers with nearby town consumers.",
          whyItFits: "Solves a real logistics gap.",
          localAdaptation: "Limited delivery options in rural areas create opportunity.",
        },
      ],
      decisionSupport: {
        pros: [
          "Low competition in rural markets",
          "Access to low-cost raw materials",
          "Authentic story appeals to consumers",
          "Community support often strong",
        ],
        cons: [
          "Limited local market size",
          "Transportation challenges for expansion",
          "Seasonal product availability",
        ],
        assumptions: [
          "Access to local agricultural products",
          "Basic transportation available",
          "Some kitchen or storage space",
        ],
        risks: [
          "Regulatory requirements for food products",
          "Weather impacts on supply",
          "Market access limitations",
        ],
        mitigations: [
          "Start with non-regulated products",
          "Build supplier relationships",
          "Explore online sales channels",
        ],
        revenueSimulation: {
          year1RevenueMin: 1500,
          year1RevenueMax: 6000,
          year1ProfitMin: 1000,
          year1ProfitMax: 4500,
          currency: "USD",
          notes: "Conservative estimates for part-time operation. Growth potential through online expansion.",
          disclaimer: "Actual results depend on product quality, marketing, and local demand.",
        },
        explainability: "This recommendation leverages rural location advantages while minimizing the need for upfront capital.",
        budgetSuitability: "excellent",
        easeOfExecution: "moderate",
      },
      ethicalSafeguards: {
        biasChecks: [
          "Ideas suitable for various skill levels",
          "No assumptions about land ownership",
          "Accessible for different family situations",
        ],
        inclusivityNotes: [
          "Works with limited resources",
          "Builds on existing community connections",
          "Flexible time commitment",
        ],
        harmAvoidance: [
          "Ethical sourcing emphasized",
          "Fair pricing to farmers",
          "Sustainable practices encouraged",
        ],
      },
      localAdaptation: {
        regionFocus: "Rural agricultural areas",
        localEconomyTie: "Connected to local farming economy",
        accessibilityNotes: "Works within transportation limitations",
      },
    },
  },
  
  // Small budget fallbacks (abbreviated for space)
  small: {
    urban: {
      results: {
        businessIdea: {
          title: "Specialized Local Services",
          description: "Offer premium versions of common services—whether it's gourmet home cooking, professional organization, specialized tutoring, or curated experiences. Focus on quality over quantity.",
          whyItFits: "Your budget allows for some tools and marketing. Urban markets support premium pricing for specialized services.",
        },
        feasibilityScores: [
          { label: "Market Demand", value: 75, iconKey: "market", description: "Good demand for quality services" },
          { label: "Ease of Execution", value: 70, iconKey: "execution", description: "Requires skill development" },
          { label: "Capital Efficiency", value: 82, iconKey: "capital", description: "Good return on investment" },
          { label: "Risk Level", value: 68, iconKey: "risk", description: "Manageable with planning" },
        ],
        roadmap: [
          { phase: "Phase 1", title: "Skill & Market Fit", description: "Identify your specialty. Research target customers.", timeframe: "Week 1-2" },
          { phase: "Phase 2", title: "Setup & Brand", description: "Get necessary tools. Create simple brand presence.", timeframe: "Week 3-4" },
          { phase: "Phase 3", title: "Launch & Learn", description: "Start serving customers. Gather feedback.", timeframe: "Month 2" },
          { phase: "Phase 4", title: "Optimize & Scale", description: "Refine offering. Increase prices. Hire help.", timeframe: "Month 3-6" },
        ],
        pitchSummary: "Deliver exceptional quality in a specific niche—because customers will pay more for expertise they can trust.",
      },
      ideas: [
        { title: "Specialized Local Services", description: "Premium service offering in a specific niche.", whyItFits: "Budget allows for quality tools.", localAdaptation: "Urban markets support premium pricing." },
        { title: "E-commerce Curator", description: "Curated product selection for specific audiences.", whyItFits: "Low inventory, high margins possible.", localAdaptation: "Good logistics access in urban areas." },
        { title: "Event Services", description: "Support local events, parties, or corporate functions.", whyItFits: "Budget covers basic equipment.", localAdaptation: "Urban areas have active event markets." },
      ],
      decisionSupport: {
        pros: ["Premium pricing possible", "Clear differentiation", "Loyal customer base potential", "Referral-driven growth"],
        cons: ["Longer customer acquisition", "Higher service expectations", "Skill development needed"],
        assumptions: ["Willingness to specialize", "Quality-focused mindset", "Patience for relationship building"],
        risks: ["Market may be limited", "Premium competitors exist", "Economic sensitivity"],
        mitigations: ["Start with broader offering, then specialize", "Build strong testimonials", "Maintain value-focused pricing"],
        revenueSimulation: { year1RevenueMin: 8000, year1RevenueMax: 25000, year1ProfitMin: 4000, year1ProfitMax: 15000, currency: "USD", notes: "Premium pricing enables better margins", disclaimer: "Results vary based on niche and execution" },
        explainability: "With a small budget, investing in quality over quantity creates sustainable differentiation.",
        budgetSuitability: "good",
        easeOfExecution: "moderate",
      },
      ethicalSafeguards: {
        biasChecks: ["Accessible across demographics"],
        inclusivityNotes: ["Works with various backgrounds"],
        harmAvoidance: ["Ethical business practices emphasized"],
      },
      localAdaptation: { regionFocus: "Urban professional markets", localEconomyTie: "Service economy focus", accessibilityNotes: "Good market access" },
    },
    rural: {
      results: {
        businessIdea: {
          title: "Agri-Tourism Experience",
          description: "Create memorable experiences for visitors—farm stays, workshops, nature tours, or cultural experiences. Combine hospitality with education.",
          whyItFits: "Budget allows for basic amenities and marketing. Rural authenticity is your competitive advantage.",
        },
        feasibilityScores: [
          { label: "Market Demand", value: 70, iconKey: "market", description: "Growing interest in rural experiences" },
          { label: "Ease of Execution", value: 62, iconKey: "execution", description: "Setup requires effort" },
          { label: "Capital Efficiency", value: 75, iconKey: "capital", description: "Good use of existing assets" },
          { label: "Risk Level", value: 60, iconKey: "risk", description: "Seasonal and weather dependent" },
        ],
        roadmap: [
          { phase: "Phase 1", title: "Define Experience", description: "What unique experience can you offer?", timeframe: "Week 1-2" },
          { phase: "Phase 2", title: "Prepare Space", description: "Set up basic amenities and safety.", timeframe: "Week 3-6" },
          { phase: "Phase 3", title: "Launch & List", description: "List on platforms, social media marketing.", timeframe: "Month 2-3" },
          { phase: "Phase 4", title: "Refine & Expand", description: "Add experiences, improve based on feedback.", timeframe: "Month 4-6" },
        ],
        pitchSummary: "Give people the authentic rural experience they're seeking—escape, learning, and memories.",
      },
      ideas: [
        { title: "Agri-Tourism Experience", description: "Farm stays, workshops, and rural experiences.", whyItFits: "Uses existing rural assets.", localAdaptation: "Growing urban demand for rural escapes." },
        { title: "Craft Production", description: "Handmade products with local materials.", whyItFits: "Budget covers materials and tools.", localAdaptation: "Access to unique local materials." },
        { title: "Local Food Processing", description: "Packaged local specialties for wider distribution.", whyItFits: "Budget enables basic equipment.", localAdaptation: "Regional food products have market appeal." },
      ],
      decisionSupport: {
        pros: ["Unique positioning", "Multiple revenue streams", "Asset utilization", "Growing market segment"],
        cons: ["Seasonal demand", "Setup complexity", "Marketing challenges from rural location"],
        assumptions: ["Space available for hosting", "Willingness to host visitors", "Transportation access"],
        risks: ["Weather dependency", "Low shoulder season demand", "Regulatory requirements"],
        mitigations: ["Diversify offerings", "Build direct booking relationships", "Start with simpler experiences"],
        revenueSimulation: { year1RevenueMin: 5000, year1RevenueMax: 18000, year1ProfitMin: 2500, year1ProfitMax: 12000, currency: "USD", notes: "Seasonal business with peak during good weather", disclaimer: "Highly dependent on location and tourism trends" },
        explainability: "Rural location becomes an asset rather than limitation through experience-based business.",
        budgetSuitability: "good",
        easeOfExecution: "challenging",
      },
      ethicalSafeguards: {
        biasChecks: ["Inclusive hosting practices"],
        inclusivityNotes: ["Accessible experience options"],
        harmAvoidance: ["Sustainable tourism practices"],
      },
      localAdaptation: { regionFocus: "Rural tourism potential", localEconomyTie: "Diversifies rural income", accessibilityNotes: "Requires some visitor accessibility" },
    },
  },
};

/**
 * Get fallback response based on context
 */
export const getFallbackResponse = (context) => {
  const budgetTier = context?.economicContext?.budget?.tier || "small";
  const locationType = context?.economicContext?.location?.type || "urban";
  
  // Map budget tiers
  const budgetKey = ["micro", "small"].includes(budgetTier) ? budgetTier : "small";
  
  // Map location types
  const locationKey = ["rural", "remote"].includes(locationType) ? "rural" : "urban";
  
  // Get fallback
  const fallback = fallbackResponses[budgetKey]?.[locationKey] || fallbackResponses.small.urban;
  
  return {
    ...fallback,
    _meta: {
      isFallback: true,
      fallbackReason: "Primary AI generation unavailable",
      budgetKey,
      locationKey,
    },
  };
};

/**
 * Check if response is a fallback
 */
export const isFallbackResponse = (response) => {
  return response?._meta?.isFallback === true;
};

/**
 * Create a "processing" state response for long operations
 */
export const getProcessingResponse = (sessionId) => {
  return {
    status: "processing",
    message: "Your personalized business ideas are being generated. This may take a moment.",
    sessionId,
    estimatedTimeSeconds: 30,
  };
};

/**
 * Create a "partial" state response when some data is available
 */
export const getPartialResponse = (partialData, sessionId) => {
  return {
    status: "partial",
    message: "Some results are available. Full analysis is still processing.",
    sessionId,
    partialResults: partialData,
  };
};

export default {
  getFallbackResponse,
  isFallbackResponse,
  getProcessingResponse,
  getPartialResponse,
  fallbackResponses,
};
