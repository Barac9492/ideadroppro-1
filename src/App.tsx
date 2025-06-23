
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Submit from '@/pages/Submit';
import Ideas from '@/pages/Ideas';
import Builder from '@/pages/Builder';
import SubmissionComplete from '@/pages/SubmissionComplete';
import Auth from '@/pages/Auth';
import MyWorkspace from '@/pages/MyWorkspace';
import Community from '@/pages/Community';
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
              <Route path="/" element={<Index />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/submission-complete" element={<SubmissionComplete />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-workspace" element={<MyWorkspace />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
