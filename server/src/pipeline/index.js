/**
 * IdeaForge Pipeline Index
 * ========================
 * Exports all pipeline components for easy importing.
 */

export * from "./validation.js";
export * from "./contextBuilder.js";
export * from "./aiOrchestration.js";
export * from "./feasibilitySimulation.js";
export * from "./ethicalSafeguards.js";
export * from "./responseFormatter.js";
export * from "./fallback.js";

// Default export with all modules
import * as validation from "./validation.js";
import * as contextBuilder from "./contextBuilder.js";
import * as aiOrchestration from "./aiOrchestration.js";
import * as feasibilitySimulation from "./feasibilitySimulation.js";
import * as ethicalSafeguards from "./ethicalSafeguards.js";
import * as responseFormatter from "./responseFormatter.js";
import * as fallback from "./fallback.js";

export default {
  validation,
  contextBuilder,
  aiOrchestration,
  feasibilitySimulation,
  ethicalSafeguards,
  responseFormatter,
  fallback,
};
