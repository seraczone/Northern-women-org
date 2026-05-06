import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Trash2 } from "lucide-react";

import AdminLayout from "./AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminNewsletter() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    void fetchSubscribers();
  }, [sortOrder]);

  const fetchSubscribers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: sortOrder === "asc" });

    if (error) {
      toast({
        title: "Unable to load newsletter subscribers",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setSubscribers(data || []);
    setLoading(false);
  };

  const deleteSubscriber = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this newsletter subscriber?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      setDeletingId(null);
      return;
    }

    setSubscribers((current) => current.filter((subscriber) => subscriber.id !== id));
    setDeletingId(null);
    toast({
      title: "Newsletter subscriber deleted",
    });
  };

  const filteredSubscribers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return subscribers;
    }

    return subscribers.filter((subscriber) =>
      [subscriber.email, subscriber.source, subscriber.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedTerm),
    );
  }, [subscribers, searchTerm]);

  const exportToCsv = () => {
    const headers = ["No", "Database ID", "Email", "Source", "Status", "Subscribed Date", "Updated Date"];

    const rows = filteredSubscribers.map((subscriber, index) => [
      index + 1,
      subscriber.id,
      subscriber.email,
      subscriber.source,
      subscriber.status,
      new Date(subscriber.created_at).toLocaleDateString(),
      new Date(subscriber.updated_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "newsletter_subscribers.csv";
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: "CSV exported",
      description: "The newsletter subscribers export has been downloaded.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
            <p className="text-muted-foreground">
              Review newsletter signups, export the list, and remove subscribers when needed.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={exportToCsv} disabled={filteredSubscribers.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => void fetchSubscribers()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search by email, source, or subscription status.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search newsletter subscribers"
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
            <CardTitle>Subscribers</CardTitle>
            <CardDescription>{filteredSubscribers.length} records in the current view.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading newsletter subscribers...</p>
            ) : filteredSubscribers.length === 0 ? (
              <p className="text-muted-foreground">No newsletter subscribers found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="border p-3">No.</th>
                      <th className="border p-3">Email</th>
                      <th className="border p-3">Source</th>
                      <th className="border p-3">Status</th>
                      <th className="border p-3">Subscribed</th>
                      <th className="border p-3">Updated</th>
                      <th className="border p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber, index) => (
                      <tr key={subscriber.id} className="hover:bg-muted/50">
                        <td className="border p-3 font-medium">{index + 1}</td>
                        <td className="border p-3">{subscriber.email}</td>
                        <td className="border p-3">{subscriber.source}</td>
                        <td className="border p-3">{subscriber.status}</td>
                        <td className="border p-3">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </td>
                        <td className="border p-3">
                          {new Date(subscriber.updated_at).toLocaleDateString()}
                        </td>
                        <td className="border p-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === subscriber.id}
                            onClick={() => void deleteSubscriber(subscriber.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === subscriber.id ? "Deleting..." : "Delete"}
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
