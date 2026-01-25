// // // import { NavLink } from "react-router-dom";
// // // import { LayoutDashboard, Quote } from "lucide-react";

// // // export default function AdminSidebar() {
// // //   return (
// // //     <aside className="w-64 bg-primary text-primary-foreground min-h-screen p-6">
// // //       <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

// // //       <nav className="space-y-4">
// // //         <NavLink
// // //           to="/admin"
// // //           end
// // //           className={({ isActive }) =>
// // //             `flex items-center gap-3 p-3 rounded-lg ${
// // //               isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary/80"
// // //             }`
// // //           }
// // //         >
// // //           <LayoutDashboard size={18} />
// // //           Dashboard
// // //         </NavLink>

// // //         <NavLink
// // //           to="/admin/quotes"
// // //           className={({ isActive }) =>
// // //             `flex items-center gap-3 p-3 rounded-lg ${
// // //               isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary/80"
// // //             }`
// // //           }
// // //         >
// // //           <Quote size={18} />
// // //           Weekly Quotes
// // //         </NavLink>
// // //       </nav>
// // //     </aside>
// // //   );
// // // }

// // import { NavLink } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   MessageCircle,
// //   ClipboardList,
// //   LogOut,
// // } from "lucide-react";
// // import { supabase } from "@/lib/supabase";
// // import { useNavigate } from "react-router-dom";

// // export default function AdminSidebar() {
// //   const navigate = useNavigate();

// //   const handleLogout = async () => {
// //     await supabase.auth.signOut();
// //     navigate("/admin/login");
// //   };

// //   const linkClass =
// //     "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition";

// //   return (
// //     <aside className="w-64 bg-background border-r min-h-screen flex flex-col">
// //       {/* Logo / Title */}
// //       <div className="px-6 py-5 border-b">
// //         <h2 className="font-serif text-xl font-bold">
// //           Admin Panel
// //         </h2>
// //         <p className="text-xs text-muted-foreground">
// //           Northern Women Initiative
// //         </p>
// //       </div>

// //       {/* Navigation */}
// //       <nav className="flex-1 px-3 py-4 space-y-1">
// //         <NavLink
// //           to="/admin"
// //           end
// //           className={({ isActive }) =>
// //             `${linkClass} ${
// //               isActive
// //                 ? "bg-primary text-primary-foreground"
// //                 : "hover:bg-muted"
// //             }`
// //           }
// //         >
// //           <LayoutDashboard size={18} />
// //           Dashboard
// //         </NavLink>

// //         <NavLink
// //           to="/admin/quotes"
// //           className={({ isActive }) =>
// //             `${linkClass} ${
// //               isActive
// //                 ? "bg-primary text-primary-foreground"
// //                 : "hover:bg-muted"
// //             }`
// //           }
// //         >
// //           <MessageCircle size={18} />
// //           Weekly Quotes
// //         </NavLink>

// //         <NavLink
// //           to="/admin/registrations"
// //           className={({ isActive }) =>
// //             `${linkClass} ${
// //               isActive
// //                 ? "bg-primary text-primary-foreground"
// //                 : "hover:bg-muted"
// //             }`
// //           }
// //         >
// //           <ClipboardList size={18} />
// //           Event Registrations
// //         </NavLink>
// //       </nav>

// //       {/* Logout */}
// //       <div className="p-4 border-t">
// //         <button
// //           onClick={handleLogout}
// //           className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
// //         >
// //           <LogOut size={18} />
// //           Logout
// //         </button>
// //       </div>
// //     </aside>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Home, FileText, MessageCircle, LogOut } from "lucide-react";
// import { supabase } from "@/lib/supabase";

// interface Quote {
//   id: number;
//   quote_text: string;
//   author?: string;
//   week_number: number;
//   year: number;
// }

// export default function AdminSidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

//   const getCurrentWeek = () => {
//     const startOfYear = new Date(new Date().getFullYear(), 0, 1);
//     const today = new Date();
//     return Math.ceil(
//       ((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
//     );
//   };

//   useEffect(() => {
//     const fetchQuote = async () => {
//       const weekNumber = getCurrentWeek();
//       const year = new Date().getFullYear();

//       const { data, error } = await supabase
//         .from("weekly_quotes")
//         .select("*")
//         .eq("week_number", weekNumber)
//         .eq("year", year)
//         .single();

//       if (!error && data) setCurrentQuote(data);
//     };

//     fetchQuote();
//   }, []);

//   const navItems = [
//     { name: "Dashboard", path: "/admin", icon: <Home size={18} /> },
//     { name: "Quotes", path: "/admin/quotes", icon: <MessageCircle size={18} /> },
//     { name: "Registrations", path: "/admin/registrations", icon: <FileText size={18} /> },
//   ];

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate("/admin/login");
//   };

//   return (
//     <aside className="w-64 bg-muted min-h-screen p-6 flex flex-col">
//       <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

//       {/* Clickable Current Week Quote Preview */}
//       <div
//         className="bg-background rounded-lg p-4 mb-6 shadow text-sm cursor-pointer hover:bg-background/70"
//         onClick={() => {
//           if (currentQuote) {
//             navigate(`/admin/quotes?week=${currentQuote.week_number}`);
//           } else {
//             navigate("/admin/quotes");
//           }
//         }}
//         title="Click to edit this week's quote"
//       >
//         <p className="italic mb-2">
//           "{currentQuote?.quote_text || "No quote for this week"}"
//         </p>
//         <p className="font-semibold text-right">
//           — {currentQuote?.author || "Admin"}
//         </p>
//         <p className="text-xs text-muted-foreground text-right">
//           Week {currentQuote?.week_number || "-"}
//         </p>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 flex flex-col gap-2">
//         {navItems.map((item) => (
//           <Link
//             key={item.name}
//             to={item.path}
//             className={`flex items-center gap-3 p-3 rounded hover:bg-background ${
//               location.pathname === item.path ? "bg-background font-semibold" : ""
//             }`}
//           >
//             {item.icon}
//             {item.name}
//           </Link>
//         ))}
//       </nav>

//       <button
//         onClick={handleLogout}
//         className="mt-auto flex items-center gap-3 p-3 bg-destructive text-white rounded hover:bg-red-700"
//       >
//         <LogOut size={18} /> Logout
//       </button>
//     </aside>
//   );
// }

import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Users,
  Quote,
  Calendar,
  Image,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition";

  const activeClass = "bg-muted font-semibold";

  return (
    <aside className="w-64 border-r bg-background min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-center">
        Admin Panel
      </h2>

      <nav className="space-y-2">
        <NavLink to="/admin" end className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/registrations" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <Users size={18} /> Registrations
        </NavLink>

        <NavLink to="/admin/quotes" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <Quote size={18} /> Weekly Quotes
        </NavLink>

        <NavLink to="/admin/programs" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <Calendar size={18} /> Programs
        </NavLink>

        <NavLink to="/admin/events" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <Calendar size={18} /> Events
        </NavLink>

        <NavLink to="/admin/media" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <Image size={18} /> Media
        </NavLink>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
}
