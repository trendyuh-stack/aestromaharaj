import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import KundaliForm from "./pages/KundaliForm";
import KundaliResult from "./pages/KundaliResult";
import Astrologers from "./pages/Astrologers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DailyHoroscope from "./pages/DailyHoroscope";
import Panchang from "./pages/Panchang";
import MatchMaking from "./pages/MatchMaking";
import Numerology from "./pages/Numerology";
import TarotReading from "./pages/TarotReading";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kundali" element={<KundaliForm />} />
            <Route path="/kundali/result" element={<KundaliResult />} />
            <Route path="/astrologers" element={<Astrologers />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/horoscope" element={<DailyHoroscope />} />
            <Route path="/panchang" element={<Panchang />} />
            <Route path="/match-making" element={<MatchMaking />} />
            <Route path="/numerology" element={<Numerology />} />
            <Route path="/tarot" element={<TarotReading />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;