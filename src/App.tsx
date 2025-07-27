import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClockCalendarPage from "./pages/student-tools/ClockCalendarPage";
import DevotionalsPage from "./pages/student-tools/DevotionalsPage";
import CareerChatsPage from "./pages/student-tools/CareerChatsPage";
import CareerMapPage from "./pages/CareerMapPage";
import BooksPage from "./pages/resources/BooksPage";
import RecordingsPage from "./pages/resources/RecordingsPage";
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
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student-tools/clock-calendar" element={<ClockCalendarPage />} />
          <Route path="/student-tools/devotionals" element={<DevotionalsPage />} />
          <Route path="/student-tools/career-chats" element={<CareerChatsPage />} />
          <Route path="/career-map" element={<CareerMapPage />} />
          <Route path="/resources/books" element={<BooksPage />} />
          <Route path="/resources/recordings" element={<RecordingsPage />} />
          <Route path="/utility-apps" element={<UtilityAppsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
