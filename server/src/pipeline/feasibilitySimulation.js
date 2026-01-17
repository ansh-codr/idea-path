/**
 * IdeaForge Feasibility & Simulation Logic
 * =========================================
 * Step 5 of the backend data flow.
 * 
 * Responsibility:
 * - Calculate feasibility scores
 * - Run simple revenue simulations
 * - Provide interpretable metrics
 * 
 * Reskill Alignment:
 * - Use ranges, not exact figures
 * - Label all outputs as estimates
 * - Prefer interpretability over accuracy
 * - Avoid misleading users
 */

/**
 * Clamp a score to valid range (0-100)
 */
export const clampScore = (value) => {
  return Math.min(100, Math.max(0, Math.round(Number(value) || 0)));
};

/**
 * Calculate confidence level based on data quality
 */
export const calculateConfidence = (context) => {
  let confidenceScore = 50; // Base score
  
  // Increase confidence with more data
  if (context.economicContext?.additionalLocalData) confidenceScore += 10;
  if (context.userProfile?.skillCategories?.length > 1) confidenceScore += 10;
  if (!context.metadata?.hasAssumedValues) confidenceScore += 15;
  if (context.audienceInsights?.characteristics?.length > 0) confidenceScore += 10;
  
  // Decrease for assumptions
  if (context.metadata?.assumptions?.includes("budget")) confidenceScore -= 10;
  if (context.metadata?.assumptions?.includes("location")) confidenceScore -= 10;
  
  if (confidenceScore >= 70) return "high";
  if (confidenceScore >= 45) return "medium";
  return "low";
};

/**
 * Adjust feasibility scores based on context
 * Ensures scores align with user's actual situation
 */
export const adjustFeasibilityScores = (scores, context) => {
  const adjustedScores = scores.map((score) => {
    let adjustedValue = score.value;
    
    // Market score adjustments
    if (score.iconKey === "market") {
      if (context.economicContext?.location?.marketAccess === "low") {
        adjustedValue = Math.min(adjustedValue, 70); // Cap for low access
      }
      if (context.economicContext?.location?.competitionLevel === "high") {
        adjustedValue -= 10; // Penalty for high competition
      }
    }
    
    // Execution score adjustments
    if (score.iconKey === "execution") {
      if (context.userProfile?.skillCategories?.length > 2) {
        adjustedValue += 5; // Bonus for diverse skills
      }
      if (context.economicContext?.location?.digitalInfra === "limited") {
        adjustedValue -= 10; // Penalty for limited infrastructure
      }
    }
    
    // Capital score adjustments
    if (score.iconKey === "capital") {
      const budgetTier = context.economicContext?.budget?.tier;
      if (budgetTier === "micro") {
        // Micro budget should have high capital efficiency to be viable
        adjustedValue = Math.max(adjustedValue, 75);
      }
    }
    
    // Risk score adjustments
    if (score.iconKey === "risk") {
      if (context.metadata?.hasAssumedValues) {
        adjustedValue -= 10; // Higher risk when we assumed values
      }
    }
    
    return {
      ...score,
      value: clampScore(adjustedValue),
      confidence: calculateConfidence(context),
    };
  });
  
  return adjustedScores;
};

/**
 * Validate score order (market, execution, capital, risk)
 */
export const enforceScoreOrder = (scores) => {
  const expectedOrder = ["market", "execution", "capital", "risk"];
  return scores.every((score, index) => score.iconKey === expectedOrder[index]);
};

/**
 * Validate roadmap phases
 */
export const enforceRoadmapPhases = (roadmap) => {
  return roadmap.every((step, index) => step.phase === `Phase ${index + 1}`);
};

/**
 * Calculate simple revenue simulation
 * CRITICAL: Uses ranges, always labeled as estimates
 */
export const calculateRevenueSimulation = (context, aiEstimates) => {
  const budgetRange = context.economicContext?.budget?.range || { min: 1000, max: 5000 };
  const budgetTier = context.economicContext?.budget?.tier || "small";
  
  // Base multipliers by budget tier (conservative estimates)
  const revenueMultipliers = {
    micro: { min: 0.3, max: 1.5 },     // 30%-150% of budget in Y1
    small: { min: 0.5, max: 2.0 },     // 50%-200% of budget in Y1
    moderate: { min: 0.4, max: 1.8 },  // 40%-180% of budget in Y1
    growth: { min: 0.3, max: 1.5 },    // 30%-150% of budget in Y1
    scale: { min: 0.25, max: 1.2 },    // 25%-120% of budget in Y1
  };
  
  const multiplier = revenueMultipliers[budgetTier] || revenueMultipliers.small;
  
  // Use AI estimates if available and reasonable, otherwise calculate
  let year1RevenueMin, year1RevenueMax;
  
  if (aiEstimates?.revenueSimulation) {
    year1RevenueMin = aiEstimates.revenueSimulation.year1RevenueMin;
    year1RevenueMax = aiEstimates.revenueSimulation.year1RevenueMax;
    
    // Sanity check: cap at 5x budget for first year (realistic for underserved users)
    const maxReasonable = budgetRange.max * 5;
    year1RevenueMin = Math.min(year1RevenueMin, maxReasonable);
    year1RevenueMax = Math.min(year1RevenueMax, maxReasonable);
  } else {
    year1RevenueMin = Math.round(budgetRange.max * multiplier.min);
    year1RevenueMax = Math.round(budgetRange.max * multiplier.max);
  }
  
  // Profit margins (conservative: 10-30% for small businesses)
  const profitMarginMin = 0.10;
  const profitMarginMax = 0.30;
  
  const year1ProfitMin = Math.round(year1RevenueMin * profitMarginMin);
  const year1ProfitMax = Math.round(year1RevenueMax * profitMarginMax);
  
  return {
    year1RevenueMin,
    year1RevenueMax,
    year1ProfitMin,
    year1ProfitMax,
    currency: "USD",
    notes: `Estimates based on ${budgetTier} budget tier and ${context.economicContext?.location?.type || "general"} location context. Actual results depend on execution, market conditions, and individual circumstances.`,
    disclaimer: "These are rough estimates based on limited data. Actual results may vary significantly. Do not make financial decisions based solely on these projections.",
  };
};

/**
 * Determine budget suitability
 */
export const assessBudgetSuitability = (context, ideaRequirements) => {
  const budgetTier = context.economicContext?.budget?.tier || "small";
  const canAfford = context.resourceConstraints?.canAfford || [];
  const shouldAvoid = context.resourceConstraints?.shouldAvoid || [];
  
  // If the idea requires things the user should avoid, it's challenging
  const requiresAvoidedItems = (ideaRequirements || []).some(
    (req) => shouldAvoid.some((avoid) => req.toLowerCase().includes(avoid.toLowerCase()))
  );
  
  if (requiresAvoidedItems) return "challenging";
  
  // Budget tier assessment
  if (budgetTier === "micro") {
    return "moderate"; // Micro budget is always at least moderate difficulty
  }
  if (budgetTier === "small") {
    return "good";
  }
  return "excellent";
};

/**
 * Determine ease of execution
 */
export const assessEaseOfExecution = (context, feasibilityScores) => {
  const executionScore = feasibilityScores.find((s) => s.iconKey === "execution")?.value || 50;
  const skillMatch = context.userProfile?.skillCategories?.length > 0;
  const digitalInfra = context.economicContext?.location?.digitalInfra || "moderate";
  
  let easeScore = executionScore;
  
  if (skillMatch) easeScore += 10;
  if (digitalInfra === "limited") easeScore -= 15;
  if (digitalInfra === "strong") easeScore += 10;
  
  if (easeScore >= 75) return "easy";
  if (easeScore >= 55) return "moderate";
  if (easeScore >= 35) return "challenging";
  return "difficult";
};

/**
 * Process and enhance AI output with simulation logic
 */
export const processSimulations = (aiOutput, context) => {
  // Ensure we have the required structure
  if (!aiOutput?.results || !aiOutput?.decisionSupport) {
    throw new Error("Invalid AI output structure for simulation processing");
  }
  
  // Adjust feasibility scores based on context
  const adjustedScores = adjustFeasibilityScores(
    aiOutput.results.feasibilityScores,
    context
  );
  
  // Calculate revenue simulation with reality checks
  const revenueSimulation = calculateRevenueSimulation(
    context,
    aiOutput.decisionSupport
  );
  
  // Assess budget suitability
  const budgetSuitability = assessBudgetSuitability(
    context,
    aiOutput.decisionSupport?.requirements || []
  );
  
  // Assess ease of execution
  const easeOfExecution = assessEaseOfExecution(context, adjustedScores);
  
  // Return enhanced output
  return {
    ...aiOutput,
    results: {
      ...aiOutput.results,
      feasibilityScores: adjustedScores,
    },
    decisionSupport: {
      ...aiOutput.decisionSupport,
      revenueSimulation,
      budgetSuitability,
      easeOfExecution,
    },
    simulationMetadata: {
      processedAt: new Date().toISOString(),
      confidence: calculateConfidence(context),
      adjustmentsApplied: true,
    },
  };
};

export default {
  clampScore,
  calculateConfidence,
  adjustFeasibilityScores,
  enforceScoreOrder,
  enforceRoadmapPhases,
  calculateRevenueSimulation,
  assessBudgetSuitability,
  assessEaseOfExecution,
  processSimulations,
};
