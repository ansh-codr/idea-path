/**
 * IdeaForge Validation Schemas
 * ============================
 * Zod schemas for input validation and output contracts.
 * 
 * Design Principles (Reskill Alignment):
 * - Assume ambiguity in inputs
 * - Never reject users for lack of clarity
 * - Preserve inclusivity through flexible validation
 * - Ensure structured, frontend-safe outputs
 */

import { z } from "zod";

// ============================================
// INPUT SCHEMAS (User-facing, inclusive)
// ============================================

/**
 * Main generation input schema
 * Designed to accept vague inputs from underserved users
 */
export const generateInputSchema = z.object({
  // Core required fields (minimum viable input)
  skills: z.string().min(2, "Please share at least a brief skill or interest"),
  interests: z.string().min(2, "Tell us what interests you"),
  budget: z.string().min(1, "Select a budget range"),
  locationType: z.string().min(1, "Select your location type"),
  targetAudience: z.string().min(2, "Describe who you want to serve"),

  // Optional enrichment fields (for better personalization)
  goals: z.string().optional().default(""),
  localData: z.string().optional().default(""),
  region: z.string().optional().default(""),
  language: z.string().optional().default("English"),
  
  // Session management (for Firebase integration)
  sessionId: z.string().optional(),
  
  // Provider override (for testing)
  provider: z.string().optional(),
});

/**
 * Feedback schema (thumbs up/down)
 * Minimal data collection aligned with ethical storage
 */
export const feedbackSchema = z.object({
  sessionId: z.string().min(3),
  rating: z.enum(["up", "down"]),
  notes: z.string().optional().default(""),
  resultId: z.string().optional(),
  ideaIndex: z.number().optional(),
});

// ============================================
// OUTPUT SCHEMAS (Structured, frontend-safe)
// ============================================

/**
 * Business idea schema
 */
export const businessIdeaSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  whyItFits: z.string().min(10),
  localAdaptation: z.string().optional().default(""),
});

/**
 * Feasibility score schema
 * Uses ranges and estimates (never exact figures)
 */
export const feasibilityScoreSchema = z.object({
  label: z.string().min(3),
  value: z.number().min(0).max(100),
  iconKey: z.enum(["market", "execution", "capital", "risk"]),
  description: z.string().min(5),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
});

/**
 * Roadmap step schema
 */
export const roadmapStepSchema = z.object({
  phase: z.string().min(3),
  title: z.string().min(3),
  description: z.string().min(5),
  timeframe: z.string().min(3),
  dependencies: z.array(z.string()).optional().default([]),
});

/**
 * Main results schema (primary output)
 */
export const resultsSchema = z.object({
  businessIdea: businessIdeaSchema,
  feasibilityScores: z.array(feasibilityScoreSchema).length(4),
  roadmap: z.array(roadmapStepSchema).length(4),
  pitchSummary: z.string().min(10),
});

/**
 * Revenue simulation schema
 * CRITICAL: Uses ranges, always labeled as estimates
 */
export const revenueSimulationSchema = z.object({
  year1RevenueMin: z.number().min(0),
  year1RevenueMax: z.number().min(0),
  year1ProfitMin: z.number(),
  year1ProfitMax: z.number(),
  currency: z.string().min(1).default("USD"),
  notes: z.string().min(5),
  disclaimer: z.string().default("These are rough estimates based on limited data. Actual results may vary significantly."),
});

/**
 * Decision support schema
 * Provides explainable pros/cons and risk assessment
 */
export const decisionSupportSchema = z.object({
  pros: z.array(z.string()).min(2),
  cons: z.array(z.string()).min(2),
  assumptions: z.array(z.string()).min(2),
  risks: z.array(z.string()).min(2),
  mitigations: z.array(z.string()).min(2),
  revenueSimulation: revenueSimulationSchema,
  explainability: z.string().min(10),
  budgetSuitability: z.enum(["excellent", "good", "moderate", "challenging"]),
  easeOfExecution: z.enum(["easy", "moderate", "challenging", "difficult"]),
});

/**
 * Ethical safeguards schema
 * Ensures all outputs pass safety checks
 */
export const ethicalSafeguardsSchema = z.object({
  biasChecks: z.array(z.string()).min(1),
  inclusivityNotes: z.array(z.string()).min(1),
  harmAvoidance: z.array(z.string()).min(1),
  safetyScore: z.number().min(0).max(100).optional(),
});

/**
 * Local adaptation schema
 * Ties ideas to specific regional contexts
 */
export const localAdaptationSchema = z.object({
  regionFocus: z.string().min(2),
  localEconomyTie: z.string().min(5),
  accessibilityNotes: z.string().min(5),
  marketConditions: z.string().optional().default(""),
  culturalConsiderations: z.string().optional().default(""),
});

/**
 * Complete AI response schema
 * Full structured output from the pipeline
 */
export const aiResponseSchema = z.object({
  results: resultsSchema,
  ideas: z.array(businessIdeaSchema).min(3).max(5),
  decisionSupport: decisionSupportSchema,
  ethicalSafeguards: ethicalSafeguardsSchema,
  localAdaptation: localAdaptationSchema,
});

/**
 * Final API response schema
 * What gets sent to the frontend
 */
export const apiResponseSchema = z.object({
  resultId: z.string(),
  sessionId: z.string().nullable(),
  results: resultsSchema,
  ideas: z.array(businessIdeaSchema),
  decisionSupport: decisionSupportSchema,
  ethicalSafeguards: ethicalSafeguardsSchema,
  localAdaptation: localAdaptationSchema,
  metadata: z.object({
    generatedAt: z.string(),
    modelPrimary: z.string(),
    modelSecondary: z.string(),
    processingTimeMs: z.number(),
    confidence: z.enum(["low", "medium", "high"]),
  }),
});

export default {
  generateInputSchema,
  feedbackSchema,
  resultsSchema,
  decisionSupportSchema,
  ethicalSafeguardsSchema,
  localAdaptationSchema,
  aiResponseSchema,
  apiResponseSchema,
};
