import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSwitcherProps {
  variant?: "select" | "buttons";
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "select",
  className = "",
}) => {
  const { language, setLanguage, t } = useLanguage();

  if (variant === "buttons") {
    return (
      <div className={`flex space-x-2 ${className}`}>
        <Button
          variant={language === "en" ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage("en")}
        >
          EN
        </Button>
        <Button
          variant={language === "id" ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage("id")}
        >
          ID
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as Language)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={t("language.select")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("language.english")}</SelectItem>
          <SelectItem value="id">{t("language.indonesian")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
