import { Button } from "@/components/ui/button";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["en", "hi"];

  return (
    <div className="flex items-center gap-1 bg-secondary/60 rounded-full p-1 border border-border/50">
      {languages.map((lang) => (
        <Button
          key={lang}
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(lang)}
          className={`rounded-full px-4 h-8 text-sm font-medium transition-all duration-300 ${
            language === lang
              ? "bg-forest text-white shadow-soft"
              : "text-muted-foreground hover:text-foreground hover:bg-transparent"
          }`}
        >
          {lang === "en" ? "English" : "हिंदी"}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
