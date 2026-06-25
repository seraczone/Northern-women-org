import { useState } from "react";
import { ArrowLeft, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  EventFeedbackFormData,
  eventFeedbackInitialFormData,
  toNullableFeedbackValue,
} from "@/lib/eventFeedback";
import { supabase } from "@/lib/supabase";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}

export default function EventFeedback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<EventFeedbackFormData>(
    eventFeedbackInitialFormData,
  );

  const updateFormData = <Key extends keyof EventFeedbackFormData>(
    key: Key,
    value: EventFeedbackFormData[Key],
  ) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.full_name.trim().length < 3) {
      toast({
        title: "Full name required",
        description: "Enter your full name using at least 3 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.joined_reason.trim()) {
      toast({
        title: "Tell us about you",
        description: "Please share what made you join Northern Women.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.experience.trim()) {
      toast({
        title: "Experience required",
        description: "Please describe your experience with Northern Women so far.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.consent) {
      toast({
        title: "Consent required",
        description: "Please confirm that Northern Women can review your feedback.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("event_feedback").insert([
      {
        full_name: formData.full_name.trim(),
        business_name: toNullableFeedbackValue(formData.business_name),
        social_handle: toNullableFeedbackValue(formData.social_handle),
        contact_number: toNullableFeedbackValue(formData.contact_number),
        joined_reason: formData.joined_reason.trim(),
        experience: formData.experience.trim(),
        expectations: toNullableFeedbackValue(formData.expectations),
        requested_support: toNullableFeedbackValue(formData.requested_support),
        improvement_areas: toNullableFeedbackValue(formData.improvement_areas),
        suggestions: toNullableFeedbackValue(formData.suggestions),
        final_message: toNullableFeedbackValue(formData.final_message),
        consent: formData.consent,
      },
    ]);

    setLoading(false);

    if (error) {
      toast({
        title: "Unable to submit feedback",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    setFormData(eventFeedbackInitialFormData);
    toast({
      title: "Feedback submitted",
      description: "Thank you. Your voice helps shape Northern Women.",
    });
  };

  if (submitted) {
    return (
      <Layout>
        <section className="bg-gradient-hero py-20">
          <div className="container-section">
            <span className="text-secondary text-sm font-medium uppercase">
              Feedback
            </span>
            <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
              Thank You for Your Contribution
            </h1>
            <p className="max-w-3xl text-lg text-primary-foreground/90">
              Your response has been received. Your voice helps shape Northern Women.
            </p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-section max-w-3xl">
            <div className="rounded-[2rem] border bg-card p-8 shadow-card md:p-10">
              <div className="flex items-center gap-3 text-primary">
                <CheckCircle2 className="h-8 w-8" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Feedback Submitted
                </p>
              </div>
              <h2 className="mt-6 text-3xl font-serif font-bold text-foreground">
                Thank you for helping us grow and better serve our community.
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="gold" onClick={() => setSubmitted(false)}>
                  Submit Another Response
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
            Northern Women Feedback Form
          </span>
          <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
            Share Your Feedback
          </h1>
          <p className="max-w-3xl text-lg text-primary-foreground/90">
            Thank you for taking the time to complete this form. Your responses
            will help us grow and better serve our community.
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

          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="rounded-[2rem] border bg-card p-7 shadow-card lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Feedback Areas
                </p>
              </div>
              <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <p>Personal details</p>
                <p>Your reason for joining</p>
                <p>Your experience so far</p>
                <p>Future expectations and support needs</p>
                <p>Suggestions for future events and programs</p>
              </div>
            </aside>

            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border bg-card p-6 shadow-card md:p-8"
            >
              <div className="space-y-8">
                <section className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      1. Personal Details
                    </p>
                    <h2 className="mt-2 text-2xl font-serif font-bold">
                      Tell us who you are
                    </h2>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name" htmlFor="full_name" required>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        placeholder="Enter your full name"
                        onChange={(event) =>
                          updateFormData("full_name", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Business Name (if applicable)" htmlFor="business_name">
                      <Input
                        id="business_name"
                        value={formData.business_name}
                        placeholder="Enter your business name"
                        onChange={(event) =>
                          updateFormData("business_name", event.target.value)
                        }
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Instagram / Business Handle (if applicable)"
                      htmlFor="social_handle"
                    >
                      <Input
                        id="social_handle"
                        value={formData.social_handle}
                        placeholder="@yourhandle"
                        onChange={(event) =>
                          updateFormData("social_handle", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Contact Number (optional)" htmlFor="contact_number">
                      <Input
                        id="contact_number"
                        type="tel"
                        value={formData.contact_number}
                        placeholder="08012345678"
                        onChange={(event) =>
                          updateFormData("contact_number", event.target.value)
                        }
                      />
                    </Field>
                  </div>
                </section>

                <section className="space-y-5">
                  <Field label="2. What made you join Northern Women?" required>
                    <Textarea
                      rows={4}
                      value={formData.joined_reason}
                      placeholder="Share what drew you to Northern Women."
                      onChange={(event) =>
                        updateFormData("joined_reason", event.target.value)
                      }
                    />
                  </Field>

                  <Field
                    label="3. How would you describe your experience with Northern Women so far?"
                    required
                  >
                    <Textarea
                      rows={4}
                      value={formData.experience}
                      placeholder="Tell us about your experience so far."
                      onChange={(event) =>
                        updateFormData("experience", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="4. What do you hope to gain from being part of Northern Women going forward?">
                    <Textarea
                      rows={4}
                      value={formData.expectations}
                      placeholder="Share your hopes and expectations."
                      onChange={(event) =>
                        updateFormData("expectations", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="5. What kind of support, events, or opportunities would you like Northern Women to provide?">
                    <Textarea
                      rows={4}
                      value={formData.requested_support}
                      placeholder="Tell us what would support you best."
                      onChange={(event) =>
                        updateFormData("requested_support", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="6. What areas do you think Northern Women can improve on?">
                    <Textarea
                      rows={4}
                      value={formData.improvement_areas}
                      placeholder="Share any areas we can improve."
                      onChange={(event) =>
                        updateFormData("improvement_areas", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="7. Do you have any ideas, suggestions, or topics you would like us to cover in future events or programs?">
                    <Textarea
                      rows={4}
                      value={formData.suggestions}
                      placeholder="Share future event or program ideas."
                      onChange={(event) =>
                        updateFormData("suggestions", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="8. Any other comments or feedback you would like to share?">
                    <Textarea
                      rows={4}
                      value={formData.final_message}
                      placeholder="Add any final message."
                      onChange={(event) =>
                        updateFormData("final_message", event.target.value)
                      }
                    />
                  </Field>
                </section>

                <label className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <Checkbox
                    checked={formData.consent}
                    onCheckedChange={(checked) =>
                      updateFormData("consent", checked === true)
                    }
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Final Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      I confirm that Northern Women can review this feedback to
                      improve future events, programs, and community support.
                    </p>
                  </div>
                </label>

                <Button
                  type="submit"
                  variant="gold"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
