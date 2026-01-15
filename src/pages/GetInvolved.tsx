import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Heart, Handshake, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const volunteerOpportunities = [
  "Event planning and coordination",
  "Teaching and mentorship",
  "Administrative support",
  "Community outreach",
  "Social media and communications",
  "Fundraising support",
];

const partnershipBenefits = [
  "Brand visibility at all events",
  "Recognition in publications",
  "Networking opportunities",
  "Community impact association",
  "Tax-deductible contributions",
  "Custom partnership packages",
];

const GetInvolved = () => {
  const { toast } = useToast();
  const [formType, setFormType] = useState<"volunteer" | "donate" | "partner">("volunteer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your interest!",
      description: "We'll be in touch with you shortly.",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">Get Involved</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
              Join Our Movement
            </h1>
            <p className="text-lg text-primary-foreground/90">
              There are many ways to be part of Northern Women Initiative. Choose how you'd like to contribute.
            </p>
          </div>
        </div>
      </section>

      {/* Involvement Options */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <button
              onClick={() => setFormType("volunteer")}
              className={`p-8 rounded-2xl text-left transition-all ${
                formType === "volunteer"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Users size={32} className={formType === "volunteer" ? "text-secondary" : "text-primary"} />
              <h3 className="font-serif text-xl font-semibold mt-4 mb-2">Volunteer</h3>
              <p className={formType === "volunteer" ? "text-primary-foreground/80" : "text-muted-foreground"}>
                Share your time and skills to empower Northern women.
              </p>
            </button>
            <button
              onClick={() => setFormType("donate")}
              className={`p-8 rounded-2xl text-left transition-all ${
                formType === "donate"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Heart size={32} className={formType === "donate" ? "text-secondary" : "text-primary"} />
              <h3 className="font-serif text-xl font-semibold mt-4 mb-2">Donate</h3>
              <p className={formType === "donate" ? "text-primary-foreground/80" : "text-muted-foreground"}>
                Your contribution helps us reach more women.
              </p>
            </button>
            <button
              onClick={() => setFormType("partner")}
              className={`p-8 rounded-2xl text-left transition-all ${
                formType === "partner"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Handshake size={32} className={formType === "partner" ? "text-secondary" : "text-primary"} />
              <h3 className="font-serif text-xl font-semibold mt-4 mb-2">Partner With Us</h3>
              <p className={formType === "partner" ? "text-primary-foreground/80" : "text-muted-foreground"}>
                Collaborate for greater impact.
              </p>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                {formType === "volunteer" && "Become a Volunteer"}
                {formType === "donate" && "Make a Donation"}
                {formType === "partner" && "Partner With Us"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
                    <Input placeholder="Your first name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
                    <Input placeholder="Your last name" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                  <Input type="tel" placeholder="+234 XXX XXX XXXX" />
                </div>
                {formType === "partner" && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Organization Name</label>
                    <Input placeholder="Your organization" />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                  <Textarea
                    placeholder={
                      formType === "volunteer"
                        ? "Tell us about your skills and availability..."
                        : formType === "donate"
                        ? "Any specific cause you'd like to support?"
                        : "Tell us about your organization and partnership interests..."
                    }
                    rows={4}
                  />
                </div>
                <Button variant="gold" size="lg" type="submit" className="w-full">
                  {formType === "volunteer" && "Submit Application"}
                  {formType === "donate" && "Proceed to Donate"}
                  {formType === "partner" && "Send Partnership Inquiry"}
                  <ArrowRight size={18} />
                </Button>
              </form>
            </div>

            {/* Info */}
            <div>
              {formType === "volunteer" && (
                <>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                    Volunteer Opportunities
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We welcome volunteers with diverse skills and backgrounds. Here are some ways you can contribute:
                  </p>
                  <ul className="space-y-3">
                    {volunteerOpportunities.map((opportunity) => (
                      <li key={opportunity} className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-secondary flex-shrink-0" />
                        <span className="text-muted-foreground">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {formType === "donate" && (
                <>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                    Your Impact
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Every donation directly supports our programs and initiatives. Here's how your contribution helps:
                  </p>
                  <div className="space-y-6">
                    <div className="bg-muted rounded-xl p-6">
                      <div className="text-3xl font-serif font-bold text-primary mb-2">₦10,000</div>
                      <p className="text-muted-foreground">Provides educational materials for 5 girls</p>
                    </div>
                    <div className="bg-muted rounded-xl p-6">
                      <div className="text-3xl font-serif font-bold text-primary mb-2">₦50,000</div>
                      <p className="text-muted-foreground">Sponsors a woman for skill acquisition training</p>
                    </div>
                    <div className="bg-muted rounded-xl p-6">
                      <div className="text-3xl font-serif font-bold text-primary mb-2">₦100,000</div>
                      <p className="text-muted-foreground">Funds a community outreach program</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6">
                    All donations are transparently managed and reported. We're committed to accountability.
                  </p>
                </>
              )}
              {formType === "partner" && (
                <>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                    Partnership Benefits
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Partner with us and align your organization with a movement that's transforming communities.
                  </p>
                  <ul className="space-y-3">
                    {partnershipBenefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-secondary flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted">
        <div className="container-section text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out and let's discuss how we can work together.
          </p>
          <Button variant="burgundy" size="lg" asChild>
            <a href="/contact">
              Contact Us
              <ArrowRight size={18} />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;
