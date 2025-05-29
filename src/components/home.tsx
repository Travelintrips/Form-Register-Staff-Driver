import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegistrationForm from "./auth/RegistrationForm";
import { Separator } from "./ui/separator";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-1">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher variant="buttons" />
      </div>
      <Card className="w-full max-w-full sm:max-w-2xl md:max-w-4xl p-2 md:p-10 rounded-2xl shadow-lg bg-white">
        <CardContent>
          <RegistrationForm />
        </CardContent>
        <Separator className="my-2" />
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {t("common.termsAgreement") ||
              "By creating an account, you agree to our"}{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t("common.termsOfService") || "Terms of Service"}
            </a>{" "}
            {t("common.and") || "and"}{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t("common.privacyPolicy") || "Privacy Policy"}
            </a>
          </div>
          <div className="text-sm text-center">
            {t("auth.hasAccount")}{" "}
            <a
              href="/login"
              className="text-primary underline underline-offset-4 hover:text-primary/90"
            >
              {t("auth.signin")}
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
