import { useState } from "react";
import { ArrowRight, CheckCircle2, Handshake, HeartHandshake, Megaphone, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { saveRegistrationByEmail } from "@/lib/saveRegistrationByEmail";

const pathways = [
  { title: "Volunteer", description: "Offer your time, skills, or professional experience to support NWI initiatives.", icon: HeartHandshake },
  { title: "Community outreach", description: "Express interest in community programmes and local engagement activities.", icon: Megaphone },
  { title: "Programme participation", description: "Stay informed about programmes, workshops, and activities.", icon: Users },
  { title: "Partnership and collaboration", description: "Explore opportunities to work with NWI as an organisation or individual.", icon: Handshake },
];

const initialFormData = {
  firstName: "", lastName: "", dateOfBirth: "", phone: "", email: "", occupation: "",
  residentialAddress: "", localGovernment: "", townCity: "", state: "", country: "",
  interestArea: "General interest", message: "",
};

export default function JoinUs() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const today = new Date().toISOString().slice(0, 10);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.interestArea === "Membership information") {
      window.location.assign("/become-a-member");
      return;
    }
    setLoading(true);
    try {
      const { error, notificationError, wasUpdate } = await saveRegistrationByEmail({
        table: "join_us_registrations",
        email: formData.email,
        payload: {
          first_name: formData.firstName, last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth, phone: formData.phone,
          occupation: formData.occupation, residential_address: formData.residentialAddress,
          local_government: formData.localGovernment, town_city: formData.townCity,
          state: formData.state, country: formData.country, interest_area: formData.interestArea,
          message: formData.message,
        },
      });
      if (error) {
        toast({ title: "Unable to submit your interest", description: error.message, variant: "destructive" });
        return;
      }
      toast({
        title: wasUpdate ? "Your details have been updated" : "Thank you for getting involved",
        description: notificationError
          ? "Your Join Us submission was saved, but the confirmation email could not be sent. The NWI team may follow up."
          : "Your Join Us submission has been received. The NWI team may follow up with relevant information.",
        variant: notificationError ? "destructive" : "default",
      });
      setFormData(initialFormData);
    } catch (error) {
      toast({ title: "Something went wrong", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container-section">
          <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium uppercase tracking-wider"><Sparkles size={16} /> Get involved</span>
          <h1 className="mt-3 mb-5 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">Join Us in Creating Meaningful Impact</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-primary-foreground/90">Connect with Northern Women Initiative and be part of programmes, opportunities and activities supporting women, communities, business growth and empowerment.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" asChild><a href="#join-form">Get Involved <ArrowRight size={18} /></a></Button>
            <Button variant="heroOutline" size="lg" asChild><Link to="/become-a-member">Explore Membership</Link></Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground">Ways to participate</span>
            <h2 className="mt-3 text-3xl font-serif font-bold md:text-4xl">There are many ways to get involved</h2>
            <p className="mt-4 text-muted-foreground">Choose the kind of connection that best reflects your interests. General Join Us registration is free and does not create paid membership.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={24} /></div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <a href="#join-form" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Express interest <ArrowRight size={16} /></a>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-muted p-6 sm:flex sm:items-center sm:justify-between">
            <div><h3 className="font-serif text-xl font-semibold">Interested in formal membership?</h3><p className="mt-1 text-sm text-muted-foreground">Explore the separate one-year NWI membership programme, fees, benefits and terms.</p></div>
            <Button className="mt-4 sm:mt-0" variant="burgundy" asChild><Link to="/become-a-member">Become a Member <ArrowRight size={17} /></Link></Button>
          </div>
        </div>
      </section>

      <section id="join-form" className="section-padding scroll-mt-24 bg-muted">
        <div className="container-section grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-serif font-bold">Tell us how you would like to connect</h2>
            <p className="mt-2 text-sm text-muted-foreground">This is a general interest form, not a paid membership application. Fields marked * are required.</p>
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><label htmlFor="firstName" className="text-sm font-medium">First name *</label><Input id="firstName" name="firstName" autoComplete="given-name" required value={formData.firstName} onChange={handleChange} /></div>
                <div className="space-y-2"><label htmlFor="lastName" className="text-sm font-medium">Last name *</label><Input id="lastName" name="lastName" autoComplete="family-name" required value={formData.lastName} onChange={handleChange} /></div>
                <div className="space-y-2"><label htmlFor="dateOfBirth" className="text-sm font-medium">Date of birth *</label><Input id="dateOfBirth" name="dateOfBirth" type="date" max={today} required value={formData.dateOfBirth} onChange={handleChange} /></div>
                <div className="space-y-2"><label htmlFor="phone" className="text-sm font-medium">Phone *</label><Input id="phone" name="phone" type="tel" autoComplete="tel" required value={formData.phone} onChange={handleChange} /></div>
                <div className="space-y-2"><label htmlFor="email" className="text-sm font-medium">Email *</label><Input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} /></div>
                <div className="space-y-2"><label htmlFor="occupation" className="text-sm font-medium">Occupation *</label><Input id="occupation" name="occupation" required value={formData.occupation} onChange={handleChange} /></div>
              </div>
              <div className="space-y-2"><label htmlFor="residentialAddress" className="text-sm font-medium">Residential address *</label><Input id="residentialAddress" name="residentialAddress" autoComplete="street-address" required value={formData.residentialAddress} onChange={handleChange} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><label htmlFor="localGovernment" className="text-sm font-medium">Local Government *</label><Input id="localGovernment" name="localGovernment" required value={formData.localGovernment} onChange={handleChange} /></div>
                <div className="space-y-2"><label htmlFor="townCity" className="text-sm font-medium">Town/City *</label><Input id="townCity" name="townCity" required value={formData.townCity} onChange={handleChange} /></div>
                <div className="space-y-2"><label htmlFor="state" className="text-sm font-medium">State *</label><Input id="state" name="state" autoComplete="address-level1" required value={formData.state} onChange={handleChange} /></div>
                <div className="space-y-2"><label htmlFor="country" className="text-sm font-medium">Country *</label><Input id="country" name="country" autoComplete="country-name" required value={formData.country} onChange={handleChange} /></div>
              </div>
              <div className="space-y-2"><label htmlFor="interestArea" className="text-sm font-medium">Area of interest *</label><select id="interestArea" name="interestArea" value={formData.interestArea} onChange={handleChange} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option>General interest</option><option>Volunteer</option><option>Community outreach</option><option>Programmes and activities</option><option>Partnership/collaboration</option><option>Support NWI initiatives</option><option>Membership information</option><option>Other</option></select></div>
              <div className="space-y-2"><label htmlFor="message" className="text-sm font-medium">Message <span className="font-normal text-muted-foreground">(optional)</span></label><Textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Tell us about your interests, skills, or questions." /></div>
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>{loading ? "Submitting..." : "Submit Join Us Interest"} {!loading && <ArrowRight size={18} />}</Button>
              <p className="text-center text-xs text-muted-foreground">Submitting this form does not register you as a paid member.</p>
            </form>
          </div>
          <aside className="rounded-2xl bg-card p-7 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><CheckCircle2 size={25} /></div>
            <h2 className="mt-5 text-2xl font-serif font-bold">What happens next?</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">Your details will be shared with the NWI team for general interest and follow-up. Submission does not guarantee programme placement, partnership, or any specific opportunity.</p>
            <div className="mt-6 border-t border-border pt-6"><h3 className="font-semibold">Looking for membership?</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Formal membership has its own application, annual fee, benefits and policies.</p><Button variant="outline" className="mt-4 w-full" asChild><Link to="/become-a-member">View membership programme <ArrowRight size={16} /></Link></Button></div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
