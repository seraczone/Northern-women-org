import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Copy, HeartHandshake, Landmark } from "lucide-react";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type DonationBankDetails = {
  bank_name: string;
  account_name: string;
  account_number: string;
};

const Donate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bankDetails, setBankDetails] = useState<DonationBankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);

  const program = location.state?.program as string | undefined;
  const image = location.state?.image as string | undefined;

  useEffect(() => {
    let active = true;

    const loadBankDetails = async () => {
      const { data, error } = await supabase
        .from("membership_payment_settings")
        .select("bank_name,account_name,account_number")
        .eq("id", true)
        .maybeSingle();

      if (!active) return;

      if (error || !data) {
        setLoadError(true);
      } else {
        setBankDetails(data as DonationBankDetails);
      }

      setLoading(false);
    };

    void loadBankDetails();
    return () => {
      active = false;
    };
  }, []);

  const copyAccountNumber = async () => {
    if (!bankDetails?.account_number) return;

    try {
      await navigator.clipboard.writeText(bankDetails.account_number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      toast({ title: "Account number copied" });
    } catch {
      toast({
        title: "Unable to copy account number",
        description: "Please select and copy the number manually.",
        variant: "destructive",
      });
    }
  };

  const hasBankDetails = Boolean(
    bankDetails?.bank_name.trim() &&
      bankDetails.account_name.trim() &&
      bankDetails.account_number.trim(),
  );

  return (
    <Layout>
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="text-secondary text-sm font-medium uppercase tracking-wider">
              Donate
            </span>
            <h1 className="mt-3 mb-6 font-serif text-4xl font-bold text-primary-foreground md:text-5xl">
              Your support helps women and communities rise.
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Donations support our work to expand opportunities for women, educate girls,
              and strengthen communities across Northern Nigeria.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-section max-w-5xl">
          {program && (
            <div className="mb-8 grid gap-6 rounded-2xl border border-border bg-card p-5 shadow-card sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center sm:p-7">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Designated support
                </p>
                <h2 className="mt-2 text-2xl font-serif font-bold">{program}</h2>
              </div>
              {image && (
                <img
                  src={image}
                  alt={program}
                  className="h-40 w-full rounded-xl object-cover sm:h-36"
                />
              )}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:items-start">
            <div className="space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HeartHandshake size={25} />
              </div>
              <h2 className="text-3xl font-serif font-bold">Make a donation</h2>
              <p className="leading-relaxed text-muted-foreground">
                Every contribution helps us deliver programmes and community initiatives.
                You can make a bank transfer using the official account details shown here.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                After your transfer, please use your name as the payment reference and
                contact us through our official channels if you need a donation receipt
                or confirmation.
              </p>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
              </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-primary">
                  <Landmark size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold">Official bank details</h2>
                  <p className="text-sm text-muted-foreground">Northern Women Initiative</p>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {loading ? (
                  <div className="space-y-3" aria-live="polite">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-full animate-pulse rounded bg-muted" />
                  </div>
                ) : loadError || !hasBankDetails ? (
                  <div className="rounded-xl bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
                    Official bank details are temporarily unavailable. Please contact
                    Northern Women Initiative through its official channels before
                    making a transfer.
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Bank
                      </p>
                      <p className="mt-1 text-lg font-semibold">{bankDetails.bank_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Account name
                      </p>
                      <p className="mt-1 leading-relaxed">{bankDetails.account_name}</p>
                    </div>
                    <div className="rounded-xl bg-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Account number
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="font-mono text-2xl font-bold tracking-wider text-primary">
                          {bankDetails.account_number}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => void copyAccountNumber()}
                          aria-label="Copy account number"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                          <span className="sr-only">Copy account number</span>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
