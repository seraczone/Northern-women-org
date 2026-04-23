import { useState } from "react";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { saveRegistrationByEmail } from "@/lib/saveRegistrationByEmail";

const reasonsToJoin = [
  "Connect with a growing network of Northern women making real impact.",
  "Get updates on mentorship, community projects, and partner opportunities.",
  "Register your interest directly with the initiative for follow-up.",
];

export default function JoinUs() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error, wasUpdate } = await saveRegistrationByEmail({
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

    setLoading(false);

    if (error) {
      toast({
        title: "Unable to save registration",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: wasUpdate ? "Registration updated" : "Registration submitted",
      description: wasUpdate
        ? "Your existing Join Us registration has been updated."
        : "Your Join Us registration has been received successfully.",
    });

    setFormData({
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
    });
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Join Us
            </span>
            <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
              Register to Join the Initiative
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Submit your details here to join Northern Women Initiative. This form is
              separate from event registration and volunteer applications.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Join Us Registration Form
              </h2>
              <p className="mt-2 text-muted-foreground">
                Complete the form and the team can follow up from the dedicated Join Us
                records.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="firstName"
                  placeholder="First name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  name="lastName"
                  placeholder="Last name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  name="occupation"
                  placeholder="Occupation"
                  required
                  value={formData.occupation}
                  onChange={handleChange}
                />
              </div>

              <Input
                name="residentialAddress"
                placeholder="Residential Address"
                required
                value={formData.residentialAddress}
                onChange={handleChange}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="localGovernment"
                  placeholder="Local Government"
                  required
                  value={formData.localGovernment}
                  onChange={handleChange}
                />
                <Input
                  name="townCity"
                  placeholder="Town/City"
                  required
                  value={formData.townCity}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="state"
                  placeholder="State"
                  required
                  value={formData.state}
                  onChange={handleChange}
                />
                <Input
                  name="country"
                  placeholder="Country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <Textarea
                name="message"
                rows={5}
                placeholder="Tell us briefly how you want to be involved."
                value={formData.message}
                onChange={handleChange}
              />

              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="text-xl font-serif font-semibold text-foreground">
                What happens after submission
              </h3>
              <ul className="mt-4 space-y-3">
                {reasonsToJoin.map((item) => (
                  <li key={item} className="rounded-xl bg-muted/70 p-4 text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
