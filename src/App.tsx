import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/auth/Login";
import routes from "tempo-routes";
import { useLanguage } from "./lib/i18n/LanguageContext";

function App() {
  const tempoRoutes = useRoutes(routes);
  const { t } = useLanguage();

  return (
    <Suspense fallback={<p>{t("common.loading")}</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tempobook/*" element={tempoRoutes} />
      </Routes>
    </Suspense>
  );
}

export default App;
