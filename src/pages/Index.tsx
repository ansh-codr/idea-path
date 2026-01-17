import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import GeneratorSection from "@/components/GeneratorSection";
import { ResultsSection, AIResults } from "@/components/ResultsSection";
import FinalCTA from "@/components/FinalCTA";
import ChatbotSidebar from "@/components/ChatbotSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, DollarSign, TrendingUp, Zap } from "lucide-react";

// Simulated AI response
const generateMockResults = (formData: any): AIResults => {
  return {
    businessIdea: {
      title: "Community Skill-Share Platform",
      description:
        "A hyperlocal platform connecting skilled individuals with learners in your area. Members can teach cooking classes, offer tutoring, share crafting skills, or provide professional consulting—all within their community.",
      whyItFits:
        "Your teaching ability combined with your interest in community building and local focus makes this a natural fit. The low startup cost aligns with your budget.",
    },
    feasibilityScores: [
      {
        label: "Market Demand",
        value: 82,
        icon: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />,
        description: "High interest in local learning experiences",
      },
      {
        label: "Ease of Execution",
        value: 68,
        icon: <Zap className="w-4 h-4" strokeWidth={1.5} />,
        description: "Moderate technical requirements",
      },
      {
        label: "Capital Efficiency",
        value: 91,
        icon: <DollarSign className="w-4 h-4" strokeWidth={1.5} />,
        description: "Can launch with minimal investment",
      },
      {
        label: "Risk Level",
        value: 74,
        icon: <Shield className="w-4 h-4" strokeWidth={1.5} />,
        description: "Manageable risks with proper planning",
      },
    ],
    roadmap: [
      {
        phase: "Phase 1",
        title: "Validate & Research",
        description: "Survey 50 potential users. Identify top skills in demand.",
        timeframe: "Week 1-2",
      },
      {
        phase: "Phase 2",
        title: "MVP Launch",
        description: "Create simple booking system. Onboard 10 skill providers.",
        timeframe: "Week 3-6",
      },
      {
        phase: "Phase 3",
        title: "First Revenue",
        description: "Host 25+ sessions. Collect feedback. Introduce platform fee.",
        timeframe: "Month 2-3",
      },
      {
        phase: "Phase 4",
        title: "Scale & Iterate",
        description: "Expand to adjacent areas. Add premium features.",
        timeframe: "Month 4-6",
      },
    ],
    pitchSummary:
      "We help communities unlock hidden talent by connecting local experts with curious learners—making knowledge sharing accessible and authentically local.",
  };
};

const Index = () => {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AIResults | null>(null);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    setResults(null);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const generatedResults = generateMockResults(formData);
    setResults(generatedResults);
    setIsGenerating(false);

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

  return (
    <main className="min-h-screen bg-background relative">
      {/* Paper grain texture overlay - CRITICAL for botanical feel */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-white font-serif text-sm font-semibold">
                IF
              </div>
              <div>
                <div className="font-serif text-xl text-foreground">
                  IdeaForge
                </div>
                <div className="text-xs text-muted-foreground tracking-wide">
                  Skills → Business ideas
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
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
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-lg text-foreground mb-2">{t("footer.tagline")}</p>
          <p className="text-sm text-muted-foreground">
            {t("footer.disclaimer")}
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
