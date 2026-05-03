import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function RegisterEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const requestedEventName = searchParams.get("event")?.trim() || "";
  const [eventDetails, setEventDetails] = useState({
    eventName: requestedEventName || "Northern Women Summit",
    eventDate: searchParams.get("date")?.trim() || "",
    eventTime: searchParams.get("time")?.trim() || "",
    eventLocation: searchParams.get("location")?.trim() || "",
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    let ignore = false;

    const fetchFeaturedEventFallback = async () => {
      const hasAllDetails =
        eventDetails.eventDate.trim() &&
        eventDetails.eventTime.trim() &&
        eventDetails.eventLocation.trim();

      if (hasAllDetails) {
        return;
      }

      const { data, error } = await supabase
        .from("featured_event")
        .select("title, date, time, location")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ignore || error || !data) {
        return;
      }

      const normalizedRequestedTitle = (requestedEventName || eventDetails.eventName)
        .trim()
        .toLowerCase();
      const normalizedFeaturedTitle = String(data.title ?? "")
        .trim()
        .toLowerCase();
      const isMatchingFeaturedEvent =
        !normalizedRequestedTitle || normalizedRequestedTitle === normalizedFeaturedTitle;

      if (!isMatchingFeaturedEvent) {
        return;
      }

      setEventDetails((current) => ({
        eventName: requestedEventName || current.eventName || data.title || "Northern Women Summit",
        eventDate: current.eventDate || data.date || "",
        eventTime: current.eventTime || data.time || "",
        eventLocation: current.eventLocation || data.location || "",
      }));
    };

    void fetchFeaturedEventFallback();

    return () => {
      ignore = true;
    };
  }, [eventDetails.eventDate, eventDetails.eventLocation, eventDetails.eventName, eventDetails.eventTime, requestedEventName]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const normalizedEmail = formData.email.trim().toLowerCase();
    const registrationRecord = {
      event_name: eventDetails.eventName,
      event_date: eventDetails.eventDate,
      event_time: eventDetails.eventTime,
      event_location: eventDetails.eventLocation,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: normalizedEmail,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
    };

    const { data, error } = await supabase
      .from("event_registration")
      .insert([registrationRecord])
      .select(
        "registration_code, event_name, event_date, event_time, event_location, first_name, last_name, email, phone, address, state, country",
      )
      .single();

    if (error) {
      setLoading(false);

      if (error.code === "23505") {
        toast({
          title: "Already registered",
          description: "This email has already been registered for this event.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const { error: notificationError } = await supabase.functions.invoke(
      "send-registration-email",
      {
        body: {
          flow: "event",
          wasUpdate: false,
          submission: data ?? registrationRecord,
        },
      },
    );

    setLoading(false);

    if (notificationError) {
      toast({
        title: "Registration submitted",
        description:
          "Your registration was saved, but the confirmation email could not be sent yet.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration successful",
        description: `You have successfully registered for ${eventDetails.eventName}.`,
      });
    }

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      country: "",
    });
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <span className="text-secondary text-sm font-medium uppercase">
            Event Registration
          </span>
          <h1 className="mt-3 mb-6 text-4xl font-serif font-bold text-primary-foreground md:text-5xl">
            Register for Event
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Secure your spot for <span className="font-semibold">{eventDetails.eventName}</span>
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section max-w-2xl">
          <Button
            variant="outline"
            size="sm"
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft size={16} /> Back to Events
          </Button>

          <div className="mb-8 flex items-center gap-3 text-muted-foreground">
            <Calendar size={18} />
            <span>{eventDetails.eventName}</span>
          </div>

          {(eventDetails.eventDate || eventDetails.eventTime || eventDetails.eventLocation) && (
            <div className="mb-8 space-y-3 rounded-2xl border border-border bg-muted p-6 text-sm text-muted-foreground">
              {eventDetails.eventDate && (
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-primary" />
                  <span>{eventDetails.eventDate}</span>
                </div>
              )}
              {eventDetails.eventTime && (
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-primary" />
                  <span>{eventDetails.eventTime}</span>
                </div>
              )}
              {eventDetails.eventLocation && (
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-primary" />
                  <span>{eventDetails.eventLocation}</span>
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border bg-card p-8 shadow-card"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="first_name"
                placeholder="First Name"
                required
                value={formData.first_name}
                onChange={handleChange}
              />
              <Input
                name="last_name"
                placeholder="Last Name"
                required
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              name="address"
              placeholder="Residential Address"
              required
              value={formData.address}
              onChange={handleChange}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="state"
                placeholder="State"
                required
                value={formData.state}
                onChange={handleChange}
              />
              <Input
                name="country"
                placeholder="Country"
                required
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <Button
              variant="gold"
              size="lg"
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Complete Registration"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
