import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const volunteerOpportunities = [
  "Event planning and coordination",
  "Teaching and mentorship",
  "Administrative support",
  "Community outreach",
  "Social media and communications",
  "Fundraising support",
];

const GetInvolved = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("volunteer_applications")
      .insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
      ]);

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Application submitted!",
      description: "Thank you for volunteering. We’ll be in touch soon.",
    });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });

    setLoading(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Get Involved
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
              Become a Volunteer
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Use your skills to empower women and communities.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-background">
        <div className="container-section grid lg:grid-cols-2 gap-12">
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-secondary" size={28} />
              <h2 className="text-2xl font-serif font-bold">
                Volunteer Application
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                name="phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={formData.phone}
                onChange={handleChange}
              />

              <Textarea
                name="message"
                rows={4}
                placeholder="Tell us about your skills and availability..."
                value={formData.message}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
                <ArrowRight size={18} />
              </Button>
            </form>
          </div>

          {/* Opportunities */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">
              Volunteer Opportunities
            </h3>
            <ul className="space-y-3">
              {volunteerOpportunities.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-secondary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;
