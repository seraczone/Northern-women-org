import Layout from "@/components/layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Donate() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get program data from state
  const program = location.state?.program || "Our Cause";
  const image = location.state?.image;

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-section max-w-2xl">
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft size={16} /> Back to Events
          </Button>

          {/* Program Title */}
          <h1 className="text-4xl font-serif font-bold text-burgundy mb-6">
            Support: {program}
          </h1>

          {/* Program Image */}
          {image && (
            <div className="mb-6">
              <img
                src={image}
                alt={program}
                className="rounded-2xl w-full object-cover max-h-80"
              />
            </div>
          )}

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
              Northern Women Initiative For Empowerement, Growth and Development
            </p>

            <p>
              <span className="font-semibold">Account Number:</span><br />
              <span className="text-2xl font-bold tracking-wide">
                1310491614
              </span>
            </p>

            <p>
              <span className="font-semibold">Bank Name:</span><br />
              Zenith Bank
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
