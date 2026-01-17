import { Globe, ChevronDown } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; nativeLabel: string }[] = [
    { code: "en", label: "English", nativeLabel: "English" },
    { code: "hi", label: "Hindi", nativeLabel: "हिंदी" },
    { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
    { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  ];

  const currentLanguage = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/80 backdrop-blur-md rounded-full px-4 h-9 border border-white/20 shadow-lg text-white hover:bg-black/90 hover:text-white gap-2"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{currentLanguage?.nativeLabel}</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-black/95 backdrop-blur-md border-white/20 rounded-xl min-w-[140px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer rounded-lg text-white hover:bg-white/10 focus:bg-white/10 focus:text-white ${
              language === lang.code ? "bg-forest/50" : ""
            }`}
          >
            <span className="font-medium">{lang.nativeLabel}</span>
            <span className="ml-auto text-xs text-white/50">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
