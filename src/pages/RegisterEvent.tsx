// // import Layout from "@/components/layout/Layout";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { ArrowLeft, Calendar } from "lucide-react";
// // import { useNavigate, useSearchParams } from "react-router-dom";
// // import { useState } from "react";
// // import { useToast } from "@/hooks/use-toast";

// // export default function RegisterEvent() {
// //   const navigate = useNavigate();
// //   const { toast } = useToast();
// //   const [searchParams] = useSearchParams();

// //   // Get event name from URL
// //   const eventName =
// //     searchParams.get("event") || "Northern Women Summit";

// //   const [formData, setFormData] = useState({
// //     first_name: "",
// //     last_name: "",
// //     email: "",
// //     phone: "",
// //     address: "",
// //     state: "",
// //     country: "",
// //   });

// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement>
// //   ) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     // 🔜 Supabase insert will go here later
// //     toast({
// //       title: "Registration successful 🎉",
// //       description: `You have registered for ${eventName}`,
// //     });

// //     // optional redirect later
// //     // navigate("/events");
// //   };

// //   return (
// //     <Layout>
// //       {/* HERO SECTION */}
// //       <section className="bg-gradient-hero py-20">
// //         <div className="container-section">
// //           <span className="text-secondary uppercase text-sm font-medium">
// //             Event Registration
// //           </span>
// //           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// //             Register for Event
// //           </h1>
// //           <p className="text-lg text-primary-foreground/90">
// //             Secure your spot for{" "}
// //             <span className="font-semibold">{eventName}</span>
// //           </p>
// //         </div>
// //       </section>

// //       {/* FORM SECTION */}
// //       <section className="section-padding bg-background">
// //         <div className="container-section max-w-2xl">
// //           {/* Back Button */}
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             className="mb-6 flex items-center gap-2"
// //             onClick={() => navigate("/events")}
// //           >
// //             <ArrowLeft size={16} /> Back to Events
// //           </Button>

// //           {/* Event Info */}
// //           <div className="flex items-center gap-3 text-muted-foreground mb-8">
// //             <Calendar size={18} />
// //             <span>{eventName}</span>
// //           </div>

// //           {/* FORM */}
// //           <form
// //             onSubmit={handleSubmit}
// //             className="bg-card rounded-2xl p-8 shadow-card border border-border space-y-6"
// //           >
// //             <div className="grid sm:grid-cols-2 gap-4">
// //               <Input
// //                 name="first_name"
// //                 placeholder="First Name"
// //                 required
// //                 value={formData.first_name}
// //                 onChange={handleChange}
// //               />
// //               <Input
// //                 name="last_name"
// //                 placeholder="Last Name"
// //                 required
// //                 value={formData.last_name}
// //                 onChange={handleChange}
// //               />
// //             </div>

// //             <Input
// //               type="email"
// //               name="email"
// //               placeholder="Email Address"
// //               required
// //               value={formData.email}
// //               onChange={handleChange}
// //             />

// //             <Input
// //               type="tel"
// //               name="phone"
// //               placeholder="Phone Number"
// //               required
// //               value={formData.phone}
// //               onChange={handleChange}
// //             />

// //             <Input
// //               name="address"
// //               placeholder="Residential Address"
// //               required
// //               value={formData.address}
// //               onChange={handleChange}
// //             />

// //             <div className="grid sm:grid-cols-2 gap-4">
// //               <Input
// //                 name="state"
// //                 placeholder="State"
// //                 required
// //                 value={formData.state}
// //                 onChange={handleChange}
// //               />
// //               <Input
// //                 name="country"
// //                 placeholder="Country"
// //                 required
// //                 value={formData.country}
// //                 onChange={handleChange}
// //               />
// //             </div>

// //             <Button
// //               variant="gold"
// //               size="lg"
// //               type="submit"
// //               className="w-full"
// //             >
// //               Complete Registration
// //             </Button>
// //           </form>
// //         </div>
// //       </section>
// //     </Layout>
// //   );
// // }

// // import Layout from "@/components/layout/Layout";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { ArrowLeft, Calendar } from "lucide-react";
// // import { useNavigate, useSearchParams } from "react-router-dom";
// // import { useState } from "react";
// // import { useToast } from "@/hooks/use-toast";
// // import { supabase } from "@/lib/supabase";

// // export default function RegisterEvent() {
// //   const navigate = useNavigate();
// //   const { toast } = useToast();
// //   const [searchParams] = useSearchParams();

// //   const eventName =
// //     searchParams.get("event") || "Northern Women Summit";

// //   const [loading, setLoading] = useState(false);

// //   const [formData, setFormData] = useState({
// //     first_name: "",
// //     last_name: "",
// //     email: "",
// //     phone: "",
// //     address: "",
// //     state: "",
// //     country: "",
// //   });

// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement>
// //   ) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     const { error } = await supabase
// //       .from("event_registrations")
// //       .insert({
// //         event_name: eventName,
// //         ...formData,
// //       });

// //     setLoading(false);

// //     if (error) {
// //       toast({
// //         title: "Registration failed",
// //         description: error.message,
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     toast({
// //       title: "Registration successful 🎉",
// //       description: `You have registered for ${eventName}`,
// //     });

// //     setFormData({
// //       first_name: "",
// //       last_name: "",
// //       email: "",
// //       phone: "",
// //       address: "",
// //       state: "",
// //       country: "",
// //     });

// //     // optional redirect
// //     // navigate("/events");
// //   };

// //   return (
// //     <Layout>
// //       {/* HERO SECTION */}
// //       <section className="bg-gradient-hero py-20">
// //         <div className="container-section">
// //           <span className="text-secondary uppercase text-sm font-medium">
// //             Event Registration
// //           </span>
// //           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// //             Register for Event
// //           </h1>
// //           <p className="text-lg text-primary-foreground/90">
// //             Secure your spot for{" "}
// //             <span className="font-semibold">{eventName}</span>
// //           </p>
// //         </div>
// //       </section>

// //       {/* FORM SECTION */}
// //       <section className="section-padding bg-background">
// //         <div className="container-section max-w-2xl">
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             className="mb-6 flex items-center gap-2"
// //             onClick={() => navigate("/events")}
// //           >
// //             <ArrowLeft size={16} /> Back to Events
// //           </Button>

// //           <div className="flex items-center gap-3 text-muted-foreground mb-8">
// //             <Calendar size={18} />
// //             <span>{eventName}</span>
// //           </div>

// //           <form
// //             onSubmit={handleSubmit}
// //             className="bg-card rounded-2xl p-8 shadow-card border space-y-6"
// //           >
// //             <div className="grid sm:grid-cols-2 gap-4">
// //               <Input
// //                 name="first_name"
// //                 placeholder="First Name"
// //                 required
// //                 value={formData.first_name}
// //                 onChange={handleChange}
// //               />
// //               <Input
// //                 name="last_name"
// //                 placeholder="Last Name"
// //                 required
// //                 value={formData.last_name}
// //                 onChange={handleChange}
// //               />
// //             </div>

// //             <Input
// //               type="email"
// //               name="email"
// //               placeholder="Email Address"
// //               required
// //               value={formData.email}
// //               onChange={handleChange}
// //             />

// //             <Input
// //               type="tel"
// //               name="phone"
// //               placeholder="Phone Number"
// //               required
// //               value={formData.phone}
// //               onChange={handleChange}
// //             />

// //             <Input
// //               name="address"
// //               placeholder="Residential Address"
// //               required
// //               value={formData.address}
// //               onChange={handleChange}
// //             />

// //             <div className="grid sm:grid-cols-2 gap-4">
// //               <Input
// //                 name="state"
// //                 placeholder="State"
// //                 required
// //                 value={formData.state}
// //                 onChange={handleChange}
// //               />
// //               <Input
// //                 name="country"
// //                 placeholder="Country"
// //                 required
// //                 value={formData.country}
// //                 onChange={handleChange}
// //               />
// //             </div>

// //             <Button
// //               variant="gold"
// //               size="lg"
// //               type="submit"
// //               className="w-full"
// //               disabled={loading}
// //             >
// //               {loading ? "Submitting..." : "Complete Registration"}
// //             </Button>
// //           </form>
// //         </div>
// //       </section>
// //     </Layout>
// //   );
// // }

// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ArrowLeft, Calendar } from "lucide-react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/lib/supabase";

// export default function RegisterEvent() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [searchParams] = useSearchParams();

//   const eventName =
//     searchParams.get("event") || "Northern Women Summit";

//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: "",
//     address: "",
//     state: "",
//     country: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase
//       .from("event_registration") // ✅ CORRECT TABLE NAME
//       .insert([
//         {
//           event_name: eventName,
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//           state: formData.state,
//           country: formData.country,
//         },
//       ]);

//     setLoading(false);

//     if (error) {
//       console.error("Event registration error:", error);

//       toast({
//         title: "Registration failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: "Registration successful 🎉",
//       description: `You have successfully registered for ${eventName}`,
//     });

//     setFormData({
//       first_name: "",
//       last_name: "",
//       email: "",
//       phone: "",
//       address: "",
//       state: "",
//       country: "",
//     });

//     // Optional redirect
//     // navigate("/events");
//   };

//   return (
//     <Layout>
//       {/* HERO SECTION */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <span className="text-secondary uppercase text-sm font-medium">
//             Event Registration
//           </span>
//           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//             Register for Event
//           </h1>
//           <p className="text-lg text-primary-foreground/90">
//             Secure your spot for{" "}
//             <span className="font-semibold">{eventName}</span>
//           </p>
//         </div>
//       </section>

//       {/* FORM SECTION */}
//       <section className="section-padding bg-background">
//         <div className="container-section max-w-2xl">
//           <Button
//             variant="outline"
//             size="sm"
//             className="mb-6 flex items-center gap-2"
//             onClick={() => navigate("/events")}
//           >
//             <ArrowLeft size={16} /> Back to Events
//           </Button>

//           <div className="flex items-center gap-3 text-muted-foreground mb-8">
//             <Calendar size={18} />
//             <span>{eventName}</span>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="bg-card rounded-2xl p-8 shadow-card border space-y-6"
//           >
//             <div className="grid sm:grid-cols-2 gap-4">
//               <Input
//                 name="first_name"
//                 placeholder="First Name"
//                 required
//                 value={formData.first_name}
//                 onChange={handleChange}
//               />
//               <Input
//                 name="last_name"
//                 placeholder="Last Name"
//                 required
//                 value={formData.last_name}
//                 onChange={handleChange}
//               />
//             </div>

//             <Input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               required
//               value={formData.email}
//               onChange={handleChange}
//             />

//             <Input
//               type="tel"
//               name="phone"
//               placeholder="Phone Number"
//               required
//               value={formData.phone}
//               onChange={handleChange}
//             />

//             <Input
//               name="address"
//               placeholder="Residential Address"
//               required
//               value={formData.address}
//               onChange={handleChange}
//             />

//             <div className="grid sm:grid-cols-2 gap-4">
//               <Input
//                 name="state"
//                 placeholder="State"
//                 required
//                 value={formData.state}
//                 onChange={handleChange}
//               />
//               <Input
//                 name="country"
//                 placeholder="Country"
//                 required
//                 value={formData.country}
//                 onChange={handleChange}
//               />
//             </div>

//             <Button
//               variant="gold"
//               size="lg"
//               type="submit"
//               className="w-full"
//               disabled={loading}
//             >
//               {loading ? "Submitting..." : "Complete Registration"}
//             </Button>
//           </form>
//         </div>
//       </section>
//     </Layout>
//   );
// }

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function RegisterEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const eventName =
    searchParams.get("event") || "Northern Women Summit";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("event_registration")
      .insert([
        {
          event_name: eventName,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          country: formData.country,
        },
      ]);

    setLoading(false);

    if (error) {
      // Duplicate registration (email + event)
      if (error.code === "23505") {
        toast({
          title: "Already registered",
          description:
            "This email has already been registered for this event.",
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

    toast({
      title: "Registration successful 🎉",
      description: `You have successfully registered for ${eventName}`,
    });

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      country: "",
    });

    // Optional redirect after success
    // navigate("/events");
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <span className="text-secondary uppercase text-sm font-medium">
            Event Registration
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
            Register for Event
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Secure your spot for{" "}
            <span className="font-semibold">{eventName}</span>
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
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

          <div className="flex items-center gap-3 text-muted-foreground mb-8">
            <Calendar size={18} />
            <span>{eventName}</span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-8 shadow-card border space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
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

            <div className="grid sm:grid-cols-2 gap-4">
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



