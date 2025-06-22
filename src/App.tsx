
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Ideas from "./pages/Ideas";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Guide from "./pages/Guide";
import Auth from "./pages/Auth";
import Submit from "./pages/Submit";
import Builder from "./pages/Builder";
import VCs from "./pages/VCs";
import Ranking from "./pages/Ranking";
import Admin from "./pages/Admin";
import Explore from "./pages/Explore";
import Remix from "./pages/Remix";
import SubmissionComplete from "./pages/SubmissionComplete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/vcs" element={<VCs />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/remix" element={<Remix />} />
            <Route path="/submission-complete" element={<SubmissionComplete />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
