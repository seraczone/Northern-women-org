import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  SUMMIT_BASE_FEE,
  SUMMIT_DATE_LABEL,
  SUMMIT_REGISTRATION_DRAFT_KEY,
  SUMMIT_STANDARD_TICKET_TYPE,
  SUMMIT_SUPPORT_EMAIL,
  SUMMIT_SUPPORT_WHATSAPP,
  SUMMIT_VENUE_LABEL,
  SummitRegistrationFormData,
  calculateTicketTotal,
  formatNaira,
  generateRegistrationReference,
  industryOptions,
  nigeriaStates,
  paymentMethodOptions,
  referralSourceOptions,
  summitInitialFormData,
  yesNoOptions,
} from "@/lib/summitRegistration";
import {
  submitSummitRegistration,
  validateSummitReceiptFile,
} from "@/lib/submitSummitRegistration";

type SubmissionSuccess = {
  registrationReference: string;
  totalAmount: number;
  notificationMessage: string | null;
};

const formSections = [
  { id: "section-personal-information", label: "Personal Information" },
  { id: "section-membership-verification", label: "Membership Verification" },
  { id: "section-ticket-information", label: "Ticket Information" },
  { id: "section-payment-information", label: "Payment Information" },
  { id: "section-summit-experience", label: "Summit Experience" },
  { id: "section-business-networking", label: "Business and Networking" },
  { id: "section-additional-information", label: "Additional Information" },
  { id: "section-consent-confirmation", label: "Consent and Confirmation" },
] as const;

const TOTAL_SECTIONS = formSections.length;

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function StepSection({
  id,
  index,
  title,
  description,
  children,
}: {
  id: string;
  index: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-[1.75rem] border border-border/80 bg-background p-6 md:p-7"
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Section {index}
          </p>
          <h2 className="mt-2 text-2xl font-serif font-bold text-foreground">{title}</h2>
          {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function RadioChoiceField({
  label,
  required,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: "yes" | "no") => void;
}) {
  return (
    <Field label={label} required={required}>
      <RadioGroup
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as "yes" | "no")}
        className="grid gap-3 sm:grid-cols-2"
      >
        {yesNoOptions.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition hover:border-primary/50"
          >
            <RadioGroupItem value={option.value} />
            <span className="font-medium text-foreground">{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </Field>
  );
}

export default function RegisterSummit2026() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptFileName, setReceiptFileName] = useState("");
  const [success, setSuccess] = useState<SubmissionSuccess | null>(null);
  const [formData, setFormData] = useState<SummitRegistrationFormData>(() =>
    summitInitialFormData(),
  );

  const totalAmount = calculateTicketTotal(SUMMIT_STANDARD_TICKET_TYPE, formData.quantity);
  const whatsappSupportHref = `https://wa.me/${SUMMIT_SUPPORT_WHATSAPP.replace(/\D/g, "")}`;

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(SUMMIT_REGISTRATION_DRAFT_KEY);

    if (!savedDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft) as Partial<SummitRegistrationFormData>;

      setFormData((current) => ({
        ...current,
        ...parsedDraft,
        country: parsedDraft.country || "Nigeria",
        ticket_type: SUMMIT_STANDARD_TICKET_TYPE,
        quantity:
          typeof parsedDraft.quantity === "number" && parsedDraft.quantity >= 1
            ? Math.min(parsedDraft.quantity, 20)
            : current.quantity,
        registration_reference:
          typeof parsedDraft.registration_reference === "string" &&
          parsedDraft.registration_reference.trim().length > 0
            ? parsedDraft.registration_reference.trim()
            : current.registration_reference,
      }));
    } catch {
      window.localStorage.removeItem(SUMMIT_REGISTRATION_DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SUMMIT_REGISTRATION_DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = <Key extends keyof SummitRegistrationFormData>(
    key: Key,
    value: SummitRegistrationFormData[Key],
  ) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const scrollToSection = (sectionIndex: number) => {
    const target = document.getElementById(formSections[sectionIndex]?.id ?? "");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showValidationError = (message: string) => {
    toast({
      title: "Complete this section",
      description: message,
      variant: "destructive",
    });
  };

  const validateStep = (stepIndex: number) => {
    if (stepIndex === 0) {
      if (formData.full_name.trim().length < 3) {
        showValidationError("Enter your full name using at least 3 characters.");
        return false;
      }

      if (!validateEmail(formData.email)) {
        showValidationError("Enter a valid email address.");
        return false;
      }

      if (!formData.phone.trim()) {
        showValidationError("Enter your phone number.");
        return false;
      }

      if (!formData.state) {
        showValidationError("Select your state.");
        return false;
      }
    }

    if (stepIndex === 1) {
      if (!formData.member_status) {
        showValidationError("Select whether you are currently a Northern Women member.");
        return false;
      }

      if (formData.member_status === "yes" && !formData.membership_id.trim()) {
        showValidationError("Enter your membership ID or registered email.");
        return false;
      }
    }

    if (stepIndex === 2) {
      if (!formData.ticket_type) {
        showValidationError("Select a ticket type.");
        return false;
      }

      if (!Number.isFinite(formData.quantity) || formData.quantity < 1 || formData.quantity > 20) {
        showValidationError("Number of tickets must be between 1 and 20.");
        return false;
      }
    }

    if (stepIndex === 3) {
      const fileError = validateSummitReceiptFile(receiptFile);

      if (fileError) {
        showValidationError(fileError);
        return false;
      }

      if (!formData.transaction_reference.trim()) {
        showValidationError("Enter your bank transaction reference or session ID.");
        return false;
      }

      if (!formData.payment_date) {
        showValidationError("Select the payment date.");
        return false;
      }

      if (!formData.payment_method) {
        showValidationError("Select your payment method.");
        return false;
      }
    }

    if (stepIndex === 4) {
      if (!formData.attended_before) {
        showValidationError("Tell us whether you have attended the summit before.");
        return false;
      }
    }

    if (stepIndex === 5) {
      if (!formData.business_owner) {
        showValidationError("Tell us whether you run a business, brand, or organisation.");
        return false;
      }

      if (formData.business_owner === "yes" && !formData.business_name.trim()) {
        showValidationError("Enter your business or organisation name.");
        return false;
      }

      if (!formData.industry) {
        showValidationError("Select your industry.");
        return false;
      }

      if (!formData.networking_interest) {
        showValidationError("Tell us whether you are interested in networking opportunities.");
        return false;
      }

      if (!formData.networking_directory) {
        showValidationError(
          "Tell us whether you want your profile included in the networking directory.",
        );
        return false;
      }
    }

    if (stepIndex === 6) {
      if (!formData.referral_source) {
        showValidationError("Select how you heard about the summit.");
        return false;
      }
    }

    if (stepIndex === 7) {
      if (!formData.agreement) {
        showValidationError(
          "Confirm that your information and payment details are correct.",
        );
        return false;
      }
    }

    return true;
  };

  const resetRegistration = () => {
    setReceiptFile(null);
    setReceiptFileName("");
    setSuccess(null);
    setFormData(summitInitialFormData(generateRegistrationReference()));
    window.localStorage.removeItem(SUMMIT_REGISTRATION_DRAFT_KEY);
  };

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setReceiptFile(file);
    setReceiptFileName(file?.name ?? "");

    if (!file) {
      return;
    }

    const fileError = validateSummitReceiptFile(file);

    if (fileError) {
      toast({
        title: "Invalid receipt file",
        description: fileError,
        variant: "destructive",
      });
      setReceiptFile(null);
      setReceiptFileName("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (let stepIndex = 0; stepIndex < TOTAL_SECTIONS; stepIndex += 1) {
      if (!validateStep(stepIndex)) {
        scrollToSection(stepIndex);
        return;
      }
    }

    if (!receiptFile) {
      scrollToSection(3);
      showValidationError("Upload a payment receipt to continue.");
      return;
    }

    setLoading(true);
    const result = await submitSummitRegistration({
      formData,
      receiptFile,
    });
    setLoading(false);

    if (result.error) {
      toast({
        title: "Unable to submit registration",
        description: result.error.message,
        variant: "destructive",
      });
      return;
    }

    window.localStorage.removeItem(SUMMIT_REGISTRATION_DRAFT_KEY);
    setSuccess({
      registrationReference: formData.registration_reference,
      totalAmount,
      notificationMessage: result.notificationError?.message ?? null,
    });
    setReceiptFile(null);
    setReceiptFileName("");

    toast({
      title: "Registration submitted",
      description: result.notificationError
        ? "Your registration was saved, but the confirmation email could not be sent yet."
        : "Your summit registration has been received and is awaiting payment verification.",
      variant: result.notificationError ? "destructive" : "default",
    });
  };

  if (success) {
    return (
      <Layout>
        <section className="bg-gradient-hero py-20">
          <div className="container-section">
            <span className="text-secondary text-sm font-medium uppercase">
              Summit Registration
            </span>
            <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
              Northern Women Summit 2026
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Your registration has been received and is now awaiting payment verification.
            </p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-section max-w-4xl">
            <div className="rounded-[2rem] border bg-card p-8 shadow-card md:p-10">
              <div className="flex items-center gap-3 text-primary">
                <CheckCircle2 className="h-8 w-8" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Registration Submitted
                </p>
              </div>

              <h2 className="mt-6 text-3xl font-serif font-bold text-foreground">
                Thank you for registering for Northern Women Summit 2026.
              </h2>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border bg-muted/60 p-5">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Registration Reference
                  </p>
                  <p className="mt-3 text-2xl font-serif font-bold text-foreground">
                    {success.registrationReference}
                  </p>
                </div>

                <div className="rounded-2xl border bg-muted/60 p-5">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Verification Status
                  </p>
                  <p className="mt-3 text-2xl font-serif font-bold text-foreground">Pending</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                  Recorded Payment Total
                </p>
                <p className="mt-3 text-3xl font-serif font-bold text-foreground">
                  {formatNaira(success.totalAmount)}
                </p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border p-5">
                  <p className="text-lg font-semibold text-foreground">Support Information</p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">WhatsApp:</strong>{" "}
                      {SUMMIT_SUPPORT_WHATSAPP}
                    </p>
                    <p>
                      <strong className="text-foreground">Email:</strong> {SUMMIT_SUPPORT_EMAIL}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border p-5">
                  <p className="text-lg font-semibold text-foreground">What Happens Next</p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>Your payment receipt will be reviewed by the summit team.</p>
                    <p>Your attendance is only confirmed after payment verification.</p>
                    <p>Keep your registration reference available for support and check-in.</p>
                  </div>
                </div>
              </div>

              {success.notificationMessage ? (
                <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
                  Confirmation email could not be sent automatically yet:{" "}
                  {success.notificationMessage}
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="gold" onClick={resetRegistration}>
                  Register Another Attendee
                </Button>
                <Button variant="outline" onClick={() => navigate("/events")}>
                  Back to Events
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <span className="text-secondary text-sm font-medium uppercase">
            Summit Registration
          </span>
          <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
            Northern Women Summit 2026 Registration Form
          </h1>
          <p className="max-w-3xl text-lg text-primary-foreground/90">
            Welcome to the Summit 2026 - a powerful gathering created to inspire,
            connect, and empower women in business, leadership, faith, community,
            and personal growth.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section space-y-8">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft size={16} /> Back to Events
          </Button>

          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <div className="rounded-[2rem] border bg-card p-7 shadow-card">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Event Information
                  </p>
                </div>

                <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Date:</strong> {SUMMIT_DATE_LABEL}
                  </p>
                  <p>
                    <strong className="text-foreground">Venue:</strong> {SUMMIT_VENUE_LABEL}
                  </p>
                  <p>
                    <strong className="text-foreground">Registration Fee:</strong>{" "}
                    {formatNaira(SUMMIT_BASE_FEE)} per attendee
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border bg-card p-7 shadow-card">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Important Notice
                  </p>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <li>Registration is only confirmed after payment verification.</li>
                  <li>A unique registration reference is generated for every attendee.</li>
                  <li>Uploading a valid payment receipt is mandatory.</li>
                  <li>Your draft autosaves on this device, except for the uploaded receipt file.</li>
                </ul>
              </div>

              <div className="rounded-[2rem] border bg-card p-7 shadow-card">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Registration Sections
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {formSections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium">{section.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border bg-card p-7 shadow-card">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Payment Support
                  </p>
                </div>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <p>
                    Keep your reference{" "}
                    <strong className="text-foreground">
                      {formData.registration_reference}
                    </strong>{" "}
                    in your transfer narration.
                  </p>
                  <p>
                    For payment questions or upload issues, contact the support team
                    directly before submitting another registration.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button variant="gold" asChild>
                    <a href={whatsappSupportHref} target="_blank" rel="noreferrer">
                      WhatsApp Support
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`mailto:${SUMMIT_SUPPORT_EMAIL}`}>{SUMMIT_SUPPORT_EMAIL}</a>
                  </Button>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8 rounded-[2rem] border bg-card p-6 shadow-card md:p-8"
            >
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      One-Page Registration
                    </p>
                    <h2 className="mt-2 text-2xl font-serif font-bold text-foreground">
                      Complete all sections below in one form
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      Each section includes its own instruction so attendees can move
                      through the form without clicking next. Your draft is saved
                      automatically on this device while you complete it.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-primary/20 bg-background/80 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Reference
                      </p>
                      <p className="mt-2 font-serif text-lg font-bold text-foreground">
                        {formData.registration_reference}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-primary/20 bg-background/80 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Current Total
                      </p>
                      <p className="mt-2 font-serif text-lg font-bold text-foreground">
                        {formatNaira(totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <StepSection
                id={formSections[0].id}
                index={1}
                title="Personal Information"
                description="Tell us how to contact you and where you are joining from."
              >
                <Field
                  label="Full Name"
                  htmlFor="full_name"
                  required
                  hint="Minimum 3 characters."
                >
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    placeholder="Enter your full name"
                    onChange={(event) => updateFormData("full_name", event.target.value)}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email Address" htmlFor="email" required>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      placeholder="example@email.com"
                      onChange={(event) => updateFormData("email", event.target.value)}
                    />
                  </Field>

                  <Field label="Phone Number" htmlFor="phone" required>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      placeholder="08012345678"
                      onChange={(event) => updateFormData("phone", event.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="City/Town" htmlFor="city">
                    <Input
                      id="city"
                      value={formData.city}
                      placeholder="Enter your city or town"
                      onChange={(event) => updateFormData("city", event.target.value)}
                    />
                  </Field>

                  <Field label="State" required>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => updateFormData("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigeriaStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field label="Country" htmlFor="country">
                  <Input id="country" value={formData.country} readOnly disabled />
                </Field>
              </StepSection>

              <StepSection
                id={formSections[1].id}
                index={2}
                title="Membership Verification"
                description="We use this to identify existing members and verify member-linked benefits where applicable."
              >
                <RadioChoiceField
                  label="Are you currently a Northern Women member?"
                  required
                  value={formData.member_status}
                  onChange={(value) => updateFormData("member_status", value)}
                />

                {formData.member_status === "yes" ? (
                  <Field
                    label="Membership ID or Registered Email"
                    htmlFor="membership_id"
                    required
                    hint="Use the email or membership identifier already associated with your membership."
                  >
                    <Input
                      id="membership_id"
                      value={formData.membership_id}
                      placeholder="Enter your membership ID or registered email"
                      onChange={(event) =>
                        updateFormData("membership_id", event.target.value)
                      }
                    />
                  </Field>
                ) : null}
              </StepSection>

              <StepSection
                id={formSections[2].id}
                index={3}
                title="Ticket Information"
                description="Registration is currently available on the standard pass only. Choose how many attendees you are paying for."
              >
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                    Ticket Type
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">Standard Pass</p>
                      <p className="text-sm text-muted-foreground">
                        Full summit access for one attendee.
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-primary">
                      {formatNaira(SUMMIT_BASE_FEE)}
                    </p>
                  </div>
                </div>

                <Field
                  label="Number of Tickets"
                  htmlFor="quantity"
                  required
                  hint="Minimum 1, maximum 20."
                >
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={20}
                    value={formData.quantity}
                    onChange={(event) => {
                      const nextQuantity = Number(event.target.value);
                      updateFormData(
                        "quantity",
                        Number.isFinite(nextQuantity)
                          ? Math.max(1, Math.min(20, nextQuantity))
                          : 1,
                      );
                    }}
                  />
                </Field>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                    Auto-Calculated Total
                  </p>
                  <p className="mt-3 text-2xl font-serif font-bold text-foreground">
                    {formData.quantity} x {formatNaira(SUMMIT_BASE_FEE)} ={" "}
                    {formatNaira(totalAmount)}
                  </p>
                </div>
              </StepSection>

              <StepSection
                id={formSections[3].id}
                index={4}
                title="Payment Information"
                description="Transfer your payment, include your registration reference in the narration, then upload the receipt."
              >
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                    Auto-Generated Registration Reference
                  </p>
                  <p className="mt-3 text-3xl font-serif font-bold text-foreground">
                    {formData.registration_reference}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Please include this reference in your transfer narration.
                  </p>
                </div>

                <div className="rounded-2xl border bg-muted/60 p-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Payment Account
                    </h3>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Bank Name:</strong> Zenith
                      Bank
                    </p>
                    <p>
                      <strong className="text-foreground">Account Name:</strong>{" "}
                      Northern Women Summit
                    </p>
                    <p>
                      <strong className="text-foreground">Account Number:</strong>{" "}
                      1234567890
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Upload Payment Receipt"
                    htmlFor="payment_receipt"
                    required
                    hint="Accepted formats: JPG, PNG, PDF. Maximum size: 5MB. Receipt files are not included in autosave."
                  >
                    <Input
                      id="payment_receipt"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleReceiptChange}
                    />
                    {receiptFileName ? (
                      <p className="text-xs text-muted-foreground">
                        Selected file: {receiptFileName}
                      </p>
                    ) : null}
                  </Field>

                  <Field
                    label="Bank Transaction Reference / Session ID"
                    htmlFor="transaction_reference"
                    required
                    hint="Example: 20394857291"
                  >
                    <Input
                      id="transaction_reference"
                      value={formData.transaction_reference}
                      placeholder="20394857291"
                      onChange={(event) =>
                        updateFormData("transaction_reference", event.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Payment Date" htmlFor="payment_date" required>
                    <Input
                      id="payment_date"
                      type="date"
                      value={formData.payment_date}
                      onChange={(event) => updateFormData("payment_date", event.target.value)}
                    />
                  </Field>

                  <Field label="Payment Method" required>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) => updateFormData("payment_method", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </StepSection>

              <StepSection
                id={formSections[4].id}
                index={5}
                title="Summit Experience"
                description="Help us understand your expectations and whether this is your first time joining."
              >
                <Field
                  label="What are you most excited about?"
                  htmlFor="summit_interest"
                  hint="Optional, but useful for programming and attendee experience."
                >
                  <Textarea
                    id="summit_interest"
                    rows={6}
                    placeholder="Tell us what you are most looking forward to."
                    value={formData.summit_interest}
                    onChange={(event) =>
                      updateFormData("summit_interest", event.target.value)
                    }
                  />
                </Field>

                <RadioChoiceField
                  label="Have you attended before?"
                  required
                  value={formData.attended_before}
                  onChange={(value) => updateFormData("attended_before", value)}
                />
              </StepSection>

              <StepSection
                id={formSections[5].id}
                index={6}
                title="Business and Networking"
                description="This helps us shape networking sessions and the attendee directory."
              >
                <RadioChoiceField
                  label="Do you run a business, brand, or organisation?"
                  required
                  value={formData.business_owner}
                  onChange={(value) => updateFormData("business_owner", value)}
                />

                {formData.business_owner === "yes" ? (
                  <Field label="Business Name" htmlFor="business_name" required>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      placeholder="Enter your business or organisation name"
                      onChange={(event) =>
                        updateFormData("business_name", event.target.value)
                      }
                    />
                  </Field>
                ) : null}

                <Field label="Industry" required>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => updateFormData("industry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <RadioChoiceField
                  label="Interested in networking opportunities?"
                  required
                  value={formData.networking_interest}
                  onChange={(value) => updateFormData("networking_interest", value)}
                />

                <RadioChoiceField
                  label="Include profile in attendee networking directory?"
                  required
                  value={formData.networking_directory}
                  onChange={(value) => updateFormData("networking_directory", value)}
                />
              </StepSection>

              <StepSection
                id={formSections[6].id}
                index={7}
                title="Additional Information"
                description="Share any support needs and tell us how you heard about the summit."
              >
                <Field
                  label="Dietary or Accessibility Requirements"
                  htmlFor="dietary_requirements"
                  hint="Optional."
                >
                  <Textarea
                    id="dietary_requirements"
                    rows={4}
                    placeholder="Let us know about any dietary, accessibility, or attendance support requirements."
                    value={formData.dietary_requirements}
                    onChange={(event) =>
                      updateFormData("dietary_requirements", event.target.value)
                    }
                  />
                </Field>

                <Field
                  label="Emergency Contact"
                  htmlFor="emergency_contact"
                  hint="Optional."
                >
                  <Input
                    id="emergency_contact"
                    value={formData.emergency_contact}
                    placeholder="Enter a contact name and phone number"
                    onChange={(event) =>
                      updateFormData("emergency_contact", event.target.value)
                    }
                  />
                </Field>

                <Field label="How did you hear about the summit?" required>
                  <Select
                    value={formData.referral_source}
                    onValueChange={(value) => updateFormData("referral_source", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a source" />
                    </SelectTrigger>
                    <SelectContent>
                      {referralSourceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </StepSection>

              <StepSection
                id={formSections[7].id}
                index={8}
                title="Consent and Confirmation"
                description="Review the final consent items before sending your registration."
              >
                <label className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <Checkbox
                    checked={formData.media_consent}
                    onCheckedChange={(checked) =>
                      updateFormData("media_consent", checked === true)
                    }
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Media Consent</p>
                    <p className="text-sm text-muted-foreground">
                      I consent to photography and video coverage during the summit.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <Checkbox
                    checked={formData.agreement}
                    onCheckedChange={(checked) =>
                      updateFormData("agreement", checked === true)
                    }
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Final Agreement</p>
                    <p className="text-sm text-muted-foreground">
                      I confirm that the information provided is accurate and my
                      payment details are correct.
                    </p>
                  </div>
                </label>
              </StepSection>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                      Live Registration Summary
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Reference: {formData.registration_reference}
                    </p>
                  </div>
                  <p className="text-2xl font-serif font-bold text-foreground">
                    {formatNaira(totalAmount)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Submit once all sections are complete. The receipt file must still be
                  uploaded even if the rest of the form has autosaved.
                </p>

                <Button type="submit" variant="gold" disabled={loading} className="sm:min-w-52">
                  {loading ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
