/**
 * IdeaForge Firebase Integration (Optional)
 * =========================================
 * Minimal storage aligned with ethical principles.
 * 
 * Use ONLY for:
 * - Session storage
 * - Input context caching
 * - Output persistence (short-lived)
 * - Feedback (thumbs up/down)
 * 
 * DO NOT use for:
 * - Sensitive personal data
 * - Long-term user tracking
 * - Complex schemas
 * 
 * Reskill Alignment:
 * - Minimal data collection (ethics)
 * - Demo reliability (persistence)
 * - User feedback loop (improvement)
 */

import config from "../config/index.js";

// In-memory fallback when Firebase is not configured
const memoryStore = {
  sessions: new Map(),
  feedback: [],
  contexts: new Map(),
};

/**
 * Initialize Firebase (placeholder for production)
 * In demo mode, uses in-memory store
 */
export const initializeFirebase = () => {
  if (!config.firebase.enabled) {
    console.log("[IdeaForge] Firebase disabled. Using in-memory storage.");
    return { initialized: false, mode: "memory" };
  }
  
  // TODO: Add actual Firebase initialization for production
  console.log("[IdeaForge] Firebase would initialize here in production.");
  return { initialized: false, mode: "memory" };
};

/**
 * Session Management
 * Stores minimal session data for continuity
 */
export const sessionStore = {
  /**
   * Create or update a session
   */
  set: async (sessionId, data) => {
    const sessionData = {
      ...data,
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + config.fallback.cacheExpiry).toISOString(),
    };
    
    memoryStore.sessions.set(sessionId, sessionData);
    return { success: true, sessionId };
  },
  
  /**
   * Get session data
   */
  get: async (sessionId) => {
    const session = memoryStore.sessions.get(sessionId);
    
    if (!session) {
      return null;
    }
    
    // Check expiry
    if (new Date(session.expiresAt) < new Date()) {
      memoryStore.sessions.delete(sessionId);
      return null;
    }
    
    return session;
  },
  
  /**
   * Delete session
   */
  delete: async (sessionId) => {
    memoryStore.sessions.delete(sessionId);
    return { success: true };
  },
  
  /**
   * Clean expired sessions
   */
  cleanExpired: async () => {
    const now = new Date();
    let cleaned = 0;
    
    for (const [sessionId, session] of memoryStore.sessions.entries()) {
      if (new Date(session.expiresAt) < now) {
        memoryStore.sessions.delete(sessionId);
        cleaned++;
      }
    }
    
    return { cleaned };
  },
};

/**
 * Context Caching
 * Caches input contexts for faster re-processing
 */
export const contextCache = {
  /**
   * Cache a context
   */
  set: async (cacheKey, context) => {
    const cached = {
      context,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + config.fallback.cacheExpiry).toISOString(),
    };
    
    memoryStore.contexts.set(cacheKey, cached);
    return { success: true };
  },
  
  /**
   * Get cached context
   */
  get: async (cacheKey) => {
    const cached = memoryStore.contexts.get(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    if (new Date(cached.expiresAt) < new Date()) {
      memoryStore.contexts.delete(cacheKey);
      return null;
    }
    
    return cached.context;
  },
  
  /**
   * Generate cache key from input
   */
  generateKey: (input) => {
    // Create a simple hash from input values
    const str = [
      input.skills,
      input.interests,
      input.budget,
      input.locationType,
      input.targetAudience,
    ].join("|");
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return `ctx_${Math.abs(hash).toString(36)}`;
  },
};

/**
 * Feedback Storage
 * Collects thumbs up/down for improvement
 */
export const feedbackStore = {
  /**
   * Save feedback
   */
  save: async (feedback) => {
    const feedbackEntry = {
      ...feedback,
      receivedAt: new Date().toISOString(),
    };
    
    memoryStore.feedback.push(feedbackEntry);
    
    // Keep only last 1000 feedback entries in memory
    if (memoryStore.feedback.length > 1000) {
      memoryStore.feedback = memoryStore.feedback.slice(-1000);
    }
    
    return { success: true };
  },
  
  /**
   * Get feedback summary
   */
  getSummary: async () => {
    const total = memoryStore.feedback.length;
    const positive = memoryStore.feedback.filter((f) => f.rating === "up").length;
    const negative = memoryStore.feedback.filter((f) => f.rating === "down").length;
    
    return {
      total,
      positive,
      negative,
      positiveRate: total > 0 ? (positive / total * 100).toFixed(1) : 0,
    };
  },
  
  /**
   * Get recent feedback
   */
  getRecent: async (limit = 10) => {
    return memoryStore.feedback.slice(-limit);
  },
};

/**
 * Result Persistence (Optional, short-lived)
 * Stores results temporarily for retrieval
 */
export const resultStore = {
  results: new Map(),
  
  /**
   * Save result
   */
  save: async (resultId, result) => {
    const stored = {
      result,
      storedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + config.fallback.cacheExpiry).toISOString(),
    };
    
    resultStore.results.set(resultId, stored);
    return { success: true, resultId };
  },
  
  /**
   * Get result
   */
  get: async (resultId) => {
    const stored = resultStore.results.get(resultId);
    
    if (!stored) {
      return null;
    }
    
    if (new Date(stored.expiresAt) < new Date()) {
      resultStore.results.delete(resultId);
      return null;
    }
    
    return stored.result;
  },
};

/**
 * Get storage statistics (for monitoring)
 */
export const getStorageStats = () => {
  return {
    sessions: memoryStore.sessions.size,
    contexts: memoryStore.contexts.size,
    feedback: memoryStore.feedback.length,
    results: resultStore.results.size,
    mode: config.firebase.enabled ? "firebase" : "memory",
  };
};

export default {
  initializeFirebase,
  sessionStore,
  contextCache,
  feedbackStore,
  resultStore,
  getStorageStats,
};
