// // import Layout from "@/components/layout/Layout";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Users, ArrowRight, CheckCircle,  } from "lucide-react";
// // import { useState } from "react";
// // import { useToast } from "@/hooks/use-toast";
// // import { supabase } from "@/lib/supabase";

// // const volunteerOpportunities = [
// //   "Event planning and coordination",
// //   "Teaching and mentorship",
// //   "Administrative support",
// //   "Community outreach",
// //   "Social media and communications",
// //   "Fundraising support",
// // ];

// // const GetInvolved = () => {
// //   const { toast } = useToast();
// //   const [loading, setLoading] = useState(false);

// //   const [formData, setFormData] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     phone: "",
// //     message: "",
// //   });

// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
// //   ) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     const { error } = await supabase
// //       .from("volunteer_applications")
// //       .insert([
// //         {
// //           first_name: formData.firstName,
// //           last_name: formData.lastName,
// //           email: formData.email,
// //           phone: formData.phone,
// //           message: formData.message,
// //         },
// //       ]);

// //     if (error) {
// //       toast({
// //         title: "Submission failed",
// //         description: error.message,
// //         variant: "destructive",
// //       });
// //       setLoading(false);
// //       return;
// //     }

// //     toast({
// //       title: "Application submitted!",
// //       description: "Thank you for volunteering. We’ll be in touch soon.",
// //     });

// //     setFormData({
// //       firstName: "",
// //       lastName: "",
// //       email: "",
// //       phone: "",
// //       message: "",
// //     });

// //     setLoading(false);
// //   };

// //   return (
// //     <Layout>
// //       {/* Hero */}
// //       <section className="bg-gradient-hero py-20">
// //         <div className="container-section">
// //           <div className="max-w-3xl">
// //             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// //               Get Involved
// //             </span>
// //             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// //               Become a Volunteer
// //             </h1>
// //             <p className="text-lg text-primary-foreground/90">
// //               Use your skills to empower women and communities.
// //             </p>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Form */}
// //       <section className="section-padding bg-background">
// //         <div className="container-section grid lg:grid-cols-2 gap-12">
// //           <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
// //             <div className="flex items-center gap-3 mb-6">
// //               <Users className="text-secondary" size={28} />
// //               <h2 className="text-2xl font-serif font-bold">
// //                 Volunteer Application
// //               </h2>
// //             </div>

// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div className="grid sm:grid-cols-2 gap-4">
// //                 <Input
// //                   name="firstName"
// //                   placeholder="First name"
// //                   value={formData.firstName}
// //                   onChange={handleChange}
// //                   required
// //                 />
// //                 <Input
// //                   name="lastName"
// //                   placeholder="Last name"
// //                   value={formData.lastName}
// //                   onChange={handleChange}
// //                   required
// //                 />
// //               </div>

// //               <Input
// //                 name="email"
// //                 type="email"
// //                 placeholder="Email address"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 required
// //               />

// //               <Input
// //                 name="phone"
// //                 type="tel"
// //                 placeholder="+234 XXX XXX XXXX"
// //                 value={formData.phone}
// //                 onChange={handleChange}
// //               />

// //               <Textarea
// //                 name="message"
// //                 rows={4}
// //                 placeholder="Tell us about your skills and availability..."
// //                 value={formData.message}
// //                 onChange={handleChange}
// //               />

// //               <Button
// //                 type="submit"
// //                 variant="gold"
// //                 size="lg"
// //                 className="w-full"
// //                 disabled={loading}
// //               >
// //                 {loading ? "Submitting..." : "Submit Application"}
// //                 <ArrowRight size={18} />
// //               </Button>
// //             </form>
// //           </div>

// //           {/* Opportunities */}
// //           <div>
// //             <h3 className="text-xl font-serif font-semibold mb-4">
// //               Volunteer Opportunities
// //             </h3>
// //             <ul className="space-y-3">
// //               {volunteerOpportunities.map((item) => (
// //                 <li key={item} className="flex items-center gap-3">
// //                   <CheckCircle size={20} className="text-secondary" />
// //                   <span className="text-muted-foreground">{item}</span>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </div>
// //       </section>
// //     </Layout>
// //   );
// // };

// // export default GetInvolved;

// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Users, ArrowRight, CheckCircle } from "lucide-react";
// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/lib/supabase";

// const volunteerOpportunities = [
//   "Event planning and coordination",
//   "Teaching and mentorship",
//   "Administrative support",
//   "Community outreach",
//   "Social media and communications",
//   "Fundraising support",
// ];

// const GetInvolved = () => {
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase
//       .from("volunteer_applications")
//       .insert([
//         {
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           email: formData.email,
//           phone: formData.phone,
//           message: formData.message,
//         },
//       ]);

//     if (error) {
//       toast({
//         title: "Submission failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       setLoading(false);
//       return;
//     }

//     toast({
//       title: "Application submitted!",
//       description: "Thank you for volunteering. We’ll be in touch soon.",
//     });

//     setFormData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       message: "",
//     });

//     setLoading(false);
//   };

//   return (
//     <Layout>
//       {/* Hero */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Get Involved
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Become a Volunteer
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               Use your skills to empower women and communities.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Form */}
//       <section className="section-padding bg-background">
//         <div className="container-section grid lg:grid-cols-2 gap-12">
//           <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
//             <div className="flex items-center gap-3 mb-6">
//               <Users className="text-secondary" size={28} />
//               <h2 className="text-2xl font-serif font-bold">
//                 Volunteer Application
//               </h2>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid sm:grid-cols-2 gap-4">
//                 <Input
//                   name="firstName"
//                   placeholder="First name"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                 />
//                 <Input
//                   name="lastName"
//                   placeholder="Last name"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />

//               <Input
//                 name="phone"
//                 type="tel"
//                 placeholder="+234 XXX XXX XXXX"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />

//               <Textarea
//                 name="message"
//                 rows={4}
//                 placeholder="Tell us about your skills and availability..."
//                 value={formData.message}
//                 onChange={handleChange}
//               />

//               <Button
//                 type="submit"
//                 variant="gold"
//                 size="lg"
//                 className="w-full"
//                 disabled={loading}
//               >
//                 {loading ? "Submitting..." : "Submit Application"}
//                 <ArrowRight size={18} />
//               </Button>
//             </form>

//             {/* ✅ WHATSAPP INSTRUCTION + BUTTON ADDED */}
//             <p className="text-sm text-muted-foreground mt-6 mb-3 text-center">
//               After submitting the form, click the WhatsApp icon below to join
//               our volunteer waiting list and receive updates.
//             </p>

//             <div className="flex justify-center">
//               <a
//                 href="https://chat.whatsapp.com/HvK4m9WQBY9DqKBSGv5ctg?mode=gi_t"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
//               >
//                 <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
//                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51z" />
//                 </svg>
//               </a>
//             </div>
//             {/* ✅ END ADDITION */}
//           </div>

//           {/* Opportunities */}
//           <div>
//             <h3 className="text-xl font-serif font-semibold mb-4">
//               Volunteer Opportunities
//             </h3>
//             <ul className="space-y-3">
//               {volunteerOpportunities.map((item) => (
//                 <li key={item} className="flex items-center gap-3">
//                   <CheckCircle size={20} className="text-secondary" />
//                   <span className="text-muted-foreground">{item}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default GetInvolved;

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { saveRegistrationByEmail } from "@/lib/saveRegistrationByEmail";
import whatsappLogo from "../assets/whatsapp.png"; // ✅ CORRECT IMAGE IMPORT

const volunteerOpportunities = [
  "Event planning and coordination",
  "Teaching and mentorship",
  "Administrative support",
  "Community outreach",
  "Social media and communications",
  "Fundraising support",
];

const GetInvolved = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error, wasUpdate } = await saveRegistrationByEmail({
      table: "volunteer_applications",
      email: formData.email,
      payload: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        message: formData.message,
      },
    });

    if (error) {
      toast({
        title: "Unable to save application",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: wasUpdate ? "Application updated" : "Application submitted!",
      description: "Thank you for volunteering. We’ll be in touch soon.",
    });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });

    setLoading(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Get Involved
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
              Become a Volunteer
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Use your skills to empower women and communities.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-background">
        <div className="container-section grid lg:grid-cols-2 gap-12">
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-secondary" size={28} />
              <h2 className="text-2xl font-serif font-bold">
                Volunteer Application
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                name="phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={formData.phone}
                onChange={handleChange}
              />

              <Textarea
                name="message"
                rows={4}
                placeholder="Tell us about your skills and availability..."
                value={formData.message}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
                <ArrowRight size={18} />
              </Button>
            </form>

            {/* ✅ WHATSAPP SECTION ADDED */}
            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4 font-medium">
               After submitting the form, click the WhatsApp icon below to join
               our volunteer waiting list and receive updates.
              </p>

              <a
                href="https://chat.whatsapp.com/HvK4m9WQBY9DqKBSGv5ctg?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src={whatsappLogo}
                  alt="Join WhatsApp Group"
                  className="w-10 h-10 mx-auto hover:scale-110 transition-transform duration-200"
                />
              </a>
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">
              Volunteer Opportunities
            </h3>
            <ul className="space-y-3">
              {volunteerOpportunities.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-secondary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;
