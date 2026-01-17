import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import SplineScene from "./SplineScene";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToGenerator = () => {
    const generatorSection = document.getElementById("generator");
    if (generatorSection) {
      generatorSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Spline 3D Animation - Full screen background */}
      <div className="absolute inset-0">
        <div className="hidden md:block w-full h-full">
          <SplineScene />
        </div>
        {/* Mobile fallback gradient */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-sage/20 via-background to-background" />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>
      
      {/* Hero Content - Centered over animation */}
      <div className="relative z-10 flex-1 flex items-center justify-center container mx-auto px-6 text-center py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2, duration: 0.5 }} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-sage" />
            <span className="text-sm text-white/90">{t("hero.badge")}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, duration: 0.6 }} 
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg"
          >
            {t("hero.headline")}{" "}
            <span className="text-sage italic">{t("hero.headline.highlight")}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.6 }} 
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 drop-shadow-md"
          >
            {t("hero.subheadline")}
          </motion.p>

          {/* Trust indicator */}
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8, duration: 0.6 }} 
            className="text-sm text-white/60"
          >
            {t("hero.trust")}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator - Bottom */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.2, duration: 0.6 }} 
        className="relative z-10 pb-8 flex justify-center"
      >
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
