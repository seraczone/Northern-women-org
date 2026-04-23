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

interface SummitRegistration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  occupation: string;
  created_at: string;
}

interface JoinUsRegistration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  occupation: string;
  created_at: string;
}

interface VolunteerApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [summitRegistrations, setSummitRegistrations] = useState<SummitRegistration[]>([]);
  const [joinUsRegistrations, setJoinUsRegistrations] = useState<JoinUsRegistration[]>([]);
  const [volunteerApplications, setVolunteerApplications] = useState<VolunteerApplication[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [summitRegistrationCount, setSummitRegistrationCount] = useState(0);
  const [joinUsCount, setJoinUsCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    const [
      recentRegistrationsResponse,
      recentSummitRegistrationsResponse,
      recentJoinUsResponse,
      recentVolunteerApplicationsResponse,
      recentQuotesResponse,
      registrationCountResponse,
      summitRegistrationCountResponse,
      joinUsCountResponse,
      volunteerCountResponse,
      quoteCountResponse,
    ] =
      await Promise.all([
        supabase
          .from("event_registration")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("summit_2026_registrations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("join_us_registrations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("volunteer_applications")
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
          .from("summit_2026_registrations")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("join_us_registrations")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("volunteer_applications")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("weekly_quotes")
          .select("*", { count: "exact", head: true }),
      ]);

    setRegistrations(recentRegistrationsResponse.data || []);
    setSummitRegistrations(recentSummitRegistrationsResponse.data || []);
    setJoinUsRegistrations(recentJoinUsResponse.data || []);
    setVolunteerApplications(recentVolunteerApplicationsResponse.data || []);
    setQuotes(recentQuotesResponse.data || []);
    setRegistrationCount(registrationCountResponse.count || 0);
    setSummitRegistrationCount(summitRegistrationCountResponse.count || 0);
    setJoinUsCount(joinUsCountResponse.count || 0);
    setVolunteerCount(volunteerCountResponse.count || 0);
    setQuoteCount(quoteCountResponse.count || 0);
    setLoading(false);
  };

  const deleteRegistration = async (id: string) => {
    if (!window.confirm("Delete this registration?")) return;
    await supabase.from("event_registration").delete().eq("id", id);
    void fetchDashboardData();
  };

  const deleteJoinUsRegistration = async (id: string) => {
    if (!window.confirm("Delete this Join Us registration?")) return;
    await supabase.from("join_us_registrations").delete().eq("id", id);
    void fetchDashboardData();
  };

  const deleteSummitRegistration = async (id: string) => {
    if (!window.confirm("Delete this summit registration?")) return;
    await supabase.from("summit_2026_registrations").delete().eq("id", id);
    void fetchDashboardData();
  };

  const deleteVolunteerApplication = async (id: string) => {
    if (!window.confirm("Delete this volunteer application?")) return;
    await supabase.from("volunteer_applications").delete().eq("id", id);
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-muted p-6 text-center shadow">
            <p>Total Event Registrations</p>
            <p className="text-3xl font-bold">{registrationCount}</p>
          </div>
          <div className="rounded-xl bg-muted p-6 text-center shadow">
            <p>Total Summit 2026 Registrations</p>
            <p className="text-3xl font-bold">{summitRegistrationCount}</p>
          </div>
          <div className="rounded-xl bg-muted p-6 text-center shadow">
            <p>Total Join Us Registrations</p>
            <p className="text-3xl font-bold">{joinUsCount}</p>
          </div>
          <div className="rounded-xl bg-muted p-6 text-center shadow">
            <p>Total Get Involved Applications</p>
            <p className="text-3xl font-bold">{volunteerCount}</p>
          </div>
          <div className="rounded-xl bg-muted p-6 text-center shadow">
            <p>Total Weekly Quotes</p>
            <p className="text-3xl font-bold">{quoteCount}</p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Recent Event Registrations</h2>
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
          <h2 className="mb-4 text-2xl font-semibold">Recent Summit 2026 Registrations</h2>
          {summitRegistrations.length === 0 ? (
            <p>No summit registrations yet.</p>
          ) : (
            <table className="mb-6 w-full overflow-hidden rounded-xl border">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Occupation</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {summitRegistrations.map((registration) => (
                  <tr key={registration.id} className="border-t">
                    <td className="p-2">
                      {registration.first_name} {registration.last_name}
                    </td>
                    <td className="p-2">{registration.email}</td>
                    <td className="p-2">{registration.occupation}</td>
                    <td className="p-2">{new Date(registration.created_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void deleteSummitRegistration(registration.id)}
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
          <h2 className="mb-4 text-2xl font-semibold">Recent Join Us Registrations</h2>
          {joinUsRegistrations.length === 0 ? (
            <p>No Join Us registrations yet.</p>
          ) : (
            <table className="mb-6 w-full overflow-hidden rounded-xl border">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Occupation</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {joinUsRegistrations.map((registration) => (
                  <tr key={registration.id} className="border-t">
                    <td className="p-2">
                      {registration.first_name} {registration.last_name}
                    </td>
                    <td className="p-2">{registration.email}</td>
                    <td className="p-2">{registration.occupation}</td>
                    <td className="p-2">{new Date(registration.created_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void deleteJoinUsRegistration(registration.id)}
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
          <h2 className="mb-4 text-2xl font-semibold">Recent Get Involved Applications</h2>
          {volunteerApplications.length === 0 ? (
            <p>No volunteer applications yet.</p>
          ) : (
            <table className="mb-6 w-full overflow-hidden rounded-xl border">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {volunteerApplications.map((application) => (
                  <tr key={application.id} className="border-t">
                    <td className="p-2">
                      {application.first_name} {application.last_name}
                    </td>
                    <td className="p-2">{application.email}</td>
                    <td className="p-2">{application.phone}</td>
                    <td className="p-2">{new Date(application.created_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void deleteVolunteerApplication(application.id)}
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
