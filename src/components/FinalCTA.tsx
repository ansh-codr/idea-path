import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, RefreshCw, Download, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface FinalCTAProps {
  hasResults: boolean;
  onRestart: () => void;
}

const FinalCTA = ({ hasResults, onRestart }: FinalCTAProps) => {
  const { t } = useLanguage();

  if (!hasResults) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "IdeaForge - My Business Idea",
        text: "Check out this business idea I generated with IdeaForge!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this page with others.",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const features = [
    t("cta.features.ai"),
    t("cta.features.roadmaps"),
    t("cta.features.scoring"),
    t("cta.features.insights"),
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 border border-sage/20 mb-6">
            <Check className="w-4 h-4 text-sage" strokeWidth={1.5} />
            <span className="text-sm text-sage font-medium">{t("cta.complete")}</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-semibold mb-4 text-foreground">
            {t("cta.title")}
          </h2>
          
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
            {t("cta.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handlePrint}
              className="bg-forest hover:bg-forest/90 text-white rounded-full uppercase tracking-widest text-sm font-medium px-8 py-6 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
              {t("cta.save")}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="rounded-full border-sage text-sage hover:bg-sage/10 uppercase tracking-widest text-sm font-medium px-8 py-6 transition-all duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
              {t("cta.share")}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onRestart}
              className="rounded-full text-muted-foreground hover:text-foreground uppercase tracking-widest text-sm font-medium px-8 py-6 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" strokeWidth={1.5} />
              {t("cta.restart")}
            </Button>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wide">
              {t("cta.features.title")}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sage" />
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
