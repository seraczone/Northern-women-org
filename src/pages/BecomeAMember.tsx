import Layout from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BriefcaseBusiness, CalendarDays, Check, GraduationCap, HeartHandshake, Lightbulb, Network, Sparkles, Users } from "lucide-react";

const benefits = [
  { icon: Network, title: "Meaningful connections", description: "Meet women across professions, communities, and generations who share a commitment to growth and collective progress." },
  { icon: GraduationCap, title: "Professional development", description: "Access learning opportunities, mentorship conversations, skills sessions, and practical insights for your next step." },
  { icon: BriefcaseBusiness, title: "Entrepreneurship support", description: "Connect with peers, resources, and initiatives that can help Northern women-owned ideas and businesses grow." },
  { icon: HeartHandshake, title: "Community impact", description: "Participate in purpose-led projects and collaborative programs that create measurable change in communities." },
  { icon: Lightbulb, title: "Leadership opportunities", description: "Discover ways to contribute your voice, share your experience, and take on meaningful leadership roles." },
  { icon: CalendarDays, title: "Events and activities", description: "Stay close to summits, workshops, community conversations, networking gatherings, and member-focused activities." },
];

const activities = [
  { label: "01", title: "Learn", description: "Build confidence and practical skills through workshops, talks, and conversations with accomplished leaders." },
  { label: "02", title: "Connect", description: "Find collaborators, mentors, peers, and professionals who understand your ambitions and can strengthen your journey." },
  { label: "03", title: "Lead", description: "Use your expertise in community initiatives, committees, advocacy, mentoring, and NWI programs." },
  { label: "04", title: "Create impact", description: "Turn shared ideas into meaningful action for women, families, businesses, and communities across the North." },
];

const faqs = [
  { question: "Who can become a member?", answer: "Membership is open to women who support the mission and values of Northern Women Initiative, including professionals, entrepreneurs, students, community leaders, and advocates." },
  { question: "Is membership the same as Join Us?", answer: "No. Join Us remains a separate general interest experience. Become a Member is a dedicated membership page with its own route and information." },
  { question: "What happens after I apply?", answer: "The application process is being finalized. This foundation page provides membership information and an application placeholder only; no application is submitted yet." },
  { question: "Are membership fees required?", answer: "Membership options and pricing will be confirmed before applications and payments are enabled. This page does not collect payment or financial information." },
];

const scrollToSection = (sectionId: string) => {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function BecomeAMember() {
  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full border border-secondary/20" aria-hidden="true" />
        <div className="absolute -right-10 top-24 h-48 w-48 rounded-full border border-primary-foreground/10" aria-hidden="true" />
        <div className="container-section relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-secondary font-medium text-sm uppercase tracking-wider"><Sparkles size={16} aria-hidden="true" /> Membership</span>
            <h1 className="mt-4 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-6xl">Become a Member</h1>
            <p className="text-lg leading-relaxed text-primary-foreground/90 md:text-xl">Belong to a purposeful network of women shaping leadership, enterprise, and lasting impact across Northern Nigeria and beyond.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="gold" size="xl" onClick={() => scrollToSection("membership-application")}>Apply for Membership <ArrowRight size={20} aria-hidden="true" /></Button>
              <Button type="button" variant="heroOutline" size="xl" onClick={() => scrollToSection("membership-benefits")}>Explore Benefits</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative">
            <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-2xl bg-secondary/20" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-elevated">
              <div className="flex aspect-[5/4] items-center justify-center bg-gradient-warm p-8 text-center">
                <div>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card"><Users size={38} aria-hidden="true" /></div>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-secondary-foreground">A growing sisterhood</p>
                  <p className="mt-3 max-w-sm font-serif text-2xl font-semibold text-foreground">Women learning, leading, and lifting together.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground">Membership at NWI</span>
            <h2 className="mt-3 text-3xl font-serif font-bold text-foreground md:text-4xl">A community where your voice and vision matter</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Northern Women Initiative membership brings women together across careers, industries, cultures, and communities. It is a place to strengthen your skills, build trusted relationships, contribute expertise, and help create opportunities that endure.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Whether you are beginning a career, growing an enterprise, serving your community, or stepping into leadership, membership offers a space to connect purpose with progress.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {["A strong and supportive network", "Learning with purpose", "Leadership and visibility", "Shared community impact"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium"><Check size={18} className="shrink-0 text-primary" aria-hidden="true" /> {item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="membership-benefits" className="scroll-mt-24 section-padding bg-muted">
        <div className="container-section">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground">Why join</span>
            <h2 className="mt-3 text-3xl font-serif font-bold md:text-4xl">Membership that moves you forward</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Build relationships, develop professionally, contribute to community work, and be part of a network committed to women&apos;s advancement.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="card-hover rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><benefit.icon size={24} aria-hidden="true" /></div>
                <h3 className="text-xl font-serif font-semibold">{benefit.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="grid items-stretch gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-between rounded-3xl bg-gradient-hero p-8 text-primary-foreground shadow-elevated md:p-10">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-secondary">Membership plan</span>
                <h2 className="mt-3 text-3xl font-serif font-bold md:text-4xl">NWI Membership</h2>
                <p className="mt-5 leading-relaxed text-primary-foreground/80">Membership information and the final fee structure are being reviewed. The completed membership offer will provide clear pricing, benefits, and renewal details before applications open.</p>
              </div>
              <div className="mt-10 border-t border-primary-foreground/20 pt-7"><p className="text-sm text-primary-foreground/70">Pricing status</p><p className="mt-1 text-2xl font-serif font-semibold">To be confirmed</p></div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-7 shadow-card md:p-10">
              <h3 className="text-2xl font-serif font-bold">Membership may include</h3>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {["Member networking access", "Mentorship opportunities", "Learning and skills sessions", "Community project participation", "Entrepreneurship support", "NWI events and updates", "Leadership opportunities", "Collaborative partnerships"].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm leading-relaxed"><Check size={18} className="mt-0.5 shrink-0 text-secondary-foreground" aria-hidden="true" /><span>{item}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-section grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div><span className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground">What you can do</span><h2 className="mt-3 text-3xl font-serif font-bold md:text-4xl">Turn membership into meaningful action</h2><p className="mt-5 leading-relaxed text-muted-foreground">NWI membership is designed around active participation, shared learning, and impact—not simply belonging.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {activities.map((activity) => (
              <article key={activity.title} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card"><span className="absolute right-5 top-3 font-serif text-5xl font-bold text-primary/10">{activity.label}</span><h3 className="relative text-xl font-serif font-semibold">{activity.title}</h3><p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{activity.description}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section id="membership-application" className="scroll-mt-24 section-padding bg-background">
        <div className="container-section">
          <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-elevated lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-primary p-8 text-primary-foreground md:p-12">
              <span className="text-sm font-semibold uppercase tracking-wider text-secondary">Membership application</span>
              <h2 className="mt-3 text-3xl font-serif font-bold">Ready to take the next step?</h2>
              <p className="mt-5 leading-relaxed text-primary-foreground/80">The membership application experience is being prepared. It will collect the information needed for membership review and follow-up while keeping your details secure.</p>
              <div className="mt-8 space-y-4">{["Review membership information", "Complete the application", "Receive confirmation and next steps"].map((item, index) => (<div key={item} className="flex items-center gap-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-sm font-semibold">{index + 1}</span><span className="text-sm font-medium">{item}</span></div>))}</div>
            </div>
            <div className="flex min-h-[420px] items-center justify-center p-8 md:p-12">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20 text-secondary-foreground"><Sparkles size={28} aria-hidden="true" /></div>
                <h3 className="mt-6 text-2xl font-serif font-bold">Application opening soon</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">No application details or payments are collected on this page yet. For immediate engagement opportunities, visit our existing Join Us registration.</p>
                <Button variant="burgundy" size="lg" className="mt-7" asChild><a href="/join-us">Visit Join Us <ArrowRight size={18} aria-hidden="true" /></a></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-section grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div><span className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground">Terms and conditions</span><h2 className="mt-3 text-3xl font-serif font-bold">Membership guidelines</h2></div>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-card md:p-9"><p className="leading-relaxed text-muted-foreground">Membership terms, eligibility, code of conduct, fees, renewal, privacy, and cancellation guidelines will be presented clearly before applications are accepted. Until that process is published, membership registration and payment are not active on this page.</p><p className="mt-4 text-sm text-muted-foreground">NWI values respectful participation, transparency, inclusion, data protection, and conduct that supports the dignity and wellbeing of our community.</p></div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div><span className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground">Frequently asked questions</span><h2 className="mt-3 text-3xl font-serif font-bold">Questions about membership</h2><p className="mt-4 leading-relaxed text-muted-foreground">Find quick answers to the most important questions about the dedicated membership experience.</p></div>
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6 shadow-card md:px-8">
            {faqs.map((faq, index) => (<AccordionItem key={faq.question} value={`item-${index}`}><AccordionTrigger className="text-left text-base font-semibold">{faq.question}</AccordionTrigger><AccordionContent className="pr-6 text-base leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>))}
          </Accordion>
        </div>
      </section>

      <section className="bg-primary py-16 md:py-20">
        <div className="container-section text-center">
          <h2 className="text-3xl font-serif font-bold text-primary-foreground md:text-4xl">Join a network built for lasting impact</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">Stay connected with Northern Women Initiative and continue your journey through our community.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button variant="gold" size="xl" asChild><a href="/join-us">Join Us <ArrowRight size={20} aria-hidden="true" /></a></Button><Button variant="heroOutline" size="xl" onClick={() => scrollToSection("membership-benefits")}>Review Benefits</Button></div>
        </div>
      </section>
    </Layout>
  );
}
