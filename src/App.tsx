// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Donate from "@/pages/Donate";
// import Index from "./pages/Index";
// import About from "./pages/About";
// import Programs from "./pages/Programs";
// import Events from "./pages/Events";
// import GetInvolved from "./pages/GetInvolved";
// import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";
// import OurTeam from "./pages/OurTeam";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter
//         future={{
//           v7_startTransition: true,
//           v7_relativeSplatPath: true,
//         }}
//       >
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/programs" element={<Programs />} />
//           <Route path="/events" element={<Events />} />
//           <Route path="/get-involved" element={<GetInvolved />} />
//           <Route path="/our-team" element={<OurTeam />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/donate" element={<Donate />} />   {/* ✅ ADD THIS */}
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Donate from "@/pages/Donate";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Events from "./pages/Events";
import GetInvolved from "./pages/GetInvolved";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import OurTeam from "./pages/OurTeam";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {/* ✅ SCROLL RESET FIX */}
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
