import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import GamesPage from "./pages/GamesPage";
import GuessNumberPage from "./pages/GuessNumberPage";
import RockPaperScissorsPage from "./pages/RockPaperScissorsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/password-generator" element={<PasswordGeneratorPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/guess-number" element={<GuessNumberPage />} />
          <Route path="/games/rock-paper-scissors" element={<RockPaperScissorsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
