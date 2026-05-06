import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Send,
} from "lucide-react";

type ContactSubmissionResponse = {
  success: boolean;
  messageSaved: boolean;
  emailSent: boolean;
  error?: string;
};

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = {
      first_name: (form.elements.namedItem("first_name") as HTMLInputElement)
        .value.trim(),
      last_name: (form.elements.namedItem("last_name") as HTMLInputElement)
        .value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value.trim(),
    };

    const { data, error } = await supabase.functions.invoke(
      "send-contact-email",
      {
        body: formData,
      }
    );

    if (error) {
      console.error("Contact submit error:", error);
      toast({
        title: "Message failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const response = (data as ContactSubmissionResponse | null) ?? {
      success: false,
      messageSaved: false,
      emailSent: false,
      error: "Unexpected response from contact service.",
    };

    if (!response.success && response.messageSaved && !response.emailSent) {
      console.error("Contact email error:", response.error);
      toast({
        title: "Message saved, email failed",
        description:
          "Your message was saved, but the admin notification email could not be sent.",
        variant: "destructive",
      });
      form.reset();
      return;
    }

    if (!response.success) {
      console.error("Contact submit error:", response.error);
      toast({
        title: "Message failed",
        description: response.error || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent successfully",
      description:
        "Thank you for reaching out. We'll get back to you shortly.",
    });

    form.reset();
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-primary-foreground/90">
              We&apos;d love to hear from you. Whether you have questions, ideas,
              or want to collaborate, reach out.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      First Name
                    </label>
                    <Input
                      name="first_name"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Last Name
                    </label>
                    <Input
                      name="last_name"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    placeholder="What is this about?"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send size={18} />
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a
                      href="mailto:Northernwomen001@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Northernwomen001@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">
                      +234 906 737 9828 <br />
                      +44 7793 012771
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">
                      No 206, Maitama Mall, Abuja.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com/your-page-name"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Facebook size={24} />
                  </a>

                  <a
                    href="https://www.instagram.com/northernwomen__?igsh=bDd1ZWFmOXhwcmpl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
