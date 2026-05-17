import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Hash,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Ticket,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  PaymentStatus,
  SUMMIT_DATE_LABEL,
  SUMMIT_SUPPORT_EMAIL,
  SUMMIT_SUPPORT_WHATSAPP,
  SUMMIT_VENUE_LABEL,
  formatNaira,
} from "@/lib/summitRegistration";

type VerifiedSummitRegistration = {
  registrationReference: string;
  fullName: string;
  emailPreview: string;
  phonePreview: string;
  city: string;
  state: string;
  country: string;
  ticketType: string;
  quantity: number;
  totalAmount: number | null;
  paymentStatus: PaymentStatus;
  paymentDate: string | null;
  registeredAt: string;
};

type VerificationPayload = {
  valid: boolean;
  registration?: VerifiedSummitRegistration;
  error?: string;
};

const SUMMIT_EVENT_TITLE = "Northern Women Summit 2026";

const normalizeReference = (value: string) => value.trim().toUpperCase();

const formatLocation = (...parts: Array<string | null | undefined>) =>
  parts
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(", ");

const formatDisplayDate = (value: string | null) => {
  if (!value) {
    return "Not available";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};

const formatDisplayDateTime = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
};

const fetchSummitRegistrationVerification = async (
  registrationReference: string,
): Promise<VerificationPayload> => {
  const { data, error } = await supabase.functions.invoke(
    "verify-summit-registration",
    {
      body: {
        registrationReference,
      },
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return (data as VerificationPayload | null) ?? {
    valid: false,
    error: "Unexpected verification response.",
  };
};

const statusStyles: Record<
  PaymentStatus,
  {
    badge: string;
    panel: string;
    title: string;
    description: string;
  }
> = {
  approved: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    panel: "border-emerald-200 bg-emerald-50/60",
    title: "Pass Approved",
    description:
      "This registration has been verified and is cleared for summit check-in.",
  },
  pending: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    panel: "border-amber-200 bg-amber-50/60",
    title: "Awaiting Payment Verification",
    description:
      "The registration exists, but payment approval is still pending. Entry should not be granted yet.",
  },
  rejected: {
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    panel: "border-rose-200 bg-rose-50/60",
    title: "Verification Issue",
    description:
      "This registration is on hold because the payment was not approved. Direct the attendee to support.",
  },
};

export default function VerifySummitRegistration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const referenceFromUrl = useMemo(
    () => normalizeReference(searchParams.get("reference") ?? ""),
    [searchParams],
  );
  const [referenceInput, setReferenceInput] = useState(referenceFromUrl);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registration, setRegistration] =
    useState<VerifiedSummitRegistration | null>(null);

  useEffect(() => {
    setReferenceInput(referenceFromUrl);

    if (!referenceFromUrl) {
      setRegistration(null);
      setErrorMessage("");
      return;
    }

    let ignore = false;

    const verifyFromUrl = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response =
          await fetchSummitRegistrationVerification(referenceFromUrl);

        if (ignore) {
          return;
        }

        if (!response.valid || !response.registration) {
          setRegistration(null);
          setErrorMessage(
            response.error ||
              "This summit pass could not be verified. Check the QR code or registration reference.",
          );
          return;
        }

        setRegistration(response.registration);
      } catch (error) {
        if (ignore) {
          return;
        }

        setRegistration(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify this summit pass right now.",
        );
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void verifyFromUrl();

    return () => {
      ignore = true;
    };
  }, [referenceFromUrl]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextReference = normalizeReference(referenceInput);

    if (!nextReference) {
      setRegistration(null);
      setErrorMessage("Enter a summit registration reference to continue.");
      setSearchParams({});
      return;
    }

    setSearchParams({
      reference: nextReference,
    });
  };

  const statusStyle = registration
    ? statusStyles[registration.paymentStatus]
    : null;
  const location = registration
    ? formatLocation(registration.city, registration.state, registration.country)
    : "";

  return (
    <Layout>
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <span className="text-secondary text-sm font-medium uppercase">
            Summit Verification
          </span>
          <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
            Verify Summit Pass
          </h1>
          <p className="max-w-3xl text-lg text-primary-foreground/90">
            Scan the QR code on the attendee PDF or enter the summit reference to
            confirm payment approval and ticket details for Northern Women Summit
            2026.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section max-w-5xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Search Reference</CardTitle>
              <CardDescription>
                Approved summit passes include a QR code that opens this page with
                the attendee reference already filled in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-4 md:flex-row"
                onSubmit={handleSubmit}
              >
                <Input
                  value={referenceInput}
                  onChange={(event) => setReferenceInput(event.target.value)}
                  placeholder="Enter summit reference, for example NWS2026-93847"
                  autoComplete="off"
                />
                <Button type="submit" variant="gold" disabled={loading}>
                  {loading ? "Checking..." : "Verify Pass"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {loading && (
            <Card>
              <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
                <Ticket className="h-5 w-5 animate-pulse" />
                <p>Checking the summit registration reference...</p>
              </CardContent>
            </Card>
          )}

          {!loading && errorMessage && (
            <Card className="border-destructive/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-6 w-6 text-destructive" />
                  <div>
                    <CardTitle className="text-xl">Verification Failed</CardTitle>
                    <CardDescription>
                      The summit pass could not be confirmed.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </CardContent>
            </Card>
          )}

          {!loading && registration && statusStyle && (
            <Card className="border-primary/20 shadow-card">
              <CardHeader className="gap-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    {registration.paymentStatus === "approved" ? (
                      <ShieldCheck className="h-7 w-7 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="h-7 w-7 text-amber-600" />
                    )}
                    <div>
                      <CardTitle className="text-2xl">{statusStyle.title}</CardTitle>
                      <CardDescription>{statusStyle.description}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`w-fit border px-3 py-1 text-xs font-semibold capitalize ${statusStyle.badge}`}
                  >
                    {registration.paymentStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className={`rounded-3xl border p-5 ${statusStyle.panel}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Registration Reference
                  </p>
                  <p className="mt-2 font-mono text-lg font-semibold text-foreground">
                    {registration.registrationReference}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                      {registration.ticketType}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 text-xs">
                      {registration.quantity} ticket
                      {registration.quantity > 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Attendee Details</h2>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Full Name:</strong>{" "}
                        {registration.fullName}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{registration.emailPreview || "Not available"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{registration.phonePreview || "Not available"}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{location || "Location not provided"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-primary" />
                        <span>
                          Submitted on {formatDisplayDateTime(registration.registeredAt)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Summit Details</h2>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <Ticket className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{SUMMIT_EVENT_TITLE}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{SUMMIT_DATE_LABEL}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{SUMMIT_VENUE_LABEL}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Wallet className="mt-0.5 h-4 w-4 text-primary" />
                        <span>
                          {registration.totalAmount !== null
                            ? formatNaira(registration.totalAmount)
                            : "Amount not available"}
                        </span>
                      </p>
                      <p>
                        <strong className="text-foreground">Payment Date:</strong>{" "}
                        {formatDisplayDate(registration.paymentDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-muted/40 p-5 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Need help?</strong>{" "}
                    Contact support on WhatsApp at {SUMMIT_SUPPORT_WHATSAPP} or by
                    email at {SUMMIT_SUPPORT_EMAIL}.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}
