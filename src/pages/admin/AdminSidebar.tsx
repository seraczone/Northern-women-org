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
