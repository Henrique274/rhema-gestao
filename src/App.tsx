
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import MembersPage from "./pages/MembersPage";
import MemberNewPage from "./pages/MemberNewPage";
import MemberEditPage from "./pages/MemberEditPage";
import AttendancePage from "./pages/AttendancePage";
import AbsenceReportPage from "./pages/AbsenceReportPage";
import CalendarPage from "./pages/CalendarPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!session ? (
              <>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            ) : (
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/members/new" element={<MemberNewPage />} />
                <Route path="/members/:id" element={<MemberEditPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/absence-report" element={<AbsenceReportPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
