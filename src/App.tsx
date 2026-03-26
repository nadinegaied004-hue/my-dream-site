import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LangProvider } from "./context/LangContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index.tsx";
import Hotels from "./pages/Hotels.tsx";
import Avis from "./pages/Avis.tsx";
import AvisPersonnel from "./pages/AvisPersonnel.tsx";
import Proprietaire from "./pages/Proprietaire.tsx";
import Connexion from "./pages/Connexion.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useEffect } from "react";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LangProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/avis" element={<Avis />} />
              <Route path="/avis-personnel" element={<AvisPersonnel />} />
              <Route path="/proprietaire" element={<Proprietaire />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
