import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Trash2 } from "lucide-react";

import AdminLayout from "./AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface VolunteerApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string | null;
  created_at: string;
}

export default function AdminGetInvolved() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    void fetchApplications();
  }, [sortOrder]);

  const fetchApplications = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("volunteer_applications")
      .select("*")
      .order("created_at", { ascending: sortOrder === "asc" });

    if (error) {
      toast({
        title: "Unable to load volunteer applications",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setApplications(data || []);
    setLoading(false);
  };

  const deleteApplication = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this volunteer application?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    const { error } = await supabase.from("volunteer_applications").delete().eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      setDeletingId(null);
      return;
    }

    setApplications((current) => current.filter((application) => application.id !== id));
    setDeletingId(null);
    toast({
      title: "Volunteer application deleted",
    });
  };

  const filteredApplications = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return applications;
    }

    return applications.filter((application) =>
      [
        application.first_name,
        application.last_name,
        application.email,
        application.phone,
        application.message || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedTerm),
    );
  }, [applications, searchTerm]);

  const exportToCsv = () => {
    const headers = [
      "No",
      "Database ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Message",
      "Date",
    ];

    const rows = filteredApplications.map((application, index) => [
      index + 1,
      application.id,
      application.first_name,
      application.last_name,
      application.email,
      application.phone,
      application.message || "",
      new Date(application.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "volunteer_applications.csv";
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: "CSV exported",
      description: "The volunteer applications export has been downloaded.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Get Involved Applications</h1>
            <p className="text-muted-foreground">
              Review volunteer applications separately from Join Us and event registrations.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={exportToCsv} disabled={filteredApplications.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => void fetchApplications()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search by name, email, phone, or message content.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search volunteer applications"
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
            <CardTitle>Applications</CardTitle>
            <CardDescription>{filteredApplications.length} records in the current view.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading volunteer applications...</p>
            ) : filteredApplications.length === 0 ? (
              <p className="text-muted-foreground">No volunteer applications found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="border p-3">No.</th>
                      <th className="border p-3">Name</th>
                      <th className="border p-3">Email</th>
                      <th className="border p-3">Phone</th>
                      <th className="border p-3">Message</th>
                      <th className="border p-3">Date</th>
                      <th className="border p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application, index) => (
                      <tr key={application.id} className="hover:bg-muted/50">
                        <td className="border p-3 font-medium">{index + 1}</td>
                        <td className="border p-3 font-medium">
                          {application.first_name} {application.last_name}
                        </td>
                        <td className="border p-3">{application.email}</td>
                        <td className="border p-3">{application.phone}</td>
                        <td className="border p-3">{application.message || "-"}</td>
                        <td className="border p-3">
                          {new Date(application.created_at).toLocaleDateString()}
                        </td>
                        <td className="border p-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === application.id}
                            onClick={() => void deleteApplication(application.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === application.id ? "Deleting..." : "Delete"}
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
