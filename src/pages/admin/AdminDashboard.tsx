import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

import AdminLayout from "./AdminLayout";

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
  const [registrationCount, setRegistrationCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    const [recentRegistrationsResponse, recentQuotesResponse, registrationCountResponse, quoteCountResponse] =
      await Promise.all([
        supabase
          .from("event_registration")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("weekly_quotes")
          .select("*")
          .order("year", { ascending: false })
          .order("week_number", { ascending: false })
          .limit(5),
        supabase
          .from("event_registration")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("weekly_quotes")
          .select("*", { count: "exact", head: true }),
      ]);

    setRegistrations(recentRegistrationsResponse.data || []);
    setQuotes(recentQuotesResponse.data || []);
    setRegistrationCount(registrationCountResponse.count || 0);
    setQuoteCount(quoteCountResponse.count || 0);
    setLoading(false);
  };

  const deleteRegistration = async (id: string) => {
    if (!window.confirm("Delete this registration?")) return;
    await supabase.from("event_registration").delete().eq("id", id);
    void fetchDashboardData();
  };

  const deleteQuote = async (id: number) => {
    if (!window.confirm("Delete this quote?")) return;
    await supabase.from("weekly_quotes").delete().eq("id", id);
    void fetchDashboardData();
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-10">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10 p-10">
        <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-muted p-6 text-center shadow">
            <p>Total Registrations</p>
            <p className="text-3xl font-bold">{registrationCount}</p>
          </div>
          <div className="rounded-xl bg-muted p-6 text-center shadow">
            <p>Total Weekly Quotes</p>
            <p className="text-3xl font-bold">{quoteCount}</p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Recent Registrations</h2>
          {registrations.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            <table className="mb-6 w-full overflow-hidden rounded-xl border">
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
                {registrations.map((registration) => (
                  <tr key={registration.id} className="border-t">
                    <td className="p-2">
                      {registration.first_name} {registration.last_name}
                    </td>
                    <td className="p-2">{registration.email}</td>
                    <td className="p-2">{registration.event_name}</td>
                    <td className="p-2">{new Date(registration.created_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void deleteRegistration(registration.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Recent Quotes</h2>
          {quotes.length === 0 ? (
            <p>No quotes yet.</p>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="flex justify-between rounded bg-card p-4 shadow">
                  <div>
                    <p className="font-medium">{quote.quote_text}</p>
                    {quote.author && <p className="text-sm">- {quote.author}</p>}
                    <p className="text-xs text-muted-foreground">
                      Week {quote.week_number}, {quote.year}
                    </p>
                  </div>
                  <div>
                    <Button size="sm" variant="destructive" onClick={() => void deleteQuote(quote.id)}>
                      Delete
                    </Button>
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
