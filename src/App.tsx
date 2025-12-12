import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import PasswordHasherPage from "./pages/PasswordHasherPage";
import CyberToolsPage from "./pages/CyberToolsPage";
import GamesPage from "./pages/GamesPage";
import GuessNumberPage from "./pages/GuessNumberPage";
import RockPaperScissorsPage from "./pages/RockPaperScissorsPage";
import SnakeGamePage from "./pages/SnakeGamePage";
import CarRacingPage from "./pages/CarRacingPage";
import CaesarCipherPage from "./pages/CaesarCipherPage";
import PortScannerPage from "./pages/PortScannerPage";
import V2XMessageSigningPage from "./pages/V2XMessageSigningPage";
import HashGeneratorPage from "./pages/HashGeneratorPage";
import Base64EncoderPage from "./pages/Base64EncoderPage";
import XorCipherPage from "./pages/XorCipherPage";
import NetworkPacketAnalyzerPage from "./pages/NetworkPacketAnalyzerPage";
import SteganographyPage from "./pages/SteganographyPage";
import UrlEncoderPage from "./pages/UrlEncoderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cyber-tools" element={<CyberToolsPage />} />
          <Route path="/password-generator" element={<PasswordGeneratorPage />} />
          <Route path="/password-hasher" element={<PasswordHasherPage />} />
          <Route path="/caesar-cipher" element={<CaesarCipherPage />} />
          <Route path="/port-scanner" element={<PortScannerPage />} />
          <Route path="/v2x-signing" element={<V2XMessageSigningPage />} />
          <Route path="/hash-generator" element={<HashGeneratorPage />} />
          <Route path="/base64-encoder" element={<Base64EncoderPage />} />
          <Route path="/xor-cipher" element={<XorCipherPage />} />
          <Route path="/packet-analyzer" element={<NetworkPacketAnalyzerPage />} />
          <Route path="/steganography" element={<SteganographyPage />} />
          <Route path="/url-encoder" element={<UrlEncoderPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/guess-number" element={<GuessNumberPage />} />
          <Route path="/games/rock-paper-scissors" element={<RockPaperScissorsPage />} />
          <Route path="/games/snake" element={<SnakeGamePage />} />
          <Route path="/games/car-racing" element={<CarRacingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
