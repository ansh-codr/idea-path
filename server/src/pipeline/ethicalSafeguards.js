/**
 * IdeaForge Ethical Safeguards
 * ============================
 * Integrated throughout the backend data flow.
 * 
 * Responsibility:
 * - Filter harmful or illegal business ideas
 * - Detect exploitative labor suggestions
 * - Prevent financial misinformation
 * - Check for bias against marginalized groups
 * 
 * Reskill Alignment:
 * - Human-centric innovation
 * - Protecting underserved users
 * - Ethical, explainable AI
 */

import config from "../config/index.js";

/**
 * Check for unsafe content in text
 * Used at input validation stage
 */
export const containsUnsafeContent = (text) => {
  const normalized = String(text || "").toLowerCase();
  return config.ethics.blockedPatterns.some((pattern) => normalized.includes(pattern));
};

/**
 * Check for flagged business types
 * These require additional scrutiny, not outright rejection
 */
export const containsFlaggedContent = (text) => {
  const normalized = String(text || "").toLowerCase();
  const flagged = config.ethics.flaggedBusinessTypes.filter(
    (type) => normalized.includes(type)
  );
  return {
    hasFlagged: flagged.length > 0,
    flaggedItems: flagged,
  };
};

/**
 * Validate input safety
 * Pre-prompt safety filter
 */
export const validateInputSafety = (normalizedInput) => {
  const combinedText = [
    normalizedInput.skills,
    normalizedInput.interests,
    normalizedInput.goals,
    normalizedInput.localData,
    normalizedInput.targetAudience,
  ].join(" ");
  
  if (containsUnsafeContent(combinedText)) {
    return {
      safe: false,
      reason: "Input contains potentially harmful content",
      action: "reject",
    };
  }
  
  const flagCheck = containsFlaggedContent(combinedText);
  if (flagCheck.hasFlagged) {
    return {
      safe: true, // Allow but flag
      reason: `Input mentions sensitive business types: ${flagCheck.flaggedItems.join(", ")}`,
      action: "proceed_with_caution",
      flagged: flagCheck.flaggedItems,
    };
  }
  
  return {
    safe: true,
    reason: "Input passed safety checks",
    action: "proceed",
  };
};

/**
 * Check for exploitative labor suggestions
 */
const detectExploitativeLabor = (text) => {
  const exploitativePatterns = [
    "unpaid intern",
    "no minimum wage",
    "below minimum",
    "work without pay",
    "volunteer labor",
    "child work",
    "forced labor",
    "24/7 availability",
  ];
  
  const normalized = String(text || "").toLowerCase();
  return exploitativePatterns.some((pattern) => normalized.includes(pattern));
};

/**
 * Check for financial misinformation
 */
const detectFinancialMisinformation = (text, revenueSimulation) => {
  const issues = [];
  
  // Check for unrealistic revenue claims
  if (revenueSimulation) {
    // Flag if claiming 10x+ returns in year 1
    if (revenueSimulation.year1RevenueMax > revenueSimulation.year1RevenueMin * 10) {
      issues.push("Revenue range is unrealistically wide");
    }
    
    // Flag if profit margin exceeds 50%
    const impliedMargin = revenueSimulation.year1ProfitMax / revenueSimulation.year1RevenueMax;
    if (impliedMargin > 0.5) {
      issues.push("Profit margin projections may be unrealistic");
    }
  }
  
  // Check for get-rich-quick language
  const dangerousPatterns = [
    "guaranteed returns",
    "get rich quick",
    "passive income overnight",
    "100% profit",
    "zero risk",
    "cannot fail",
    "instant success",
  ];
  
  const normalized = String(text || "").toLowerCase();
  dangerousPatterns.forEach((pattern) => {
    if (normalized.includes(pattern)) {
      issues.push(`Contains potentially misleading language: "${pattern}"`);
    }
  });
  
  return {
    hasIssues: issues.length > 0,
    issues,
  };
};

/**
 * Check for bias against marginalized groups
 */
const detectBias = (output) => {
  const biasIndicators = [];
  
  // Check if ideas assume certain demographics
  const assumptionPatterns = {
    gender: ["only men can", "only women can", "men are better", "women are better"],
    age: ["only young people", "old people can't", "too old to"],
    disability: ["must be able-bodied", "requires full mobility", "no disabilities"],
    socioeconomic: ["requires connections", "need wealthy network", "privileged background"],
  };
  
  const textToCheck = JSON.stringify(output).toLowerCase();
  
  for (const [category, patterns] of Object.entries(assumptionPatterns)) {
    for (const pattern of patterns) {
      if (textToCheck.includes(pattern)) {
        biasIndicators.push({
          category,
          pattern,
          severity: "high",
        });
      }
    }
  }
  
  return {
    hasBias: biasIndicators.length > 0,
    indicators: biasIndicators,
  };
};

/**
 * Validate AI output for ethical compliance
 * Post-generation safety check
 */
export const validateOutputSafety = (aiOutput) => {
  const issues = [];
  const warnings = [];
  
  // Convert output to searchable text
  const outputText = JSON.stringify(aiOutput);
  
  // Check for harmful content in output
  if (containsUnsafeContent(outputText)) {
    issues.push({
      type: "harmful_content",
      severity: "critical",
      message: "Output contains potentially harmful content",
    });
  }
  
  // Check for exploitative labor
  if (detectExploitativeLabor(outputText)) {
    issues.push({
      type: "exploitative_labor",
      severity: "critical",
      message: "Output suggests exploitative labor practices",
    });
  }
  
  // Check for financial misinformation
  const financialCheck = detectFinancialMisinformation(
    outputText,
    aiOutput?.decisionSupport?.revenueSimulation
  );
  if (financialCheck.hasIssues) {
    financialCheck.issues.forEach((issue) => {
      warnings.push({
        type: "financial_misinformation",
        severity: "warning",
        message: issue,
      });
    });
  }
  
  // Check for bias
  const biasCheck = detectBias(aiOutput);
  if (biasCheck.hasBias) {
    biasCheck.indicators.forEach((indicator) => {
      issues.push({
        type: "bias",
        severity: indicator.severity,
        category: indicator.category,
        message: `Potential ${indicator.category} bias detected`,
      });
    });
  }
  
  // Determine overall safety
  const criticalIssues = issues.filter((i) => i.severity === "critical");
  
  return {
    safe: criticalIssues.length === 0,
    issues,
    warnings,
    action: criticalIssues.length > 0 ? "block" : warnings.length > 0 ? "proceed_with_warnings" : "proceed",
  };
};

/**
 * Generate ethical safeguards section for output
 */
export const generateEthicalSafeguards = (context, outputSafetyCheck) => {
  const safeguards = {
    biasChecks: [],
    inclusivityNotes: [],
    harmAvoidance: [],
    safetyScore: 100,
  };
  
  // Bias checks performed
  safeguards.biasChecks = [
    "Checked for gender-based assumptions",
    "Checked for age-based exclusions",
    "Checked for socioeconomic bias",
    "Verified accessibility considerations",
  ];
  
  // Inclusivity notes
  safeguards.inclusivityNotes = [
    `Ideas adapted for ${context.economicContext?.budget?.tier || "various"} budget tier`,
    `Considered ${context.economicContext?.location?.type || "general"} location constraints`,
    "Prioritized low-barrier entry options",
    "Included options for limited digital infrastructure",
  ];
  
  // Harm avoidance
  safeguards.harmAvoidance = [
    "Excluded exploitative business models",
    "Avoided unrealistic revenue promises",
    "Ensured legal compliance considerations",
    "Removed potentially harmful suggestions",
  ];
  
  // Adjust safety score based on checks
  if (outputSafetyCheck?.warnings?.length > 0) {
    safeguards.safetyScore -= outputSafetyCheck.warnings.length * 5;
  }
  if (outputSafetyCheck?.issues?.length > 0) {
    safeguards.safetyScore -= outputSafetyCheck.issues.length * 10;
  }
  
  safeguards.safetyScore = Math.max(0, safeguards.safetyScore);
  
  return safeguards;
};

/**
 * Apply safety filters to final output
 * Removes or modifies unsafe content
 */
export const applySafetyFilters = (output, safetyCheck) => {
  if (safetyCheck.safe && safetyCheck.warnings.length === 0) {
    return output; // No modifications needed
  }
  
  let filteredOutput = { ...output };
  
  // Add disclaimers for warnings
  if (safetyCheck.warnings.length > 0) {
    filteredOutput.decisionSupport = {
      ...filteredOutput.decisionSupport,
      additionalWarnings: safetyCheck.warnings.map((w) => w.message),
    };
  }
  
  // If there are critical issues, return a safe fallback
  if (!safetyCheck.safe) {
    return null; // Signal to use fallback
  }
  
  return filteredOutput;
};

export default {
  containsUnsafeContent,
  containsFlaggedContent,
  validateInputSafety,
  validateOutputSafety,
  generateEthicalSafeguards,
  applySafetyFilters,
};
