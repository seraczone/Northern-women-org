import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { saveRegistrationByEmail } from "@/lib/saveRegistrationByEmail";

export default function RegisterSummit2026() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "",
    occupation: "",
    organization: "",
    expectations: "",
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
      table: "summit_2026_registrations",
      email: formData.email,
      payload: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
        state: formData.state,
        country: formData.country,
        occupation: formData.occupation,
        organization: formData.organization,
        expectations: formData.expectations,
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
        ? "Your Northern Women Summit 2026 registration has been updated."
        : "Your Northern Women Summit 2026 registration has been received.",
    });

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      country: "",
      occupation: "",
      organization: "",
      expectations: "",
    });
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <span className="text-secondary uppercase text-sm font-medium">
            Summit Registration
          </span>
          <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
            Northern Women Summit 2026
          </h1>
          <p className="text-lg text-primary-foreground/90">
            This registration is separate from Join Us and Get Involved, with its own
            database records and its own admin page.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate("/events")}
            >
              <ArrowLeft size={16} /> Back to Events
            </Button>

            <div className="rounded-2xl border border-border bg-muted p-8">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Event Details
              </h2>

              <div className="mt-6 space-y-4 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-primary" />
                  <span>November 1, 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary" />
                  <span>Northern Nigeria</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-primary" />
                  <span>500+ attendees expected</span>
                </div>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                The extra fields below help the team plan communication and attendance
                support for the summit.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border bg-card p-8 shadow-card"
          >
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Register Now
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fill in your details to reserve your place at the summit.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="first_name"
                placeholder="First Name"
                required
                value={formData.first_name}
                onChange={handleChange}
              />
              <Input
                name="last_name"
                placeholder="Last Name"
                required
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              name="address"
              placeholder="Residential Address"
              required
              value={formData.address}
              onChange={handleChange}
            />

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

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="occupation"
                placeholder="Occupation"
                required
                value={formData.occupation}
                onChange={handleChange}
              />
              <Input
                name="organization"
                placeholder="Organization or Business"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>

            <Textarea
              name="expectations"
              rows={5}
              placeholder="What are you hoping to gain from the summit?"
              value={formData.expectations}
              onChange={handleChange}
            />

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Complete Summit Registration"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
