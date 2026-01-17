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
    { icon: <Lightbulb className="w-4 h-4 text-sage" strokeWidth={1.5} />, label: "Low-capital ideas" },
    { icon: <Shield className="w-4 h-4 text-sage" strokeWidth={1.5} />, label: "Ethical & safe" },
    { icon: <BookOpen className="w-4 h-4 text-sage" strokeWidth={1.5} />, label: "Hindi & English" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Spline 3D Background - Full width on desktop */}
      <div className="absolute inset-0">
        <SplineScene />
      </div>
      
      {/* Hero Content - Overlaid on Spline */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex justify-end">
          {/* Feature Card - Right side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="glass-surface rounded-3xl p-8 backdrop-blur-sm bg-card/95">
              {/* Quote */}
              <div className="flex gap-3 mb-8 p-5 bg-secondary/60 rounded-2xl">
                <Sparkles className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="font-serif text-lg text-foreground mb-2">
                    "I know tailoring and live in a small town."
                  </p>
                  <p className="text-sm text-muted-foreground">
                    IdeaForge suggests 3-5 ideas with steps and local twists.
                  </p>
                </div>
              </div>

              {/* Feature list */}
              <ul className="space-y-4 mb-8">
                {[
                  "Simple form with skills, location, budget",
                  "Hindi/English toggle for comfort",
                  "Lightweight business plan on demand",
                  "No login required to get started",
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="w-2 h-2 rounded-full bg-sage mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={scrollToGenerator}
                className="w-full bg-forest hover:bg-forest/90 text-white rounded-full uppercase tracking-widest text-sm font-medium py-6 transition-all duration-300"
              >
                {t("hero.cta")}
                <ArrowDown className="w-4 h-4 ml-2" strokeWidth={1.5} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-sage/40 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-sage/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
