import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Trash2 } from "lucide-react";

import AdminLayout from "./AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SummitRegistration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  country: string;
  occupation: string;
  organization: string | null;
  expectations: string | null;
  created_at: string;
}

export default function AdminSummitRegistrations() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<SummitRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    void fetchRegistrations();
  }, [sortOrder]);

  const fetchRegistrations = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("summit_2026_registrations")
      .select("*")
      .order("created_at", { ascending: sortOrder === "asc" });

    if (error) {
      toast({
        title: "Unable to load summit registrations",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setRegistrations(data || []);
    setLoading(false);
  };

  const deleteRegistration = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this summit registration?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    const { error } = await supabase.from("summit_2026_registrations").delete().eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      setDeletingId(null);
      return;
    }

    setRegistrations((current) => current.filter((registration) => registration.id !== id));
    setDeletingId(null);
    toast({
      title: "Summit registration deleted",
    });
  };

  const filteredRegistrations = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return registrations;
    }

    return registrations.filter((registration) =>
      [
        registration.first_name,
        registration.last_name,
        registration.email,
        registration.phone,
        registration.state,
        registration.country,
        registration.occupation,
        registration.organization || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedTerm),
    );
  }, [registrations, searchTerm]);

  const exportToCsv = () => {
    const headers = [
      "No",
      "Database ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Address",
      "State",
      "Country",
      "Occupation",
      "Organization",
      "Expectations",
      "Date",
    ];

    const rows = filteredRegistrations.map((registration, index) => [
      index + 1,
      registration.id,
      registration.first_name,
      registration.last_name,
      registration.email,
      registration.phone,
      registration.address,
      registration.state,
      registration.country,
      registration.occupation,
      registration.organization || "",
      registration.expectations || "",
      new Date(registration.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "summit_2026_registrations.csv";
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: "CSV exported",
      description: "The summit registrations export has been downloaded.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Summit 2026 Registrations</h1>
            <p className="text-muted-foreground">
              Review Northern Women Summit 2026 signups in their own admin table.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={exportToCsv} disabled={filteredRegistrations.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => void fetchRegistrations()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search by attendee, email, phone, location, or occupation.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search summit registrations"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as "asc" | "desc")}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrations</CardTitle>
            <CardDescription>{filteredRegistrations.length} records in the current view.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading summit registrations...</p>
            ) : filteredRegistrations.length === 0 ? (
              <p className="text-muted-foreground">No summit registrations found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="border p-3">No.</th>
                      <th className="border p-3">Name</th>
                      <th className="border p-3">Email</th>
                      <th className="border p-3">Phone</th>
                      <th className="border p-3">Location</th>
                      <th className="border p-3">Occupation</th>
                      <th className="border p-3">Organization</th>
                      <th className="border p-3">Expectations</th>
                      <th className="border p-3">Date</th>
                      <th className="border p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((registration, index) => (
                      <tr key={registration.id} className="hover:bg-muted/50">
                        <td className="border p-3 font-medium">{index + 1}</td>
                        <td className="border p-3 font-medium">
                          {registration.first_name} {registration.last_name}
                        </td>
                        <td className="border p-3">{registration.email}</td>
                        <td className="border p-3">{registration.phone}</td>
                        <td className="border p-3">
                          {registration.state}, {registration.country}
                        </td>
                        <td className="border p-3">{registration.occupation}</td>
                        <td className="border p-3">{registration.organization || "-"}</td>
                        <td className="border p-3">{registration.expectations || "-"}</td>
                        <td className="border p-3">
                          {new Date(registration.created_at).toLocaleDateString()}
                        </td>
                        <td className="border p-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === registration.id}
                            onClick={() => void deleteRegistration(registration.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === registration.id ? "Deleting..." : "Delete"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
