import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, Language, languageNames } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["en", "hi"];

  return (
    <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
      {languages.map((lang) => (
        <Button
          key={lang}
          variant={language === lang ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage(lang)}
          className={`rounded-full px-4 h-8 text-sm font-medium ${
            language === lang
              ? "bg-primary text-primary-foreground shadow-sm"
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
