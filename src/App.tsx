import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "@/components/AuthProvider";
import DonateButton from "@/components/DonateButton";

const queryClient = new QueryClient();

const STRIPE_DONATE_LINK = "https://buy.stripe.com/test_bJecN786G3Ef6JSbZN2sM00"; // Replace with your actual link

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* Donate button fixed in bottom right */}
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}>
          <DonateButton link={STRIPE_DONATE_LINK} />
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
