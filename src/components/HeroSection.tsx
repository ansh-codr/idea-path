import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Lightbulb, Shield, BookOpen } from "lucide-react";
import SplineScene from "./SplineScene";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToGenerator = () => {
    const generatorSection = document.getElementById("generator");
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    { icon: <Lightbulb className="w-4 h-4 text-primary" />, label: "Low-capital ideas" },
    { icon: <Shield className="w-4 h-4 text-primary" />, label: "Ethical & safe" },
    { icon: <BookOpen className="w-4 h-4 text-primary" />, label: "Hindi & English" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Spline 3D Background - hidden on mobile for performance */}
      <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full">
        <SplineScene />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="text-sm font-semibold tracking-widest text-accent uppercase">
                IDEAFORGE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground"
            >
              {t("hero.headline")}{" "}
              <span className="text-foreground">{t("hero.headline.highlight")}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-muted-foreground max-w-md mb-8"
            >
              {t("hero.subheadline")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Button
                variant="default"
                size="lg"
                onClick={scrollToGenerator}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
              >
                {t("hero.cta")}
              </Button>
              <Button variant="outline" size="lg" className="font-medium px-6">
                Login to save ideas
              </Button>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-badge"
                >
                  {feature.icon}
                  <span>{feature.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Trust indicator */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xs text-muted-foreground"
            >
              AI-generated suggestions. Please verify before execution.
            </motion.p>
          </motion.div>

          {/* Right Column - Feature Card (visible on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="glass-surface rounded-2xl p-6 max-w-md ml-auto">
              {/* Quote */}
              <div className="flex gap-3 mb-6 p-4 bg-secondary/50 rounded-xl">
                <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">
                    "I know tailoring and live in a small town."
                  </p>
                  <p className="text-sm text-muted-foreground">
                    IdeaForge suggests 3-5 ideas with steps and local twists.
                  </p>
                </div>
              </div>

              {/* Feature list */}
              <ul className="space-y-3">
                {[
                  "Simple form with skills, location, budget",
                  "Hindi/English toggle for comfort",
                  "Save and revisit when logged in",
                  "Lightweight business plan on demand",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
