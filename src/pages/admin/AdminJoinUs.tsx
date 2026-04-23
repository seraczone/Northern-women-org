import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Trash2 } from "lucide-react";

import AdminLayout from "./AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface JoinUsSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  local_government: string;
  town_city: string;
  occupation: string;
  residential_address: string;
  date_of_birth: string;
  state: string;
  country: string;
  message: string | null;
  created_at: string;
}

export default function AdminJoinUs() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<JoinUsSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    void fetchSubmissions();
  }, [sortOrder]);

  const fetchSubmissions = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("join_us_registrations")
      .select("*")
      .order("created_at", { ascending: sortOrder === "asc" });

    if (error) {
      toast({
        title: "Unable to load Join Us records",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setSubmissions(data || []);
    setLoading(false);
  };

  const deleteSubmission = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this Join Us record?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    const { error } = await supabase.from("join_us_registrations").delete().eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      setDeletingId(null);
      return;
    }

    setSubmissions((current) => current.filter((submission) => submission.id !== id));
    setDeletingId(null);
    toast({
      title: "Join Us record deleted",
    });
  };

  const filteredSubmissions = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return submissions;
    }

    return submissions.filter((submission) =>
      [
        submission.first_name,
        submission.last_name,
        submission.email,
        submission.local_government,
        submission.town_city,
        submission.occupation,
        submission.state,
        submission.country,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedTerm),
    );
  }, [submissions, searchTerm]);

  const exportToCsv = () => {
    const headers = [
      "No",
      "Database ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Local Government",
      "Town/City",
      "Occupation",
      "Residential Address",
      "Date of Birth",
      "State",
      "Country",
      "Message",
      "Date",
    ];

    const rows = filteredSubmissions.map((submission, index) => [
      index + 1,
      submission.id,
      submission.first_name,
      submission.last_name,
      submission.email,
      submission.phone,
      submission.local_government,
      submission.town_city,
      submission.occupation,
      submission.residential_address,
      submission.date_of_birth,
      submission.state,
      submission.country,
      submission.message || "",
      new Date(submission.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "join_us_registrations.csv";
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: "CSV exported",
      description: "The Join Us export has been downloaded.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Join Us Registrations</h1>
            <p className="text-muted-foreground">
              Review dedicated Join Us submissions separately from event registrations.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={exportToCsv} disabled={filteredSubmissions.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => void fetchSubmissions()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search by name, email, location, or occupation.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search Join Us registrations"
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
            <CardTitle>Submissions</CardTitle>
            <CardDescription>{filteredSubmissions.length} records in the current view.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading Join Us registrations...</p>
            ) : filteredSubmissions.length === 0 ? (
              <p className="text-muted-foreground">No Join Us registrations found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="border p-3">No.</th>
                      <th className="border p-3">Name</th>
                      <th className="border p-3">Email</th>
                      <th className="border p-3">Phone</th>
                      <th className="border p-3">Local Government</th>
                      <th className="border p-3">Town/City</th>
                      <th className="border p-3">Occupation</th>
                      <th className="border p-3">Address</th>
                      <th className="border p-3">Date of Birth</th>
                      <th className="border p-3">Location</th>
                      <th className="border p-3">Message</th>
                      <th className="border p-3">Date</th>
                      <th className="border p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission, index) => (
                      <tr key={submission.id} className="hover:bg-muted/50">
                        <td className="border p-3 font-medium">{index + 1}</td>
                        <td className="border p-3 font-medium">
                          {submission.first_name} {submission.last_name}
                        </td>
                        <td className="border p-3">{submission.email}</td>
                        <td className="border p-3">{submission.phone}</td>
                        <td className="border p-3">{submission.local_government}</td>
                        <td className="border p-3">{submission.town_city}</td>
                        <td className="border p-3">{submission.occupation}</td>
                        <td className="border p-3">{submission.residential_address}</td>
                        <td className="border p-3">
                          {new Date(submission.date_of_birth).toLocaleDateString()}
                        </td>
                        <td className="border p-3">
                          {submission.town_city}, {submission.state}, {submission.country}
                        </td>
                        <td className="border p-3">{submission.message || "-"}</td>
                        <td className="border p-3">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </td>
                        <td className="border p-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === submission.id}
                            onClick={() => void deleteSubmission(submission.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === submission.id ? "Deleting..." : "Delete"}
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
