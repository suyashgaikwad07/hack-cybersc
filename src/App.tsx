import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import CyberToolsPage from "./pages/CyberToolsPage";
import CyberSecurityPage from "./pages/CyberSecurityPage";
import SoftwarePage from "./pages/SoftwarePage";
import GamesPage from "./pages/GamesPage";
import GuessNumberPage from "./pages/GuessNumberPage";
import RockPaperScissorsPage from "./pages/RockPaperScissorsPage";
import SnakeGamePage from "./pages/SnakeGamePage";
import CarRacingPage from "./pages/CarRacingPage";
import PortScannerPage from "./pages/PortScannerPage";
import V2XMessageSigningPage from "./pages/V2XMessageSigningPage";
import HashToolsPage from "./pages/HashToolsPage";
import CipherToolsPage from "./pages/CipherToolsPage";
import Base64EncoderPage from "./pages/Base64EncoderPage";
import NetworkPacketAnalyzerPage from "./pages/NetworkPacketAnalyzerPage";
import SteganographyPage from "./pages/SteganographyPage";
import UrlEncoderPage from "./pages/UrlEncoderPage";
import TicTacToePage from "./pages/TicTacToePage";
import MemoryCardPage from "./pages/MemoryCardPage";
import FlappyBirdPage from "./pages/FlappyBirdPage";
import Game2048Page from "./pages/Game2048Page";

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
          <Route path="/cyber-security" element={<CyberSecurityPage />} />
          <Route path="/software" element={<SoftwarePage />} />
          <Route path="/hash-tools" element={<HashToolsPage />} />
          <Route path="/cipher-tools" element={<CipherToolsPage />} />
          <Route path="/port-scanner" element={<PortScannerPage />} />
          <Route path="/v2x-signing" element={<V2XMessageSigningPage />} />
          <Route path="/base64-encoder" element={<Base64EncoderPage />} />
          <Route path="/packet-analyzer" element={<NetworkPacketAnalyzerPage />} />
          <Route path="/steganography" element={<SteganographyPage />} />
          <Route path="/url-encoder" element={<UrlEncoderPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/guess-number" element={<GuessNumberPage />} />
          <Route path="/games/rock-paper-scissors" element={<RockPaperScissorsPage />} />
          <Route path="/games/snake" element={<SnakeGamePage />} />
          <Route path="/games/car-racing" element={<CarRacingPage />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToePage />} />
          <Route path="/games/memory-card" element={<MemoryCardPage />} />
          <Route path="/games/flappy-bird" element={<FlappyBirdPage />} />
          <Route path="/games/2048" element={<Game2048Page />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
