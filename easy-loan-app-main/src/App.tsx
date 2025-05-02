

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";
import NewLoan from "./pages/NewLoan";
import Documents from "./pages/Documents";
import ExistingLoans from "./pages/ExistingLoans";
import TrackLoan from "./pages/TrackLoan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={isAuthenticated ? <Index /> : <Navigate to="/login" />} />
              <Route path="/faq" element={isAuthenticated ? <FAQ /> : <Navigate to="/login" />} />
              <Route path="/new-loan" element={isAuthenticated ? <NewLoan /> : <Navigate to="/login" />} />
              <Route path="/documents" element={isAuthenticated ? <Documents /> : <Navigate to="/login" />} />
              <Route path="/existing-loans" element={isAuthenticated ? <ExistingLoans /> : <Navigate to="/login" />} />
              <Route path="/track-loan" element={isAuthenticated ? <TrackLoan /> : <Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
