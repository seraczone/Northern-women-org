import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Events from "./pages/Events";
import GetInvolved from "./pages/GetInvolved";
import JoinUs from "./pages/JoinUs";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import OurTeam from "./pages/OurTeam";
import RegisterEvent from "./pages/RegisterEvent";
import RegisterSummit2026 from "./pages/RegisterSummit2026";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGetInvolved from "./pages/admin/AdminGetInvolved";
import AdminJoinUs from "./pages/admin/AdminJoinUs";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminSummitRegistrations from "./pages/admin/AdminSummitRegistrations";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminUsers from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register-event" element={<RegisterEvent />} />
          <Route path="/summit-2026/register" element={<RegisterSummit2026 />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />

          {/* ===== ADMIN ROUTES ===== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/get-involved" element={<AdminGetInvolved />} />
          <Route path="/admin/summit-registrations" element={<AdminSummitRegistrations />} />
          <Route path="/admin/join-us" element={<AdminJoinUs />} />
          <Route path="/admin/quotes" element={<AdminQuotes />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/users" element={<AdminUsers />} />

          {/* ===== FALLBACKS ===== */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
