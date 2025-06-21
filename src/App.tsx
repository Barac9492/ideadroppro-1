
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Submit from "./pages/Submit";
import Remix from "./pages/Remix";
import VCs from "./pages/VCs";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Guide from "./pages/Guide";
import Ranking from "./pages/Ranking";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import TabNavigation from "./components/TabNavigation";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const hideTabsOn = ['/auth', '/admin', '/about', '/guide'];
  const showTabs = !hideTabsOn.includes(location.pathname);

  return (
    <>
      <Toaster />
      <Sonner />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/remix" element={<Remix />} />
            <Route path="/vcs" element={<VCs />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        {showTabs && (
          <TabNavigation currentLanguage="ko" />
        )}
      </div>
    </>
  );
};

export default App;
