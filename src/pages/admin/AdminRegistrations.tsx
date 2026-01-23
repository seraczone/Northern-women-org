import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Registration = {
  id: string;
  full_name: string;
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
      .from("event_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRegistrations(data);
    }
    setLoading(false);
  }

  async function deleteRegistration(id: string) {
    if (role !== "admin") return;

    const confirmDelete = confirm("Delete this registration?");
    if (!confirmDelete) return;

    await supabase.from("event_registrations").delete().eq("id", id);
    fetchRegistrations();
  }

  function exportToCSV() {
    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "Address",
      "State",
      "Country",
      "Event",
      "Date",
    ];

    const rows = registrations.map((r) => [
      r.full_name,
      r.email,
      r.phone,
      r.address,
      r.state,
      r.country,
      r.event_name,
      new Date(r.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "event_registrations.csv";
    a.click();
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif font-bold">
              Event Registrations
            </h1>

            <Button variant="gold" onClick={exportToCSV}>
              Export to Excel
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-muted">
                <tr>
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
                    <td className="p-3">{r.full_name}</td>
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
          </div>
        </div>
      </section>
    </Layout>
  );
}
