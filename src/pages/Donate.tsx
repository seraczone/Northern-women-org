import Layout from "@/components/layout/Layout";

export default function Donate() {
  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-section max-w-2xl">

          <h1 className="text-4xl font-serif font-bold text-burgundy mb-6">
            Support Our Cause
          </h1>

          <p className="text-lg text-muted-foreground mb-10">
            Your support helps us empower women, educate girls, and provide
            essential aid to communities across Northern Nigeria.
          </p>

          {/* Bank Details */}
          <div className="bg-muted rounded-2xl p-8 space-y-5">
            <h2 className="text-2xl font-serif font-bold">
              Bank Transfer Details
            </h2>

            <p>
              <span className="font-semibold">Account Name:</span><br />
              Northern Women Initiative
            </p>

            <p>
              <span className="font-semibold">Account Number:</span><br />
              <span className="text-2xl font-bold tracking-wide">
                1234567890
              </span>
            </p>

            <p>
              <span className="font-semibold">Bank Name:</span><br />
              Example Bank PLC
            </p>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Kindly use your name as payment reference.  
            For confirmation, contact us via our official channels.
          </p>

        </div>
      </section>
    </Layout>
  );
}
