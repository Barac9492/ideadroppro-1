import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from '@/pages/Landing';
import Submit from '@/pages/Submit';
import Ideas from '@/pages/Ideas';
import Builder from '@/pages/Builder';
import SubmissionComplete from '@/pages/SubmissionComplete';
import Auth from '@/pages/Auth';
import Legal from '@/pages/Legal';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Contact from '@/pages/Contact';
import Pricing from '@/pages/Pricing';
import MyWorkspace from '@/pages/MyWorkspace';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/submission-complete" element={<SubmissionComplete />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/my-workspace" element={<MyWorkspace />} />
            </Routes>
          </div>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
