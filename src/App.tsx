import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClockCalendarPage from "./pages/student-tools/ClockCalendarPage";
import DevotionalsPage from "./pages/student-tools/DevotionalsPage";
import CareerChatsPage from "./pages/student-tools/CareerChatsPage";
import CareerMapPage from "./pages/CareerMapPage";
import BooksPage from "./pages/resources/BooksPage";
import JobsPage from "./pages/resources/JobsPage";

import CommunityPage from "./pages/CommunityPage";
import UtilityAppsPage from "./pages/UtilityAppsPage";
import AdminPage from "./pages/AdminPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/student-tools/clock-calendar" element={<ClockCalendarPage />} />
              <Route path="/student-tools/devotionals" element={<DevotionalsPage />} />
              <Route path="/student-tools/career-chats" element={<CareerChatsPage />} />
              <Route path="/career-map" element={<CareerMapPage />} />
              <Route path="/resources/books" element={<BooksPage />} />
              <Route path="/resources/jobs" element={<JobsPage />} />
              
              <Route path="/utility-apps" element={<UtilityAppsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
