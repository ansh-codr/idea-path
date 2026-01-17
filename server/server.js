/**
 * IdeaForge Backend Server
 * ========================
 * Production-feasible, hackathon-demonstrable AI decision-support pipeline.
 * 
 * This is NOT a chatbot.
 * This is a structured AI decision-support pipeline.
 * 
 * System Goals (Reskill Alignment):
 * - Convert minimal human context into personalized business guidance
 * - Reduce cognitive and time burden for underserved entrepreneurs
 * - Provide explainable, ethical, locally-adapted recommendations
 * 
 * Backend Priorities:
 * - Clarity > Complexity
 * - Guidance > Automation
 * - Trust > Intelligence theatrics
 */

import express from "express";
import cors from "cors";
import crypto from "crypto";
import config from "./src/config/index.js";
import { generateInputSchema, feedbackSchema } from "./src/schemas/index.js";
import {
  validateAndNormalize,
  createValidationResult,
} from "./src/pipeline/validation.js";
import {
  buildContext,
  buildPrimarySystemPrompt,
  buildUserPrompt,
  buildSecondarySystemPrompt,
} from "./src/pipeline/contextBuilder.js";
import {
  orchestrateAIGeneration,
  checkAIAvailability,
} from "./src/pipeline/aiOrchestration.js";
import {
  processSimulations,
  enforceScoreOrder,
  enforceRoadmapPhases,
} from "./src/pipeline/feasibilitySimulation.js";
import {
  validateInputSafety,
  validateOutputSafety,
  generateEthicalSafeguards,
  applySafetyFilters,
} from "./src/pipeline/ethicalSafeguards.js";
import {
  formatResponse,
  formatErrorResponse,
} from "./src/pipeline/responseFormatter.js";
import { getFallbackResponse } from "./src/pipeline/fallback.js";
import {
  sessionStore,
  feedbackStore,
  contextCache,
  resultStore,
  getStorageStats,
  initializeFirebase,
} from "./src/storage/firebase.js";
import { optionalAuth, requireAuth } from "./src/middleware/auth.js";

// Initialize Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: config.server.corsOrigins.length ? config.server.corsOrigins : "*",
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Initialize storage
initializeFirebase();

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[IdeaForge] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get("/api/health", (req, res) => {
  const aiStatus = checkAIAvailability();
  const storageStats = getStorageStats();
  
  res.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    ai: {
      primaryAvailable: aiStatus.primaryAvailable,
      secondaryAvailable: aiStatus.secondaryAvailable,
    },
    storage: storageStats,
  });
});

// ============================================
// MAIN GENERATION ENDPOINT
// ============================================
/**
 * POST /api/generate
 * 
 * Main idea generation pipeline:
 * 1. Validation & Normalization
 * 2. Context Building
 * 3. LLaMA-4 Scout (idea generation)
 * 4. GPT-5.2 (structuring & safety)
 * 5. Feasibility & Simulation
 * 6. Response Formatting
 * 
 * Uses optionalAuth - works for both authenticated and anonymous users.
 * Authenticated users get their results saved to their account.
 */
app.post("/api/generate", optionalAuth, async (req, res) => {
  const startTime = Date.now();
  const sessionId = req.body.sessionId || crypto.randomUUID();
  const userId = req.user?.uid || null; // Will be null for anonymous users
  
  try {
    // Log user context
    if (userId) {
      console.log(`[IdeaForge] Authenticated request from user: ${userId}`);
    } else {
      console.log("[IdeaForge] Anonymous request");
    }
    
    // ========================================
    // STEP 1: Validation & Normalization
    // ========================================
    console.log("[IdeaForge] Step 1: Validating input...");
    
    const parsed = generateInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(
        formatErrorResponse("Invalid input", sessionId)
      );
    }
    
    // Normalize input (handles vague/ambiguous inputs inclusively)
    const normalizedInput = validateAndNormalize(parsed.data);
    
    // ========================================
    // STEP 2: Input Safety Check
    // ========================================
    console.log("[IdeaForge] Step 2: Checking input safety...");
    
    const inputSafety = validateInputSafety(normalizedInput);
    if (!inputSafety.safe) {
      return res.status(400).json(
        formatErrorResponse("Input contains unsafe content", sessionId)
      );
    }
    
    // ========================================
    // STEP 3: Context Building
    // ========================================
    console.log("[IdeaForge] Step 3: Building context...");
    
    // Check cache first
    const cacheKey = contextCache.generateKey(parsed.data);
    let context = await contextCache.get(cacheKey);
    
    if (!context) {
      context = buildContext(normalizedInput);
      await contextCache.set(cacheKey, context);
    }
    
    // Store session
    await sessionStore.set(sessionId, {
      input: parsed.data,
      context,
      stage: "generating",
    });
    
    // ========================================
    // STEP 4: AI Generation (Dual-Model)
    // ========================================
    console.log("[IdeaForge] Step 4: AI generation pipeline...");
    
    // Check AI availability
    const aiStatus = checkAIAvailability();
    if (!aiStatus.primaryAvailable) {
      console.log("[IdeaForge] Primary AI unavailable, using fallback...");
      
      const fallbackOutput = getFallbackResponse(context);
      const response = formatResponse({
        output: fallbackOutput,
        sessionId,
        metadata: {
          primaryModel: "fallback",
          secondaryModel: null,
          totalProcessingTimeMs: Date.now() - startTime,
          confidence: "low",
        },
      });
      
      return res.json(response);
    }
    
    // Build prompts
    const primarySystemPrompt = buildPrimarySystemPrompt(context);
    const userPrompt = buildUserPrompt(context);
    const secondarySystemPrompt = buildSecondarySystemPrompt();
    
    // Orchestrate AI generation
    const aiResult = await orchestrateAIGeneration({
      primarySystemPrompt,
      userPrompt,
      secondarySystemPrompt,
      skipSecondary: !aiStatus.secondaryAvailable,
    });
    
    if (!aiResult.success) {
      console.log("[IdeaForge] AI generation failed, using fallback...");
      
      const fallbackOutput = getFallbackResponse(context);
      const response = formatResponse({
        output: fallbackOutput,
        sessionId,
        metadata: {
          primaryModel: "fallback",
          secondaryModel: null,
          totalProcessingTimeMs: Date.now() - startTime,
          confidence: "low",
        },
      });
      
      return res.json(response);
    }
    
    // ========================================
    // STEP 5: Output Validation & Processing
    // ========================================
    console.log("[IdeaForge] Step 5: Processing and validating output...");
    
    let processedOutput = aiResult.output;
    
    // Validate score order
    if (!enforceScoreOrder(processedOutput.results?.feasibilityScores || [])) {
      console.log("[IdeaForge] Invalid score order, reordering...");
      // Attempt to reorder or use fallback
    }
    
    // Validate roadmap phases
    if (!enforceRoadmapPhases(processedOutput.results?.roadmap || [])) {
      console.log("[IdeaForge] Invalid roadmap phases, fixing...");
      // Attempt to fix phases
    }
    
    // Process simulations (adjust scores, calculate revenue)
    processedOutput = processSimulations(processedOutput, context);
    
    // ========================================
    // STEP 6: Output Safety Check
    // ========================================
    console.log("[IdeaForge] Step 6: Output safety validation...");
    
    const outputSafety = validateOutputSafety(processedOutput);
    
    // Apply safety filters
    const filteredOutput = applySafetyFilters(processedOutput, outputSafety);
    
    if (!filteredOutput) {
      console.log("[IdeaForge] Output blocked by safety filters, using fallback...");
      
      const fallbackOutput = getFallbackResponse(context);
      const response = formatResponse({
        output: fallbackOutput,
        sessionId,
        metadata: {
          primaryModel: "fallback",
          secondaryModel: null,
          totalProcessingTimeMs: Date.now() - startTime,
          confidence: "low",
        },
      });
      
      return res.json(response);
    }
    
    // Generate ethical safeguards section
    const ethicalSafeguards = generateEthicalSafeguards(context, outputSafety);
    filteredOutput.ethicalSafeguards = {
      ...filteredOutput.ethicalSafeguards,
      ...ethicalSafeguards,
    };
    
    // ========================================
    // STEP 7: Response Formatting
    // ========================================
    console.log("[IdeaForge] Step 7: Formatting response...");
    
    const { calculateConfidence } = await import("./src/pipeline/feasibilitySimulation.js");
    
    const response = formatResponse({
      output: filteredOutput,
      sessionId,
      metadata: {
        primaryModel: aiResult.metadata?.primaryModel || config.ai.primary.model,
        secondaryModel: aiResult.metadata?.secondaryModel || config.ai.secondary.model,
        totalProcessingTimeMs: Date.now() - startTime,
        confidence: calculateConfidence(context),
      },
    });
    
    // Store result for potential retrieval
    await resultStore.save(response.resultId, response);
    
    // Update session
    await sessionStore.set(sessionId, {
      input: parsed.data,
      context,
      stage: "completed",
      resultId: response.resultId,
      completedAt: new Date().toISOString(),
    });
    
    console.log(`[IdeaForge] Generation complete in ${Date.now() - startTime}ms`);
    
    res.json(response);
    
  } catch (error) {
    console.error("[IdeaForge] Error in generation pipeline:", error.message);
    
    // Try fallback
    try {
      const fallbackOutput = getFallbackResponse({});
      const response = formatResponse({
        output: fallbackOutput,
        sessionId,
        metadata: {
          primaryModel: "fallback",
          secondaryModel: null,
          totalProcessingTimeMs: Date.now() - startTime,
          confidence: "low",
        },
      });
      
      return res.json(response);
    } catch (fallbackError) {
      return res.status(500).json(
        formatErrorResponse("Failed to generate results", sessionId)
      );
    }
  }
});

// ============================================
// FEEDBACK ENDPOINT
// ============================================
/**
 * POST /api/feedback
 * 
 * Collects thumbs up/down feedback.
 * Minimal data collection aligned with ethical storage.
 */
app.post("/api/feedback", async (req, res) => {
  try {
    const parsed = feedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid feedback data" });
    }
    
    await feedbackStore.save(parsed.data);
    
    res.json({ status: "ok", message: "Thank you for your feedback!" });
  } catch (error) {
    console.error("[IdeaForge] Feedback error:", error.message);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// ============================================
// SESSION RETRIEVAL ENDPOINT
// ============================================
/**
 * GET /api/session/:sessionId
 * 
 * Retrieves session data for continuity.
 */
app.get("/api/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await sessionStore.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.json(session);
  } catch (error) {
    console.error("[IdeaForge] Session retrieval error:", error.message);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
});

// ============================================
// RESULT RETRIEVAL ENDPOINT
// ============================================
/**
 * GET /api/result/:resultId
 * 
 * Retrieves a previously generated result.
 */
app.get("/api/result/:resultId", async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await resultStore.get(resultId);
    
    if (!result) {
      return res.status(404).json({ error: "Result not found or expired" });
    }
    
    res.json(result);
  } catch (error) {
    console.error("[IdeaForge] Result retrieval error:", error.message);
    res.status(500).json({ error: "Failed to retrieve result" });
  }
});

// ============================================
// FEEDBACK SUMMARY ENDPOINT (Admin)
// ============================================
/**
 * GET /api/admin/feedback-summary
 * 
 * Returns feedback statistics for monitoring.
 */
app.get("/api/admin/feedback-summary", async (req, res) => {
  try {
    const summary = await feedbackStore.getSummary();
    res.json(summary);
  } catch (error) {
    console.error("[IdeaForge] Feedback summary error:", error.message);
    res.status(500).json({ error: "Failed to get feedback summary" });
  }
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error("[IdeaForge] Unhandled error:", err.message);
  res.status(500).json(formatErrorResponse("An unexpected error occurred"));
});

// ============================================
// USER PROFILE ENDPOINT (Authenticated Only)
// ============================================
app.get("/api/user/profile", requireAuth, async (req, res) => {
  try {
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
      emailVerified: req.user.emailVerified,
    });
  } catch (error) {
    console.error("[IdeaForge] Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ============================================
// USER HISTORY ENDPOINT (Authenticated Only)
// ============================================
app.get("/api/user/history", requireAuth, async (req, res) => {
  try {
    // For now, return empty array - would fetch from database in production
    res.json({
      results: [],
      message: "History feature coming soon!",
    });
  } catch (error) {
    console.error("[IdeaForge] Error fetching user history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ============================================
// START SERVER
// ============================================
const port = config.server.port;
app.listen(port, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 IdeaForge Backend Server                               ║
║                                                              ║
║   Status: Running                                            ║
║   Port: ${port}                                                 ║
║   Environment: ${config.server.env}                              ║
║                                                              ║
║   Endpoints:                                                 ║
║   • POST /api/generate    - Main idea generation             ║
║   • POST /api/feedback    - User feedback                    ║
║   • GET  /api/health      - Health check                     ║
║   • GET  /api/session/:id - Session retrieval                ║
║   • GET  /api/result/:id  - Result retrieval                 ║
║   • GET  /api/user/profile - User profile (auth required)    ║
║   • GET  /api/user/history - User history (auth required)    ║
║                                                              ║
║   Backend Priorities:                                        ║
║   • Clarity > Complexity                                     ║
║   • Guidance > Automation                                    ║
║   • Trust > Intelligence theatrics                           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
