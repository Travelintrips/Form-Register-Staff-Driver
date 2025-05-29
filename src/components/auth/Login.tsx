import React from "react";
import LoginForm from "./LoginForm";
import LanguageSwitcher from "../LanguageSwitcher";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher variant="buttons" />
      </div>
      <LoginForm />
    </div>
  );
}
