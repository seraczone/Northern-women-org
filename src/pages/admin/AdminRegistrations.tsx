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
