// // // /// // import { useEffect, useState } from "react";
// // // // // import Layout from "@/components/layout/Layout";
// // // // // import { supabase } from "@/lib/supabase";
// // // // // import { Button } from "@/components/ui/button";
// // // // // import { useNavigate } from "react-router-dom";

// // // // // type Registration = {
// // // // //   id: string;
// // // // //   full_name: string;
// // // // //   email: string;
// // // // //   phone: string;
// // // // //   address: string;
// // // // //   state: string;
// // // // //   country: string;
// // // // //   event_name: string;
// // // // //   created_at: string;
// // // // // };

// // // // // export default function AdminRegistrations() {
// // // // //   const [registrations, setRegistrations] = useState<Registration[]>([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [role, setRole] = useState<"admin" | "staff" | null>(null);
// // // // //   const navigate = useNavigate();

// // // // //   useEffect(() => {
// // // // //     checkAdminAccess();
// // // // //   }, []);

// // // // //   async function checkAdminAccess() {
// // // // //     const {
// // // // //       data: { user },
// // // // //     } = await supabase.auth.getUser();

// // // // //     if (!user) {
// // // // //       navigate("/404");
// // // // //       return;
// // // // //     }

// // // // //     const { data, error } = await supabase
// // // // //       .from("admin_users")
// // // // //       .select("role")
// // // // //       .eq("email", user.email)
// // // // //       .single();

// // // // //     if (error || !data) {
// // // // //       navigate("/404");
// // // // //       return;
// // // // //     }

// // // // //     setRole(data.role);
// // // // //     fetchRegistrations();
// // // // //   }

// // // // //   async function fetchRegistrations() {
// // // // //     const { data, error } = await supabase
// // // // //       .from("event_registrations")
// // // // //       .select("*")
// // // // //       .order("created_at", { ascending: false });

// // // // //     if (!error && data) {
// // // // //       setRegistrations(data);
// // // // //     }
// // // // //     setLoading(false);
// // // // //   }

// // // // //   async function deleteRegistration(id: string) {
// // // // //     if (role !== "admin") return;

// // // // //     const confirmDelete = confirm("Delete this registration?");
// // // // //     if (!confirmDelete) return;

// // // // //     await supabase.from("event_registrations").delete().eq("id", id);
// // // // //     fetchRegistrations();
// // // // //   }

// // // // //   function exportToCSV() {
// // // // //     const headers = [
// // // // //       "Full Name",
// // // // //       "Email",
// // // // //       "Phone",
// // // // //       "Address",
// // // // //       "State",
// // // // //       "Country",
// // // // //       "Event",
// // // // //       "Date",
// // // // //     ];

// // // // //     const rows = registrations.map((r) => [
// // // // //       r.full_name,
// // // // //       r.email,
// // // // //       r.phone,
// // // // //       r.address,
// // // // //       r.state,
// // // // //       r.country,
// // // // //       r.event_name,
// // // // //       new Date(r.created_at).toLocaleDateString(),
// // // // //     ]);

// // // // //     const csv = [headers, ...rows]
// // // // //       .map((row) => row.map((v) => `"${v}"`).join(","))
// // // // //       .join("\n");

// // // // //     const blob = new Blob([csv], { type: "text/csv" });
// // // // //     const url = window.URL.createObjectURL(blob);

// // // // //     const a = document.createElement("a");
// // // // //     a.href = url;
// // // // //     a.download = "event_registrations.csv";
// // // // //     a.click();
// // // // //   }

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <Layout>
// // // // //         <p className="text-center py-20">Loading admin data...</p>
// // // // //       </Layout>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <Layout>
// // // // //       <section className="section-padding bg-background">
// // // // //         <div className="container-section">
// // // // //           <div className="flex justify-between items-center mb-6">
// // // // //             <h1 className="text-3xl font-serif font-bold">
// // // // //               Event Registrations
// // // // //             </h1>

// // // // //             <Button variant="gold" onClick={exportToCSV}>
// // // // //               Export to Excel
// // // // //             </Button>
// // // // //           </div>

// // // // //           <div className="overflow-x-auto">
// // // // //             <table className="w-full border rounded-xl overflow-hidden">
// // // // //               <thead className="bg-muted">
// // // // //                 <tr>
// // // // //                   <th className="p-3 text-left">Name</th>
// // // // //                   <th className="p-3 text-left">Email</th>
// // // // //                   <th className="p-3 text-left">Phone</th>
// // // // //                   <th className="p-3 text-left">Address</th>
// // // // //                   <th className="p-3 text-left">Event</th>
// // // // //                   <th className="p-3 text-left">Date</th>
// // // // //                   {role === "admin" && <th className="p-3">Action</th>}
// // // // //                 </tr>
// // // // //               </thead>

// // // // //               <tbody>
// // // // //                 {registrations.map((r) => (
// // // // //                   <tr key={r.id} className="border-t">
// // // // //                     <td className="p-3">{r.full_name}</td>
// // // // //                     <td className="p-3">{r.email}</td>
// // // // //                     <td className="p-3">{r.phone}</td>
// // // // //                     <td className="p-3">
// // // // //                       {r.address}, {r.state}, {r.country}
// // // // //                     </td>
// // // // //                     <td className="p-3">{r.event_name}</td>
// // // // //                     <td className="p-3">
// // // // //                       {new Date(r.created_at).toLocaleDateString()}
// // // // //                     </td>

// // // // //                     {role === "admin" && (
// // // // //                       <td className="p-3">
// // // // //                         <Button
// // // // //                           variant="destructive"
// // // // //                           size="sm"
// // // // //                           onClick={() => deleteRegistration(r.id)}
// // // // //                         >
// // // // //                           Delete
// // // // //                         </Button>
// // // // //                       </td>
// // // // //                     )}
// // // // //                   </tr>
// // // // //                 ))}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //         </div>
// // // // //       </section>
// // // // //     </Layout>
// // // // //   );
// // // // // }

// // // // // // import { useEffect, useState } from "react";
// // // // // // import { supabase } from "@/lib/supabase";
// // // // // // import AdminLayout from "./AdminLayout";

// // // // // // type Registration = {
// // // // // //   id: string;
// // // // // //   full_name: string;
// // // // // //   email: string;
// // // // // //   phone: string;
// // // // // //   state: string;
// // // // // //   country: string;
// // // // // //   created_at: string;
// // // // // // };

// // // // // // export default function AdminRegistrations() {
// // // // // //   const [data, setData] = useState<Registration[]>([]);
// // // // // //   const [loading, setLoading] = useState(true);

// // // // // //   useEffect(() => {
// // // // // //     const fetchData = async () => {
// // // // // //       const { data, error } = await supabase
// // // // // //         .from("event_registration")
// // // // // //         .select("*")
// // // // // //         .order("created_at", { ascending: false });

// // // // // //       if (!error && data) {
// // // // // //         setData(data);
// // // // // //       }

// // // // // //       setLoading(false);
// // // // // //     };

// // // // // //     fetchData();
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <AdminLayout>
// // // // // //       <div className="p-10">
// // // // // //         <h1 className="text-3xl font-bold mb-6">Event Registrations</h1>

// // // // // //         {loading ? (
// // // // // //           <p>Loading…</p>
// // // // // //         ) : (
// // // // // //           <div className="overflow-x-auto">
// // // // // //             <table className="w-full border">
// // // // // //               <thead>
// // // // // //                 <tr className="bg-muted">
// // // // // //                   <th className="p-3 border">Name</th>
// // // // // //                   <th className="p-3 border">Email</th>
// // // // // //                   <th className="p-3 border">Phone</th>
// // // // // //                   <th className="p-3 border">State</th>
// // // // // //                   <th className="p-3 border">Country</th>
// // // // // //                   <th className="p-3 border">Date</th>
// // // // // //                 </tr>
// // // // // //               </thead>
// // // // // //               <tbody>
// // // // // //                 {data.map((r) => (
// // // // // //                   <tr key={r.id}>
// // // // // //                     <td className="p-3 border">{r.full_name}</td>
// // // // // //                     <td className="p-3 border">{r.email}</td>
// // // // // //                     <td className="p-3 border">{r.phone}</td>
// // // // // //                     <td className="p-3 border">{r.state}</td>
// // // // // //                     <td className="p-3 border">{r.country}</td>
// // // // // //                     <td className="p-3 border">
// // // // // //                       {new Date(r.created_at).toLocaleDateString()}
// // // // // //                     </td>
// // // // // //                   </tr>
// // // // // //                 ))}
// // // // // //               </tbody>
// // // // // //             </table>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </AdminLayout>
// // // // // //   );
// // // // // // }

// // // // // // import { useEffect, useState } from "react";
// // // // // // import { supabase } from "@/lib/supabase";
// // // // // // import AdminLayout from "./AdminLayout";

// // // // // // type Registration = {
// // // // // //   id: string;
// // // // // //   full_name: string;
// // // // // //   email: string;
// // // // // //   phone: string;
// // // // // //   state: string;
// // // // // //   country: string;
// // // // // //   created_at: string;
// // // // // // };

// // // // // // export default function AdminRegistrations() {
// // // // // //   const [data, setData] = useState<Registration[]>([]);
// // // // // //   const [loading, setLoading] = useState(true);

// // // // // //   useEffect(() => {
// // // // // //     const fetchRegistrations = async () => {
// // // // // //       // Ensure user session exists
// // // // // //       const {
// // // // // //         data: { user },
// // // // // //       } = await supabase.auth.getUser();

// // // // // //       if (!user) {
// // // // // //         console.error("User not authenticated");
// // // // // //         setLoading(false);
// // // // // //         return;
// // // // // //       }

// // // // // //       const { data, error } = await supabase
// // // // // //         .from("event_registration")
// // // // // //         .select("*")
// // // // // //         .order("created_at", { ascending: false });

// // // // // //       console.log("Registrations response:", data, error);

// // // // // //       if (error) {
// // // // // //         console.error("Error fetching registrations:", error.message);
// // // // // //       } else {
// // // // // //         setData(data ?? []);
// // // // // //       }

// // // // // //       setLoading(false);
// // // // // //     };

// // // // // //     fetchRegistrations();
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <AdminLayout>
// // // // // //       <div className="p-10">
// // // // // //         <h1 className="text-3xl font-bold mb-6">Event Registrations</h1>

// // // // // //         {loading ? (
// // // // // //           <p>Loading…</p>
// // // // // //         ) : data.length === 0 ? (
// // // // // //           <p className="text-muted-foreground">
// // // // // //             No registrations found.
// // // // // //           </p>
// // // // // //         ) : (
// // // // // //           <div className="overflow-x-auto">
// // // // // //             <table className="w-full border border-collapse">
// // // // // //               <thead>
// // // // // //                 <tr className="bg-muted">
// // // // // //                   <th className="p-3 border">Name</th>
// // // // // //                   <th className="p-3 border">Email</th>
// // // // // //                   <th className="p-3 border">Phone</th>
// // // // // //                   <th className="p-3 border">State</th>
// // // // // //                   <th className="p-3 border">Country</th>
// // // // // //                   <th className="p-3 border">Date</th>
// // // // // //                 </tr>
// // // // // //               </thead>
// // // // // //               <tbody>
// // // // // //                 {data.map((r) => (
// // // // // //                   <tr key={r.id}>
// // // // // //                     <td className="p-3 border">{r.full_name}</td>
// // // // // //                     <td className="p-3 border">{r.email}</td>
// // // // // //                     <td className="p-3 border">{r.phone}</td>
// // // // // //                     <td className="p-3 border">{r.state}</td>
// // // // // //                     <td className="p-3 border">{r.country}</td>
// // // // // //                     <td className="p-3 border">
// // // // // //                       {new Date(r.created_at).toLocaleDateString()}
// // // // // //                     </td>
// // // // // //                   </tr>
// // // // // //                 ))}
// // // // // //               </tbody>
// // // // // //             </table>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </AdminLayout>
// // // // // //   );
// // // // // // }

// // // // import { useEffect, useState } from "react";
// // // // import Layout from "@/components/layout/Layout";
// // // // import { supabase } from "@/lib/supabase";
// // // // import { Button } from "@/components/ui/button";
// // // // import { useNavigate } from "react-router-dom";

// // // // type Registration = {
// // // //   id: string;
// // // //   full_name: string;
// // // //   email: string;
// // // //   phone: string;
// // // //   address: string;
// // // //   state: string;
// // // //   country: string;
// // // //   event_name: string;
// // // //   created_at: string;
// // // // };

// // // // export default function AdminRegistrations() {
// // // //   const [registrations, setRegistrations] = useState<Registration[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [role, setRole] = useState<"admin" | "staff" | null>(null);
// // // //   const navigate = useNavigate();

// // // //   useEffect(() => {
// // // //     checkAdminAccess();
// // // //   }, []);

// // // //   async function checkAdminAccess() {
// // // //     const {
// // // //       data: { user },
// // // //     } = await supabase.auth.getUser();

// // // //     if (!user) {
// // // //       navigate("/404");
// // // //       return;
// // // //     }

// // // //     const { data, error } = await supabase
// // // //       .from("admin_users")
// // // //       .select("role")
// // // //       .eq("email", user.email)
// // // //       .single();

// // // //     if (error || !data) {
// // // //       navigate("/404");
// // // //       return;
// // // //     }

// // // //     setRole(data.role);
// // // //     fetchRegistrations();
// // // //   }

// // // //   async function fetchRegistrations() {
// // // //     const { data, error } = await supabase
// // // //       // ✅ FIXED TABLE NAME
// // // //       .from("event_registration")
// // // //       .select("*")
// // // //       .order("created_at", { ascending: false });

// // // //     if (error) {
// // // //       console.error("Fetch error:", error.message);
// // // //     } else {
// // // //       setRegistrations(data ?? []);
// // // //     }

// // // //     setLoading(false);
// // // //   }

// // // //   async function deleteRegistration(id: string) {
// // // //     if (role !== "admin") return;

// // // //     const confirmDelete = confirm("Delete this registration?");
// // // //     if (!confirmDelete) return;

// // // //     await supabase
// // // //       .from("event_registration") // ✅ FIXED
// // // //       .delete()
// // // //       .eq("id", id);

// // // //     fetchRegistrations();
// // // //   }

// // // //   function exportToCSV() {
// // // //     const headers = [
// // // //       "Full Name",
// // // //       "Email",
// // // //       "Phone",
// // // //       "Address",
// // // //       "State",
// // // //       "Country",
// // // //       "Event",
// // // //       "Date",
// // // //     ];

// // // //     const rows = registrations.map((r) => [
// // // //       r.full_name,
// // // //       r.email,
// // // //       r.phone,
// // // //       r.address,
// // // //       r.state,
// // // //       r.country,
// // // //       r.event_name,
// // // //       new Date(r.created_at).toLocaleDateString(),
// // // //     ]);

// // // //     const csv = [headers, ...rows]
// // // //       .map((row) => row.map((v) => `"${v ?? ""}"`).join(","))
// // // //       .join("\n");

// // // //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// // // //     const url = window.URL.createObjectURL(blob);

// // // //     const a = document.createElement("a");
// // // //     a.href = url;
// // // //     a.download = "event_registrations.csv";
// // // //     a.click();
// // // //   }

// // // //   if (loading) {
// // // //     return (
// // // //       <Layout>
// // // //         <p className="text-center py-20">Loading admin data...</p>
// // // //       </Layout>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <Layout>
// // // //       <section className="section-padding bg-background">
// // // //         <div className="container-section">
// // // //           <div className="flex justify-between items-center mb-6">
// // // //             <h1 className="text-3xl font-serif font-bold">
// // // //               Event Registrations
// // // //             </h1>

// // // //             <Button variant="gold" onClick={exportToCSV}>
// // // //               Export to Excel
// // // //             </Button>
// // // //           </div>

// // // //           {registrations.length === 0 ? (
// // // //             <p className="text-muted-foreground">
// // // //               No registrations found.
// // // //             </p>
// // // //           ) : (
// // // //             <div className="overflow-x-auto">
// // // //               <table className="w-full border rounded-xl overflow-hidden">
// // // //                 <thead className="bg-muted">
// // // //                   <tr>
// // // //                     <th className="p-3 text-left">Name</th>
// // // //                     <th className="p-3 text-left">Email</th>
// // // //                     <th className="p-3 text-left">Phone</th>
// // // //                     <th className="p-3 text-left">Address</th>
// // // //                     <th className="p-3 text-left">Event</th>
// // // //                     <th className="p-3 text-left">Date</th>
// // // //                     {role === "admin" && <th className="p-3">Action</th>}
// // // //                   </tr>
// // // //                 </thead>

// // // //                 <tbody>
// // // //                   {registrations.map((r) => (
// // // //                     <tr key={r.id} className="border-t">
// // // //                       <td className="p-3">{r.full_name}</td>
// // // //                       <td className="p-3">{r.email}</td>
// // // //                       <td className="p-3">{r.phone}</td>
// // // //                       <td className="p-3">
// // // //                         {r.address}, {r.state}, {r.country}
// // // //                       </td>
// // // //                       <td className="p-3">{r.event_name}</td>
// // // //                       <td className="p-3">
// // // //                         {new Date(r.created_at).toLocaleDateString()}
// // // //                       </td>

// // // //                       {role === "admin" && (
// // // //                         <td className="p-3">
// // // //                           <Button
// // // //                             variant="destructive"
// // // //                             size="sm"
// // // //                             onClick={() => deleteRegistration(r.id)}
// // // //                           >
// // // //                             Delete
// // // //                           </Button>
// // // //                         </td>
// // // //                       )}
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </section>
// // // //     </Layout>
// // // //   );
// // // // }

// // // import { useEffect, useState } from "react";
// // // import Layout from "@/components/layout/Layout";
// // // import { supabase } from "@/lib/supabase";
// // // import { Button } from "@/components/ui/button";
// // // import { useNavigate } from "react-router-dom";

// // // type Registration = {
// // //   id: string;
// // //   first_name: string;
// // //   last_name: string;
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

// // //     if (!user || !user.email) {
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
// // //       "First Name",
// // //       "Last Name",
// // //       "Email",
// // //       "Phone",
// // //       "Address",
// // //       "State",
// // //       "Country",
// // //       "Event",
// // //       "Date",
// // //     ];

// // //     const rows = registrations.map((r) => [
// // //       r.first_name,
// // //       r.last_name,
// // //       r.email,
// // //       r.phone,
// // //       r.address,
// // //       r.state,
// // //       r.country,
// // //       r.event_name,
// // //       new Date(r.created_at).toLocaleDateString(),
// // //     ]);

// // //     const csv = [headers, ...rows]
// // //       .map((row) => row.map((v) => `"${v ?? ""}"`).join(","))
// // //       .join("\n");

// // //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// // //     const url = URL.createObjectURL(blob);

// // //     const a = document.createElement("a");
// // //     a.href = url;
// // //     a.download = "event_registrations.csv";
// // //     a.click();
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <Layout>
// // //         <p className="text-center py-20">Loading admin data…</p>
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
// // //                     <td className="p-3 font-medium">
// // //                       {r.first_name} {r.last_name}
// // //                     </td>
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

// // //
// // // import { useEffect, useState } from "react";
// // // import Layout from "@/components/layout/Layout";
// // // import { supabase } from "@/lib/supabase";
// // // import { Button } from "@/components/ui/button";
// // // import { useNavigate } from "react-router-dom";

// // // type Registration = {
// // //   id: string;
// // //   first_name: string;
// // //   last_name: string;
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
// // //       .from("event_registration") // ✅ CORRECT TABLE
// // //       .select("*")
// // //       .order("created_at", { ascending: false });

// // //     if (error) {
// // //       console.error("Fetch error:", error.message);
// // //     } else {
// // //       setRegistrations(data ?? []);
// // //     }

// // //     setLoading(false);
// // //   }

// // //   async function deleteRegistration(id: string) {
// // //     if (role !== "admin") return;

// // //     const confirmDelete = confirm("Delete this registration?");
// // //     if (!confirmDelete) return;

// // //     await supabase
// // //       .from("event_registration") // ✅ SAME TABLE
// // //       .delete()
// // //       .eq("id", id);

// // //     fetchRegistrations();
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
// // //           <h1 className="text-3xl font-serif font-bold mb-6 text-[#900020]">
// // //             Event Registrations List
// // //           </h1>

// // //           <div className="overflow-x-auto">
// // //             <table className="w-full border rounded-xl overflow-hidden">
// // //               <thead className="bg-muted">
// // //                 <tr>
// // //                   <th className="p-3 text-left">ID</th>
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
// // //                     <td className="p-3 text-xs text-muted-foreground">
// // //                       {r.id}
// // //                     </td>

// // //                     <td className="p-3 font-medium">
// // //                       {r.first_name} {r.last_name}
// // //                     </td>

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

// // //             {registrations.length === 0 && (
// // //               <p className="text-center text-muted-foreground py-10">
// // //                 No registrations found.
// // //               </p>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </section>
// // //     </Layout>
// // //   );
// // // }

// // // import { useEffect, useState } from "react";
// // // import { supabase } from "@/lib/supabase";
// // // import { Button } from "@/components/ui/button";
// // // import { useNavigate } from "react-router-dom";
// // // import AdminLayout from "@/pages/admin//AdminLayout"; // Wrap inside admin layout

// // // type Registration = {
// // //   id: string;
// // //   first_name: string;
// // //   last_name: string;
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
// // //       .from("event_registration") // ✅ Correct table
// // //       .select("*")
// // //       .order("created_at", { ascending: false });

// // //     if (error) {
// // //       console.error("Fetch error:", error.message);
// // //     } else {
// // //       setRegistrations(data ?? []);
// // //     }

// // //     setLoading(false);
// // //   }

// // //   async function deleteRegistration(id: string) {
// // //     if (role !== "admin") return;

// // //     const confirmDelete = confirm("Delete this registration?");
// // //     if (!confirmDelete) return;

// // //     await supabase
// // //       .from("event_registration")
// // //       .delete()
// // //       .eq("id", id);

// // //     fetchRegistrations();
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <AdminLayout>
// // //         <p className="text-center py-20">Loading admin data...</p>
// // //       </AdminLayout>
// // //     );
// // //   }

// // //   return (
// // //     <AdminLayout>
// // //       <section className="section-padding bg-background">
// // //         <div className="container-section">
// // //           <h1 className="text-3xl font-serif font-bold mb-6 text-[#900020]">
// // //             Event Registrations List
// // //           </h1>

// // //           <div className="overflow-x-auto">
// // //             <table className="w-full border rounded-xl overflow-hidden">
// // //               <thead className="bg-muted">
// // //                 <tr>
// // //                   <th className="p-3 text-left">ID</th>
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
// // //                     <td className="p-3 text-xs text-muted-foreground">{r.id}</td>
// // //                     <td className="p-3 font-medium">
// // //                       {r.first_name} {r.last_name}
// // //                     </td>
// // //                     <td className="p-3">{r.email}</td>
// // //                     <td className="p-3">{r.phone}</td>
// // //                     <td className="p-3">
// // //                       {r.address}, {r.state}, {r.country}
// // //                     </td>
// // //                     <td className="p-3">{r.event_name}</td>
// // //                     <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
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

// // //             {registrations.length === 0 && (
// // //               <p className="text-center text-muted-foreground py-10">
// // //                 No registrations found.
// // //               </p>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </section>
// // //     </AdminLayout>
// // //   );
// // // }


// // // import { useEffect, useState } from "react";
// // // import { supabase } from "@/lib/supabase";
// // // import AdminLayout from "./AdminLayout";
// // // import { Button } from "@/components/ui/button";

// // // interface Registration {
// // //   id: number;
// // //   full_name: string;
// // //   email: string;
// // //   phone: string;
// // //   event_name: string;
// // //   created_at: string;
// // // }

// // // export default function AdminRegistrations() {
// // //   const [registrations, setRegistrations] = useState<Registration[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   // NEW FEATURES
// // //   const [filterEvent, setFilterEvent] = useState("");
// // //   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

// // //   useEffect(() => {
// // //     fetchRegistrations();
// // //   }, []);

// // //   const fetchRegistrations = async () => {
// // //     setLoading(true);

// // //     const { data, error } = await supabase
// // //       .from("event_registration")
// // //       .select("*");

// // //     if (error) {
// // //       console.error(error);
// // //       alert("Failed to load registrations");
// // //     } else {
// // //       setRegistrations(data || []);
// // //     }

// // //     setLoading(false);
// // //   };

// // //   // FILTER + SORT LOGIC
// // //   const filteredRegistrations = registrations
// // //     .filter((r) =>
// // //       r.event_name
// // //         .toLowerCase()
// // //         .includes(filterEvent.toLowerCase())
// // //     )
// // //     .sort((a, b) => {
// // //       const dateA = new Date(a.created_at).getTime();
// // //       const dateB = new Date(b.created_at).getTime();
// // //       return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
// // //     });

// // //   return (
// // //     <AdminLayout>
// // //       <div className="p-10">
// // //         <h1 className="text-3xl font-bold mb-6">
// // //           Event Registrations
// // //         </h1>

// // //         {/* FILTER & SORT CONTROLS */}
// // //         <div className="flex flex-wrap gap-4 mb-6">
// // //           <input
// // //             type="text"
// // //             placeholder="Filter by event name"
// // //             className="p-2 border rounded w-64"
// // //             value={filterEvent}
// // //             onChange={(e) => setFilterEvent(e.target.value)}
// // //           />

// // //           <select
// // //             className="p-2 border rounded"
// // //             value={sortOrder}
// // //             onChange={(e) =>
// // //               setSortOrder(e.target.value as "asc" | "desc")
// // //             }
// // //           >
// // //             <option value="desc">Newest First</option>
// // //             <option value="asc">Oldest First</option>
// // //           </select>

// // //           <Button variant="secondary" onClick={fetchRegistrations}>
// // //             Refresh
// // //           </Button>
// // //         </div>

// // //         {/* TABLE */}
// // //         {loading ? (
// // //           <p>Loading registrations…</p>
// // //         ) : filteredRegistrations.length === 0 ? (
// // //           <p>No registrations found.</p>
// // //         ) : (
// // //           <div className="overflow-x-auto">
// // //             <table className="w-full border-collapse">
// // //               <thead>
// // //                 <tr className="bg-muted text-left">
// // //                   <th className="p-3 border">Name</th>
// // //                   <th className="p-3 border">Email</th>
// // //                   <th className="p-3 border">Phone</th>
// // //                   <th className="p-3 border">Event</th>
// // //                   <th className="p-3 border">Date</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {filteredRegistrations.map((r) => (
// // //                   <tr key={r.id} className="hover:bg-muted/50">
// // //                     <td className="p-3 border">{r.full_name}</td>
// // //                     <td className="p-3 border">{r.email}</td>
// // //                     <td className="p-3 border">{r.phone}</td>
// // //                     <td className="p-3 border">{r.event_name}</td>
// // //                     <td className="p-3 border">
// // //                       {new Date(r.created_at).toLocaleDateString()}
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </AdminLayout>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import { supabase } from "@/lib/supabase";
// // import AdminLayout from "./AdminLayout";
// // import { Button } from "@/components/ui/button";

// // interface Registration {
// //   id: string;
// //   first_name: string;
// //   last_name: string;
// //   email: string;
// //   phone: string;
// //   event_name: string;
// //   created_at: string;
// // }

// // export default function AdminRegistrations() {
// //   const [registrations, setRegistrations] = useState<Registration[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filterEvent, setFilterEvent] = useState("");
// //   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

// //   useEffect(() => {
// //     fetchRegistrations();
// //   }, []);

// //   /* ================= FETCH DATA ================= */
// //   const fetchRegistrations = async () => {
// //     setLoading(true);

// //     const { data, error } = await supabase
// //       .from("event_registration")
// //       .select("*");

// //     if (error) {
// //       console.error(error);
// //       alert("Failed to load registrations");
// //     } else {
// //       setRegistrations(data || []);
// //     }

// //     setLoading(false);
// //   };

// //   /* ================= FILTER + SORT ================= */
// //   const filteredRegistrations = registrations
// //     .filter((r) =>
// //       r.event_name.toLowerCase().includes(filterEvent.toLowerCase())
// //     )
// //     .sort((a, b) => {
// //       const aDate = new Date(a.created_at).getTime();
// //       const bDate = new Date(b.created_at).getTime();
// //       return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
// //     });

// //   /* ================= EXCEL (CSV) EXPORT ================= */
// //   const exportToExcel = () => {
// //     const headers = [
// //       "ID",
// //       "First Name",
// //       "Last Name",
// //       "Email",
// //       "Phone",
// //       "Event",
// //       "Date",
// //     ];

// //     const rows = filteredRegistrations.map((r) => [
// //       r.id,
// //       r.first_name,
// //       r.last_name,
// //       r.email,
// //       r.phone,
// //       r.event_name,
// //       new Date(r.created_at).toLocaleDateString(),
// //     ]);

// //     const csvContent =
// //       [headers, ...rows]
// //         .map((row) => row.map((v) => `"${v}"`).join(","))
// //         .join("\n");

// //     const blob = new Blob([csvContent], {
// //       type: "text/csv;charset=utf-8;",
// //     });

// //     const url = URL.createObjectURL(blob);
// //     const link = document.createElement("a");
// //     link.href = url;
// //     link.download = "event_registrations.csv";
// //     link.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   /* ================= ADMIN DELETE ================= */
// //   const deleteRegistration = async (id: string) => {
// //     const confirmDelete = window.confirm(
// //       "Are you sure you want to delete this registration?"
// //     );

// //     if (!confirmDelete) return;

// //     const { error } = await supabase
// //       .from("event_registration")
// //       .delete()
// //       .eq("id", id);

// //     if (error) {
// //       alert("Failed to delete registration");
// //       console.error(error);
// //     } else {
// //       fetchRegistrations();
// //     }
// //   };

// //   return (
// //     <AdminLayout>
// //       <div className="p-10">
// //         {/* HEADER */}
// //         <div className="flex items-center justify-between mb-6">
// //           <h1 className="text-3xl font-bold">Event Registrations</h1>

// //           <Button variant="gold" onClick={exportToExcel}>
// //             Export to Excel
// //           </Button>
// //         </div>

// //         {/* FILTERS */}
// //         <div className="flex flex-wrap gap-4 mb-6">
// //           <input
// //             type="text"
// //             placeholder="Filter by event name"
// //             className="p-2 border rounded w-64"
// //             value={filterEvent}
// //             onChange={(e) => setFilterEvent(e.target.value)}
// //           />

// //           <select
// //             className="p-2 border rounded"
// //             value={sortOrder}
// //             onChange={(e) =>
// //               setSortOrder(e.target.value as "asc" | "desc")
// //             }
// //           >
// //             <option value="desc">Newest First</option>
// //             <option value="asc">Oldest First</option>
// //           </select>

// //           <Button variant="secondary" onClick={fetchRegistrations}>
// //             Refresh
// //           </Button>
// //         </div>

// //         {/* TABLE */}
// //         {loading ? (
// //           <p>Loading registrations…</p>
// //         ) : filteredRegistrations.length === 0 ? (
// //           <p>No registrations found.</p>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse">
// //               <thead>
// //                 <tr className="bg-muted text-left">
// //                   <th className="p-3 border">ID</th>
// //                   <th className="p-3 border">Name</th>
// //                   <th className="p-3 border">Email</th>
// //                   <th className="p-3 border">Phone</th>
// //                   <th className="p-3 border">Event</th>
// //                   <th className="p-3 border">Date</th>
// //                   <th className="p-3 border">Action</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {filteredRegistrations.map((r) => (
// //                   <tr key={r.id} className="hover:bg-muted/50">
// //                     <td className="p-3 border text-xs text-muted-foreground">
// //                       {r.id.slice(0, 8)}
// //                     </td>
// //                     <td className="p-3 border font-medium">
// //                       {r.first_name} {r.last_name}
// //                     </td>
// //                     <td className="p-3 border">{r.email}</td>
// //                     <td className="p-3 border">{r.phone}</td>
// //                     <td className="p-3 border">{r.event_name}</td>
// //                     <td className="p-3 border">
// //                       {new Date(r.created_at).toLocaleDateString()}
// //                     </td>
// //                     <td className="p-3 border">
// //                       <Button
// //                         variant="destructive"
// //                         size="sm"
// //                         onClick={() => deleteRegistration(r.id)}
// //                       >
// //                         Delete
// //                       </Button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //     </AdminLayout>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import AdminLayout from "./AdminLayout";
// import { Button } from "@/components/ui/button";

// interface Registration {
//   id: number; // ✅ NUMBER — matches Supabase
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   event_name: string;
//   created_at: string;
// }

// export default function AdminRegistrations() {
//   const [registrations, setRegistrations] = useState<Registration[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterEvent, setFilterEvent] = useState("");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

//   useEffect(() => {
//     fetchRegistrations();
//   }, []);

//   const fetchRegistrations = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("event_registration")
//       .select("*");

//     if (error) {
//       console.error(error);
//       alert("Failed to load registrations");
//     } else {
//       setRegistrations(data || []);
//     }

//     setLoading(false);
//   };

//   const filteredRegistrations = registrations
//     .filter((r) =>
//       r.event_name.toLowerCase().includes(filterEvent.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aDate = new Date(a.created_at).getTime();
//       const bDate = new Date(b.created_at).getTime();
//       return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
//     });

//   /* ================= EXCEL EXPORT ================= */
//   const exportToExcel = () => {
//     const headers = [
//       "ID",
//       "First Name",
//       "Last Name",
//       "Email",
//       "Phone",
//       "Event",
//       "Date",
//     ];

//     const rows = filteredRegistrations.map((r) => [
//       r.id,
//       r.first_name,
//       r.last_name,
//       r.email,
//       r.phone,
//       r.event_name,
//       new Date(r.created_at).toLocaleDateString(),
//     ]);

//     const csv =
//       [headers, ...rows]
//         .map((row) => row.map((v) => `"${v}"`).join(","))
//         .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "event_registrations.csv";
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   /* ================= DELETE ================= */
//   const deleteRegistration = async (id: number) => {
//     if (!confirm("Delete this registration?")) return;

//     const { error } = await supabase
//       .from("event_registration")
//       .delete()
//       .eq("id", id);

//     if (error) {
//       console.error(error);
//       alert("Delete failed");
//     } else {
//       fetchRegistrations();
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="p-10">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Event Registrations</h1>

//           <Button variant="gold" onClick={exportToExcel}>
//             Export to Excel
//           </Button>
//         </div>

//         <div className="flex gap-4 mb-6">
//           <input
//             className="p-2 border rounded w-64"
//             placeholder="Filter by event"
//             value={filterEvent}
//             onChange={(e) => setFilterEvent(e.target.value)}
//           />

//           <select
//             className="p-2 border rounded"
//             value={sortOrder}
//             onChange={(e) =>
//               setSortOrder(e.target.value as "asc" | "desc")
//             }
//           >
//             <option value="desc">Newest First</option>
//             <option value="asc">Oldest First</option>
//           </select>

//           <Button variant="secondary" onClick={fetchRegistrations}>
//             Refresh
//           </Button>
//         </div>

//         {loading ? (
//           <p>Loading…</p>
//         ) : filteredRegistrations.length === 0 ? (
//           <p>No registrations found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-muted">
//                   <th className="p-3 border">ID</th>
//                   <th className="p-3 border">Name</th>
//                   <th className="p-3 border">Email</th>
//                   <th className="p-3 border">Phone</th>
//                   <th className="p-3 border">Event</th>
//                   <th className="p-3 border">Date</th>
//                   <th className="p-3 border">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredRegistrations.map((r) => (
//                   <tr key={r.id}>
//                     <td className="p-3 border">{r.id}</td>
//                     <td className="p-3 border font-medium">
//                       {r.first_name} {r.last_name}
//                     </td>
//                     <td className="p-3 border">{r.email}</td>
//                     <td className="p-3 border">{r.phone}</td>
//                     <td className="p-3 border">{r.event_name}</td>
//                     <td className="p-3 border">
//                       {new Date(r.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="p-3 border">
//                       <Button
//                         size="sm"
//                         variant="destructive"
//                         onClick={() => deleteRegistration(r.id)}
//                       >
//                         Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import AdminLayout from "./AdminLayout";
// import { Button } from "@/components/ui/button";

// interface Registration {
//   id: string;              // uuid
//   first_name: string;      // ✅ real columns
//   last_name: string;
//   email: string;
//   phone: string;
//   event_name: string;
//   created_at: string;
// }

// export default function AdminRegistrations() {
//   const [registrations, setRegistrations] = useState<Registration[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRegistrations();
//   }, []);

//   /* ================= FETCH ================= */
//   const fetchRegistrations = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("event_registration")   // ✅ correct table
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Fetch error:", error);
//       alert("Failed to load registrations");
//     } else {
//       setRegistrations(data || []);
//     }

//     setLoading(false);
//   };

//   /* ================= DELETE ================= */
//   const deleteRegistration = async (id: string) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this registration?"
//     );
//     if (!confirmDelete) return;

//     const { error } = await supabase
//       .from("event_registration")
//       .delete()
//       .eq("id", id);

//     if (error) {
//       console.error("Delete failed:", error);
//       alert("Delete failed. Check admin permission.");
//       return;
//     }

//     // remove locally for instant UI update
//     setRegistrations((prev) =>
//       prev.filter((r) => r.id !== id)
//     );
//   };

//   return (
//     <AdminLayout>
//       <div className="p-10">
//         <h1 className="text-3xl font-bold mb-6">
//           Event Registrations
//         </h1>

//         {loading ? (
//           <p>Loading registrations…</p>
//         ) : registrations.length === 0 ? (
//           <p>No registrations found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-muted text-left">
//                   <th className="p-3 border">ID</th>
//                   <th className="p-3 border">Name</th>
//                   <th className="p-3 border">Email</th>
//                   <th className="p-3 border">Phone</th>
//                   <th className="p-3 border">Event</th>
//                   <th className="p-3 border">Date</th>
//                   <th className="p-3 border">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {registrations.map((r) => (
//                   <tr key={r.id} className="hover:bg-muted/50">
//                     <td className="p-3 border text-xs">
//                       {r.id}
//                     </td>

//                     {/* ✅ NAME FIXED */}
//                     <td className="p-3 border font-medium">
//                       {r.first_name} {r.last_name}
//                     </td>

//                     <td className="p-3 border">{r.email}</td>
//                     <td className="p-3 border">{r.phone}</td>
//                     <td className="p-3 border">{r.event_name}</td>
//                     <td className="p-3 border">
//                       {new Date(r.created_at).toLocaleDateString()}
//                     </td>

//                     <td className="p-3 border">
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => deleteRegistration(r.id)}
//                       >
//                         Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  event_name: string;
  created_at: string;
}

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 FILTER + SORT STATE */
  const [filterEvent, setFilterEvent] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  /* ================= FETCH ================= */
  const fetchRegistrations = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("event_registration")
      .select("*")
      .order("created_at", { ascending: sortOrder === "asc" });

    if (error) {
      console.error("Fetch error:", error);
      alert("Failed to load registrations");
    } else {
      setRegistrations(data || []);
    }

    setLoading(false);
  };

  /* ================= DELETE ================= */
  const deleteRegistration = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this registration?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("event_registration")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete failed:", error);
      alert("Delete failed. Check admin permission.");
      return;
    }

    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  /* ================= FILTER + SORT ================= */
  const filteredRegistrations = registrations
    .filter((r) =>
      r.event_name.toLowerCase().includes(filterEvent.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  /* ================= EXPORT ================= */
  const exportToExcel = () => {
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Event",
      "Date",
    ];

    const rows = filteredRegistrations.map((r) => [
      r.id,
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      r.event_name,
      new Date(r.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "event_registrations.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Event Registrations</h1>

          <Button variant="secondary" onClick={exportToExcel}>
            Export to Excel
          </Button>
        </div>

        {/* 🔹 FILTER & SORT CONTROLS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by event name"
            className="p-2 border rounded w-64"
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
          />

          <select
            className="p-2 border rounded"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "asc" | "desc")
            }
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <Button variant="outline" onClick={fetchRegistrations}>
            Refresh
          </Button>
        </div>

        {/* 🔹 TABLE */}
        {loading ? (
          <p>Loading registrations…</p>
        ) : filteredRegistrations.length === 0 ? (
          <p>No registrations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="p-3 border">ID</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Event</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRegistrations.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/50">
                    <td className="p-3 border text-xs">{r.id}</td>

                    <td className="p-3 border font-medium">
                      {r.first_name} {r.last_name}
                    </td>

                    <td className="p-3 border">{r.email}</td>
                    <td className="p-3 border">{r.phone}</td>
                    <td className="p-3 border">{r.event_name}</td>
                    <td className="p-3 border">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-3 border">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRegistration(r.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
