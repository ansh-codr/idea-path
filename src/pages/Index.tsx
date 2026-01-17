import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import GeneratorSection from "@/components/GeneratorSection";
import { ResultsSection, AIResults } from "@/components/ResultsSection";
import FinalCTA from "@/components/FinalCTA";
import ChatbotSidebar from "@/components/ChatbotSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, DollarSign, TrendingUp, Zap } from "lucide-react";

// Simulated AI response - in production this would come from backend
const generateMockResults = (formData: any): AIResults => {
  return {
    businessIdea: {
      title: "Community Skill-Share Platform",
      description:
        "A hyperlocal platform connecting skilled individuals with learners in your area. Members can teach cooking classes, offer tutoring, share crafting skills, or provide professional consulting—all within their community. Revenue comes from small transaction fees and premium features for power users.",
      whyItFits:
        "Your teaching ability combined with your interest in community building and local focus makes this a natural fit. The low startup cost aligns with your budget, and the model scales through network effects rather than capital.",
    },
    feasibilityScores: [
      {
        label: "Market Demand",
        value: 82,
        icon: <TrendingUp className="w-4 h-4" />,
        description: "High interest in local learning experiences post-pandemic",
      },
      {
        label: "Ease of Execution",
        value: 68,
        icon: <Zap className="w-4 h-4" />,
        description: "Moderate technical requirements, strong community-building needed",
      },
      {
        label: "Capital Efficiency",
        value: 91,
        icon: <DollarSign className="w-4 h-4" />,
        description: "Can launch MVP with minimal investment",
      },
      {
        label: "Risk Level",
        value: 74,
        icon: <Shield className="w-4 h-4" />,
        description: "Manageable risks with proper community vetting",
      },
    ],
    roadmap: [
      {
        phase: "Phase 1",
        title: "Validate & Research",
        description: "Survey 50 potential users in your area. Identify top 3 skills in demand.",
        timeframe: "Week 1-2",
      },
      {
        phase: "Phase 2",
        title: "MVP Launch",
        description: "Create simple booking system. Onboard 10 skill providers as founding members.",
        timeframe: "Week 3-6",
      },
      {
        phase: "Phase 3",
        title: "First Revenue",
        description: "Host 25+ sessions. Collect feedback. Introduce small platform fee.",
        timeframe: "Month 2-3",
      },
      {
        phase: "Phase 4",
        title: "Scale & Iterate",
        description: "Expand to adjacent neighborhoods. Add premium features based on user needs.",
        timeframe: "Month 4-6",
      },
    ],
    pitchSummary:
      "We help communities unlock hidden talent by connecting local experts with curious learners—making knowledge sharing accessible, affordable, and authentically local.",
  };
};

const Index = () => {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AIResults | null>(null);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    setResults(null);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const generatedResults = generateMockResults(formData);
    setResults(generatedResults);
    setIsGenerating(false);

    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById("results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleRestart = () => {
    setResults(null);
    const generatorSection = document.getElementById("generator");
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToGenerator = () => {
    const generatorSection = document.getElementById("generator");
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                IF
              </div>
              <div>
                <div className="font-display font-bold text-foreground">
                  IdeaForge
                </div>
                <div className="text-xs text-muted-foreground">
                  Skills → Business ideas
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Chatbot */}
      <ChatbotSidebar />

      <HeroSection />
      <GeneratorSection onGenerate={handleGenerate} isGenerating={isGenerating} />
      <ResultsSection results={results} />
      <FinalCTA hasResults={!!results} onRestart={handleRestart} />

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>{t("footer.tagline")}</p>
          <p className="mt-2 text-xs">
            {t("footer.disclaimer")}
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
