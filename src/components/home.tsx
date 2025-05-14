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

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-1">
      <Card className="w-full max-w-full sm:max-w-2xl md:max-w-4xl p-6 md:p-10 rounded-2xl shadow-lg bg-white">
        <CardContent>
          <RegistrationForm />
        </CardContent>
        <Separator className="my-2" />
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
          </div>
          <div className="text-sm text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary underline underline-offset-4 hover:text-primary/90"
            >
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
