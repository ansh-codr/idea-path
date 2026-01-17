/**
 * IdeaForge Validation & Normalization Pipeline
 * ==============================================
 * Step 1 of the backend data flow.
 * 
 * Responsibility:
 * - Accept vague inputs from users
 * - Normalize text and categorize values
 * - Never reject users for lack of clarity
 * 
 * Reskill Alignment:
 * - Inclusive access for underserved users
 * - Reduced cognitive burden
 * - Preserve user intent even with ambiguous input
 */

import config from "../config/index.js";

/**
 * Normalize free-form text input
 * Cleans whitespace, limits length, preserves meaning
 */
export const normalizeText = (value, maxLen = 600) => {
  if (!value) return "";
  return String(value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
};

/**
 * Normalize language preference
 * Supports Hindi/English with fallback to English
 */
export const normalizeLanguage = (value) => {
  const raw = normalizeText(value, 40).toLowerCase();
  if (!raw) return "English";
  
  const hindiVariants = ["hi", "hindi", "हिंदी", "हिन्दी"];
  const englishVariants = ["en", "english", "eng"];
  
  if (hindiVariants.includes(raw)) return "Hindi";
  if (englishVariants.includes(raw)) return "English";
  
  return "English"; // Inclusive fallback
};

/**
 * Normalize budget input to structured range
 * Maps vague budget descriptions to concrete ranges
 */
export const normalizeBudget = (value) => {
  const raw = normalizeText(value, 60).toLowerCase();
  
  // Direct mapping from form values
  if (config.budgetRanges[raw]) {
    return {
      key: raw,
      ...config.budgetRanges[raw],
    };
  }
  
  // Fuzzy matching for vague inputs
  const fuzzyMap = {
    // Micro budget indicators
    "very low": "under-1k",
    "minimal": "under-1k",
    "almost nothing": "under-1k",
    "very little": "under-1k",
    "bootstrapping": "under-1k",
    
    // Small budget indicators
    "low": "1k-5k",
    "limited": "1k-5k",
    "tight": "1k-5k",
    "small": "1k-5k",
    
    // Moderate indicators
    "medium": "5k-20k",
    "moderate": "5k-20k",
    "reasonable": "5k-20k",
    "some savings": "5k-20k",
    
    // Growth indicators
    "good": "20k-50k",
    "substantial": "20k-50k",
    "solid": "20k-50k",
    
    // Scale indicators
    "high": "over-50k",
    "significant": "over-50k",
    "large": "over-50k",
  };
  
  for (const [keyword, budgetKey] of Object.entries(fuzzyMap)) {
    if (raw.includes(keyword)) {
      return {
        key: budgetKey,
        ...config.budgetRanges[budgetKey],
        normalized: true, // Flag that we interpreted the input
      };
    }
  }
  
  // Default to small budget for safety (underserved user assumption)
  return {
    key: "1k-5k",
    ...config.budgetRanges["1k-5k"],
    assumed: true, // Flag that we assumed this value
  };
};

/**
 * Normalize location type to structured context
 * Maps location to market accessibility factors
 */
export const normalizeLocation = (value) => {
  const raw = normalizeText(value, 60).toLowerCase();
  
  // Direct mapping
  if (config.locationContexts[raw]) {
    return {
      type: raw,
      ...config.locationContexts[raw],
    };
  }
  
  // Fuzzy matching
  const fuzzyMap = {
    "city": "urban",
    "metro": "urban",
    "metropolitan": "urban",
    "downtown": "urban",
    
    "suburb": "suburban",
    "outskirts": "suburban",
    
    "town": "semi-urban",
    "small city": "semi-urban",
    "district": "semi-urban",
    
    "village": "rural",
    "countryside": "rural",
    "farm": "rural",
    "agricultural": "rural",
    
    "isolated": "remote",
    "mountain": "remote",
    "island": "remote",
  };
  
  for (const [keyword, locationType] of Object.entries(fuzzyMap)) {
    if (raw.includes(keyword)) {
      return {
        type: locationType,
        ...config.locationContexts[locationType],
        normalized: true,
      };
    }
  }
  
  // Default to semi-urban (middle ground for inclusivity)
  return {
    type: "semi-urban",
    ...config.locationContexts["semi-urban"],
    assumed: true,
  };
};

/**
 * Extract skill categories from free-form text
 * Helps contextualize user capabilities
 */
export const extractSkillCategories = (skillsText) => {
  const raw = normalizeText(skillsText, 400).toLowerCase();
  
  const categories = {
    technical: ["coding", "programming", "software", "web", "app", "data", "computer", "tech", "engineering"],
    creative: ["design", "art", "music", "writing", "photography", "video", "content", "creative"],
    service: ["teaching", "tutoring", "consulting", "coaching", "mentoring", "counseling", "helping"],
    trade: ["cooking", "baking", "crafting", "sewing", "carpentry", "repair", "maintenance", "making"],
    business: ["sales", "marketing", "accounting", "management", "organizing", "planning", "strategy"],
    agricultural: ["farming", "gardening", "livestock", "agriculture", "cultivation", "harvest"],
    healthcare: ["nursing", "caregiving", "health", "wellness", "fitness", "therapy"],
  };
  
  const detected = [];
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => raw.includes(keyword))) {
      detected.push(category);
    }
  }
  
  return detected.length > 0 ? detected : ["general"];
};

/**
 * Main validation and normalization function
 * Transforms raw user input into structured context
 */
export const validateAndNormalize = (rawInput) => {
  const normalized = {
    // Core fields (normalized)
    skills: normalizeText(rawInput.skills, 400),
    interests: normalizeText(rawInput.interests, 300),
    targetAudience: normalizeText(rawInput.targetAudience, 200),
    
    // Structured fields
    budget: normalizeBudget(rawInput.budget),
    location: normalizeLocation(rawInput.locationType),
    language: normalizeLanguage(rawInput.language),
    
    // Optional enrichment
    goals: normalizeText(rawInput.goals, 300) || "Build a sustainable income source",
    localData: normalizeText(rawInput.localData, 400),
    region: normalizeText(rawInput.region, 80) || rawInput.locationType || "local area",
    
    // Derived context
    skillCategories: extractSkillCategories(rawInput.skills),
    
    // Session tracking
    sessionId: rawInput.sessionId || null,
    
    // Metadata
    _meta: {
      receivedAt: new Date().toISOString(),
      hasAssumedValues: false,
      assumptions: [],
    },
  };
  
  // Track assumptions for transparency
  if (normalized.budget.assumed) {
    normalized._meta.hasAssumedValues = true;
    normalized._meta.assumptions.push("budget");
  }
  if (normalized.location.assumed) {
    normalized._meta.hasAssumedValues = true;
    normalized._meta.assumptions.push("location");
  }
  
  return normalized;
};

/**
 * Validation result type
 */
export const createValidationResult = (isValid, data, errors = []) => ({
  isValid,
  data,
  errors,
  timestamp: new Date().toISOString(),
});

export default {
  normalizeText,
  normalizeLanguage,
  normalizeBudget,
  normalizeLocation,
  extractSkillCategories,
  validateAndNormalize,
  createValidationResult,
};
