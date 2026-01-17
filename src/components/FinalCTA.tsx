import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FinalCTAProps {
  hasResults: boolean;
  onRestart: () => void;
}

const FinalCTA = ({ hasResults, onRestart }: FinalCTAProps) => {
  const { t } = useLanguage();

  if (!hasResults) return null;

  const features = [
    t("cta.features.ai"),
    t("cta.features.roadmaps"),
    t("cta.features.scoring"),
    t("cta.features.insights"),
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm text-success">{t("cta.complete")}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            {t("cta.title")}
          </h2>
          
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            {t("cta.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="intelligence" size="lg" className="group">
              {t("cta.save")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button variant="outline" size="lg" onClick={onRestart}>
              <RefreshCw className="w-4 h-4" />
              {t("cta.restart")}
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              {t("cta.features.title")}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
