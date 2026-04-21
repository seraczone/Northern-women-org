import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "@/pages/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (!user) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("email", user.email)
        .single();

      if (!active) {
        return;
      }

      if (error || !adminUser) {
        navigate("/404", { replace: true });
        return;
      }

      setLoading(false);
    };

    void checkAccess();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
}
