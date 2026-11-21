import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Membership = {
  id:string; first_name:string; last_name:string; email:string; phone:string;
  membership_type:"new"|"renewal"; membership_year:number; fee:number;
  payment_status:"unpaid"|"pending_verification"|"paid"|"failed"|"cancelled";
  membership_status:"pending"|"active"|"expired"|"suspended"|"terminated";
  payment_reference:string|null; admin_notes:string|null; created_at:string;
  expiry_date:string;
};
const money=(amount:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(amount);

export default function AdminMemberships() {
  const {toast}=useToast();
  const [rows,setRows]=useState<Membership[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [year,setYear]=useState("all");
  const [payment,setPayment]=useState("all");
  const [saving,setSaving]=useState<string|null>(null);

  const load=async()=>{
    setLoading(true);
    const {data,error}=await supabase.from("membership_applications").select("*").order("created_at",{ascending:false});
    if(error) toast({title:"Unable to load membership applications",description:error.message,variant:"destructive"});
    else setRows((data||[]) as Membership[]);
    setLoading(false);
  };
  useEffect(()=>{void load();},[]);
  const filtered=useMemo(()=>rows.filter(row=>{
    const term=search.trim().toLowerCase();
    const matches=!term||[`${row.first_name} ${row.last_name}`,row.email,row.phone].join(" ").toLowerCase().includes(term);
    return matches&&(year==="all"||String(row.membership_year)===year)&&(payment==="all"||row.payment_status===payment);
  }),[rows,search,year,payment]);

  const updateRow=async(id:string,changes:Partial<Membership>)=>{
    setSaving(id);
    const {error}=await supabase.from("membership_applications").update(changes).eq("id",id);
    if(error) toast({title:"Update failed",description:error.message,variant:"destructive"});
    else {toast({title:"Membership record updated"});await load();}
    setSaving(null);
  };
  const exportCsv=()=>{
    const headers=["Name","Email","Phone","Type","Year","Fee","Payment Status","Membership Status","Payment Reference","Expiry","Admin Notes"];
    const csv=[headers,...filtered.map(r=>[`${r.first_name} ${r.last_name}`,r.email,r.phone,r.membership_type,r.membership_year,r.fee,r.payment_status,r.membership_status,r.payment_reference||"",r.expiry_date,r.admin_notes||""])].map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
    const link=document.createElement("a");link.href=url;link.download="nwi_membership_applications.csv";link.click();URL.revokeObjectURL(url);
  };

  return <AdminLayout><div className="space-y-6 p-6 md:p-10">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-3xl font-bold">Membership Applications</h1><p className="text-muted-foreground">Review applications and verify payments before activating membership.</p></div><div className="flex gap-3"><Button variant="outline" onClick={()=>void load()} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading?"animate-spin":""}`}/>Refresh</Button><Button variant="secondary" onClick={exportCsv} disabled={!filtered.length}><Download className="mr-2 h-4 w-4"/>Export CSV</Button></div></div>
    <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Applications</p><p className="text-2xl font-bold">{rows.length}</p></div><div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Paid</p><p className="text-2xl font-bold">{rows.filter(r=>r.payment_status==="paid").length}</p></div><div className="rounded-xl bg-muted p-5"><p className="text-sm text-muted-foreground">Awaiting payment / verification</p><p className="text-2xl font-bold">{rows.filter(r=>r.payment_status==="unpaid"||r.payment_status==="pending_verification").length}</p></div></div>
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row"><Input placeholder="Search name, email or phone" value={search} onChange={e=>setSearch(e.target.value)}/><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={year} onChange={e=>setYear(e.target.value)}><option value="all">All years</option>{Array.from(new Set(rows.map(r=>r.membership_year))).sort((a,b)=>b-a).map(y=><option key={y} value={y}>{y}</option>)}</select><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={payment} onChange={e=>setPayment(e.target.value)}><option value="all">All payment statuses</option>{["unpaid","pending_verification","paid","failed","cancelled"].map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select></div>
    {loading?<p>Loading applications...</p>:!filtered.length?<p className="text-muted-foreground">No membership applications found.</p>:<div className="space-y-4">{filtered.map(row=><article key={row.id} className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><h2 className="text-lg font-semibold">{row.first_name} {row.last_name}</h2><p className="text-sm text-muted-foreground">{row.email} · {row.phone}</p><p className="mt-2 text-sm">{row.membership_type==="new"?"New Member":"Renewal"} · {row.membership_year} · {money(row.fee)} · Expires {row.expiry_date}</p><p className="mt-1 text-xs text-muted-foreground">Applied {new Date(row.created_at).toLocaleString()}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">{row.membership_status}</span></div>
      <div className="mt-4 grid gap-3 md:grid-cols-3"><label className="space-y-1 text-xs font-medium">Payment status<select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={row.payment_status} onChange={e=>void updateRow(row.id,{payment_status:e.target.value as Membership["payment_status"]})}><option value="unpaid">Unpaid</option><option value="pending_verification">Pending verification</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="cancelled">Cancelled</option></select></label><label className="space-y-1 text-xs font-medium">Membership status<select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={row.membership_status} onChange={e=>void updateRow(row.id,{membership_status:e.target.value as Membership["membership_status"]})}><option value="pending">Pending</option><option value="active">Active</option><option value="expired">Expired</option><option value="suspended">Suspended</option><option value="terminated">Terminated</option></select></label><label className="space-y-1 text-xs font-medium">Payment reference<Input defaultValue={row.payment_reference||""} placeholder="Reference" onBlur={e=>{if(e.target.value!==(row.payment_reference||""))void updateRow(row.id,{payment_reference:e.target.value||null});}}/></label></div>
      <label className="mt-3 block space-y-1 text-xs font-medium">Internal admin notes<textarea className="min-h-20 w-full rounded-md border border-input bg-background p-3 text-sm" defaultValue={row.admin_notes||""} placeholder="Internal notes..." onBlur={e=>{if(e.target.value!==(row.admin_notes||""))void updateRow(row.id,{admin_notes:e.target.value||null});}}/></label>
      {saving===row.id&&<p className="mt-2 text-xs text-muted-foreground">Saving changes...</p>}
    </article>)}</div>}
  </div></AdminLayout>;
}
