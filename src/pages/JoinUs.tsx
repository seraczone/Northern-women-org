import { useState } from "react";
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { saveRegistrationByEmail } from "@/lib/saveRegistrationByEmail";

const memberBenefits = [
  "Connect with a growing network of Northern women making a difference.",
  "Hear about mentorship, community projects, and partner opportunities.",
  "Share your experience and let us know how you would like to contribute.",
];

const initialFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  occupation: "",
  residentialAddress: "",
  localGovernment: "",
  townCity: "",
  state: "",
  country: "",
  message: "",
};

export default function JoinUs() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const today = new Date().toISOString().slice(0, 10);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error, notificationError, wasUpdate } = await saveRegistrationByEmail({
        table: "join_us_registrations",
        email: formData.email,
        payload: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth,
          phone: formData.phone,
          occupation: formData.occupation,
          residential_address: formData.residentialAddress,
          local_government: formData.localGovernment,
          town_city: formData.townCity,
          state: formData.state,
          country: formData.country,
          message: formData.message,
        },
      });

      if (error) {
        toast({
          title: "Unable to submit your application",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (notificationError) {
        toast({
          title: wasUpdate ? "Your details are updated" : "Application received",
          description: wasUpdate
            ? "Your membership details were updated, but we could not send the email confirmation yet."
            : "Your application was received, but we could not send the email confirmation yet.",
          variant: "destructive",
        });
      } else {
        toast({
          title: wasUpdate ? "Your details are updated" : "Welcome to the movement!",
          description: wasUpdate
            ? "Your membership details have been updated successfully."
            : "Thank you for your interest. Our team will be in touch soon.",
        });
      }

      setFormData(initialFormData);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description:
          error instanceof Error
            ? error.message
            : "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-secondary font-medium text-sm uppercase tracking-wider">
              <Sparkles size={16} aria-hidden="true" /> Join the movement
            </span>
            <h1 className="mt-3 mb-5 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
              Become a Member
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
              Be part of a community creating more opportunities for women and girls
              across Northern Nigeria. Tell us a little about yourself to get started.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary-foreground">
                Membership application
              </p>
              <h2 className="mt-2 text-2xl font-serif font-bold text-foreground">
                Let&apos;s get to know you
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Fields marked <span className="font-semibold text-foreground">*</span> are required.
                Your information helps our team connect you with relevant updates and opportunities.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First name <span aria-hidden="true">*</span></label>
                  <Input id="firstName" name="firstName" autoComplete="given-name" placeholder="First name" required value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last name <span aria-hidden="true">*</span></label>
                  <Input id="lastName" name="lastName" autoComplete="family-name" placeholder="Last name" required value={formData.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of birth <span aria-hidden="true">*</span></label>
                  <Input id="dateOfBirth" type="date" name="dateOfBirth" autoComplete="bday" max={today} required value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone number <span aria-hidden="true">*</span></label>
                  <Input id="phone" type="tel" name="phone" autoComplete="tel" placeholder="Phone number" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email address <span aria-hidden="true">*</span></label>
                  <Input id="email" type="email" name="email" autoComplete="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="occupation" className="text-sm font-medium">Occupation <span aria-hidden="true">*</span></label>
                  <Input id="occupation" name="occupation" autoComplete="organization-title" placeholder="Your occupation" required value={formData.occupation} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="residentialAddress" className="text-sm font-medium">Residential address <span aria-hidden="true">*</span></label>
                <Input id="residentialAddress" name="residentialAddress" autoComplete="street-address" placeholder="Street address" required value={formData.residentialAddress} onChange={handleChange} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="localGovernment" className="text-sm font-medium">Local government area <span aria-hidden="true">*</span></label>
                  <Input id="localGovernment" name="localGovernment" placeholder="Local government area" required value={formData.localGovernment} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="townCity" className="text-sm font-medium">Town or city <span aria-hidden="true">*</span></label>
                  <Input id="townCity" name="townCity" autoComplete="address-level2" placeholder="Town or city" required value={formData.townCity} onChange={handleChange} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">State <span aria-hidden="true">*</span></label>
                  <Input id="state" name="state" autoComplete="address-level1" placeholder="State" required value={formData.state} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">Country <span aria-hidden="true">*</span></label>
                  <Input id="country" name="country" autoComplete="country-name" placeholder="Country" required value={formData.country} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">How would you like to be involved? <span className="font-normal text-muted-foreground">(optional)</span></label>
                <Textarea id="message" name="message" rows={4} placeholder="Share your interests, skills, or what inspired you to join." value={formData.message} onChange={handleChange} />
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                {loading ? "Submitting your application..." : "Submit membership application"}
                {!loading && <ArrowRight size={18} aria-hidden="true" />}
              </Button>
              <p className="flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                Your details are shared with our team for membership follow-up only.
              </p>
            </form>
          </div>

          <aside className="space-y-6 lg:pt-2">
            <div className="rounded-2xl bg-muted/70 p-6 sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HeartHandshake size={25} aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-serif font-bold">A community that moves forward together</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Membership is a way to stay connected with the Northern Women Initiative
                and discover ways to support our shared work.
              </p>
              <ul className="mt-6 space-y-4">
                {memberBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-foreground">
                  <CheckCircle2 size={20} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-serif font-semibold">What happens next?</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Once you submit your details, our team will review your interest and
                follow up with information about the initiative and ways to stay involved.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
