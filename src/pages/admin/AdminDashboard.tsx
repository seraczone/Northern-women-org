// // import { useEffect, useState } from "react";
// // import { supabase } from "@/lib/supabase";
// // import AdminLayout from "./AdminLayout";

// // export default function AdminDashboard() {
// //   const [count, setCount] = useState(0);

// //   useEffect(() => {
// //     supabase
// //       .from("event_registration")
// //       .select("*", { count: "exact", head: true })
// //       .then(({ count }) => {
// //         if (count) setCount(count);
// //       });
// //   }, []);

// //   return (
// //     <AdminLayout>
// //       <div className="p-10">
// //         <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

// //         <div className="bg-muted p-6 rounded-xl w-fit">
// //           <p className="text-lg">Total Registrations</p>
// //           <p className="text-4xl font-bold">{count}</p>
// //         </div>
// //       </div>
// //     </AdminLayout>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import AdminLayout from "@/pages/admin/AdminLayout"; // make sure path is correct

// export default function AdminDashboard() {
//   const [count, setCount] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchCount = async () => {
//       setLoading(true);
//       // Use head: true to get count without fetching all rows
//       const { count, error } = await supabase
//         .from("event_registration")
//         .select("*", { count: "exact", head: true });

//       if (error) {
//         console.error("Error fetching registration count:", error);
//       } else {
//         setCount(count || 0);
//       }
//       setLoading(false);
//     };

//     fetchCount();
//   }, []);

//   return (
//     <AdminLayout>
//       <div className="p-10">
//         <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//         <div className="bg-muted p-6 rounded-xl w-fit">
//           <p className="text-lg">Total Registrations</p>
//           <p className="text-4xl font-bold">
//             {loading ? "Loading..." : count}
//           </p>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";

interface Quote {
  id: number;
  quote_text: string;
  author?: string;
  week_number: number;
  year: number;
}

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  event_name: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: regData } = await supabase
      .from("event_registration")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: quoteData } = await supabase
      .from("weekly_quotes")
      .select("*")
      .order("week_number", { ascending: false })
      .limit(5);

    setRegistrations(regData || []);
    setQuotes(quoteData || []);
    setLoading(false);
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    await supabase.from("event_registration").delete().eq("id", id);
    fetchDashboardData();
  };

  const deleteQuote = async (id: number) => {
    if (!confirm("Delete this quote?")) return;
    await supabase.from("weekly_quotes").delete().eq("id", id);
    fetchDashboardData();
  };

  if (loading) return <AdminLayout><p>Loading dashboard…</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-10 space-y-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-muted p-6 rounded-xl text-center shadow">
            <p>Total Registrations</p>
            <p className="text-3xl font-bold">{registrations.length}</p>
          </div>
          <div className="bg-muted p-6 rounded-xl text-center shadow">
            <p>Total Weekly Quotes</p>
            <p className="text-3xl font-bold">{quotes.length}</p>
          </div>
        </div>

        {/* Recent Registrations */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Registrations</h2>
          {registrations.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            <table className="w-full border rounded-xl overflow-hidden mb-6">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Event</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.first_name} {r.last_name}</td>
                    <td className="p-2">{r.email}</td>
                    <td className="p-2">{r.event_name}</td>
                    <td className="p-2">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Button size="sm" variant="destructive" onClick={() => deleteRegistration(r.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Quotes */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Quotes</h2>
          {quotes.length === 0 ? (
            <p>No quotes yet.</p>
          ) : (
            <div className="space-y-4">
              {quotes.map((q) => (
                <div key={q.id} className="flex justify-between p-4 bg-card rounded shadow">
                  <div>
                    <p className="font-medium">{q.quote_text}</p>
                    {q.author && <p className="text-sm">— {q.author}</p>}
                    <p className="text-xs text-muted-foreground">
                      Week {q.week_number}, {q.year}
                    </p>
                  </div>
                  <div>
                    <Button size="sm" variant="destructive" onClick={() => deleteQuote(q.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
