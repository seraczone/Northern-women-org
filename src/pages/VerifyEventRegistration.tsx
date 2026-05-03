import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Ticket,
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

type VerifiedRegistration = {
  registrationCode: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  registeredAt: string;
  checkedInAt: string | null;
};

type VerificationPayload = {
  valid: boolean;
  registration?: VerifiedRegistration;
  error?: string;
};

const normalizeCode = (value: string) => value.trim().toUpperCase();

const fetchEventRegistrationVerification = async (
  registrationCode: string,
): Promise<VerificationPayload> => {
  const { data, error } = await supabase.functions.invoke(
    "verify-event-registration",
    {
      body: {
        registrationCode,
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

export default function VerifyEventRegistration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const codeFromUrl = useMemo(
    () => normalizeCode(searchParams.get("code") ?? ""),
    [searchParams],
  );
  const [codeInput, setCodeInput] = useState(codeFromUrl);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registration, setRegistration] = useState<VerifiedRegistration | null>(
    null,
  );

  useEffect(() => {
    setCodeInput(codeFromUrl);

    if (!codeFromUrl) {
      setRegistration(null);
      setErrorMessage("");
      return;
    }

    let ignore = false;

    const verifyFromUrl = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetchEventRegistrationVerification(codeFromUrl);

        if (ignore) {
          return;
        }

        if (!response.valid || !response.registration) {
          setRegistration(null);
          setErrorMessage(
            response.error ||
              "This registration code could not be verified. Please confirm the QR code or registration ID.",
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
            : "Unable to verify this registration right now.",
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
  }, [codeFromUrl]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextCode = normalizeCode(codeInput);

    if (!nextCode) {
      setRegistration(null);
      setErrorMessage("Enter a registration ID to continue.");
      setSearchParams({});
      return;
    }

    setSearchParams({
      code: nextCode,
    });
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <span className="text-secondary text-sm font-medium uppercase">
            Event Verification
          </span>
          <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
            Verify Event Registration
          </h1>
          <p className="max-w-3xl text-lg text-primary-foreground/90">
            Scan the attendee QR code or enter the registration ID to confirm the
            event details and registrant information.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Search Registration</CardTitle>
              <CardDescription>
                The QR code in the confirmation email opens this page with the
                unique registration ID already attached.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4 md:flex-row" onSubmit={handleSubmit}>
                <Input
                  value={codeInput}
                  onChange={(event) => setCodeInput(event.target.value)}
                  placeholder="Enter registration ID, for example NWI-EVT-AB12CD34EF56GH78"
                  autoComplete="off"
                />
                <Button type="submit" variant="gold" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {loading && (
            <Card>
              <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
                <Ticket className="h-5 w-5 animate-pulse" />
                <p>Checking the registration code against the event records...</p>
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
                      The registration could not be confirmed.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </CardContent>
            </Card>
          )}

          {!loading && registration && (
            <Card className="border-primary/20 shadow-card">
              <CardHeader className="gap-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">
                        Registration Verified
                      </CardTitle>
                      <CardDescription>
                        This registration code is valid for the event listed below.
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit px-3 py-1 text-xs">
                    Valid Registration
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="rounded-2xl border bg-muted/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Registration ID
                  </p>
                  <p className="mt-2 font-mono text-lg font-semibold text-foreground">
                    {registration.registrationCode}
                  </p>
                  <Badge
                    variant={registration.checkedInAt ? "secondary" : "outline"}
                    className="mt-4"
                  >
                    {registration.checkedInAt ? "Checked In" : "Not Checked In Yet"}
                  </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Registrant Details</h2>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Full Name:</strong>{" "}
                        {registration.fullName}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{registration.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{registration.phone || "Not provided"}</span>
                      </p>
                      <p>
                        <strong className="text-foreground">Submitted On:</strong>{" "}
                        {new Date(registration.registeredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Event Details</h2>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <Ticket className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{registration.eventName}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{registration.eventDate || "To be confirmed"}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{registration.eventTime || "To be confirmed"}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{registration.eventLocation || "To be confirmed"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}
