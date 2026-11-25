import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, ExternalLink, RefreshCw, Save, XCircle } from "lucide-react";

import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Membership = {
  id: string;
  member_id: string | null;
  membership_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  occupation: string;
  business_name: string | null;
  business_category: string | null;
  residential_address: string;
  local_government: string;
  town_city: string;
  state: string;
  country: string;
  membership_type: "new" | "renewal";
  membership_year: number;
  fee: number;
  payment_status: "unpaid" | "pending_verification" | "paid" | "failed" | "cancelled" | "declined";
  membership_status: "pending" | "active" | "expired" | "suspended" | "terminated";
  payment_reference: string | null;
  receipt_path: string | null;
  receipt_uploaded_at: string | null;
  payment_verified_at: string | null;
  payment_verified_by: string | null;
  payment_decision: "approved" | "declined" | null;
  payment_decided_at: string | null;
  payment_decline_reason: string | null;
  decision_email_status: "pending" | "sending" | "sent" | "failed";
  decision_email_attempts: number;
  decision_email_started_at: string | null;
  decision_email_sent_at: string | null;
  decision_email_error: string | null;
  admin_notes: string | null;
  created_at: string;
  expiry_date: string;
};

type PaymentSettings = {
  bank_name: string;
  account_name: string;
  account_number: string;
  payment_instructions: string;
};

type PaymentStatus = Membership["payment_status"];

const emptySettings: PaymentSettings = {
  bank_name: "",
  account_name: "",
  account_number: "",
  payment_instructions: "",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  unpaid: "border-slate-200 bg-slate-50 text-slate-700",
  pending_verification: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  declined: "border-rose-200 bg-rose-50 text-rose-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  cancelled: "border-slate-200 bg-slate-50 text-slate-600",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-NG", { dateStyle: "medium" }) : "-";

const formatDateTime = (value: string | null) =>
  value ? new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "-";

const formatMembershipType = (value: Membership["membership_type"]) =>
  value === "renewal" ? "Renewal" : "New member";

export default function AdminMemberships() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Membership[]>([]);
  const [settings, setSettings] = useState<PaymentSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [payment, setPayment] = useState("all");
  const [membershipStatus, setMembershipStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [saving, setSaving] = useState<string | null>(null);
  const [openingReceiptId, setOpeningReceiptId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [memberships, paymentSettings] = await Promise.all([
      supabase.from("membership_applications").select("*").order("created_at", { ascending: false }),
      supabase
        .from("membership_payment_settings")
        .select("bank_name,account_name,account_number,payment_instructions")
        .eq("id", true)
        .maybeSingle(),
    ]);

    if (memberships.error) {
      toast({
        title: "Unable to load membership applications",
        description: memberships.error.message,
        variant: "destructive",
      });
    } else {
      setRows((memberships.data ?? []) as Membership[]);
    }

    if (paymentSettings.data) setSettings(paymentSettings.data as PaymentSettings);
    if (paymentSettings.error) {
      toast({ title: "Unable to load bank details", description: paymentSettings.error.message, variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows
      .filter((row) => {
        const searchable = [
          `${row.first_name} ${row.last_name}`,
          row.email,
          row.phone,
          row.membership_id ?? "",
          row.payment_reference ?? "",
          row.occupation,
          row.business_name ?? "",
          row.business_category ?? "",
          row.local_government,
          row.town_city,
          row.state,
        ].join(" ").toLowerCase();

        return (
          (!term || searchable.includes(term)) &&
          (year === "all" || String(row.membership_year) === year) &&
          (payment === "all" || row.payment_status === payment) &&
          (membershipStatus === "all" || row.membership_status === membershipStatus)
        );
      })
      .sort((a, b) => {
        const difference = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortOrder === "asc" ? difference : -difference;
      });
  }, [membershipStatus, payment, rows, search, sortOrder, year]);

  const updateRow = async (id: string, changes: Record<string, unknown>) => {
    setSaving(id);
    const { error } = await supabase.from("membership_applications").update(changes).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Membership record updated" });
      await load();
    }
    setSaving(null);
    return !error;
  };

  const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings.bank_name.trim() || !settings.account_name.trim() || !/^\d{10}$/.test(settings.account_number.trim())) {
      toast({
        title: "Check bank details",
        description: "Enter the bank name, account name and a valid 10-digit account number.",
        variant: "destructive",
      });
      return;
    }

    setSavingSettings(true);
    const { error } = await supabase
      .from("membership_payment_settings")
      .update({
        bank_name: settings.bank_name.trim(),
        account_name: settings.account_name.trim(),
        account_number: settings.account_number.trim(),
        payment_instructions: settings.payment_instructions.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", true);
    setSavingSettings(false);

    if (error) {
      toast({ title: "Unable to save bank details", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Membership bank details saved", description: "New applicants will see these payment instructions." });
    }
  };

  const openReceipt = async (row: Membership) => {
    if (!row.receipt_path) return;
    setOpeningReceiptId(row.id);
    const { data, error } = await supabase.storage
      .from("membership-payment-receipts")
      .createSignedUrl(row.receipt_path, 60 * 10);
    setOpeningReceiptId(null);

    if (error || !data?.signedUrl) {
      toast({ title: "Unable to open receipt", description: error?.message || "Receipt link unavailable.", variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const sendDecisionEmail = async (row: Membership, decision: "approved" | "declined", isRetry = false) => {
    setSaving(row.id);
    const { error } = await supabase.functions.invoke("send-registration-email", {
      body: { flow: "membership_decision", decision, application_id: row.id },
    });
    await load();
    setSaving(null);

    if (error) {
      toast({
        title: isRetry ? "Email retry failed" : "Decision saved; email failed",
        description: error.message || "The applicant notification could not be sent. You can retry it from this record.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: isRetry ? "Notification email sent" : "Decision notification sent", description: "The applicant has been notified." });
  };

  const decidePayment = async (row: Membership, decision: "approved" | "declined") => {
    if (!row.receipt_path) {
      toast({ title: "Receipt required", description: "The applicant must upload a receipt before a decision can be made.", variant: "destructive" });
      return;
    }
    const declineReason = decision === "declined" ? window.prompt("Optional: enter the reason for declining this payment") : null;
    if (decision === "declined" && declineReason === null) return;

    setSaving(row.id);
    const { data, error } = await supabase.rpc("admin_decide_membership_payment", {
      p_application_id: row.id,
      p_decision: decision,
      p_decline_reason: declineReason?.trim() || null,
    });
    if (error || !data) {
      setSaving(null);
      toast({ title: "Unable to record payment decision", description: error?.message || "No updated record was returned.", variant: "destructive" });
      return;
    }

    const decided = data as Membership;
    await sendDecisionEmail({ ...row, ...decided, decision_email_status: "pending" }, decision);
  };

  const exportCsv = () => {
    const headers = [
      "Membership ID", "Name", "Email", "Phone", "Occupation", "Business", "Location",
      "Type", "Year", "Fee", "Payment Status", "Membership Status", "Payment Reference",
      "Receipt Uploaded", "Expiry", "Admin Notes",
    ];
    const csv = [
      headers,
      ...filtered.map((row) => [
        row.membership_id || "",
        `${row.first_name} ${row.last_name}`,
        row.email,
        row.phone,
        row.occupation,
        row.business_name || row.business_category || "",
        [row.town_city, row.local_government, row.state, row.country].filter(Boolean).join(", "),
        row.membership_type,
        row.membership_year,
        row.fee,
        row.payment_status,
        row.membership_status,
        row.payment_reference || "",
        row.receipt_uploaded_at || "",
        row.expiry_date,
        row.admin_notes || "",
      ]),
    ]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "nwi_membership_register.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Membership register exported", description: "The current membership table has been downloaded." });
  };

  const activeCount = new Set(rows.filter((row) => row.membership_status === "active" && row.membership_id).map((row) => row.membership_id)).size;

  return (
    <AdminLayout>
      <div className="space-y-7 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Become a Member</h1>
            <p className="text-muted-foreground">Review applications, payment receipts, and membership decisions.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={exportCsv} disabled={!filtered.length}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" onClick={() => void load()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bank transfer settings</CardTitle>
            <CardDescription>These details appear to membership applicants and on the Donate page.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSettings} className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm font-medium">
                Bank name
                <Input value={settings.bank_name} onChange={(event) => setSettings((current) => ({ ...current, bank_name: event.target.value }))} placeholder="e.g. First Bank" />
              </label>
              <label className="space-y-1 text-sm font-medium">
                Account name
                <Input value={settings.account_name} onChange={(event) => setSettings((current) => ({ ...current, account_name: event.target.value }))} placeholder="Registered NWI account name" />
              </label>
              <label className="space-y-1 text-sm font-medium">
                Account number
                <Input inputMode="numeric" maxLength={10} value={settings.account_number} onChange={(event) => setSettings((current) => ({ ...current, account_number: event.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="10-digit account number" />
              </label>
              <label className="space-y-1 text-sm font-medium md:col-span-2">
                Additional payment instructions
                <textarea className="min-h-20 w-full rounded-md border border-input bg-background p-3 text-sm" value={settings.payment_instructions} onChange={(event) => setSettings((current) => ({ ...current, payment_instructions: event.target.value }))} placeholder="Include transfer narration or payment guidance." />
              </label>
              <div className="md:col-span-2">
                <Button type="submit" disabled={savingSettings}>
                  <Save className="mr-2 h-4 w-4" /> {savingSettings ? "Saving..." : "Save bank details"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Applications", rows.length],
            ["Awaiting verification", rows.filter((row) => row.payment_status === "pending_verification").length],
            ["Payments approved", rows.filter((row) => row.payment_status === "paid").length],
            ["Active members", activeCount],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{value}</p></CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Membership filters</CardTitle>
            <CardDescription>Search applications by member details, payment reference, location, or NWI ID.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <Input placeholder="Search membership applications" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "asc" | "desc")}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">All years</option>
              {Array.from(new Set(rows.map((row) => row.membership_year))).sort((a, b) => b - a).map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={payment} onChange={(event) => setPayment(event.target.value)}>
              <option value="all">All payment statuses</option>
              {["unpaid", "pending_verification", "paid", "declined", "failed", "cancelled"].map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={membershipStatus} onChange={(event) => setMembershipStatus(event.target.value)}>
              <option value="all">All membership statuses</option>
              {["pending", "active", "expired", "suspended", "terminated"].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership applications</CardTitle>
            <CardDescription>{filtered.length} records in the current view.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading membership applications...</p>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground">No membership applications found for the current filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="border p-3">S/N</th>
                      <th className="border p-3">Applicant</th>
                      <th className="border p-3">Profile</th>
                      <th className="border p-3">Membership</th>
                      <th className="border p-3">Payment</th>
                      <th className="border p-3">Receipt</th>
                      <th className="border p-3">Member ID</th>
                      <th className="border p-3">Date</th>
                      <th className="border p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, index) => (
                      <tr key={row.id} className="align-top hover:bg-muted/50">
                        <td className="border p-3 font-medium text-muted-foreground">{index + 1}</td>
                        <td className="border p-3">
                          <p className="font-semibold">{row.first_name} {row.last_name}</p>
                          <p className="text-muted-foreground">{row.email}</p>
                          <p className="text-muted-foreground">{row.phone}</p>
                        </td>
                        <td className="border p-3">
                          <p className="font-medium">{row.occupation || "-"}</p>
                          <p className="text-muted-foreground">{row.business_name || row.business_category || "-"}</p>
                          <p className="max-w-52 text-muted-foreground">{[row.town_city, row.local_government, row.state].filter(Boolean).join(", ") || "-"}</p>
                        </td>
                        <td className="border p-3">
                          <p className="font-medium">{formatMembershipType(row.membership_type)}</p>
                          <p className="text-muted-foreground">Year {row.membership_year}</p>
                          <p className="font-medium">{money(row.fee)}</p>
                          <p className="text-muted-foreground">Expires {formatDate(row.expiry_date)}</p>
                        </td>
                        <td className="border p-3">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${paymentStatusStyles[row.payment_status]}`}>
                            {row.payment_status.replaceAll("_", " ")}
                          </span>
                          <p className="mt-2 break-all text-muted-foreground">{row.payment_reference || "No reference"}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{row.payment_decision ? `Decision: ${row.payment_decision}` : "Awaiting decision"}</p>
                        </td>
                        <td className="border p-3">
                          <Button type="button" variant="outline" size="sm" disabled={!row.receipt_path || openingReceiptId === row.id} onClick={() => void openReceipt(row)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {openingReceiptId === row.id ? "Opening..." : row.receipt_path ? "View Receipt" : "Not uploaded"}
                          </Button>
                          <p className="mt-2 whitespace-nowrap text-xs text-muted-foreground">{row.receipt_uploaded_at ? formatDateTime(row.receipt_uploaded_at) : "-"}</p>
                        </td>
                        <td className="border p-3">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${row.membership_status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                            {row.membership_status}
                          </span>
                          {row.membership_id && <p className="mt-2 whitespace-nowrap font-mono font-bold text-primary">{row.membership_id}</p>}
                        </td>
                        <td className="border p-3 whitespace-nowrap text-muted-foreground">{formatDateTime(row.created_at)}</td>
                        <td className="border p-3">
                          <div className="flex min-w-44 flex-col gap-2">
                            {row.payment_status === "pending_verification" && (
                              <>
                                <Button type="button" size="sm" onClick={() => void decidePayment(row, "approved")} disabled={saving === row.id} className="bg-amber-500 text-white hover:bg-amber-600">
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Payment
                                </Button>
                                <Button type="button" size="sm" variant="destructive" onClick={() => void decidePayment(row, "declined")} disabled={saving === row.id}>
                                  <XCircle className="mr-2 h-4 w-4" /> Reject Payment
                                </Button>
                              </>
                            )}
                            {row.payment_decision && row.decision_email_status !== "sent" && (
                              <Button type="button" size="sm" variant="outline" onClick={() => void sendDecisionEmail(row, row.payment_decision as "approved" | "declined", true)} disabled={saving === row.id}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Retry email
                              </Button>
                            )}
                            {row.payment_decision && (
                              <span className="text-xs text-muted-foreground">Decision email: {row.decision_email_status}; attempts: {row.decision_email_attempts}</span>
                            )}
                            {row.decision_email_error && <span className="max-w-52 break-words text-xs text-destructive">{row.decision_email_error}</span>}
                            {saving === row.id && <span className="text-xs text-muted-foreground">Saving...</span>}
                            <label className="mt-1 block space-y-1 text-xs font-medium">
                              Admin notes
                              <textarea
                                className="min-h-16 w-full rounded-md border border-input bg-background p-2 text-sm font-normal"
                                defaultValue={row.admin_notes || ""}
                                placeholder="Internal notes..."
                                onBlur={(event) => {
                                  if (event.target.value !== (row.admin_notes || "")) {
                                    void updateRow(row.id, { admin_notes: event.target.value || null });
                                  }
                                }}
                              />
                            </label>
                          </div>
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
