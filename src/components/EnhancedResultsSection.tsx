/**
 * IdeaForge Enhanced Results Section
 * ===================================
 * Displays comprehensive AI-generated business guidance including:
 * - Primary idea with feasibility scores
 * - Alternative ideas
 * - Decision support (pros/cons)
 * - Revenue simulation (ranges, not exact)
 * - Ethical safeguards
 * - Local adaptation notes
 */

import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Zap,
  Lightbulb,
  DollarSign,
  Shield,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Users,
  ChevronDown,
  Info,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GenerateResponse,
  FeasibilityScore,
  formatRevenueRange,
  getConfidenceLabel,
  getBudgetSuitabilityLabel,
  getExecutionLabel,
  ideaForgeAPI,
} from "@/services/ideaForgeAPI";

interface EnhancedResultsSectionProps {
  data: GenerateResponse | null;
  onFeedback?: (rating: "up" | "down", notes?: string) => void;
}

// Feasibility Meter Component
const FeasibilityMeter = ({
  score,
  delay = 0,
}: {
  score: FeasibilityScore;
  delay?: number;
}) => {
  const iconMap = {
    market: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />,
    execution: <Zap className="w-4 h-4" strokeWidth={1.5} />,
    capital: <DollarSign className="w-4 h-4" strokeWidth={1.5} />,
    risk: <Shield className="w-4 h-4" strokeWidth={1.5} />,
  } as const;

  const getColorClass = (value: number) => {
    if (value >= 75) return "from-sage to-sage/70";
    if (value >= 50) return "from-terracotta to-terracotta/70";
    return "from-muted-foreground to-muted-foreground/70";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sage">{iconMap[score.iconKey]}</span>
          <span className="text-sm font-medium text-foreground">
            {score.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {score.value}%
          </span>
          {score.confidence && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getConfidenceLabel(score.confidence)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <div className="trust-meter h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score.value}%` }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getColorClass(score.value)} rounded-full`}
        />
      </div>
      <p className="text-xs text-muted-foreground">{score.description}</p>
    </motion.div>
  );
};

// Pros/Cons List Component
const ProConList = ({
  items,
  type,
}: {
  items: string[];
  type: "pro" | "con";
}) => {
  const Icon = type === "pro" ? CheckCircle2 : XCircle;
  const colorClass = type === "pro" ? "text-sage" : "text-terracotta";

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="flex items-start gap-2"
        >
          <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
          <span className="text-sm text-foreground/80">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
};

// Alternative Ideas Card
const AlternativeIdeaCard = ({
  idea,
  index,
}: {
  idea: GenerateResponse["ideas"][0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      className="bg-secondary/40 rounded-2xl p-5 border border-border/30 hover:shadow-medium transition-all duration-300"
    >
      <h4 className="font-serif font-semibold text-foreground mb-2">
        {idea.title}
      </h4>
      <p className="text-sm text-foreground/80 mb-3">{idea.description}</p>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 text-sage mt-0.5" />
          <p className="text-xs text-muted-foreground">{idea.whyItFits}</p>
        </div>
        {idea.localAdaptation && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-terracotta mt-0.5" />
            <p className="text-xs text-muted-foreground">{idea.localAdaptation}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Main Enhanced Results Section
export const EnhancedResultsSection = ({
  data,
  onFeedback,
}: EnhancedResultsSectionProps) => {
  const { t } = useLanguage();
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);

  if (!data) return null;

  const { results, ideas, decisionSupport, ethicalSafeguards, localAdaptation, metadata } =
    data;

  const handleFeedback = async (rating: "up" | "down") => {
    setFeedbackGiven(rating);
    if (onFeedback) {
      onFeedback(rating);
    }
    // Submit to API
    if (data.sessionId) {
      try {
        await ideaForgeAPI.submitFeedback({
          sessionId: data.sessionId,
          rating,
          resultId: data.resultId,
        });
      } catch (error) {
        console.error("Failed to submit feedback:", error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="results" className="py-24 md:py-32 relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold mb-4 text-foreground">
            {t("results.title")}{" "}
            <span className="italic">{t("results.title.highlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t("results.subtitle")}
          </p>
          {metadata && (
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>Confidence: {getConfidenceLabel(metadata.confidence)}</span>
              <span>•</span>
              <span>Generated in {(metadata.processingTimeMs / 1000).toFixed(1)}s</span>
            </div>
          )}
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Main Idea Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 glass-surface rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-sage" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("results.idea.label")}
                </p>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {results.businessIdea.title}
                </h3>
              </div>
            </div>

            <p className="text-foreground/90 mb-6 leading-relaxed text-lg">
              {results.businessIdea.description}
            </p>

            <div className="bg-secondary/50 rounded-2xl p-5 border border-border/50 mb-6">
              <p className="text-sm text-muted-foreground mb-1">
                {t("results.idea.whyFits")}
              </p>
              <p className="text-foreground/80">{results.businessIdea.whyItFits}</p>
            </div>

            {/* Budget & Execution Summary */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-sage/10 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Budget Fit</p>
                <p className="font-medium text-foreground">
                  {getBudgetSuitabilityLabel(decisionSupport.budgetSuitability)}
                </p>
              </div>
              <div className="bg-terracotta/10 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Execution</p>
                <p className="font-medium text-foreground">
                  {getExecutionLabel(decisionSupport.easeOfExecution)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feasibility Scores Card */}
          <motion.div variants={itemVariants} className="glass-surface rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-sage" strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-foreground">
                {t("results.feasibility.title")}
              </h3>
            </div>

            <div className="space-y-6">
              {results.feasibilityScores.map((score, index) => (
                <FeasibilityMeter
                  key={score.label}
                  score={score}
                  delay={index * 0.1}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border/50">
              {t("results.feasibility.disclaimer")}
            </p>
          </motion.div>
        </div>

        {/* Roadmap Section */}
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto mt-8">
          <div className="glass-surface rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-sage" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {t("results.roadmap.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("results.roadmap.subtitle")}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.roadmap.map((step, index) => (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className={`relative bg-secondary/40 rounded-2xl p-5 border border-border/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-medium ${
                    index % 2 === 1 ? "md:translate-y-4" : ""
                  }`}
                >
                  <div className="text-xs font-medium text-sage mb-2 uppercase tracking-wide">
                    {step.phase} • {step.timeframe}
                  </div>
                  <h4 className="font-serif font-medium text-foreground mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Decision Support Section */}
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto mt-8">
          <Accordion type="single" collapsible className="w-full">
            {/* Pros & Cons */}
            <AccordionItem value="pros-cons" className="glass-surface rounded-3xl mb-4 border-none">
              <AccordionTrigger className="px-8 py-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-sage" strokeWidth={1.5} />
                  </div>
                  <span className="font-serif text-lg font-semibold text-foreground">
                    Pros & Cons Analysis
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-sage mb-4">Advantages</h4>
                    <ProConList items={decisionSupport.pros} type="pro" />
                  </div>
                  <div>
                    <h4 className="font-medium text-terracotta mb-4">Considerations</h4>
                    <ProConList items={decisionSupport.cons} type="con" />
                  </div>
                </div>
                <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    <strong>Why these recommendations:</strong>{" "}
                    {decisionSupport.explainability}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Revenue Projection */}
            <AccordionItem value="revenue" className="glass-surface rounded-3xl mb-4 border-none">
              <AccordionTrigger className="px-8 py-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
                  </div>
                  <span className="font-serif text-lg font-semibold text-foreground">
                    Revenue Projection (Estimates)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-secondary/50 rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">
                      Year 1 Revenue Range
                    </p>
                    <p className="text-2xl font-serif font-semibold text-foreground">
                      {formatRevenueRange(decisionSupport.revenueSimulation)}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">
                      Year 1 Profit Range
                    </p>
                    <p className="text-2xl font-serif font-semibold text-sage">
                      {formatRevenueRange({
                        ...decisionSupport.revenueSimulation,
                        year1RevenueMin: decisionSupport.revenueSimulation.year1ProfitMin,
                        year1RevenueMax: decisionSupport.revenueSimulation.year1ProfitMax,
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 mb-4">
                  {decisionSupport.revenueSimulation.notes}
                </p>
                <div className="flex items-start gap-2 p-4 bg-terracotta/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    {decisionSupport.revenueSimulation.disclaimer}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Risks & Mitigations */}
            <AccordionItem value="risks" className="glass-surface rounded-3xl mb-4 border-none">
              <AccordionTrigger className="px-8 py-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <span className="font-serif text-lg font-semibold text-foreground">
                    Risks & Mitigations
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-8">
                <div className="space-y-4">
                  {decisionSupport.risks.map((risk, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-xl"
                    >
                      <div>
                        <p className="text-xs text-amber-600 font-medium mb-1">Risk</p>
                        <p className="text-sm text-foreground">{risk}</p>
                      </div>
                      <div>
                        <p className="text-xs text-sage font-medium mb-1">Mitigation</p>
                        <p className="text-sm text-foreground">
                          {decisionSupport.mitigations[index] || "Plan accordingly"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    Key Assumptions
                  </p>
                  <ul className="space-y-1">
                    {decisionSupport.assumptions.map((assumption, index) => (
                      <li key={index} className="text-sm text-foreground/70 flex items-start gap-2">
                        <span className="text-sage">•</span>
                        {assumption}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Local Adaptation */}
            <AccordionItem value="local" className="glass-surface rounded-3xl mb-4 border-none">
              <AccordionTrigger className="px-8 py-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                  </div>
                  <span className="font-serif text-lg font-semibold text-foreground">
                    Local Adaptation Notes
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-8">
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-blue-500 font-medium mb-1">Region Focus</p>
                    <p className="text-sm text-foreground">{localAdaptation.regionFocus}</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-sage font-medium mb-1">Local Economy Connection</p>
                    <p className="text-sm text-foreground">{localAdaptation.localEconomyTie}</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-terracotta font-medium mb-1">Accessibility</p>
                    <p className="text-sm text-foreground">
                      {localAdaptation.accessibilityNotes}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Alternative Ideas */}
        {ideas && ideas.length > 1 && (
          <motion.div variants={itemVariants} className="max-w-5xl mx-auto mt-8">
            <div className="glass-surface rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-purple-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Alternative Ideas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Other directions worth considering
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.slice(1).map((idea, index) => (
                  <AlternativeIdeaCard key={index} idea={idea} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Pitch Summary */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto mt-8">
          <div className="glass-surface rounded-3xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-foreground">
                {t("results.pitch.title")}
              </h3>
            </div>
            <p className="text-xl text-foreground/90 font-serif italic leading-relaxed">
              "{results.pitchSummary}"
            </p>
          </div>
        </motion.div>

        {/* Feedback Section */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Was this helpful for your planning?
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={feedbackGiven === "up" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFeedback("up")}
              disabled={feedbackGiven !== null}
              className="rounded-full"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Yes, helpful
            </Button>
            <Button
              variant={feedbackGiven === "down" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFeedback("down")}
              disabled={feedbackGiven !== null}
              className="rounded-full"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Needs improvement
            </Button>
          </div>
          {feedbackGiven && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-sage mt-4"
            >
              Thank you for your feedback!
            </motion.p>
          )}
        </motion.div>

        {/* Ethical Safeguards Badge */}
        <motion.div
          variants={itemVariants}
          className="max-w-2xl mx-auto mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 rounded-full">
            <Shield className="w-4 h-4 text-sage" />
            <span className="text-xs text-sage font-medium">
              Ethically Generated • Bias-Checked • Inclusive by Design
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EnhancedResultsSection;
