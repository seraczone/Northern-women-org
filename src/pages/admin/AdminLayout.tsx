// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { useNavigate } from "react-router-dom";

// type Props = {
//   children: React.ReactNode;
// };

// export default function AdminLayout({ children }: Props) {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAccess = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         navigate("/404");
//         return;
//       }

//       const { data: adminUser, error } = await supabase
//         .from("admin_users")
//         .select("role")
//         .eq("email", user.email)
//         .single();

//       if (error || !adminUser) {
//         navigate("/404");
//         return;
//       }

//       setLoading(false);
//     };

//     checkAccess();
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Checking access…
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/pages/admin/AdminSidebar";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("email", user.email)
        .single();

      if (error || !adminUser) {
        navigate("/404");
        return;
      }

      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  );
}
