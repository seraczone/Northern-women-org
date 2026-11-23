import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, ExternalLink, RefreshCw, Save, XCircle } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Membership = {
  id:string; member_id:string|null; membership_id:string|null;
  first_name:string; last_name:string; email:string; phone:string;
  membership_type:"new"|"renewal"; membership_year:number; fee:number;
  payment_status:"unpaid"|"pending_verification"|"paid"|"failed"|"cancelled"|"declined";
  membership_status:"pending"|"active"|"expired"|"suspended"|"terminated";
  payment_reference:string|null; receipt_path:string|null; receipt_uploaded_at:string|null;
  payment_verified_at:string|null; payment_verified_by:string|null;\n  payment_decision:"approved"|"declined"|null; payment_decided_at:string|null; payment_decline_reason:string|null;
  admin_notes:string|null; created_at:string; expiry_date:string;
};
type PaymentSettings = {bank_name:string;account_name:string;account_number:string;payment_instructions:string};
const emptySettings:PaymentSettings={bank_name:"",account_name:"",account_number:"",payment_instructions:""};
const money=(amount:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(amount);

export default function AdminMemberships() {
  const {toast}=useToast();
  const [rows,setRows]=useState<Membership[]>([]);
  const [settings,setSettings]=useState<PaymentSettings>(emptySettings);
  const [loading,setLoading]=useState(true);
  const [savingSettings,setSavingSettings]=useState(false);
  const [search,setSearch]=useState("");
  const [year,setYear]=useState("all");
  const [payment,setPayment]=useState("all");
  const [membershipStatus,setMembershipStatus]=useState("all");
  const [saving,setSaving]=useState<string|null>(null);

  const load=async()=>{
    setLoading(true);
    const [memberships,paymentSettings]=await Promise.all([
      supabase.from("membership_applications").select("*").order("created_at",{ascending:false}),
      supabase.from("membership_payment_settings").select("bank_name,account_name,account_number,payment_instructions").eq("id",true).maybeSingle(),
    ]);
    if(memberships.error) toast({title:"Unable to load membership applications",description:memberships.error.message,variant:"destructive"});
    else setRows((memberships.data||[]) as Membership[]);
    if(paymentSettings.data) setSettings(paymentSettings.data as PaymentSettings);
    if(paymentSettings.error) toast({title:"Unable to load bank details",description:paymentSettings.error.message,variant:"destructive"});
    setLoading(false);
  };
  useEffect(()=>{void load();},[]);

  const filtered=useMemo(()=>rows.filter(row=>{
    const term=search.trim().toLowerCase();
    const searchable=[`${row.first_name} ${row.last_name}`,row.email,row.phone,row.membership_id||""].join(" ").toLowerCase();
    return (!term||searchable.includes(term))&&(year==="all"||String(row.membership_year)===year)&&(payment==="all"||row.payment_status===payment)&&(membershipStatus==="all"||row.membership_status===membershipStatus);
  }),[rows,search,year,payment,membershipStatus]);

  const updateRow=async(id:string,changes:Record<string,unknown>)=>{
    setSaving(id);
    const {error}=await supabase.from("membership_applications").update(changes).eq("id",id);
    if(error) toast({title:"Update failed",description:error.message,variant:"destructive"});
    else {toast({title:"Membership record updated"});await load();}
    setSaving(null);
    return !error;
  };

  const saveSettings=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(!settings.bank_name.trim()||!settings.account_name.trim()||!/^\d{10}$/.test(settings.account_number.trim())){
      toast({title:"Check bank details",description:"Enter the bank name, account name and a valid 10-digit account number.",variant:"destructive"});
      return;
    }
    setSavingSettings(true);
    const {error}=await supabase.from("membership_payment_settings").update({
      bank_name:settings.bank_name.trim(),account_name:settings.account_name.trim(),
      account_number:settings.account_number.trim(),payment_instructions:settings.payment_instructions.trim(),
      updated_at:new Date().toISOString(),
    }).eq("id",true);
    setSavingSettings(false);
    if(error) toast({title:"Unable to save bank details",description:error.message,variant:"destructive"});
    else toast({title:"Membership bank details saved",description:"New applicants will see these payment instructions."});
  };

  const openReceipt=async(row:Membership)=>{
    if(!row.receipt_path) return;
    const {data,error}=await supabase.storage.from("membership-payment-receipts").createSignedUrl(row.receipt_path,120);
    if(error||!data?.signedUrl){toast({title:"Unable to open receipt",description:error?.message||"Receipt link unavailable.",variant:"destructive"});return;}
    window.open(data.signedUrl,"_blank","noopener,noreferrer");
  };

  const decidePayment=async(row:Membership,decision:"approved"|"declined")=>{
    if(!row.receipt_path){toast({title:"Receipt required",description:"The applicant must upload a receipt before a decision can be made.",variant:"destructive"});return;}
    const declineReason=decision==="declined" ? window.prompt("Optional: enter the reason for declining this payment") : null;
    if(decision==="declined" && declineReason===null) return;
    setSaving(row.id);
    const {data,error}=await supabase.rpc("admin_decide_membership_payment",{
      p_application_id:row.id,p_decision:decision,p_decline_reason:declineReason?.trim()||null,
    });
    if(error){setSaving(null);toast({title:"Unable to record payment decision",description:error.message,variant:"destructive"});return;}
    const decided=data as Membership;
    const {error:emailError}=await supabase.functions.invoke("send-registration-email",{body:{
      flow:"membership_decision",decision,application_id:row.id,
    }});
    await load();setSaving(null);
    if(emailError){toast({title:"Decision saved; email failed",description:"The decision was recorded, but the applicant notification could not be sent.",variant:"destructive"});return;}
    toast({title:decision==="approved"?"Payment approved and membership activated":"Payment declined",description:decision==="approved"?`Membership ID: ${decided.membership_id||"assigned"}`:"The applicant has been notified."});
  };

  const exportCsv=()=>{
    const headers=["Membership ID","Name","Email","Phone","Type","Year","Fee","Payment Status","Membership Status","Payment Reference","Receipt Uploaded","Expiry","Admin Notes"];
    const csv=[headers,...filtered.map(r=>[r.membership_id||"",`${r.first_name} ${r.last_name}`,r.email,r.phone,r.membership_type,r.membership_year,r.fee,r.payment_status,r.membership_status,r.payment_reference||"",r.receipt_uploaded_at||"",r.expiry_date,r.admin_notes||""])].map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
    const link=document.createElement("a");link.href=url;link.download="nwi_membership_register.csv";link.click();URL.revokeObjectURL(url);
  };

  return <AdminLayout><div className="space-y-7 p-6 md:p-10">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-3xl font-bold">Become a Member</h1><p className="text-muted-foreground">Manage membership applications, bank-transfer receipts, verification and member approvals.</p></div><div className="flex gap-3"><Button variant="outline" onClick={()=>void load()} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading?"animate-spin":""}`}/>Refresh</Button><Button variant="secondary" onClick={exportCsv} disabled={!filtered.length}><Download className="mr-2 h-4 w-4"/>Export register</Button></div></div>

    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4"><h2 className="text-xl font-semibold">Bank transfer settings</h2><p className="text-sm text-muted-foreground">These details appear to applicants after they submit their membership application.</p></div>
      <form onSubmit={saveSettings} className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium">Bank name<Input value={settings.bank_name} onChange={e=>setSettings(s=>({...s,bank_name:e.target.value}))} placeholder="e.g. First Bank"/></label>
        <label className="space-y-1 text-sm font-medium">Account name<Input value={settings.account_name} onChange={e=>setSettings(s=>({...s,account_name:e.target.value}))} placeholder="Registered NWI account name"/></label>
        <label className="space-y-1 text-sm font-medium">Account number<Input inputMode="numeric" maxLength={10} value={settings.account_number} onChange={e=>setSettings(s=>({...s,account_number:e.target.value.replace(/\D/g,"").slice(0,10)}))} placeholder="10-digit account number"/></label>
        <label className="space-y-1 text-sm font-medium md:col-span-2">Additional payment instructions<textarea className="min-h-20 w-full rounded-md border border-input bg-background p-3 text-sm" value={settings.payment_instructions} onChange={e=>setSettings(s=>({...s,payment_instructions:e.target.value}))} placeholder="Include any transfer narration or payment guidance."/></label>
        <div className="md:col-span-2"><Button type="submit" disabled={savingSettings}><Save className="mr-2 h-4 w-4"/>{savingSettings?"Saving...":"Save bank details"}</Button></div>
      </form>
    </section>

    <div className="grid gap-4 sm:grid-cols-4">
      <div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Applications</p><p className="text-2xl font-bold">{rows.length}</p></div>
      <div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Awaiting verification</p><p className="text-2xl font-bold">{rows.filter(r=>r.payment_status==="pending_verification").length}</p></div>
      <div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Paid</p><p className="text-2xl font-bold">{rows.filter(r=>r.payment_status==="paid").length}</p></div>
      <div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Active members</p><p className="text-2xl font-bold">{new Set(rows.filter(r=>r.membership_status==="active"&&r.membership_id).map(r=>r.membership_id)).size}</p></div>
    </div>

    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row">
      <Input placeholder="Search name, email, phone or NWI ID" value={search} onChange={e=>setSearch(e.target.value)}/>
      <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={year} onChange={e=>setYear(e.target.value)}><option value="all">All years</option>{Array.from(new Set(rows.map(r=>r.membership_year))).sort((a,b)=>b-a).map(y=><option key={y} value={y}>{y}</option>)}</select>
      <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={payment} onChange={e=>setPayment(e.target.value)}><option value="all">All payment statuses</option>{["unpaid","pending_verification","paid","declined","failed","cancelled"].map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select>
      <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={membershipStatus} onChange={e=>setMembershipStatus(e.target.value)}><option value="all">All membership statuses</option>{["pending","active","expired","suspended","terminated"].map(s=><option key={s} value={s}>{s}</option>)}</select>
    </div>

    {loading?<p>Loading membership records...</p>:!filtered.length?<p className="text-muted-foreground">No membership applications found.</p>:<div className="space-y-4">{filtered.map(row=><article key={row.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><h2 className="text-lg font-semibold">{row.first_name} {row.last_name}</h2><p className="text-sm text-muted-foreground">{row.email} · {row.phone}</p><p className="mt-2 text-sm">{row.membership_type==="new"?"New Member":"Renewal"} · {row.membership_year} · {money(row.fee)} · Expires {row.expiry_date}</p><p className="mt-1 text-xs text-muted-foreground">Applied {new Date(row.created_at).toLocaleString()}</p></div><div className="space-y-2 text-right"><span className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize">{row.membership_status==="active"?"Active":row.payment_status==="declined"?"Declined":"Pending"}</span>{row.membership_id&&<p className="font-mono text-sm font-bold text-primary">{row.membership_id}</p>}</div></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Payment status</p><p className="mt-1 text-sm font-semibold capitalize">{row.payment_status.replaceAll("_"," ")}</p></div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Receipt</p>{row.receipt_path?<Button variant="link" className="h-auto p-0" onClick={()=>void openReceipt(row)}>View receipt <ExternalLink className="ml-1 h-3 w-3"/></Button>:<p className="text-sm">Not uploaded</p>}</div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Receipt submitted</p><p className="text-sm">{row.receipt_uploaded_at?new Date(row.receipt_uploaded_at).toLocaleString():"—"}</p></div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Payment reference</p><p className="break-all text-sm">{row.payment_reference||"—"}</p></div></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {row.payment_status==="pending_verification"&&<><Button size="sm" onClick={()=>void decidePayment(row,"approved")} disabled={saving===row.id} className="bg-amber-500 text-white hover:bg-amber-600"><CheckCircle2 className="mr-2 h-4 w-4"/>Approve Payment</Button><Button size="sm" variant="destructive" onClick={()=>void decidePayment(row,"declined")} disabled={saving===row.id}><XCircle className="mr-2 h-4 w-4"/>Reject Payment</Button></>}
        {row.payment_status==="paid"&&<span className="self-center text-sm font-medium text-primary">Approved · Active member</span>}
        {row.payment_status==="declined"&&<span className="self-center text-sm font-medium text-destructive">Payment declined</span>}
        {row.payment_status==="unpaid"&&<span className="self-center text-sm text-muted-foreground">Waiting for member payment and receipt</span>}
        {saving===row.id&&<span className="self-center text-xs text-muted-foreground">Saving...</span>}
      </div>
      <label className="mt-4 block space-y-1 text-xs font-medium">Internal admin notes<textarea className="min-h-16 w-full rounded-md border border-input bg-background p-3 text-sm" defaultValue={row.admin_notes||""} placeholder="Internal notes..." onBlur={e=>{if(e.target.value!==(row.admin_notes||""))void updateRow(row.id,{admin_notes:e.target.value||null});}}/></label>
    </article>)}</div>}
  </div></AdminLayout>;
}
