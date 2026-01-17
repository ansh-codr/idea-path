/**
 * IdeaForge Backend Configuration
 * ================================
 * Centralized configuration management aligned with Reskill goals:
 * - Clarity > Complexity
 * - Trust > Intelligence theatrics
 * - Inclusive defaults for underserved users
 */

import dotenv from "dotenv";
dotenv.config();

export const config = {
  // Server Configuration
  server: {
    port: Number(process.env.PORT) || 5001,
    env: process.env.NODE_ENV || "development",
    corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:8080")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  },

  // AI Model Configuration (Dual-Model Strategy)
  ai: {
    // Primary: LLaMA-4 Scout (domain-trained for idea generation)
    // In demo: Using OpenAI as proxy for LLaMA-4 Scout behavior
    primary: {
      provider: (process.env.PRIMARY_AI_PROVIDER || "openai").toLowerCase(),
      model: process.env.PRIMARY_AI_MODEL || "gpt-4o-mini",
      temperature: 0.7, // Higher creativity for idea generation
      maxTokens: 2000,
      role: "IDEA_GENERATION", // Generates domain ideas and raw reasoning
    },
    // Secondary: GPT-5.2 (reasoning refinement, structuring, safety)
    // NEVER generates ideas from scratch
    secondary: {
      provider: (process.env.SECONDARY_AI_PROVIDER || "openai").toLowerCase(),
      model: process.env.SECONDARY_AI_MODEL || "gpt-4o",
      temperature: 0.3, // Lower for structured, consistent outputs
      maxTokens: 1500,
      role: "STRUCTURING_SAFETY", // Only structures, refines, enforces safety
    },
  },

  // Firebase Configuration (Minimal storage aligned with ethics)
  firebase: {
    enabled: process.env.FIREBASE_ENABLED === "true",
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    // Used ONLY for: session storage, context caching, feedback
    // NOT for: sensitive personal data, user tracking
  },

  // Budget Mapping (Normalized for inclusivity)
  // Designed for underserved users with limited resources
  budgetRanges: {
    "under-1k": { min: 0, max: 1000, label: "Micro Budget", tier: "micro" },
    "1k-5k": { min: 1000, max: 5000, label: "Small Budget", tier: "small" },
    "5k-20k": { min: 5000, max: 20000, label: "Moderate Budget", tier: "moderate" },
    "20k-50k": { min: 20000, max: 50000, label: "Growth Budget", tier: "growth" },
    "over-50k": { min: 50000, max: 200000, label: "Scale Budget", tier: "scale" },
  },

  // Location Context Mapping (Local adaptation)
  locationContexts: {
    urban: {
      marketAccess: "high",
      footTraffic: "high",
      rentCost: "high",
      digitalInfra: "strong",
      competitionLevel: "high",
    },
    suburban: {
      marketAccess: "medium-high",
      footTraffic: "medium",
      rentCost: "medium",
      digitalInfra: "strong",
      competitionLevel: "medium",
    },
    "semi-urban": {
      marketAccess: "medium",
      footTraffic: "medium",
      rentCost: "low-medium",
      digitalInfra: "moderate",
      competitionLevel: "low-medium",
    },
    rural: {
      marketAccess: "low",
      footTraffic: "low",
      rentCost: "low",
      digitalInfra: "limited",
      competitionLevel: "low",
    },
    remote: {
      marketAccess: "very-low",
      footTraffic: "minimal",
      rentCost: "very-low",
      digitalInfra: "limited",
      competitionLevel: "minimal",
    },
  },

  // Ethical Safeguards Configuration
  ethics: {
    // Blocked content patterns (harm avoidance)
    blockedPatterns: [
      "hate", "kill", "explosive", "weapon", "terror",
      "self-harm", "suicide", "scam", "fraud", "exploit",
      "illegal", "child", "trafficking", "money laundering",
    ],
    // Business types to flag for review
    flaggedBusinessTypes: [
      "gambling", "adult", "tobacco", "alcohol",
      "payday lending", "multi-level marketing",
    ],
    // Bias check categories
    biasCategories: [
      "gender", "age", "disability", "ethnicity",
      "socioeconomic", "geographic",
    ],
  },

  // Fallback Configuration (Demo reliability)
  fallback: {
    enabled: true,
    cacheExpiry: 3600000, // 1 hour in ms
    maxRetries: 2,
    retryDelay: 1000, // 1 second
  },

  // Rate Limiting (Resource protection)
  rateLimit: {
    windowMs: 60000, // 1 minute
    maxRequests: 10,
  },
};

export default config;
