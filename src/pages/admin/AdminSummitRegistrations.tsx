import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, ExternalLink, RefreshCw, XCircle } from "lucide-react";

import AdminLayout from "./AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  PaymentStatus,
  SUMMIT_PAYMENT_RECEIPTS_BUCKET,
  SummitRegistrationRecord,
  formatBooleanLabel,
  formatNaira,
} from "@/lib/summitRegistration";

type FilterPreset = "all" | "pending" | "approved" | "business" | "first_time";

const filterPresets: Array<{ label: string; value: FilterPreset }> = [
  { label: "All Registrations", value: "all" },
  { label: "Pending Payments", value: "pending" },
  { label: "Approved Attendees", value: "approved" },
  { label: "Business Owners", value: "business" },
  { label: "First-Time Attendees", value: "first_time" },
];

const statusStyles: Record<PaymentStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const formatTicketType = (value: string) =>
  value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const buildSummitEmailPayload = (registration: SummitRegistrationRecord) => ({
  email: registration.email,
  full_name: registration.full_name,
  phone: registration.phone,
  city: registration.city,
  state: registration.state,
  country: registration.country,
  ticket_type: registration.ticket_type,
  quantity: registration.quantity,
  total_amount: registration.total_amount,
  registration_reference: registration.registration_reference,
  payment_status: registration.payment_status,
  transaction_reference: registration.transaction_reference,
  payment_method: registration.payment_method,
  payment_date: registration.payment_date,
});

export default function AdminSummitRegistrations() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<SummitRegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterPreset, setFilterPreset] = useState<FilterPreset>("pending");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openingReceiptId, setOpeningReceiptId] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
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

    setRegistrations((data ?? []) as SummitRegistrationRecord[]);
    setLoading(false);
  }, [sortOrder, toast]);

  useEffect(() => {
    void fetchRegistrations();
  }, [fetchRegistrations]);

  const filteredRegistrations = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return registrations
      .filter((registration) => {
        if (filterPreset === "pending") {
          return registration.payment_status === "pending";
        }

        if (filterPreset === "approved") {
          return registration.payment_status === "approved";
        }

        if (filterPreset === "business") {
          return registration.business_owner === true;
        }

        if (filterPreset === "first_time") {
          return registration.attended_before === false;
        }

        return true;
      })
      .filter((registration) => {
        if (!normalizedTerm) {
          return true;
        }

        return [
          registration.full_name,
          registration.email,
          registration.phone,
          registration.registration_reference,
          registration.transaction_reference,
          registration.state,
          registration.city || "",
          registration.ticket_type,
          registration.business_name || "",
          registration.industry || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedTerm);
      });
  }, [filterPreset, registrations, searchTerm]);

  const counts = useMemo(
    () => ({
      total: registrations.length,
      pending: registrations.filter((registration) => registration.payment_status === "pending")
        .length,
      approved: registrations.filter((registration) => registration.payment_status === "approved")
        .length,
      business: registrations.filter((registration) => registration.business_owner === true)
        .length,
    }),
    [registrations],
  );

  const exportToCsv = () => {
    const headers = [
      "No",
      "Database ID",
      "Full Name",
      "Email",
      "Phone",
      "City",
      "State",
      "Country",
      "Member",
      "Membership ID",
      "Ticket Type",
      "Quantity",
      "Total Amount",
      "Registration Reference",
      "Payment Status",
      "Transaction Reference",
      "Payment Method",
      "Payment Date",
      "Summit Interest",
      "Attended Before",
      "Business Owner",
      "Business Name",
      "Industry",
      "Networking Interest",
      "Directory Opt-In",
      "Dietary Requirements",
      "Emergency Contact",
      "Referral Source",
      "Media Consent",
      "Agreement",
      "Receipt Path",
      "Created At",
    ];

    const rows = filteredRegistrations.map((registration, index) => [
      index + 1,
      registration.id,
      registration.full_name,
      registration.email,
      registration.phone,
      registration.city || "",
      registration.state,
      registration.country,
      formatBooleanLabel(registration.member_status),
      registration.membership_id || "",
      formatTicketType(registration.ticket_type),
      registration.quantity,
      registration.total_amount,
      registration.registration_reference,
      registration.payment_status,
      registration.transaction_reference,
      registration.payment_method,
      registration.payment_date,
      registration.summit_interest || "",
      formatBooleanLabel(registration.attended_before),
      formatBooleanLabel(registration.business_owner),
      registration.business_name || "",
      registration.industry || "",
      formatBooleanLabel(registration.networking_interest),
      formatBooleanLabel(registration.networking_directory),
      registration.dietary_requirements || "",
      registration.emergency_contact || "",
      registration.referral_source || "",
      formatBooleanLabel(registration.media_consent),
      formatBooleanLabel(registration.agreement),
      registration.receipt_url,
      new Date(registration.created_at).toISOString(),
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

  const openReceipt = async (registration: SummitRegistrationRecord) => {
    if (!registration.receipt_url) {
      toast({
        title: "Receipt unavailable",
        description: "No payment receipt path is stored for this registration.",
        variant: "destructive",
      });
      return;
    }

    if (/^https?:\/\//i.test(registration.receipt_url)) {
      window.open(registration.receipt_url, "_blank", "noopener,noreferrer");
      return;
    }

    setOpeningReceiptId(registration.id);

    const { data, error } = await supabase.storage
      .from(SUMMIT_PAYMENT_RECEIPTS_BUCKET)
      .createSignedUrl(registration.receipt_url, 60 * 10);

    setOpeningReceiptId(null);

    if (error || !data?.signedUrl) {
      toast({
        title: "Unable to open receipt",
        description: error?.message || "A signed receipt URL could not be generated.",
        variant: "destructive",
      });
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const updatePaymentStatus = async (
    registration: SummitRegistrationRecord,
    paymentStatus: PaymentStatus,
  ) => {
    setUpdatingId(registration.id);

    const { data, error } = await supabase
      .from("summit_2026_registrations")
      .update({ payment_status: paymentStatus })
      .eq("id", registration.id)
      .select("*")
      .single();

    if (error || !data) {
      setUpdatingId(null);
      toast({
        title: "Unable to update payment status",
        description: error?.message || "No updated registration record was returned.",
        variant: "destructive",
      });
      return;
    }

    const updatedRegistration = data as SummitRegistrationRecord;

    setRegistrations((current) =>
      current.map((item) => (item.id === updatedRegistration.id ? updatedRegistration : item)),
    );

    const notificationResponse = await supabase.functions.invoke("send-summit-email", {
      body: {
        action: paymentStatus === "approved" ? "payment_approved" : "payment_rejected",
        registration: buildSummitEmailPayload(updatedRegistration),
      },
    });

    setUpdatingId(null);

    toast({
      title: paymentStatus === "approved" ? "Payment approved" : "Payment rejected",
      description: notificationResponse.error
        ? "Status updated, but the attendee email could not be sent yet."
        : "The attendee has been notified by email.",
      variant: notificationResponse.error ? "destructive" : "default",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Summit 2026 Registrations</h1>
            <p className="text-muted-foreground">
              Review payment status, receipts, and attendee readiness for Northern Women Summit 2026.
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

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{counts.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{counts.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{counts.approved}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Business Owners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{counts.business}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Search by attendee, payment reference, location, or use a preset queue filter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
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
            </div>

            <div className="flex flex-wrap gap-3">
              {filterPresets.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant={filterPreset === preset.value ? "gold" : "outline"}
                  onClick={() => setFilterPreset(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration Queue</CardTitle>
            <CardDescription>{filteredRegistrations.length} records in the current view.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading summit registrations...</p>
            ) : filteredRegistrations.length === 0 ? (
              <p className="text-muted-foreground">No summit registrations found for the current filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="border p-3">S/N</th>
                      <th className="border p-3">Attendee</th>
                      <th className="border p-3">Ticket</th>
                      <th className="border p-3">Amount</th>
                      <th className="border p-3">Status</th>
                      <th className="border p-3">Reference</th>
                      <th className="border p-3">Receipt</th>
                      <th className="border p-3">Business</th>
                      <th className="border p-3">First Time</th>
                      <th className="border p-3">Date</th>
                      <th className="border p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((registration, index) => (
                      <tr key={registration.id} className="hover:bg-muted/50">
                        <td className="border p-3 align-top font-medium text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="border p-3 align-top">
                          <p className="font-medium">{registration.full_name}</p>
                          <p className="text-sm text-muted-foreground">{registration.email}</p>
                          <p className="text-sm text-muted-foreground">{registration.phone}</p>
                        </td>
                        <td className="border p-3 align-top">
                          <p className="font-medium">{formatTicketType(registration.ticket_type)}</p>
                          <p className="text-sm text-muted-foreground">
                            {registration.quantity} ticket{registration.quantity > 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="border p-3 align-top font-medium">
                          {formatNaira(registration.total_amount)}
                        </td>
                        <td className="border p-3 align-top">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[registration.payment_status]}`}
                          >
                            {registration.payment_status}
                          </span>
                        </td>
                        <td className="border p-3 align-top">
                          <p className="font-medium">{registration.registration_reference}</p>
                          <p className="text-sm text-muted-foreground">
                            {registration.transaction_reference}
                          </p>
                        </td>
                        <td className="border p-3 align-top">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!registration.receipt_url || openingReceiptId === registration.id}
                            onClick={() => void openReceipt(registration)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {openingReceiptId === registration.id ? "Opening..." : "View Receipt"}
                          </Button>
                        </td>
                        <td className="border p-3 align-top">
                          <p>{formatBooleanLabel(registration.business_owner)}</p>
                          <p className="text-sm text-muted-foreground">
                            {registration.business_name || registration.industry || "-"}
                          </p>
                        </td>
                        <td className="border p-3 align-top">
                          {formatBooleanLabel(
                            registration.attended_before === null
                              ? null
                              : !registration.attended_before,
                          )}
                        </td>
                        <td className="border p-3 align-top text-sm text-muted-foreground">
                          {new Date(registration.created_at).toLocaleDateString()}
                        </td>
                        <td className="border p-3 align-top">
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              disabled={
                                updatingId === registration.id ||
                                registration.payment_status === "approved"
                              }
                              onClick={() => void updatePaymentStatus(registration, "approved")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              {updatingId === registration.id &&
                              registration.payment_status !== "approved"
                                ? "Updating..."
                                : "Approve Payment"}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              disabled={
                                updatingId === registration.id ||
                                registration.payment_status === "rejected"
                              }
                              onClick={() => void updatePaymentStatus(registration, "rejected")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {updatingId === registration.id &&
                              registration.payment_status !== "rejected"
                                ? "Updating..."
                                : "Reject Payment"}
                            </Button>
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
