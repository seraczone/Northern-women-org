import { NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  Image,
  LayoutDashboard,
  LogOut,
  Quote,
  Shield,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const linkClass =
    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-muted";
  const activeClass = "bg-muted font-semibold";

  return (
    <aside className="min-h-screen w-64 border-r bg-background p-4">
      <h2 className="mb-6 text-center text-xl font-bold">Admin Panel</h2>

      <nav className="space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/registrations"
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          <Users size={18} /> Registrations
        </NavLink>

        <NavLink
          to="/admin/quotes"
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          <Quote size={18} /> Weekly Quotes
        </NavLink>

        <NavLink
          to="/admin/events"
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          <Calendar size={18} /> Events Content
        </NavLink>

        <NavLink
          to="/admin/media"
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          <Image size={18} /> Media
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          <Shield size={18} /> Admin Users
        </NavLink>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
}
