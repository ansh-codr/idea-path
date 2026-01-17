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
    <section id="generator" className="py-24 relative">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            {t("generator.title")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
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
          <div className="glass-surface rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Skills & Sector */}
            <div className="space-y-3">
              <Label htmlFor="skills" className="flex items-center gap-2 text-foreground">
                <Lightbulb className="w-4 h-4 text-primary" />
                {t("generator.skills.label")}
              </Label>
              <Textarea
                id="skills"
                placeholder={t("generator.skills.placeholder")}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                {t("generator.skills.hint")}
              </p>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label htmlFor="interests" className="flex items-center gap-2 text-foreground">
                <Wand2 className="w-4 h-4 text-primary" />
                {t("generator.interests.label")}
              </Label>
              <Input
                id="interests"
                placeholder={t("generator.interests.placeholder")}
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              />
            </div>

            {/* Budget & Location Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Budget */}
              <div className="space-y-3">
                <Label htmlFor="budget" className="flex items-center gap-2 text-foreground">
                  <Wallet className="w-4 h-4 text-primary" />
                  {t("generator.budget.label")}
                </Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                >
                  <SelectTrigger id="budget">
                    <SelectValue placeholder={t("generator.budget.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1k">{t("generator.budget.under1k")}</SelectItem>
                    <SelectItem value="1k-5k">{t("generator.budget.1k5k")}</SelectItem>
                    <SelectItem value="5k-20k">{t("generator.budget.5k20k")}</SelectItem>
                    <SelectItem value="20k-50k">{t("generator.budget.20k50k")}</SelectItem>
                    <SelectItem value="over-50k">{t("generator.budget.over50k")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Type */}
              <div className="space-y-3">
                <Label htmlFor="location" className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t("generator.location.label")}
                </Label>
                <Select
                  value={formData.locationType}
                  onValueChange={(value) => setFormData({ ...formData, locationType: value })}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder={t("generator.location.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
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
              <Label htmlFor="audience" className="flex items-center gap-2 text-foreground">
                <Users className="w-4 h-4 text-primary" />
                {t("generator.audience.label")}
              </Label>
              <Input
                id="audience"
                placeholder={t("generator.audience.placeholder")}
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {t("generator.audience.hint")}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="intelligence"
                size="lg"
                className="w-full"
                disabled={!isFormValid || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("generator.loading")}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
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
