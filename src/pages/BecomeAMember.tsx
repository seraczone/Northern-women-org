import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Handshake, Lightbulb, Network, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const benefits = [
  { icon: GraduationCap, title: "Mentorship and coaching classes", description: "Learn through guided mentorship and coaching sessions." },
  { icon: Lightbulb, title: "Workshops and capacity building", description: "Develop practical knowledge and skills through workshops." },
  { icon: Network, title: "Members' interaction and networking", description: "Build relationships and exchange ideas with fellow members." },
  { icon: Handshake, title: "Business problem-solving support", description: "Connect with peers to discuss challenges and explore practical solutions." },
  { icon: Users, title: "Collaborative content creation", description: "Collaborate on content highlighting members, their work and shared learning." },
  { icon: CheckCircle2, title: "Access to discounted opportunities", description: "Receive information about eligible discounted opportunities made available to members." },
  { icon: Users, title: "Participation in NWI activities", description: "Take part in scheduled member activities in line with programme arrangements." },
];
const activities = [
  ["Ramadan Feeding Programme", "An organisational community support activity. Members may have opportunities to participate when activities are scheduled."],
  ["Community Outreach and Empowerment Programme", "NWI outreach and empowerment work that members may be invited to support."],
  ["Organisational Content Creation", "Collaborative content work that supports NWI communication and visibility."],
];
const policyVersion = "2026-11-21";
const initial = {
  first_name:"", last_name:"", date_of_birth:"", phone:"", email:"", occupation:"",
  business_name:"", business_category:"", residential_address:"", local_government:"",
  town_city:"", state:"", country:"Nigeria", membership_type:"new" as "new"|"renewal",
  membership_year:String(new Date().getFullYear()), terms_accepted:false,
  conduct_accepted:false, privacy_accepted:false,
};
const money = (amount:number) => new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(amount);

export default function BecomeAMember() {
  const { toast } = useToast();
  const [step,setStep] = useState(1);
  const [form,setForm] = useState(initial);
  const [submitting,setSubmitting] = useState(false);
  const [submitted,setSubmitted] = useState(false);
  const fee = form.membership_type === "new" ? 40000 : 30000;
  const year = Number(form.membership_year);
  const expiry = useMemo(() => new Date(year,11,31).toLocaleDateString("en-NG",{day:"numeric",month:"long",year:"numeric"}),[year]);
  const today = new Date().toISOString().slice(0,10);
  const update = (event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm(current => ({...current,[target.name]:value}));
  };
  const next = () => {
    const required:Record<number,(keyof typeof form)[]> = {
      1:["first_name","last_name","date_of_birth","phone","email"],
      2:["occupation","residential_address","local_government","town_city","state","country"],
    };
    if ((required[step] || []).some(key => !String(form[key]).trim())) {
      toast({title:"Complete the required fields",description:"Please fill in all required information before continuing.",variant:"destructive"});
      return;
    }
    setStep(current => Math.min(4,current+1));
  };
  const submit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.terms_accepted || !form.conduct_accepted || !form.privacy_accepted) {
      toast({title:"Please accept all membership acknowledgements",variant:"destructive"}); return;
    }
    setSubmitting(true);
    const {error} = await supabase.from("membership_applications").insert({
      ...form,membership_year:year,fee,expiry_date:`${year}-12-31`,
      accepted_at:new Date().toISOString(),policy_version:policyVersion,
    });
    setSubmitting(false);
    if (error) {
      toast({title:error.code==="23505"?"Application already exists":"Unable to submit application",
        description:error.code==="23505"?"An application for this email and membership year already exists. Please contact NWI for help with a renewal or correction.":error.message,variant:"destructive"});
      return;
    }
    setSubmitted(true);
  };

  return <Layout>
    <section className="bg-gradient-hero py-16 md:py-20"><div className="container-section max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-secondary">NWI annual membership</p>
      <h1 className="mt-3 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">Grow, Connect, Learn and Build Together</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-primary-foreground/90">Join the Northern Women Initiative membership community and access mentorship, business development, networking, collaboration and opportunities for growth.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button variant="gold" size="lg" asChild><a href="#membership-benefits">Explore Membership</a></Button><Button variant="heroOutline" size="lg" asChild><a href="#membership-application">Register as a Member</a></Button></div>
    </div></section>
    <section id="membership-benefits" className="section-padding bg-background"><div className="container-section">
      <div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-serif font-bold md:text-4xl">What membership includes</h2><p className="mt-4 text-muted-foreground">The membership package includes the following programme benefits.</p></div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(({icon:Icon,title,description})=><article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={22}/></div><h3 className="font-serif text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></article>)}</div>
    </div></section>
    <section className="section-padding bg-muted"><div className="container-section"><h2 className="text-center text-3xl font-serif font-bold">Annual membership fees</h2><div className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-7 text-center"><p className="text-sm font-semibold uppercase text-muted-foreground">New member</p><p className="mt-3 text-4xl font-bold text-primary">{money(40000)}</p><p className="mt-2 text-sm text-muted-foreground">One-year membership</p></div>
      <div className="rounded-2xl border border-border bg-card p-7 text-center"><p className="text-sm font-semibold uppercase text-muted-foreground">Existing member renewal</p><p className="mt-3 text-4xl font-bold text-primary">{money(30000)}</p><p className="mt-2 text-sm text-muted-foreground">Renewal for a membership year</p></div>
    </div><p className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted-foreground">Membership operates from January to December and expires on 31 December of the selected year, even where registration occurs later.</p></div></section>
    <section className="section-padding bg-background"><div className="container-section"><h2 className="text-center text-3xl font-serif font-bold">NWI organisational activities</h2><p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">These are organisational activities and possible participation opportunities, not guaranteed membership entitlements.</p><div className="mt-8 grid gap-5 md:grid-cols-3">{activities.map(([title,description])=><article key={title} className="rounded-2xl border border-border bg-card p-6"><h3 className="font-serif text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p></article>)}</div></div></section>
    <section id="membership-application" className="section-padding scroll-mt-24 bg-muted"><div className="container-section max-w-4xl">
      <div className="mb-8 text-center"><h2 className="text-3xl font-serif font-bold">Membership application</h2><p className="mt-3 text-muted-foreground">Complete the four steps below. Your progress is kept while navigating between steps.</p></div>
      {submitted ? <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card"><CheckCircle2 className="mx-auto h-14 w-14 text-primary"/><h3 className="mt-4 text-2xl font-serif font-bold">Application received</h3><p className="mx-auto mt-3 max-w-xl text-muted-foreground">Your application has been saved. Your selected category is {form.membership_type==="new"?"New Member":"Existing Member Renewal"} and the fee is {money(fee)}. Payment has not been processed or verified. Please wait for official payment instructions and confirmation from NWI.</p><p className="mt-3 text-sm text-muted-foreground">Membership year: {year}. Expiry: {expiry}.</p><Button className="mt-6" asChild><Link to="/join-us">Explore other ways to get involved</Link></Button></div> :
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="mb-8 grid grid-cols-4 gap-2">{["Personal","Profile","Membership","Agreement"].map((label,index)=><div key={label}><div className={`h-2 rounded-full ${step>=index+1?"bg-primary":"bg-muted"}`}/><p className={`mt-2 text-center text-xs ${step===index+1?"font-bold text-foreground":"text-muted-foreground"}`}>{label}</p></div>)}</div>
        {step===1 && <div className="space-y-4"><h3 className="text-xl font-semibold">Step 1 — Personal information</h3><div className="grid gap-4 sm:grid-cols-2">{([["first_name","First name","text"],["last_name","Last name","text"],["date_of_birth","Date of birth","date"],["phone","Phone","tel"],["email","Email","email"]] as const).map(([name,label,type])=><div key={name} className="space-y-2"><label htmlFor={name} className="text-sm font-medium">{label} *</label><Input id={name} name={name} type={type} max={name==="date_of_birth"?today:undefined} required value={form[name]} onChange={update}/></div>)}</div></div>}
        {step===2 && <div className="space-y-4"><h3 className="text-xl font-semibold">Step 2 — Profile</h3><div className="grid gap-4 sm:grid-cols-2">{([["occupation","Occupation",true],["business_name","Business name",false],["business_category","Business category",false],["residential_address","Residential address",true],["local_government","Local Government",true],["town_city","Town/City",true],["state","State",true],["country","Country",true]] as const).map(([name,label,required])=><div key={name} className="space-y-2"><label htmlFor={name} className="text-sm font-medium">{label}{required?" *":" (optional)"}</label><Input id={name} name={name} required={required} value={form[name]} onChange={update}/></div>)}</div></div>}
        {step===3 && <div className="space-y-5"><h3 className="text-xl font-semibold">Step 3 — Membership selection</h3><div className="space-y-2"><label htmlFor="membership_type" className="text-sm font-medium">Membership category</label><select id="membership_type" name="membership_type" value={form.membership_type} onChange={update} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="new">New Member — {money(40000)}</option><option value="renewal">Existing Member Renewal — {money(30000)}</option></select></div><div className="space-y-2"><label htmlFor="membership_year" className="text-sm font-medium">Membership year</label><select id="membership_year" name="membership_year" value={form.membership_year} onChange={update} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{[new Date().getFullYear(),new Date().getFullYear()+1].map(item=><option key={item} value={item}>{item}</option>)}</select></div><div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Application fee</p><p className="mt-1 text-3xl font-bold text-primary">{money(fee)}</p><p className="mt-2 text-sm text-muted-foreground">Membership year: {year} · Expiry: {expiry}</p></div></div>}
        {step===4 && <div className="space-y-5"><h3 className="text-xl font-semibold">Step 4 — Review and agreement</h3><div className="rounded-xl bg-muted p-5 text-sm"><p><strong>Name:</strong> {form.first_name} {form.last_name}</p><p className="mt-1"><strong>Email:</strong> {form.email}</p><p className="mt-1"><strong>Category:</strong> {form.membership_type==="new"?"New Member":"Existing Member Renewal"}</p><p className="mt-1"><strong>Fee:</strong> {money(fee)}</p><p className="mt-1"><strong>Membership year:</strong> {year}</p><p className="mt-1"><strong>Expiry:</strong> {expiry}</p></div>
          <div className="rounded-xl border border-border p-4 text-sm leading-relaxed"><p className="font-semibold">Membership terms and policies</p><ul className="mt-2 list-disc space-y-2 pl-5"><li>Membership operates January–December and expires 31 December.</li><li>Late registration does not extend membership into an additional twelve-month period.</li><li>Payments are strictly non-refundable. Failure to attend does not qualify for refunds or extensions.</li><li>Members are expected to participate in scheduled activities, provide accurate information and requested materials, and monitor official communication channels.</li><li>Respect and professionalism are required. Bullying, harassment, intimidation, insults and discrimination are prohibited.</li><li>Confidentiality and privacy must be respected. Obtain consent before sharing another member's personal information, images or private business details.</li><li>Fraud, dishonest solicitation, spam and unrelated promotional activities are prohibited. Members must follow organisational guidelines.</li><li>Misconduct may result in suspension or termination. Listed benefits define the membership package; additional opportunities, sponsorships, privileges and partnerships are supplementary and not guaranteed.</li><li>Membership requires renewal for the following year.</li></ul></div>
          {([["terms_accepted","I accept the membership fees, duration, expiry and non-refundable payment terms."],["conduct_accepted","I agree to follow the NWI code of conduct and organisational guidelines."],["privacy_accepted","I acknowledge the privacy and confidentiality expectations above."]] as const).map(([name,label])=><label key={name} className="flex items-start gap-3 text-sm"><input type="checkbox" name={name} checked={form[name]} onChange={update} className="mt-1"/><span>{label} *</span></label>)}
        </div>}
        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-6">{step>1?<Button type="button" variant="outline" onClick={()=>setStep(current=>current-1)}><ArrowLeft size={16}/> Back</Button>:<span/>}{step<4?<Button type="button" onClick={next}>Continue <ArrowRight size={16}/></Button>:<Button type="submit" disabled={submitting||!form.terms_accepted||!form.conduct_accepted||!form.privacy_accepted}>{submitting?"Submitting...":"Submit membership application"} <ArrowRight size={16}/></Button>}</div>
      </form>}
    </div></section>
    <section className="section-padding bg-background"><div className="container-section max-w-4xl"><h2 className="text-2xl font-serif font-bold">Membership FAQs</h2><div className="mt-5 divide-y divide-border rounded-2xl border border-border px-6">{[
      ["Who can join?","Women who support the mission and values of Northern Women Initiative may apply."],
      ["What are the fees?","New membership is ₦40,000 and existing member renewal is ₦30,000."],
      ["How long does membership last?","Membership operates January through December and expires on 31 December of the selected year."],
      ["Does late registration extend membership?","No. Late registration does not add another twelve months."],
      ["Are payments refundable?","No. Membership payments are strictly non-refundable, including where a member does not attend."],
      ["Are additional opportunities guaranteed?","No. The listed membership package defines the benefits. Additional sponsorships, privileges and partnerships are not guaranteed."],
      ["How do I renew?","Select Existing Member Renewal in the application and complete the renewal for the relevant membership year."],
    ].map(([question,answer])=><details key={question} className="py-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}</div><p className="mt-6 text-sm text-muted-foreground">Not ready for membership? <Link className="font-semibold text-primary underline" to="/join-us">Explore other ways to get involved.</Link></p></div></section>
  </Layout>;
}
