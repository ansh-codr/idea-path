/**
 * IdeaForge API Service
 * =====================
 * Frontend service for communicating with the IdeaForge backend.
 * Handles all API calls, error handling, and response typing.
 */

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Types
export interface GenerateInput {
  skills: string;
  interests: string;
  budget: string;
  locationType: string;
  targetAudience: string;
  goals?: string;
  localData?: string;
  region?: string;
  language?: string;
  sessionId?: string;
}

export interface BusinessIdea {
  title: string;
  description: string;
  whyItFits: string;
  localAdaptation?: string;
}

export interface FeasibilityScore {
  label: string;
  value: number;
  iconKey: "market" | "execution" | "capital" | "risk";
  description: string;
  confidence?: "low" | "medium" | "high";
}

export interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  timeframe: string;
  dependencies?: string[];
}

export interface RevenueSimulation {
  year1RevenueMin: number;
  year1RevenueMax: number;
  year1ProfitMin: number;
  year1ProfitMax: number;
  currency: string;
  notes: string;
  disclaimer: string;
}

export interface DecisionSupport {
  pros: string[];
  cons: string[];
  assumptions: string[];
  risks: string[];
  mitigations: string[];
  revenueSimulation: RevenueSimulation;
  explainability: string;
  budgetSuitability: "excellent" | "good" | "moderate" | "challenging";
  easeOfExecution: "easy" | "moderate" | "challenging" | "difficult";
}

export interface EthicalSafeguards {
  biasChecks: string[];
  inclusivityNotes: string[];
  harmAvoidance: string[];
  safetyScore?: number;
}

export interface LocalAdaptation {
  regionFocus: string;
  localEconomyTie: string;
  accessibilityNotes: string;
  marketConditions?: string;
  culturalConsiderations?: string;
}

export interface AIResults {
  businessIdea: BusinessIdea;
  feasibilityScores: FeasibilityScore[];
  roadmap: RoadmapStep[];
  pitchSummary: string;
}

export interface GenerateResponse {
  resultId: string;
  sessionId: string | null;
  results: AIResults;
  ideas: BusinessIdea[];
  decisionSupport: DecisionSupport;
  ethicalSafeguards: EthicalSafeguards;
  localAdaptation: LocalAdaptation;
  metadata: {
    generatedAt: string;
    modelPrimary: string;
    modelSecondary: string;
    processingTimeMs: number;
    confidence: "low" | "medium" | "high";
  };
}

export interface FeedbackInput {
  sessionId: string;
  rating: "up" | "down";
  notes?: string;
  resultId?: string;
  ideaIndex?: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  ai: {
    primaryAvailable: boolean;
    secondaryAvailable: boolean;
  };
  storage: {
    sessions: number;
    contexts: number;
    feedback: number;
    results: number;
    mode: string;
  };
}

// Error handling
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public sessionId?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Token getter function - will be set by AuthContext
let getAuthToken: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  getAuthToken = getter;
};

// Helper to get headers with auth token
const getHeaders = async (): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (getAuthToken) {
    const token = await getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// API Functions
export const ideaForgeAPI = {
  /**
   * Generate business ideas based on user input
   */
  generate: async (input: GenerateInput): Promise<GenerateResponse> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new APIError(
        errorBody?.error || "Failed to generate results",
        response.status,
        errorBody?.sessionId
      );
    }

    return response.json();
  },

  /**
   * Submit feedback for a result
   */
  submitFeedback: async (feedback: FeedbackInput): Promise<void> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers,
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new APIError("Failed to submit feedback", response.status);
    }
  },

  /**
   * Check API health status
   */
  health: async (): Promise<HealthResponse> => {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new APIError("Health check failed", response.status);
    }

    return response.json();
  },

  /**
   * Get a previously generated result
   */
  getResult: async (resultId: string): Promise<GenerateResponse> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/result/${resultId}`, { headers });

    if (!response.ok) {
      throw new APIError("Result not found", response.status);
    }

    return response.json();
  },

  /**
   * Get session data
   */
  getSession: async (sessionId: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, { headers });

    if (!response.ok) {
      throw new APIError("Session not found", response.status);
    }

    return response.json();
  },

  /**
   * Get user profile (requires authentication)
   */
  getUserProfile: async () => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/user/profile`, { headers });

    if (!response.ok) {
      throw new APIError("Failed to get profile", response.status);
    }

    return response.json();
  },

  /**
   * Get user history (requires authentication)
   */
  getUserHistory: async () => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/user/history`, { headers });

    if (!response.ok) {
      throw new APIError("Failed to get history", response.status);
    }

    return response.json();
  },
};

// Helper functions
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatRevenueRange = (simulation: RevenueSimulation): string => {
  const min = formatCurrency(simulation.year1RevenueMin, simulation.currency);
  const max = formatCurrency(simulation.year1RevenueMax, simulation.currency);
  return `${min} - ${max}`;
};

export const getConfidenceLabel = (confidence: string): string => {
  const labels: Record<string, string> = {
    low: "Preliminary Estimate",
    medium: "Moderate Confidence",
    high: "High Confidence",
  };
  return labels[confidence] || "Estimate";
};

export const getBudgetSuitabilityLabel = (suitability: string): string => {
  const labels: Record<string, string> = {
    excellent: "Excellent Fit",
    good: "Good Fit",
    moderate: "Moderate Fit",
    challenging: "May Be Challenging",
  };
  return labels[suitability] || suitability;
};

export const getExecutionLabel = (ease: string): string => {
  const labels: Record<string, string> = {
    easy: "Relatively Easy",
    moderate: "Moderate Effort",
    challenging: "Challenging",
    difficult: "Significant Effort Required",
  };
  return labels[ease] || ease;
};

export default ideaForgeAPI;
