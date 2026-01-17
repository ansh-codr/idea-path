import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import SplineScene from "./SplineScene";
const HeroSection = () => {
  const scrollToGenerator = () => {
    const generatorSection = document.getElementById("generator");
    if (generatorSection) {
      generatorSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Spline 3D Animation - Full width at top with Start Button overlay */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <div className="hidden md:block w-full h-full">
          <SplineScene />
        </div>
        {/* Mobile fallback gradient */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-sage/20 via-background to-background" />
        
        {/* Start Building Button - Overlay on Spline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <Button variant="intelligence" size="xl" onClick={scrollToGenerator} className="group shadow-xl">
            Start Building
            <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
          </Button>
        </motion.div>
      </div>
      
      {/* Hero Content - Below Spline */}
      <div className="relative z-10 container mx-auto px-6 text-center py-16 md:py-24 bg-background">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay/50 border border-border backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-sage" />
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, duration: 0.6 }} 
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-forest"
          >
            Turn your skills into a{" "}
            <span className="text-sage italic">real business path</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.6 }} 
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Guided by AI. Built for first-time founders. Transform your unique
            background into actionable startup ideas with confidence.
          </motion.p>

          {/* Trust indicator */}
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8, duration: 0.6 }} 
            className="text-sm text-muted-foreground/70"
          >
            No credit card required • Free to explore • Private & secure
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.2, duration: 0.6 }} 
          className="mt-12 flex justify-center"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
            className="w-6 h-10 rounded-full border-2 border-stone flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default HeroSection;