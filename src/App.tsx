import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/auth/Login";
import routes from "tempo-routes";

function App() {
  const tempoRoutes = useRoutes(routes);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tempobook/*" element={tempoRoutes} />
      </Routes>
    </Suspense>
  );
}

export default App;
