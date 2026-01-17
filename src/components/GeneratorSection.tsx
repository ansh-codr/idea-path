import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Wand2, Lightbulb, MapPin, Users, Wallet } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface GeneratorFormData {
  skills: string;
  interests: string;
  budget: string;
  locationType: string;
  targetAudience: string;
}

interface GeneratorSectionProps {
  onGenerate: (data: GeneratorFormData) => void;
  isGenerating: boolean;
}

const GeneratorSection = ({ onGenerate, isGenerating }: GeneratorSectionProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<GeneratorFormData>({
    skills: "",
    interests: "",
    budget: "",
    locationType: "",
    targetAudience: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const isFormValid =
    formData.skills &&
    formData.interests &&
    formData.budget &&
    formData.locationType &&
    formData.targetAudience;

  return (
    <section id="generator" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold mb-4 text-foreground">
            {t("generator.title")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t("generator.subtitle")}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-surface rounded-3xl p-8 sm:p-10 space-y-8">
            {/* Skills & Sector */}
            <div className="space-y-3">
              <Label htmlFor="skills" className="flex items-center gap-2 text-foreground font-medium">
                <Lightbulb className="w-4 h-4 text-sage" strokeWidth={1.5} />
                {t("generator.skills.label")}
              </Label>
              <Textarea
                id="skills"
                placeholder={t("generator.skills.placeholder")}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="min-h-[100px] rounded-2xl border-border bg-secondary/30 focus:border-sage focus:ring-sage/20 transition-all duration-300"
              />
              <p className="text-xs text-muted-foreground">
                {t("generator.skills.hint")}
              </p>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label htmlFor="interests" className="flex items-center gap-2 text-foreground font-medium">
                <Wand2 className="w-4 h-4 text-sage" strokeWidth={1.5} />
                {t("generator.interests.label")}
              </Label>
              <Input
                id="interests"
                placeholder={t("generator.interests.placeholder")}
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="rounded-full border-border bg-secondary/30 h-12 focus:border-sage focus:ring-sage/20 transition-all duration-300"
              />
            </div>

            {/* Budget & Location Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="budget" className="flex items-center gap-2 text-foreground font-medium">
                  <Wallet className="w-4 h-4 text-sage" strokeWidth={1.5} />
                  {t("generator.budget.label")}
                </Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                >
                  <SelectTrigger id="budget" className="rounded-full h-12 border-border bg-secondary/30">
                    <SelectValue placeholder={t("generator.budget.placeholder")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="under-1k">{t("generator.budget.under1k")}</SelectItem>
                    <SelectItem value="1k-5k">{t("generator.budget.1k5k")}</SelectItem>
                    <SelectItem value="5k-20k">{t("generator.budget.5k20k")}</SelectItem>
                    <SelectItem value="20k-50k">{t("generator.budget.20k50k")}</SelectItem>
                    <SelectItem value="over-50k">{t("generator.budget.over50k")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="location" className="flex items-center gap-2 text-foreground font-medium">
                  <MapPin className="w-4 h-4 text-sage" strokeWidth={1.5} />
                  {t("generator.location.label")}
                </Label>
                <Select
                  value={formData.locationType}
                  onValueChange={(value) => setFormData({ ...formData, locationType: value })}
                >
                  <SelectTrigger id="location" className="rounded-full h-12 border-border bg-secondary/30">
                    <SelectValue placeholder={t("generator.location.placeholder")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="urban">{t("generator.location.urban")}</SelectItem>
                    <SelectItem value="suburban">{t("generator.location.suburban")}</SelectItem>
                    <SelectItem value="semi-urban">{t("generator.location.semiurban")}</SelectItem>
                    <SelectItem value="rural">{t("generator.location.rural")}</SelectItem>
                    <SelectItem value="remote">{t("generator.location.remote")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-3">
              <Label htmlFor="audience" className="flex items-center gap-2 text-foreground font-medium">
                <Users className="w-4 h-4 text-sage" strokeWidth={1.5} />
                {t("generator.audience.label")}
              </Label>
              <Input
                id="audience"
                placeholder={t("generator.audience.placeholder")}
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="rounded-full border-border bg-secondary/30 h-12 focus:border-sage focus:ring-sage/20 transition-all duration-300"
              />
              <p className="text-xs text-muted-foreground">
                {t("generator.audience.hint")}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full uppercase tracking-widest text-sm font-medium h-14 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                disabled={!isFormValid || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>{t("generator.loading")}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" strokeWidth={1.5} />
                    <span>{t("generator.submit")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default GeneratorSection;
