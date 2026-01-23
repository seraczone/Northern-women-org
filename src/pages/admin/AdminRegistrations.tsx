// /// // import { useEffect, useState } from "react";
// // // import Layout from "@/components/layout/Layout";
// // // import { supabase } from "@/lib/supabase";
// // // import { Button } from "@/components/ui/button";
// // // import { useNavigate } from "react-router-dom";

// // // type Registration = {
// // //   id: string;
// // //   full_name: string;
// // //   email: string;
// // //   phone: string;
// // //   address: string;
// // //   state: string;
// // //   country: string;
// // //   event_name: string;
// // //   created_at: string;
// // // };

// // // export default function AdminRegistrations() {
// // //   const [registrations, setRegistrations] = useState<Registration[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [role, setRole] = useState<"admin" | "staff" | null>(null);
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     checkAdminAccess();
// // //   }, []);

// // //   async function checkAdminAccess() {
// // //     const {
// // //       data: { user },
// // //     } = await supabase.auth.getUser();

// // //     if (!user) {
// // //       navigate("/404");
// // //       return;
// // //     }

// // //     const { data, error } = await supabase
// // //       .from("admin_users")
// // //       .select("role")
// // //       .eq("email", user.email)
// // //       .single();

// // //     if (error || !data) {
// // //       navigate("/404");
// // //       return;
// // //     }

// // //     setRole(data.role);
// // //     fetchRegistrations();
// // //   }

// // //   async function fetchRegistrations() {
// // //     const { data, error } = await supabase
// // //       .from("event_registrations")
// // //       .select("*")
// // //       .order("created_at", { ascending: false });

// // //     if (!error && data) {
// // //       setRegistrations(data);
// // //     }
// // //     setLoading(false);
// // //   }

// // //   async function deleteRegistration(id: string) {
// // //     if (role !== "admin") return;

// // //     const confirmDelete = confirm("Delete this registration?");
// // //     if (!confirmDelete) return;

// // //     await supabase.from("event_registrations").delete().eq("id", id);
// // //     fetchRegistrations();
// // //   }

// // //   function exportToCSV() {
// // //     const headers = [
// // //       "Full Name",
// // //       "Email",
// // //       "Phone",
// // //       "Address",
// // //       "State",
// // //       "Country",
// // //       "Event",
// // //       "Date",
// // //     ];

// // //     const rows = registrations.map((r) => [
// // //       r.full_name,
// // //       r.email,
// // //       r.phone,
// // //       r.address,
// // //       r.state,
// // //       r.country,
// // //       r.event_name,
// // //       new Date(r.created_at).toLocaleDateString(),
// // //     ]);

// // //     const csv = [headers, ...rows]
// // //       .map((row) => row.map((v) => `"${v}"`).join(","))
// // //       .join("\n");

// // //     const blob = new Blob([csv], { type: "text/csv" });
// // //     const url = window.URL.createObjectURL(blob);

// // //     const a = document.createElement("a");
// // //     a.href = url;
// // //     a.download = "event_registrations.csv";
// // //     a.click();
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <Layout>
// // //         <p className="text-center py-20">Loading admin data...</p>
// // //       </Layout>
// // //     );
// // //   }

// // //   return (
// // //     <Layout>
// // //       <section className="section-padding bg-background">
// // //         <div className="container-section">
// // //           <div className="flex justify-between items-center mb-6">
// // //             <h1 className="text-3xl font-serif font-bold">
// // //               Event Registrations
// // //             </h1>

// // //             <Button variant="gold" onClick={exportToCSV}>
// // //               Export to Excel
// // //             </Button>
// // //           </div>

// // //           <div className="overflow-x-auto">
// // //             <table className="w-full border rounded-xl overflow-hidden">
// // //               <thead className="bg-muted">
// // //                 <tr>
// // //                   <th className="p-3 text-left">Name</th>
// // //                   <th className="p-3 text-left">Email</th>
// // //                   <th className="p-3 text-left">Phone</th>
// // //                   <th className="p-3 text-left">Address</th>
// // //                   <th className="p-3 text-left">Event</th>
// // //                   <th className="p-3 text-left">Date</th>
// // //                   {role === "admin" && <th className="p-3">Action</th>}
// // //                 </tr>
// // //               </thead>

// // //               <tbody>
// // //                 {registrations.map((r) => (
// // //                   <tr key={r.id} className="border-t">
// // //                     <td className="p-3">{r.full_name}</td>
// // //                     <td className="p-3">{r.email}</td>
// // //                     <td className="p-3">{r.phone}</td>
// // //                     <td className="p-3">
// // //                       {r.address}, {r.state}, {r.country}
// // //                     </td>
// // //                     <td className="p-3">{r.event_name}</td>
// // //                     <td className="p-3">
// // //                       {new Date(r.created_at).toLocaleDateString()}
// // //                     </td>

// // //                     {role === "admin" && (
// // //                       <td className="p-3">
// // //                         <Button
// // //                           variant="destructive"
// // //                           size="sm"
// // //                           onClick={() => deleteRegistration(r.id)}
// // //                         >
// // //                           Delete
// // //                         </Button>
// // //                       </td>
// // //                     )}
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>
// // //       </section>
// // //     </Layout>
// // //   );
// // // }

// // // // import { useEffect, useState } from "react";
// // // // import { supabase } from "@/lib/supabase";
// // // // import AdminLayout from "./AdminLayout";

// // // // type Registration = {
// // // //   id: string;
// // // //   full_name: string;
// // // //   email: string;
// // // //   phone: string;
// // // //   state: string;
// // // //   country: string;
// // // //   created_at: string;
// // // // };

// // // // export default function AdminRegistrations() {
// // // //   const [data, setData] = useState<Registration[]>([]);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       const { data, error } = await supabase
// // // //         .from("event_registration")
// // // //         .select("*")
// // // //         .order("created_at", { ascending: false });

// // // //       if (!error && data) {
// // // //         setData(data);
// // // //       }

// // // //       setLoading(false);
// // // //     };

// // // //     fetchData();
// // // //   }, []);

// // // //   return (
// // // //     <AdminLayout>
// // // //       <div className="p-10">
// // // //         <h1 className="text-3xl font-bold mb-6">Event Registrations</h1>

// // // //         {loading ? (
// // // //           <p>Loading…</p>
// // // //         ) : (
// // // //           <div className="overflow-x-auto">
// // // //             <table className="w-full border">
// // // //               <thead>
// // // //                 <tr className="bg-muted">
// // // //                   <th className="p-3 border">Name</th>
// // // //                   <th className="p-3 border">Email</th>
// // // //                   <th className="p-3 border">Phone</th>
// // // //                   <th className="p-3 border">State</th>
// // // //                   <th className="p-3 border">Country</th>
// // // //                   <th className="p-3 border">Date</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {data.map((r) => (
// // // //                   <tr key={r.id}>
// // // //                     <td className="p-3 border">{r.full_name}</td>
// // // //                     <td className="p-3 border">{r.email}</td>
// // // //                     <td className="p-3 border">{r.phone}</td>
// // // //                     <td className="p-3 border">{r.state}</td>
// // // //                     <td className="p-3 border">{r.country}</td>
// // // //                     <td className="p-3 border">
// // // //                       {new Date(r.created_at).toLocaleDateString()}
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </AdminLayout>
// // // //   );
// // // // }

// // // // import { useEffect, useState } from "react";
// // // // import { supabase } from "@/lib/supabase";
// // // // import AdminLayout from "./AdminLayout";

// // // // type Registration = {
// // // //   id: string;
// // // //   full_name: string;
// // // //   email: string;
// // // //   phone: string;
// // // //   state: string;
// // // //   country: string;
// // // //   created_at: string;
// // // // };

// // // // export default function AdminRegistrations() {
// // // //   const [data, setData] = useState<Registration[]>([]);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const fetchRegistrations = async () => {
// // // //       // Ensure user session exists
// // // //       const {
// // // //         data: { user },
// // // //       } = await supabase.auth.getUser();

// // // //       if (!user) {
// // // //         console.error("User not authenticated");
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       const { data, error } = await supabase
// // // //         .from("event_registration")
// // // //         .select("*")
// // // //         .order("created_at", { ascending: false });

// // // //       console.log("Registrations response:", data, error);

// // // //       if (error) {
// // // //         console.error("Error fetching registrations:", error.message);
// // // //       } else {
// // // //         setData(data ?? []);
// // // //       }

// // // //       setLoading(false);
// // // //     };

// // // //     fetchRegistrations();
// // // //   }, []);

// // // //   return (
// // // //     <AdminLayout>
// // // //       <div className="p-10">
// // // //         <h1 className="text-3xl font-bold mb-6">Event Registrations</h1>

// // // //         {loading ? (
// // // //           <p>Loading…</p>
// // // //         ) : data.length === 0 ? (
// // // //           <p className="text-muted-foreground">
// // // //             No registrations found.
// // // //           </p>
// // // //         ) : (
// // // //           <div className="overflow-x-auto">
// // // //             <table className="w-full border border-collapse">
// // // //               <thead>
// // // //                 <tr className="bg-muted">
// // // //                   <th className="p-3 border">Name</th>
// // // //                   <th className="p-3 border">Email</th>
// // // //                   <th className="p-3 border">Phone</th>
// // // //                   <th className="p-3 border">State</th>
// // // //                   <th className="p-3 border">Country</th>
// // // //                   <th className="p-3 border">Date</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {data.map((r) => (
// // // //                   <tr key={r.id}>
// // // //                     <td className="p-3 border">{r.full_name}</td>
// // // //                     <td className="p-3 border">{r.email}</td>
// // // //                     <td className="p-3 border">{r.phone}</td>
// // // //                     <td className="p-3 border">{r.state}</td>
// // // //                     <td className="p-3 border">{r.country}</td>
// // // //                     <td className="p-3 border">
// // // //                       {new Date(r.created_at).toLocaleDateString()}
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </AdminLayout>
// // // //   );
// // // // }

// // import { useEffect, useState } from "react";
// // import Layout from "@/components/layout/Layout";
// // import { supabase } from "@/lib/supabase";
// // import { Button } from "@/components/ui/button";
// // import { useNavigate } from "react-router-dom";

// // type Registration = {
// //   id: string;
// //   full_name: string;
// //   email: string;
// //   phone: string;
// //   address: string;
// //   state: string;
// //   country: string;
// //   event_name: string;
// //   created_at: string;
// // };

// // export default function AdminRegistrations() {
// //   const [registrations, setRegistrations] = useState<Registration[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [role, setRole] = useState<"admin" | "staff" | null>(null);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     checkAdminAccess();
// //   }, []);

// //   async function checkAdminAccess() {
// //     const {
// //       data: { user },
// //     } = await supabase.auth.getUser();

// //     if (!user) {
// //       navigate("/404");
// //       return;
// //     }

// //     const { data, error } = await supabase
// //       .from("admin_users")
// //       .select("role")
// //       .eq("email", user.email)
// //       .single();

// //     if (error || !data) {
// //       navigate("/404");
// //       return;
// //     }

// //     setRole(data.role);
// //     fetchRegistrations();
// //   }

// //   async function fetchRegistrations() {
// //     const { data, error } = await supabase
// //       // ✅ FIXED TABLE NAME
// //       .from("event_registration")
// //       .select("*")
// //       .order("created_at", { ascending: false });

// //     if (error) {
// //       console.error("Fetch error:", error.message);
// //     } else {
// //       setRegistrations(data ?? []);
// //     }

// //     setLoading(false);
// //   }

// //   async function deleteRegistration(id: string) {
// //     if (role !== "admin") return;

// //     const confirmDelete = confirm("Delete this registration?");
// //     if (!confirmDelete) return;

// //     await supabase
// //       .from("event_registration") // ✅ FIXED
// //       .delete()
// //       .eq("id", id);

// //     fetchRegistrations();
// //   }

// //   function exportToCSV() {
// //     const headers = [
// //       "Full Name",
// //       "Email",
// //       "Phone",
// //       "Address",
// //       "State",
// //       "Country",
// //       "Event",
// //       "Date",
// //     ];

// //     const rows = registrations.map((r) => [
// //       r.full_name,
// //       r.email,
// //       r.phone,
// //       r.address,
// //       r.state,
// //       r.country,
// //       r.event_name,
// //       new Date(r.created_at).toLocaleDateString(),
// //     ]);

// //     const csv = [headers, ...rows]
// //       .map((row) => row.map((v) => `"${v ?? ""}"`).join(","))
// //       .join("\n");

// //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// //     const url = window.URL.createObjectURL(blob);

// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = "event_registrations.csv";
// //     a.click();
// //   }

// //   if (loading) {
// //     return (
// //       <Layout>
// //         <p className="text-center py-20">Loading admin data...</p>
// //       </Layout>
// //     );
// //   }

// //   return (
// //     <Layout>
// //       <section className="section-padding bg-background">
// //         <div className="container-section">
// //           <div className="flex justify-between items-center mb-6">
// //             <h1 className="text-3xl font-serif font-bold">
// //               Event Registrations
// //             </h1>

// //             <Button variant="gold" onClick={exportToCSV}>
// //               Export to Excel
// //             </Button>
// //           </div>

// //           {registrations.length === 0 ? (
// //             <p className="text-muted-foreground">
// //               No registrations found.
// //             </p>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="w-full border rounded-xl overflow-hidden">
// //                 <thead className="bg-muted">
// //                   <tr>
// //                     <th className="p-3 text-left">Name</th>
// //                     <th className="p-3 text-left">Email</th>
// //                     <th className="p-3 text-left">Phone</th>
// //                     <th className="p-3 text-left">Address</th>
// //                     <th className="p-3 text-left">Event</th>
// //                     <th className="p-3 text-left">Date</th>
// //                     {role === "admin" && <th className="p-3">Action</th>}
// //                   </tr>
// //                 </thead>

// //                 <tbody>
// //                   {registrations.map((r) => (
// //                     <tr key={r.id} className="border-t">
// //                       <td className="p-3">{r.full_name}</td>
// //                       <td className="p-3">{r.email}</td>
// //                       <td className="p-3">{r.phone}</td>
// //                       <td className="p-3">
// //                         {r.address}, {r.state}, {r.country}
// //                       </td>
// //                       <td className="p-3">{r.event_name}</td>
// //                       <td className="p-3">
// //                         {new Date(r.created_at).toLocaleDateString()}
// //                       </td>

// //                       {role === "admin" && (
// //                         <td className="p-3">
// //                           <Button
// //                             variant="destructive"
// //                             size="sm"
// //                             onClick={() => deleteRegistration(r.id)}
// //                           >
// //                             Delete
// //                           </Button>
// //                         </td>
// //                       )}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </section>
// //     </Layout>
// //   );
// // }

// import { useEffect, useState } from "react";
// import Layout from "@/components/layout/Layout";
// import { supabase } from "@/lib/supabase";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";

// type Registration = {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   address: string;
//   state: string;
//   country: string;
//   event_name: string;
//   created_at: string;
// };

// export default function AdminRegistrations() {
//   const [registrations, setRegistrations] = useState<Registration[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [role, setRole] = useState<"admin" | "staff" | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     checkAdminAccess();
//   }, []);

//   async function checkAdminAccess() {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user || !user.email) {
//       navigate("/404");
//       return;
//     }

//     const { data, error } = await supabase
//       .from("admin_users")
//       .select("role")
//       .eq("email", user.email)
//       .single();

//     if (error || !data) {
//       navigate("/404");
//       return;
//     }

//     setRole(data.role);
//     fetchRegistrations();
//   }

//   async function fetchRegistrations() {
//     const { data, error } = await supabase
//       .from("event_registrations")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (!error && data) {
//       setRegistrations(data);
//     }

//     setLoading(false);
//   }

//   async function deleteRegistration(id: string) {
//     if (role !== "admin") return;

//     const confirmDelete = confirm("Delete this registration?");
//     if (!confirmDelete) return;

//     await supabase.from("event_registrations").delete().eq("id", id);
//     fetchRegistrations();
//   }

//   function exportToCSV() {
//     const headers = [
//       "First Name",
//       "Last Name",
//       "Email",
//       "Phone",
//       "Address",
//       "State",
//       "Country",
//       "Event",
//       "Date",
//     ];

//     const rows = registrations.map((r) => [
//       r.first_name,
//       r.last_name,
//       r.email,
//       r.phone,
//       r.address,
//       r.state,
//       r.country,
//       r.event_name,
//       new Date(r.created_at).toLocaleDateString(),
//     ]);

//     const csv = [headers, ...rows]
//       .map((row) => row.map((v) => `"${v ?? ""}"`).join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "event_registrations.csv";
//     a.click();
//   }

//   if (loading) {
//     return (
//       <Layout>
//         <p className="text-center py-20">Loading admin data…</p>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-serif font-bold">
//               Event Registrations
//             </h1>

//             <Button variant="gold" onClick={exportToCSV}>
//               Export to Excel
//             </Button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full border rounded-xl overflow-hidden">
//               <thead className="bg-muted">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Address</th>
//                   <th className="p-3 text-left">Event</th>
//                   <th className="p-3 text-left">Date</th>
//                   {role === "admin" && <th className="p-3">Action</th>}
//                 </tr>
//               </thead>

//               <tbody>
//                 {registrations.map((r) => (
//                   <tr key={r.id} className="border-t">
//                     <td className="p-3 font-medium">
//                       {r.first_name} {r.last_name}
//                     </td>
//                     <td className="p-3">{r.email}</td>
//                     <td className="p-3">{r.phone}</td>
//                     <td className="p-3">
//                       {r.address}, {r.state}, {r.country}
//                     </td>
//                     <td className="p-3">{r.event_name}</td>
//                     <td className="p-3">
//                       {new Date(r.created_at).toLocaleDateString()}
//                     </td>

//                     {role === "admin" && (
//                       <td className="p-3">
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => deleteRegistration(r.id)}
//                         >
//                           Delete
//                         </Button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// }

//
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Registration = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  country: string;
  event_name: string;
  created_at: string;
};

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "staff" | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/404");
      return;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("role")
      .eq("email", user.email)
      .single();

    if (error || !data) {
      navigate("/404");
      return;
    }

    setRole(data.role);
    fetchRegistrations();
  }

  async function fetchRegistrations() {
    const { data, error } = await supabase
      .from("event_registration") // ✅ CORRECT TABLE
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setRegistrations(data ?? []);
    }

    setLoading(false);
  }

  async function deleteRegistration(id: string) {
    if (role !== "admin") return;

    const confirmDelete = confirm("Delete this registration?");
    if (!confirmDelete) return;

    await supabase
      .from("event_registration") // ✅ SAME TABLE
      .delete()
      .eq("id", id);

    fetchRegistrations();
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-center py-20">Loading admin data...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-section">
          <h1 className="text-3xl font-serif font-bold mb-6">
            Event Registrations
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Event</th>
                  <th className="p-3 text-left">Date</th>
                  {role === "admin" && <th className="p-3">Action</th>}
                </tr>
              </thead>

              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3 text-xs text-muted-foreground">
                      {r.id}
                    </td>

                    <td className="p-3 font-medium">
                      {r.first_name} {r.last_name}
                    </td>

                    <td className="p-3">{r.email}</td>
                    <td className="p-3">{r.phone}</td>

                    <td className="p-3">
                      {r.address}, {r.state}, {r.country}
                    </td>

                    <td className="p-3">{r.event_name}</td>

                    <td className="p-3">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>

                    {role === "admin" && (
                      <td className="p-3">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRegistration(r.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {registrations.length === 0 && (
              <p className="text-center text-muted-foreground py-10">
                No registrations found.
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
