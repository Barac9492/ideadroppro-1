import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Lazy load all pages for code splitting
const Index = React.lazy(() => import('@/pages/Index'));
const Submit = React.lazy(() => import('@/pages/Submit'));
const Ideas = React.lazy(() => import('@/pages/Ideas'));
const Builder = React.lazy(() => import('@/pages/Builder'));
const SubmissionComplete = React.lazy(() => import('@/pages/SubmissionComplete'));
const Auth = React.lazy(() => import('@/pages/Auth'));
const MyWorkspace = React.lazy(() => import('@/pages/MyWorkspace'));
const Community = React.lazy(() => import('@/pages/Community'));
const Remix = React.lazy(() => import('@/pages/Remix'));
const Create = React.lazy(() => import('@/pages/Create'));
const Explore = React.lazy(() => import('@/pages/Explore'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Admin = React.lazy(() => import('@/pages/Admin'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Reduce unnecessary refetches
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-white">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/submit" element={<Submit />} />
                <Route path="/create" element={<Create />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/builder" element={<Builder />} />
                <Route path="/submission-complete" element={<SubmissionComplete />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/my-workspace" element={<MyWorkspace />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/community" element={<Community />} />
                <Route path="/remix" element={<Remix />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </div>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
