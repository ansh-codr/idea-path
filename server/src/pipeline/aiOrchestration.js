/**
 * IdeaForge AI Orchestration Pipeline
 * ====================================
 * Steps 3-4 of the backend data flow.
 * 
 * Responsibility:
 * - Orchestrate dual-model AI strategy
 * - LLaMA-4 Scout: Generate ideas (primary)
 * - GPT-5.2: Structure and refine (secondary)
 * - Handle model failures gracefully
 * 
 * Reskill Alignment:
 * - Domain-trained ideation for underserved users
 * - Ethical, explainable outputs
 * - Trust through structured processing
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import config from "../config/index.js";

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

/**
 * Strip to valid JSON from model response
 */
const stripToJson = (text) => {
  if (!text) return "";
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return text.trim();
  return text.slice(first, last + 1).trim();
};

/**
 * Call OpenAI API
 */
const callOpenAI = async ({ system, user, model, temperature, maxTokens }) => {
  if (!openai) {
    throw new Error("OpenAI client not initialized. Check OPENAI_API_KEY.");
  }
  
  const response = await openai.chat.completions.create({
    model: model || config.ai.primary.model,
    temperature: temperature ?? config.ai.primary.temperature,
    max_tokens: maxTokens || config.ai.primary.maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  
  return {
    content: response.choices[0]?.message?.content || "",
    usage: response.usage,
    model: response.model,
  };
};

/**
 * Call Anthropic API
 */
const callAnthropic = async ({ system, user, model, temperature, maxTokens }) => {
  if (!anthropic) {
    throw new Error("Anthropic client not initialized. Check ANTHROPIC_API_KEY.");
  }
  
  const response = await anthropic.messages.create({
    model: model || "claude-3-5-sonnet-latest",
    temperature: temperature ?? 0.7,
    max_tokens: maxTokens || 2000,
    system,
    messages: [{ role: "user", content: user }],
  });
  
  return {
    content: response.content?.[0]?.text || "",
    usage: response.usage,
    model: response.model,
  };
};

/**
 * Generic AI call dispatcher
 */
const callAI = async ({ provider, system, user, model, temperature, maxTokens }) => {
  const startTime = Date.now();
  
  let result;
  if (provider === "anthropic") {
    result = await callAnthropic({ system, user, model, temperature, maxTokens });
  } else {
    result = await callOpenAI({ system, user, model, temperature, maxTokens });
  }
  
  return {
    ...result,
    processingTimeMs: Date.now() - startTime,
    provider,
  };
};

/**
 * Primary Model: LLaMA-4 Scout (Idea Generation)
 * =============================================
 * In demo/production: Uses configured model as proxy
 * 
 * Role:
 * - Generate 3-5 business ideas
 * - Create execution steps
 * - Identify risks and dependencies
 * 
 * Training Intent:
 * - Low-budget, small-scale business cases
 * - Human-friendly language
 * - Ethical constraints (no scams, no exploitation)
 */
export const callPrimaryModel = async ({ systemPrompt, userPrompt }) => {
  const { primary } = config.ai;
  
  console.log(`[IdeaForge] Calling primary model (${primary.model}) for idea generation...`);
  
  const result = await callAI({
    provider: primary.provider,
    system: systemPrompt,
    user: userPrompt,
    model: primary.model,
    temperature: primary.temperature,
    maxTokens: primary.maxTokens,
  });
  
  console.log(`[IdeaForge] Primary model completed in ${result.processingTimeMs}ms`);
  
  return result;
};

/**
 * Secondary Model: GPT-5.2 (Structuring & Safety)
 * ===============================================
 * 
 * STRICT RULES:
 * - NEVER generates ideas from scratch
 * - ONLY structures outputs
 * - ONLY enforces schemas
 * - ONLY refines language
 * - ONLY resolves ambiguity
 * - ONLY applies safety constraints
 */
export const callSecondaryModel = async ({ rawOutput, systemPrompt }) => {
  const { secondary } = config.ai;
  
  console.log(`[IdeaForge] Calling secondary model (${secondary.model}) for structuring...`);
  
  const structuringPrompt = `Review and structure the following AI-generated business ideas output.

RULES:
1. Do NOT add new ideas or information
2. Fix any JSON formatting issues
3. Simplify language for non-technical users
4. Ensure all estimates are labeled as estimates
5. Add safety disclaimers where appropriate
6. Remove any hallucinations or unsupported claims

RAW OUTPUT TO STRUCTURE:
${rawOutput}

Return ONLY valid JSON that follows the required schema. No markdown, no explanation.`;

  const result = await callAI({
    provider: secondary.provider,
    system: systemPrompt,
    user: structuringPrompt,
    model: secondary.model,
    temperature: secondary.temperature,
    maxTokens: secondary.maxTokens,
  });
  
  console.log(`[IdeaForge] Secondary model completed in ${result.processingTimeMs}ms`);
  
  return result;
};

/**
 * Full AI Orchestration Pipeline
 * ==============================
 * Orchestrates both models in sequence
 */
export const orchestrateAIGeneration = async ({
  primarySystemPrompt,
  userPrompt,
  secondarySystemPrompt,
  skipSecondary = false,
}) => {
  const orchestrationStart = Date.now();
  const orchestrationLog = [];
  
  try {
    // Step 1: Primary Model - Idea Generation
    orchestrationLog.push({
      step: "primary_model_start",
      timestamp: new Date().toISOString(),
      model: config.ai.primary.model,
      role: config.ai.primary.role,
    });
    
    const primaryResult = await callPrimaryModel({
      systemPrompt: primarySystemPrompt,
      userPrompt,
    });
    
    orchestrationLog.push({
      step: "primary_model_complete",
      timestamp: new Date().toISOString(),
      processingTimeMs: primaryResult.processingTimeMs,
    });
    
    // Extract JSON from primary response
    let rawJson = stripToJson(primaryResult.content);
    
    // Step 2: Secondary Model - Structuring (if enabled)
    if (!skipSecondary && secondarySystemPrompt) {
      orchestrationLog.push({
        step: "secondary_model_start",
        timestamp: new Date().toISOString(),
        model: config.ai.secondary.model,
        role: config.ai.secondary.role,
      });
      
      const secondaryResult = await callSecondaryModel({
        rawOutput: rawJson,
        systemPrompt: secondarySystemPrompt,
      });
      
      orchestrationLog.push({
        step: "secondary_model_complete",
        timestamp: new Date().toISOString(),
        processingTimeMs: secondaryResult.processingTimeMs,
      });
      
      rawJson = stripToJson(secondaryResult.content);
    }
    
    // Parse final JSON
    const parsedOutput = JSON.parse(rawJson);
    
    const totalProcessingTime = Date.now() - orchestrationStart;
    
    return {
      success: true,
      output: parsedOutput,
      metadata: {
        totalProcessingTimeMs: totalProcessingTime,
        primaryModel: config.ai.primary.model,
        secondaryModel: skipSecondary ? null : config.ai.secondary.model,
        orchestrationLog,
      },
    };
    
  } catch (error) {
    orchestrationLog.push({
      step: "error",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
    
    return {
      success: false,
      error: error.message,
      metadata: {
        totalProcessingTimeMs: Date.now() - orchestrationStart,
        orchestrationLog,
      },
    };
  }
};

/**
 * Check if AI providers are available
 */
export const checkAIAvailability = () => {
  return {
    openai: !!openai,
    anthropic: !!anthropic,
    primaryAvailable: config.ai.primary.provider === "openai" ? !!openai : !!anthropic,
    secondaryAvailable: config.ai.secondary.provider === "openai" ? !!openai : !!anthropic,
  };
};

export default {
  callPrimaryModel,
  callSecondaryModel,
  orchestrateAIGeneration,
  checkAIAvailability,
  stripToJson,
};
