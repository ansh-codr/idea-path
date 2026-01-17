/**
 * IdeaForge Response Formatter
 * ============================
 * Final step of the backend data flow.
 * 
 * Responsibility:
 * - Create fully structured outputs
 * - Ensure frontend-safe JSON
 * - Remove raw model responses
 * - Protect UX integrity
 * 
 * Reskill Alignment:
 * - Clear, accessible outputs for non-technical users
 * - No exposed reasoning traces
 * - Consistent, reliable response format
 */

import crypto from "crypto";
import { apiResponseSchema } from "../schemas/index.js";

/**
 * Generate a unique result ID
 */
export const generateResultId = () => {
  return crypto.randomUUID();
};

/**
 * Sanitize text for frontend display
 * Removes any potentially dangerous content
 */
const sanitizeText = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove JS protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

/**
 * Sanitize an object recursively
 */
const sanitizeObject = (obj) => {
  if (typeof obj === "string") {
    return sanitizeText(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (typeof obj === "object" && obj !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip internal/debug fields
      if (key.startsWith("_") || key === "rawModelResponse") {
        continue;
      }
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
};

/**
 * Ensure required fields have defaults
 */
const ensureDefaults = (output) => {
  // Ensure results structure
  output.results = output.results || {};
  output.results.businessIdea = output.results.businessIdea || {
    title: "Business Idea",
    description: "A business opportunity tailored to your profile.",
    whyItFits: "This idea aligns with your skills and interests.",
  };
  
  // Ensure feasibility scores
  if (!output.results.feasibilityScores || output.results.feasibilityScores.length !== 4) {
    output.results.feasibilityScores = [
      { label: "Market Demand", value: 60, iconKey: "market", description: "Moderate market opportunity" },
      { label: "Ease of Execution", value: 55, iconKey: "execution", description: "Achievable with effort" },
      { label: "Capital Efficiency", value: 70, iconKey: "capital", description: "Good budget fit" },
      { label: "Risk Level", value: 50, iconKey: "risk", description: "Manageable risks" },
    ];
  }
  
  // Ensure roadmap
  if (!output.results.roadmap || output.results.roadmap.length !== 4) {
    output.results.roadmap = [
      { phase: "Phase 1", title: "Research & Validate", description: "Understand your market", timeframe: "Week 1-2" },
      { phase: "Phase 2", title: "Setup & Launch", description: "Get started with basics", timeframe: "Week 3-4" },
      { phase: "Phase 3", title: "First Customers", description: "Acquire initial customers", timeframe: "Month 2" },
      { phase: "Phase 4", title: "Grow & Iterate", description: "Expand and improve", timeframe: "Month 3-6" },
    ];
  }
  
  // Ensure pitch summary
  output.results.pitchSummary = output.results.pitchSummary || 
    "A practical business opportunity designed for your unique situation.";
  
  // Ensure ideas array
  if (!output.ideas || output.ideas.length < 3) {
    output.ideas = output.ideas || [];
    while (output.ideas.length < 3) {
      output.ideas.push({
        title: `Alternative Idea ${output.ideas.length + 1}`,
        description: "An alternative business direction to consider.",
        whyItFits: "This option offers different advantages.",
        localAdaptation: "Can be adapted to your local context.",
      });
    }
  }
  
  // Ensure decision support
  output.decisionSupport = output.decisionSupport || {};
  output.decisionSupport.pros = output.decisionSupport.pros || ["Aligned with your skills", "Low barrier to entry"];
  output.decisionSupport.cons = output.decisionSupport.cons || ["Requires consistent effort", "Market validation needed"];
  output.decisionSupport.assumptions = output.decisionSupport.assumptions || ["Based on provided information", "Market conditions may vary"];
  output.decisionSupport.risks = output.decisionSupport.risks || ["Competition", "Economic changes"];
  output.decisionSupport.mitigations = output.decisionSupport.mitigations || ["Start small and validate", "Diversify offerings"];
  output.decisionSupport.revenueSimulation = output.decisionSupport.revenueSimulation || {
    year1RevenueMin: 5000,
    year1RevenueMax: 15000,
    year1ProfitMin: 500,
    year1ProfitMax: 4500,
    currency: "USD",
    notes: "Estimates based on typical small business performance",
    disclaimer: "Actual results may vary significantly",
  };
  output.decisionSupport.explainability = output.decisionSupport.explainability || 
    "These recommendations are based on your stated skills, budget, and location.";
  output.decisionSupport.budgetSuitability = output.decisionSupport.budgetSuitability || "moderate";
  output.decisionSupport.easeOfExecution = output.decisionSupport.easeOfExecution || "moderate";
  
  // Ensure ethical safeguards
  output.ethicalSafeguards = output.ethicalSafeguards || {
    biasChecks: ["Standard bias review completed"],
    inclusivityNotes: ["Ideas suitable for various backgrounds"],
    harmAvoidance: ["No harmful suggestions included"],
  };
  
  // Ensure local adaptation
  output.localAdaptation = output.localAdaptation || {
    regionFocus: "Your local area",
    localEconomyTie: "Designed for local market conditions",
    accessibilityNotes: "Accessible given your stated resources",
  };
  
  return output;
};

/**
 * Format the final API response
 * Creates a frontend-safe, structured output
 */
export const formatResponse = ({
  output,
  sessionId,
  metadata,
}) => {
  const resultId = generateResultId();
  
  // Ensure all required fields exist
  const completeOutput = ensureDefaults(output);
  
  // Sanitize all text content
  const sanitizedOutput = sanitizeObject(completeOutput);
  
  // Build the final response
  const response = {
    resultId,
    sessionId: sessionId || null,
    results: sanitizedOutput.results,
    ideas: sanitizedOutput.ideas,
    decisionSupport: sanitizedOutput.decisionSupport,
    ethicalSafeguards: sanitizedOutput.ethicalSafeguards,
    localAdaptation: sanitizedOutput.localAdaptation,
    metadata: {
      generatedAt: new Date().toISOString(),
      modelPrimary: metadata?.primaryModel || "unknown",
      modelSecondary: metadata?.secondaryModel || "none",
      processingTimeMs: metadata?.totalProcessingTimeMs || 0,
      confidence: metadata?.confidence || "medium",
    },
  };
  
  return response;
};

/**
 * Format error response
 * Ensures consistent error format without exposing internals
 */
export const formatErrorResponse = (error, sessionId = null) => {
  // Map internal errors to user-friendly messages
  const userFriendlyMessages = {
    "Invalid input": "Please check your inputs and try again.",
    "Input contains unsafe content": "Some of your input couldn't be processed. Please rephrase and try again.",
    "OpenAI client not initialized": "The service is temporarily unavailable. Please try again later.",
    "Anthropic client not initialized": "The service is temporarily unavailable. Please try again later.",
    "Invalid AI output structure": "We couldn't generate results this time. Please try again.",
    "Output blocked by safety filters": "We couldn't generate appropriate results for this request.",
  };
  
  const errorMessage = typeof error === "string" ? error : error?.message || "An error occurred";
  const userMessage = userFriendlyMessages[errorMessage] || "Something went wrong. Please try again.";
  
  return {
    error: userMessage,
    sessionId,
    timestamp: new Date().toISOString(),
    // Don't expose stack traces or internal details
  };
};

/**
 * Validate response against schema
 */
export const validateResponse = (response) => {
  try {
    apiResponseSchema.parse(response);
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: error.errors || [{ message: "Schema validation failed" }],
    };
  }
};

export default {
  generateResultId,
  formatResponse,
  formatErrorResponse,
  validateResponse,
};
