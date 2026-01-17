/**
 * IdeaForge Index Page
 * ====================
 * Main page using REAL AI generation from backend.
 * NO MOCK DATA - connects to actual IdeaForge API.
 */

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import GeneratorSection from "@/components/GeneratorSection";
import { ResultsSection, AIResults } from "@/components/ResultsSection";
import FinalCTA from "@/components/FinalCTA";
import ChatbotSidebar from "@/components/ChatbotSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { Shield, DollarSign, TrendingUp, Zap } from "lucide-react";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Icon mapping for feasibility scores
const iconMap: Record<string, React.ReactNode> = {
  market: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />,
  execution: <Zap className="w-4 h-4" strokeWidth={1.5} />,
  capital: <DollarSign className="w-4 h-4" strokeWidth={1.5} />,
  risk: <Shield className="w-4 h-4" strokeWidth={1.5} />,
};

const Index = () => {
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AIResults | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    setResults(null);

    try {
      // Call the REAL IdeaForge API
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          language,
          sessionId: sessionId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Store session ID for future interactions
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Transform API response to match ResultsSection format
      const transformedResults: AIResults = {
        businessIdea: data.results.businessIdea,
        feasibilityScores: data.results.feasibilityScores.map((score: any) => ({
          ...score,
          icon: iconMap[score.iconKey] || iconMap.market,
        })),
        roadmap: data.results.roadmap,
        pitchSummary: data.results.pitchSummary,
      };

      setResults(transformedResults);

      toast({
        title: "Ideas Generated!",
        description: "Your personalized business guidance is ready.",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }

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

      {/* Header with logo */}
      <Header />
      
      {/* Language Switcher - Fixed position */}
      <div className="fixed top-4 right-4 z-40">
        <LanguageSwitcher />
      </div>
      
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
