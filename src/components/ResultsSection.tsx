import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeasibilityScore {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

interface FeasibilityMeterProps {
  score: FeasibilityScore;
  delay?: number;
}

const FeasibilityMeter = ({ score, delay = 0 }: FeasibilityMeterProps) => {
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
          <span className="text-sage">{score.icon}</span>
          <span className="text-sm font-medium text-foreground">{score.label}</span>
        </div>
        <span className="text-sm font-semibold text-foreground">{score.value}%</span>
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

interface BusinessIdea {
  title: string;
  description: string;
  whyItFits: string;
}

interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  timeframe: string;
}

interface AIResults {
  businessIdea: BusinessIdea;
  feasibilityScores: FeasibilityScore[];
  roadmap: RoadmapStep[];
  pitchSummary: string;
}

interface ResultsSectionProps {
  results: AIResults | null;
}

const ResultsSection = ({ results }: ResultsSectionProps) => {
  const { t } = useLanguage();

  if (!results) return null;

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
            {t("results.title")} <span className="italic">{t("results.title.highlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t("results.subtitle")}
          </p>
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
                <p className="text-sm text-muted-foreground">{t("results.idea.label")}</p>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {results.businessIdea.title}
                </h3>
              </div>
            </div>
            
            <p className="text-foreground/90 mb-6 leading-relaxed text-lg">
              {results.businessIdea.description}
            </p>
            
            <div className="bg-secondary/50 rounded-2xl p-5 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">{t("results.idea.whyFits")}</p>
              <p className="text-foreground/80">
                {results.businessIdea.whyItFits}
              </p>
            </div>
          </motion.div>

          {/* Feasibility Scores Card */}
          <motion.div
            variants={itemVariants}
            className="glass-surface rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-sage" strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-foreground">
                {t("results.feasibility.title")}
              </h3>
            </div>
            
            <div className="space-y-6">
              {results.feasibilityScores.map((score, index) => (
                <FeasibilityMeter key={score.label} score={score} delay={index * 0.1} />
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
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5, ease: "easeOut" }}
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
      </motion.div>
    </section>
  );
};

export { ResultsSection, type AIResults };
