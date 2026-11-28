import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Handshake, Lightbulb, Network, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  getMembershipFee,
  initialMembershipForm,
  MEMBERSHIP_YEAR,
  MembershipFormData,
  MembershipPaymentSettings,
} from "@/lib/membershipApplication";
import {
  submitMembershipApplication,
  submitMembershipReceipt,
} from "@/lib/submitMembershipApplication";

const benefits = [
  {
    icon: GraduationCap,
    title: "Mentorship and Coaching Classes",
    details: [
      "Access to mentorship opportunities and guidance.",
      "Business coaching classes designed to improve business knowledge, skills and management.",
      "Learning opportunities from experienced individuals and business owners.",
    ],
  },
  {
    icon: Lightbulb,
    title: "Workshops and Capacity Building",
    details: [
      "Participation in workshops organised to support business growth and development.",
      "Practical learning sessions and capacity-building activities.",
      "Exposure to relevant business knowledge, ideas and skills.",
    ],
  },
  {
    icon: Network,
    title: "Members’ Interaction and Networking",
    details: [
      "Access to a community where members can interact, connect and build meaningful relationships.",
      "Opportunities to exchange ideas, experiences and business knowledge.",
      "Opportunities for collaborations and partnerships among members.",
      "Mutual business support through engagement with fellow members’ business posts, including liking, commenting, sharing and promoting businesses across WhatsApp and other social media platforms.",
    ],
  },
  {
    icon: Handshake,
    title: "Business Problem-Solving Support",
    details: [
      "Access to a network of experienced business owners within NWI who can offer guidance and advice when business challenges arise.",
      "Opportunities to learn from the experiences of others and seek practical solutions to business challenges.",
    ],
  },
  {
    icon: Users,
    title: "Collaborative Content Creation",
    details: [
      "Opportunities to participate in collaborative content creation initiatives.",
      "Opportunities to showcase businesses, products and services.",
      "Increased visibility through selected NWI content activities and collaborations.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Access to Discounted Opportunities",
    details: [
      "Access to available discounts and special offers secured through NWI partnerships and collaborations.",
      "These may include discounted products, services and other business-related opportunities.",
    ],
  },
  {
    icon: Users,
    title: "Participation in NWI Activities",
    details: [
      "Opportunities to participate in activities, programmes and events organised by NWI throughout the membership year.",
    ],
  },
];
const activities = [
  ["Ramadan Feeding Programme", "An organisational community support activity. Members may have opportunities to participate when activities are scheduled."],
  ["Community Outreach and Empowerment Programme", "NWI outreach and empowerment work that members may be invited to support."],
  ["Organisational Content Creation", "Collaborative content work that supports NWI communication and visibility."],
];
const businessCategories = [
  "Fashion",
  "Skincare",
  "Food",
  "Retail & General Merchandise",
  "Education",
  "Digital Services",
  "Agriculture",
  "Media",
  "Professional & Consulting Services",
  "Events & Entertainment",
  "Hospitality & Tourism",
  "Manufacturing & Production",
  "Real Estate & Construction",
  "Logistics & Transportation",
  "Arts & Crafts",
  "Interior Design",
  "Other",
];
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  "Federal Capital Territory (Abuja)",
];
const cardEntranceOffset = (index: number) => {
  const offsets = [
    { x: -42, y: 0 },
    { x: 0, y: -36 },
    { x: 42, y: 0 },
    { x: 0, y: 36 },
  ];
  return offsets[index % offsets.length];
};
const money = (amount:number) => new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(amount);

const emptyPaymentSettings:MembershipPaymentSettings = {bank_name:"",account_name:"",account_number:"",payment_instructions:""};

export default function BecomeAMember() {
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [step,setStep] = useState(1);
  const [overviewAccepted, setOverviewAccepted] = useState(false);
  const [applicationStarted, setApplicationStarted] = useState(false);
  const [form,setForm] = useState<MembershipFormData>(initialMembershipForm);
  const [submitting,setSubmitting] = useState(false);
  const [verifyingMembershipCode, setVerifyingMembershipCode] = useState(false);
  const [submitted,setSubmitted] = useState(false);
  const [paymentSettings,setPaymentSettings] = useState<MembershipPaymentSettings>(emptyPaymentSettings);
  const [applicationId,setApplicationId] = useState("");
  const [uploadToken,setUploadToken] = useState("");
  const [receiptFile,setReceiptFile] = useState<File|null>(null);
  const [paymentReference,setPaymentReference] = useState("");
  const [uploadingReceipt,setUploadingReceipt] = useState(false);
  const [receiptSubmitted,setReceiptSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.from("membership_payment_settings")
      .select("bank_name,account_name,account_number,payment_instructions")
      .eq("id",true).maybeSingle()
      .then(({data}) => { if(active && data) setPaymentSettings(data as PaymentSettings); });
    return () => { active = false; };
  }, []);
  const fee = getMembershipFee(form.membership_type);
  const year = MEMBERSHIP_YEAR;
  const expiry = "31 December 2027";
  const update = (event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm(current => ({...current,[target.name]:value}));
  };
  const next = async () => {
    const required:Record<number,(keyof typeof form)[]> = {
      1:["first_name","last_name","phone","email"],
      2:["business_name","business_category","state","country"],
    };
    if ((required[step] || []).some(key => !String(form[key]).trim())) {
      toast({title:"Complete the required fields",description:"Please fill in all required information before continuing.",variant:"destructive"});
      return;
    }
    if (step === 2 && form.business_category === "Other" && !form.business_category_other.trim()) {
      toast({title:"Specify your business category",description:"Please enter your business type to continue.",variant:"destructive"});
      return;
    }

    if (step === 3 && form.membership_type === "renewal") {
      if (!form.membership_code.trim()) {
        toast({title:"Membership code required",description:"Enter your unique NWI membership code to continue with renewal.",variant:"destructive"});
        return;
      }
      setVerifyingMembershipCode(true);
      const { data, error } = await supabase.rpc("verify_nwi_membership_code", {
        p_membership_code: form.membership_code.trim(),
        p_email: form.email.trim().toLowerCase(),
      });
      setVerifyingMembershipCode(false);
      if (error || data !== true) {
        toast({
          title: "Membership code could not be verified",
          description: error
            ? "We could not verify the code right now. Please try again shortly."
            : "Check the code and use the email address registered with NWI.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(current => Math.min(4,current+1));
  };
  const submit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.terms_accepted || !form.conduct_accepted || !form.privacy_accepted) {
      toast({title:"Please accept all membership acknowledgements",variant:"destructive"}); return;
    }
    setSubmitting(true);
    const result=await submitMembershipApplication({formData:form,receiptFile,paymentReference,paymentSettings});
    setSubmitting(false);
    if(!result.applicationSaved){
      toast({title:result.error?.message.includes("receipt")?"Payment receipt required":"Unable to submit application",description:result.error?.message,variant:"destructive"});
      return;
    }
    setApplicationId(result.applicationId||""); setUploadToken(result.uploadToken||"");
    setSubmitted(true);setReceiptSubmitted(result.receiptSubmitted);
    if(result.error){toast({title:"Application saved; receipt upload needs attention",description:result.error.message,variant:"destructive"});return;}
    if(result.notificationError) toast({title:"Application submitted; email notification failed",description:"Your application and receipt are saved. NWI can still review them.",variant:"destructive"});
    else toast({title:"Membership application submitted",description:"Your application and payment receipt have been received. Check your email for confirmation."});
  };

  const uploadReceipt = async () => {
    if (!applicationId || !uploadToken) { toast({title:"Application details are missing",description:"Please contact Northern Women Initiative for help.",variant:"destructive"}); return; }
    setUploadingReceipt(true);
    const result=await submitMembershipReceipt({applicationId,uploadToken,receiptFile,formData:form,paymentReference});
    setUploadingReceipt(false);
    if (result.error) { toast({title:"Unable to submit payment receipt",description:result.error.message,variant:"destructive"}); return; }
    setReceiptSubmitted(true);
    if(result.notificationError) toast({title:"Receipt submitted; email notification failed",description:"NWI can still review your payment receipt.",variant:"destructive"});
    else toast({title:"Payment receipt submitted",description:"NWI will verify your transfer and update your membership."});
  };
  return <Layout>
    <section className="bg-gradient-hero py-20">
      <div className="container-section">
        <div className="max-w-3xl">
          <motion.span className="text-secondary text-sm font-medium uppercase tracking-wider" initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: "easeOut" }}>Become a Member</motion.span>
          <motion.h1 className="mt-3 mb-6 font-serif text-4xl font-bold text-primary-foreground md:text-5xl" initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: prefersReducedMotion ? 0 : 0.12, ease: "easeOut" }}>Welcome to Northern Women Initiative (NWI)</motion.h1>
          <motion.p className="text-lg leading-relaxed text-primary-foreground/90" initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: prefersReducedMotion ? 0 : 0.24, ease: "easeOut" }}>The Northern Women Initiative (NWI) is committed to empowering women, supporting business growth, encouraging meaningful connections and creating opportunities for personal and professional development.</motion.p>
          <motion.p className="mt-4 text-lg leading-relaxed text-primary-foreground/90" initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: prefersReducedMotion ? 0 : 0.32, ease: "easeOut" }}>The NWI One-Year Membership Programme is designed to build a structured and supportive community where women can learn, grow, collaborate, access mentorship and benefit from business development opportunities.</motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" asChild><a href="#membership-benefits">Explore Membership</a></Button>
            <Button variant="heroOutline" size="lg" asChild><a href="#membership-acknowledgement">Register as a Member</a></Button>
          </div>
        </div>
      </div>
    </section>
    <section id="membership-benefits" className="section-padding bg-background"><div className="container-section">
      <motion.div className="mx-auto max-w-3xl text-center" initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.85, ease: "easeOut" }}><h2 className="text-3xl font-serif font-bold md:text-4xl">What We Offer</h2><p className="mt-4 text-muted-foreground">As a registered NWI member, you will have access to the following benefits and opportunities throughout the membership year.</p></motion.div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map(({icon:Icon,title,details},index)=><motion.article
          key={title}
          className="rounded-2xl border border-border bg-card p-6 shadow-card"
          initial={prefersReducedMotion ? false : { opacity: 0, ...cardEntranceOffset(index) }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: prefersReducedMotion ? 0 : (index % 3) * 0.11, ease: "easeOut" }}
          whileHover={prefersReducedMotion ? undefined : { y: -5, transition: { duration: 0.35, ease: "easeOut" } }}
        ><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={22}/></div><h3 className="font-serif text-lg font-semibold">{title}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{details.map((detail)=><li key={detail}>{detail}</li>)}</ul></motion.article>)}
      </div>
    </div></section>
    <section id="membership-acknowledgement" className="section-padding scroll-mt-24 bg-background"><div className="container-section">
      <motion.div className="text-center" initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.85, ease: "easeOut" }}>
        <h2 className="text-3xl font-serif font-bold md:text-4xl">Other NWI Organisational Activities</h2>
        <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">Beyond direct membership benefits, NWI will also organise initiatives that contribute to women’s empowerment, community development and social impact, including:</p>
      </motion.div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{activities.map(([title,description],index)=><motion.article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card" initial={prefersReducedMotion ? false : { opacity: 0, ...cardEntranceOffset(index) }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, delay: prefersReducedMotion ? 0 : (index % 3) * 0.12, ease: "easeOut" }} whileHover={prefersReducedMotion ? undefined : { y: -5, transition: { duration: 0.35, ease: "easeOut" } }}><h3 className="font-serif text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p></motion.article>)}</div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-muted-foreground">Members may have opportunities to participate in selected organisational activities.</p>

      <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-border bg-muted p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">Important Membership Information</h2>
        <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Membership operates on an annual January–December basis.</li>
          <li>New membership registration fee: {money(40000)}.</li>
          <li>Existing member renewal fee: {money(30000)}.</li>
          <li>All memberships expire on 31 December 2027.</li>
          <li>Registration after January does not extend membership beyond 31 December 2027.</li>
          <li>All membership payments are strictly non-refundable.</li>
          <li>Additional opportunities, sponsorships, partnerships and privileges outside the stated membership package are supplementary and not guaranteed.</li>
        </ul>
      </div>

      <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">Membership Acknowledgement</h2>
        <p className="mt-2 text-sm text-muted-foreground">Required checkbox:</p>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" checked={overviewAccepted} onChange={(event) => {
            setOverviewAccepted(event.target.checked);
            if (!event.target.checked) setApplicationStarted(false);
          }} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
          <span>I confirm that I have read and understood the NWI membership overview, including the programme, its offerings, benefits and opportunities.</span>
        </label>
        <div className="mt-6 flex justify-center">
          <Button type="button" disabled={!overviewAccepted} onClick={() => {
            if (!overviewAccepted) return;
            setApplicationStarted(true);
            window.setTimeout(() => document.getElementById("membership-application")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
          }}>Proceed to Membership Application <ArrowRight size={16} /></Button>
        </div>
      </div>
    </div></section>
    {applicationStarted && <section id="membership-application" className="section-padding scroll-mt-24 bg-muted"><div className="container-section max-w-4xl">
      <div className="mb-8 text-center"><h2 className="text-3xl font-serif font-bold">Membership application</h2><p className="mt-3 text-muted-foreground">Complete the four steps below. Your progress is kept while navigating between steps.</p></div>
      {submitted ? <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-primary"/><h3 className="mt-4 text-2xl font-serif font-bold">Application received</h3><p className="mx-auto mt-3 max-w-xl text-muted-foreground">Your application has been saved. Your annual fee is {money(fee)} for {year}, expiring on {expiry}. Your membership is not active yet and your NWI Membership ID will be assigned after payment verification and approval.</p></div>
        <div className="mt-7 rounded-xl border border-border bg-muted p-5"><h4 className="font-semibold">Bank transfer details</h4>
          {paymentSettings.bank_name && paymentSettings.account_name && paymentSettings.account_number ? <div className="mt-3 space-y-2 text-sm"><p><strong>Bank:</strong> {paymentSettings.bank_name}</p><p><strong>Account name:</strong> {paymentSettings.account_name}</p><p><strong>Account number:</strong> {paymentSettings.account_number}</p>{paymentSettings.payment_instructions && <p className="pt-2 text-muted-foreground">{paymentSettings.payment_instructions}</p>}<p className="pt-2 font-semibold">Transfer exactly {money(fee)}. Use your full name as the transfer narration where possible.</p></div> : <p className="mt-2 text-sm text-muted-foreground">NWI has not published its bank account details yet. Please contact the organisation for official payment instructions.</p>}
        </div>
        {receiptSubmitted ? <div className="mt-6 rounded-xl border border-border p-5 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-primary"/><h4 className="mt-2 font-semibold">Receipt submitted successfully</h4><p className="mt-1 text-sm text-muted-foreground">Your payment is awaiting verification. NWI will contact you after reviewing the transfer.</p></div> : <div className="mt-6 space-y-4">
          <h4 className="font-semibold">Submit your payment receipt</h4><p className="text-sm text-muted-foreground">After completing the bank transfer, upload the teller or transfer confirmation. Accepted formats: JPG, PNG or PDF, maximum 5MB.</p>
          <div className="space-y-2"><label className="text-sm font-medium" htmlFor="payment-reference">Payment reference (optional)</label><Input id="payment-reference" value={paymentReference} onChange={e=>setPaymentReference(e.target.value)} placeholder="Bank transaction reference"/></div>
          <div className="space-y-2"><label className="text-sm font-medium" htmlFor="payment-receipt">Payment receipt</label><Input id="payment-receipt" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={e=>setReceiptFile(e.target.files?.[0]||null)}/></div>
          <Button type="button" onClick={()=>void uploadReceipt()} disabled={!receiptFile||uploadingReceipt||!(paymentSettings.bank_name&&paymentSettings.account_name&&paymentSettings.account_number)}>{uploadingReceipt?"Uploading receipt...":"Upload payment receipt"}</Button>
        </div>}
      </div> :
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="mb-8 grid grid-cols-4 gap-2">{["Personal","Profile","Membership","Agreement"].map((label,index)=><div key={label}><div className={`h-2 rounded-full ${step>=index+1?"bg-primary":"bg-muted"}`}/><p className={`mt-2 text-center text-xs ${step===index+1?"font-bold text-foreground":"text-muted-foreground"}`}>{label}</p></div>)}</div>
        {step===1 && <div className="space-y-4"><h3 className="text-xl font-semibold">Step 1 — Personal information</h3><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label htmlFor="first_name" className="text-sm font-medium">First Name *</label><Input id="first_name" name="first_name" type="text" autoComplete="given-name" required value={form.first_name} onChange={update}/></div><div className="space-y-2"><label htmlFor="last_name" className="text-sm font-medium">Last Name *</label><Input id="last_name" name="last_name" type="text" autoComplete="family-name" required value={form.last_name} onChange={update}/></div><div className="space-y-2"><label htmlFor="phone" className="text-sm font-medium">WhatsApp Number *</label><Input id="phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update}/></div><div className="space-y-2"><label htmlFor="email" className="text-sm font-medium">Email Address *</label><Input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update}/></div></div></div>}
        {step===2 && <div className="space-y-4"><h3 className="text-xl font-semibold">Step 2 — Business Information</h3><div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><label htmlFor="business_name" className="text-sm font-medium">Business Name *</label><Input id="business_name" name="business_name" type="text" required value={form.business_name} onChange={update}/></div>
          <div className="space-y-2"><label htmlFor="business_category" className="text-sm font-medium">Business Category *</label><select id="business_category" name="business_category" required value={form.business_category} onChange={(event)=>{update(event);if(event.target.value!=="Other")setForm((current)=>({...current,business_category_other:""}));}} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="" disabled>Select a business category</option>{businessCategories.map((category)=><option key={category} value={category}>{category}</option>)}</select></div>
          {form.business_category === "Other" && <div className="space-y-2 sm:col-span-2"><label htmlFor="business_category_other" className="text-sm font-medium">Specify your business category *</label><Input id="business_category_other" name="business_category_other" type="text" required value={form.business_category_other} onChange={update} placeholder="Enter your business type" /></div>}
          <div className="space-y-2"><label htmlFor="state" className="text-sm font-medium">State Where Your Business Operates *</label><select id="state" name="state" required value={form.state} onChange={update} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="" disabled>Select a state</option>{nigerianStates.map((state)=><option key={state} value={state}>{state}</option>)}</select></div>
          <div className="space-y-2"><label htmlFor="country" className="text-sm font-medium">Country of Residence *</label><Input id="country" name="country" type="text" autoComplete="country-name" placeholder="Enter your country of residence" required value={form.country} onChange={update}/></div>
        </div></div>}
        {step===3 && <div className="space-y-5"><h3 className="text-xl font-semibold">Section 4 — Membership Selection</h3>
          <div className="space-y-2"><label htmlFor="membership_type" className="text-sm font-medium">Membership Category *</label><select id="membership_type" name="membership_type" value={form.membership_type} onChange={(event)=>{update(event);if(event.target.value==="new")setForm((current)=>({...current,membership_code:""}));}} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="new">New Member – {money(40000)}</option><option value="renewal">Existing Member Renewal – {money(30000)}</option></select></div>
          {form.membership_type === "renewal" && <div className="space-y-2"><label htmlFor="membership_code" className="text-sm font-medium">Enter Your Unique Membership Code *</label><Input id="membership_code" name="membership_code" type="text" required value={form.membership_code} onChange={update} placeholder="For example, NWI-0001" autoCapitalize="characters"/><p className="text-xs text-muted-foreground">Use the email address registered with your NWI membership. We’ll verify both before you continue.</p></div>}
          <div className="space-y-2"><span className="text-sm font-medium">Membership Year</span><p className="h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm">{MEMBERSHIP_YEAR}</p></div>
          <div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Application Fee</p><p className="mt-1 text-3xl font-bold text-primary">{money(fee)}</p><p className="mt-2 text-sm text-muted-foreground">Membership Year: {MEMBERSHIP_YEAR} · Expiry Date: 31 December 2027</p></div>
        </div>}
        {step===4 && <div className="space-y-5"><h3 className="text-xl font-semibold">Step 4 — Review and agreement</h3><div className="rounded-xl bg-muted p-5 text-sm"><p><strong>First name:</strong> {form.first_name}</p><p className="mt-1"><strong>Last name:</strong> {form.last_name}</p><p className="mt-1"><strong>WhatsApp Number:</strong> {form.phone}</p><p className="mt-1"><strong>Email:</strong> {form.email}</p><p className="mt-1"><strong>Business category:</strong> {form.business_category === "Other" ? form.business_category_other : form.business_category}</p><p className="mt-1"><strong>Membership type:</strong> {form.membership_type==="new"?"New Member":"Existing Member Renewal"}</p><p className="mt-1"><strong>Fee:</strong> {money(fee)}</p><p className="mt-1"><strong>Membership year:</strong> {year}</p><p className="mt-1"><strong>Expiry:</strong> {expiry}</p></div>
          <div className="rounded-xl border border-border p-4 text-sm leading-relaxed"><p className="font-semibold">Membership terms and policies</p><ul className="mt-2 list-disc space-y-2 pl-5"><li>Membership operates January–December and expires 31 December.</li><li>Late registration does not extend membership into an additional twelve-month period.</li><li>Payments are strictly non-refundable. Failure to attend does not qualify for refunds or extensions.</li><li>Members are expected to participate in scheduled activities, provide accurate information and requested materials, and monitor official communication channels.</li><li>Respect and professionalism are required. Bullying, harassment, intimidation, insults and discrimination are prohibited.</li><li>Confidentiality and privacy must be respected. Obtain consent before sharing another member's personal information, images or private business details.</li><li>Fraud, dishonest solicitation, spam and unrelated promotional activities are prohibited. Members must follow organisational guidelines.</li><li>Misconduct may result in suspension or termination. Listed benefits define the membership package; additional opportunities, sponsorships, privileges and partnerships are supplementary and not guaranteed.</li><li>Membership requires renewal for the following year.</li></ul></div>
          {([["terms_accepted","I accept the membership fees, duration, expiry and non-refundable payment terms."],["conduct_accepted","I agree to follow the NWI code of conduct and organisational guidelines."],["privacy_accepted","I acknowledge the privacy and confidentiality expectations above."]] as const).map(([name,label])=><label key={name} className="flex items-start gap-3 text-sm"><input type="checkbox" name={name} checked={form[name]} onChange={update} className="mt-1"/><span>{label} *</span></label>)}
        </div>}
        {step===4 && <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-primary/20 bg-muted p-5"><h4 className="font-semibold">Bank transfer details</h4>
            {paymentSettings.bank_name && paymentSettings.account_name && paymentSettings.account_number ? <div className="mt-3 space-y-2 text-sm">
              <p><strong>Bank:</strong> {paymentSettings.bank_name}</p><p><strong>Account name:</strong> {paymentSettings.account_name}</p><p><strong>Account number:</strong> {paymentSettings.account_number}</p>
              {paymentSettings.payment_instructions && <p className="text-muted-foreground">{paymentSettings.payment_instructions}</p>}
              <p className="pt-2 font-semibold">Transfer exactly {money(fee)} before submitting. Use your full name as the transfer narration where possible.</p>
            </div> : <p className="mt-2 text-sm text-muted-foreground">Official bank details are not available yet. Please contact NWI before making any payment.</p>}
          </div>
          <div className="space-y-3 rounded-xl border border-border p-5"><h4 className="font-semibold">Upload payment receipt</h4>
            <p className="text-sm text-muted-foreground">Attach the bank teller or transfer confirmation. JPG, PNG or PDF only; maximum file size 5MB. Your application cannot be submitted without the receipt.</p>
            <div className="space-y-2"><label className="text-sm font-medium" htmlFor="application-payment-reference">Payment reference (optional)</label><Input id="application-payment-reference" value={paymentReference} onChange={e=>setPaymentReference(e.target.value)} placeholder="Bank transaction reference"/></div>
            <div className="space-y-2"><label className="text-sm font-medium" htmlFor="application-payment-receipt">Payment receipt *</label><Input id="application-payment-receipt" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={e=>setReceiptFile(e.target.files?.[0]||null)} required/></div>
            {receiptFile && <p className="text-xs text-muted-foreground">Selected: {receiptFile.name}</p>}
          </div>
        </div>}
        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-6">{step>1?<Button type="button" variant="outline" onClick={()=>setStep(current=>current-1)}><ArrowLeft size={16}/> Back</Button>:<span/>}{step<4?<Button type="button" onClick={()=>void next()} disabled={verifyingMembershipCode}>{verifyingMembershipCode?"Verifying membership code...":"Continue"} <ArrowRight size={16}/></Button>:<Button type="submit" disabled={submitting||!form.terms_accepted||!form.conduct_accepted||!form.privacy_accepted}>{submitting?"Submitting...":"Submit membership application"} <ArrowRight size={16}/></Button>}</div>
      </form>}
    </div></section>}
    <section className="section-padding bg-background"><div className="container-section max-w-4xl"><h2 className="text-2xl font-serif font-bold">Membership FAQs</h2><div className="mt-5 divide-y divide-border rounded-2xl border border-border px-6">{[
      ["Who can join?","Women who support the mission and values of Northern Women Initiative may apply."],
      ["What are the fees?","New membership is ₦40,000 and existing member renewal is ₦30,000."],
      ["How long does membership last?","Membership operates January through December and expires on 31 December of the selected year."],
      ["Does late registration extend membership?","No. Late registration does not add another twelve months."],
      ["Are payments refundable?","No. Membership payments are strictly non-refundable, including where a member does not attend."],
      ["Are additional opportunities guaranteed?","No. The listed membership package defines the benefits. Additional sponsorships, privileges and partnerships are not guaranteed."],
      ["How do I renew?","Select Existing Member Renewal in the application and complete the renewal for the relevant membership year."],
    ].map(([question,answer])=><details key={question} className="py-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}</div></div></section>
  </Layout>;
}
