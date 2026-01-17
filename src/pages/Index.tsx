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
import ResultsVisualization from "@/components/ResultsVisualization";
import FinalCTA from "@/components/FinalCTA";
import ChatbotSidebar from "@/components/ChatbotSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { Shield, DollarSign, TrendingUp, Zap } from "lucide-react";

// API Base URL - Call Render directly to avoid Netlify's 26s proxy timeout
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://idea-path.onrender.com/api";

// Icon mapping for feasibility scores
const iconMap: Record<string, React.ReactNode> = {
  market: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />,
  execution: <Zap className="w-4 h-4" strokeWidth={1.5} />,
  capital: <DollarSign className="w-4 h-4" strokeWidth={1.5} />,
  risk: <Shield className="w-4 h-4" strokeWidth={1.5} />,
};

// Full API response type for visualization data
interface FullAPIResponse {
  results: AIResults;
  decisionSupport?: {
    pros?: string[];
    cons?: string[];
    revenueSimulation?: {
      year1RevenueMin: number;
      year1RevenueMax: number;
      year1ProfitMin: number;
      year1ProfitMax: number;
      currency?: string;
    };
    budgetSuitability?: string;
    easeOfExecution?: string;
  };
}

const Index = () => {
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AIResults | null>(null);
  const [fullResponse, setFullResponse] = useState<FullAPIResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Helper function to fetch with timeout and retry
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 2): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 second timeout
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Retry on timeout or network errors
      if (retries > 0 && (error.name === 'AbortError' || error.message?.includes('504'))) {
        console.log(`Retrying... (${retries} attempts left)`);
        toast({
          title: "Still generating...",
          description: "AI is working on your personalized guidance. Please wait.",
        });
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    setResults(null);

    try {
      // Show initial toast for potentially slow response
      toast({
        title: "Generating your business ideas...",
        description: "This may take 30-60 seconds. Our AI is crafting personalized guidance.",
      });

      // Call the REAL IdeaForge API with retry logic
      const response = await fetchWithRetry(`${API_BASE_URL}/generate`, {
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
      
      // Store full response for visualization
      setFullResponse({
        results: transformedResults,
        decisionSupport: data.decisionSupport,
      });

      toast({
        title: "Ideas Generated!",
        description: "Your personalized business guidance is ready.",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      
      // Provide user-friendly error messages
      let errorTitle = "Generation failed";
      let errorDesc = "Please try again in a moment.";
      
      if (error.name === 'AbortError' || error.message?.includes('504') || error.message?.includes('timeout')) {
        errorTitle = "Request timed out";
        errorDesc = "The AI is taking longer than expected. Please try again - the server may have been waking up.";
      } else if (error.message?.includes('500')) {
        errorTitle = "Server error";
        errorDesc = "Something went wrong on our end. Please try again.";
      } else if (error.message) {
        errorDesc = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorDesc,
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
    setFullResponse(null);
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

      {/* Header with logo and language switcher */}
      <Header />
      
      {/* Chatbot */}
      <ChatbotSidebar />

      <HeroSection />
      <GeneratorSection onGenerate={handleGenerate} isGenerating={isGenerating} />
      <ResultsSection results={results} />
      
      {/* Visualization Section */}
      {fullResponse && (
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-6 max-w-5xl">
            <ResultsVisualization
              feasibilityScores={fullResponse.results.feasibilityScores.map(score => ({
                label: score.label,
                value: score.value,
                description: score.description,
              }))}
              roadmap={fullResponse.results.roadmap}
              revenueSimulation={fullResponse.decisionSupport?.revenueSimulation}
              budgetSuitability={fullResponse.decisionSupport?.budgetSuitability}
            />
          </div>
        </section>
      )}
      
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
