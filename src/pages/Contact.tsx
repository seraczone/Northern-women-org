// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Send } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const Contact = () => {
//   const { toast } = useToast();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: "Message sent!",
//       description: "Thank you for reaching out. We'll respond within 24-48 hours.",
//     });
//   };

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">Contact Us</span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Get in Touch
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               We'd love to hear from you. Whether you have questions, ideas, or want to collaborate—reach out!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Contact Form */}
//             <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
//               <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Send Us a Message</h2>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
//                     <Input placeholder="Your first name" required />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
//                     <Input placeholder="Your last name" required />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
//                   <Input type="email" placeholder="your@email.com" required />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
//                   <Input placeholder="What is this about?" required />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
//                   <Textarea placeholder="Tell us more about your inquiry..." rows={5} required />
//                 </div>
//                 <Button variant="gold" size="lg" type="submit" className="w-full">
//                   Send Message
//                   <Send size={18} />
//                 </Button>
//               </form>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Contact Information</h2>
//               <p className="text-muted-foreground mb-8">
//                 Reach out through any of the channels below. We typically respond within 24-48 hours.
//               </p>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
//                     <Mail className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-foreground">Email</h3>
//                     <a href="Northernwomen001@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
//                       Northernwomen001@gmail.com
//                     </a>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
//                     <Phone className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-foreground">Phone</h3>
//                     <a href="tel:+234XXXXXXXXXX" className="text-muted-foreground hover:text-primary transition-colors">
//                       +234 906 737 9828 <br />
//                       +447793012771
//                     </a>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
//                     <MapPin className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-foreground">Location</h3>
//                     <p className="text-muted-foreground">
//                       No 206, Maitama Mall, Abuja. <br />
//                       Scotland, United Kingdom.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
//                     <Clock className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-foreground">Office Hours</h3>
//                     <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="mt-10">
//                 <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
//                 <div className="flex gap-4">
//                   <a
//                     href="#"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Facebook size={24} />
//                   </a>
//                   <a
//                     href="#"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Instagram size={24} />
//                   </a>
//                   <a
//                     href="#"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FAQ CTA */}
//       <section className="section-padding bg-muted">
//         <div className="container-section text-center">
//           <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
//             Looking to Get Involved?
//           </h2>
//           <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
//             Explore ways to volunteer, donate, or partner with Northern Women Initiative.
//           </p>
//           <Button variant="burgundy" size="lg" asChild>
//             <a href="/get-involved">
//               Explore Opportunities
//             </a>
//           </Button>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Contact;
// import { supabase } from '@/lib/supabase'
// import React from "react";
// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   Facebook,
//   Instagram,
//   Send,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const Contact = () => {
//   const { toast } = useToast();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: "Message sent!",
//       description: "Thank you for reaching out. We'll respond within 24-48 hours.",
//     });
//   };

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Contact Us
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Get in Touch
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               We'd love to hear from you. Whether you have questions, ideas, or
//               want to collaborate—reach out!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Contact Form */}
//             <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
//               <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
//                 Send Us a Message
//               </h2>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       First Name
//                     </label>
//                     <Input placeholder="Your first name" required />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       Last Name
//                     </label>
//                     <Input placeholder="Your last name" required />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Email Address
//                   </label>
//                   <Input type="email" placeholder="your@email.com" required />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Subject
//                   </label>
//                   <Input placeholder="What is this about?" required />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Message
//                   </label>
//                   <Textarea
//                     placeholder="Tell us more about your inquiry..."
//                     rows={5}
//                     required
//                   />
//                 </div>

//                 <Button variant="gold" size="lg" type="submit" className="w-full">
//                   Send Message
//                   <Send size={18} />
//                 </Button>
//               </form>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h2 className="text-2xl font-serif font-bold mb-6">
//                 Contact Information
//               </h2>

//               <div className="space-y-6">
//                 {/* Email */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Mail className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Email</h3>
//                     <a
//                       href="mailto:Northernwomen001@gmail.com"
//                       className="text-muted-foreground hover:text-primary transition-colors"
//                     >
//                       Northernwomen001@gmail.com
//                     </a>
//                   </div>
//                 </div>

//                 {/* Phone */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Phone className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Phone</h3>
//                     <a
//                       href="tel:+2349067379828"
//                       className="text-muted-foreground hover:text-primary transition-colors"
//                     >
//                       +234 906 737 9828 <br />
//                       +44 7793 012771
//                     </a>
//                   </div>
//                 </div>

//                 {/* Location */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <MapPin className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Location</h3>
//                     <p className="text-muted-foreground">
//                       No 206, Maitama Mall, Abuja. <br />
//                       Scotland, United Kingdom.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Office Hours */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Clock className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Office Hours</h3>
//                     <p className="text-muted-foreground">
//                       Monday – Friday: 9:00 AM – 5:00 PM
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="mt-10">
//                 <h3 className="font-semibold mb-4">Follow Us</h3>

//                 <div className="flex gap-4">
//                   {/* Facebook (dummy link) */}
//                   <a
//                     href="https://facebook.com/your-page-name"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Facebook size={24} />
//                   </a>

//                   {/* Instagram */}
//                   <a
//                     href="https://www.instagram.com/northernwomen__?igsh=bDd1ZWFmOXhwcmpl"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Instagram size={24} />
//                   </a>

//                   {/* WhatsApp */}
//                   <a
//                     href="https://wa.me/2349067379828"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <svg
//                       viewBox="0 0 24 24"
//                       className="w-6 h-6 fill-current"
//                     >
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51z" />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Contact;

// import React from "react";
// import { supabase } from "@/lib/supabase";
// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   Facebook,
//   Instagram,
//   Send,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const Contact = () => {
//   const { toast } = useToast();

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();

//     const form = e.currentTarget;

//     const formData = {
//       first_name: (form.elements.namedItem("first_name") as HTMLInputElement)
//         .value,
//       last_name: (form.elements.namedItem("last_name") as HTMLInputElement)
//         .value,
//       email: (form.elements.namedItem("email") as HTMLInputElement).value,
//       subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
//       message: (form.elements.namedItem("message") as HTMLTextAreaElement)
//         .value,
//     };

//     const { error } = await supabase
//       .from("contact_messages")
//       .insert([formData]);

//     if (error) {
//       console.error(error);
//       toast({
//         title: "Message failed",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: "Message sent!",
//       description: "Thank you for reaching out. We'll respond within 24–48 hours.",
//     });

//     form.reset();
//   };

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Contact Us
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Get in Touch
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               We'd love to hear from you. Whether you have questions, ideas, or
//               want to collaborate—reach out!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Contact Form */}
//             <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
//               <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
//                 Send Us a Message
//               </h2>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       First Name
//                     </label>
//                     <Input
//                       name="first_name"
//                       placeholder="Your first name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       Last Name
//                     </label>
//                     <Input
//                       name="last_name"
//                       placeholder="Your last name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Email Address
//                   </label>
//                   <Input
//                     name="email"
//                     type="email"
//                     placeholder="your@email.com"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Subject
//                   </label>
//                   <Input
//                     name="subject"
//                     placeholder="What is this about?"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Message
//                   </label>
//                   <Textarea
//                     name="message"
//                     placeholder="Tell us more about your inquiry..."
//                     rows={5}
//                     required
//                   />
//                 </div>

//                 <Button variant="gold" size="lg" type="submit" className="w-full">
//                   Send Message
//                   <Send size={18} />
//                 </Button>
//               </form>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h2 className="text-2xl font-serif font-bold mb-6">
//                 Contact Information
//               </h2>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Mail className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Email</h3>
//                     <a
//                       href="mailto:Northernwomen001@gmail.com"
//                       className="text-muted-foreground hover:text-primary transition-colors"
//                     >
//                       Northernwomen001@gmail.com
//                     </a>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Phone className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Phone</h3>
//                     <p className="text-muted-foreground">
//                       +234 906 737 9828 <br />
//                       +44 7793 012771
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <MapPin className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Location</h3>
//                     <p className="text-muted-foreground">
//                       No 206, Maitama Mall, Abuja. <br />
//                       Scotland, United Kingdom.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Clock className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Office Hours</h3>
//                     <p className="text-muted-foreground">
//                       Monday – Friday: 9:00 AM – 5:00 PM
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="mt-10">
//                 <h3 className="font-semibold mb-4">Follow Us</h3>
//                 <div className="flex gap-4">
//                   <a
//                     href="https://facebook.com/your-page-name"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Facebook size={24} />
//                   </a>

//                   <a
//                     href="https://www.instagram.com/northernwomen__?igsh=bDd1ZWFmOXhwcmpl"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Instagram size={24} />
//                   </a>

//                   <a
//                     href="https://wa.me/2349067379828"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51z" />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Contact;

// import React from "react";
// import { supabase } from "@/lib/supabase";
// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   Facebook,
//   Instagram,
//   Send,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const Contact = () => {
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = e.currentTarget;

//     const formData = {
//       first_name: (form.elements.namedItem("first_name") as HTMLInputElement)
//         .value,
//       last_name: (form.elements.namedItem("last_name") as HTMLInputElement)
//         .value,
//       email: (form.elements.namedItem("email") as HTMLInputElement).value,
//       subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
//       message: (form.elements.namedItem("message") as HTMLTextAreaElement)
//         .value,
//     };

//     // 1️⃣ Save to Supabase
//     const { error } = await supabase
//       .from("contact_messages")
//       .insert([formData]);

//     if (error) {
//       console.error(error);
//       toast({
//         title: "Message failed",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // 2️⃣ Send email via Supabase Edge Function
//     try {
//       await fetch(
//         "https://ponlvomzjoxsfrrdzwqz.functions.supabase.co/send-contact-email",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError);
//       toast({
//         title: "Message saved, email failed",
//         description:
//           "Your message was saved, but the admin email could not be sent.",
//         variant: "destructive",
//       });
//       form.reset();
//       return;
//     }

//     toast({
//       title: "Message sent!",
//       description:
//         "Thank you for reaching out. We'll respond within 24–48 hours.",
//     });

//     form.reset();
//   };

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Contact Us
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Get in Touch
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               We'd love to hear from you. Whether you have questions, ideas, or
//               want to collaborate—reach out!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Contact Form */}
//             <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
//               <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
//                 Send Us a Message
//               </h2>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       First Name
//                     </label>
//                     <Input
//                       name="first_name"
//                       placeholder="Your first name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       Last Name
//                     </label>
//                     <Input
//                       name="last_name"
//                       placeholder="Your last name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Email Address
//                   </label>
//                   <Input
//                     name="email"
//                     type="email"
//                     placeholder="your@email.com"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Subject
//                   </label>
//                   <Input
//                     name="subject"
//                     placeholder="What is this about?"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Message
//                   </label>
//                   <Textarea
//                     name="message"
//                     placeholder="Tell us more about your inquiry..."
//                     rows={5}
//                     required
//                   />
//                 </div>

//                 <Button
//                   variant="gold"
//                   size="lg"
//                   type="submit"
//                   className="w-full"
//                 >
//                   Send Message
//                   <Send size={18} />
//                 </Button>
//               </form>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h2 className="text-2xl font-serif font-bold mb-6">
//                 Contact Information
//               </h2>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Mail className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Email</h3>
//                     <a
//                       href="mailto:Northernwomen001@gmail.com"
//                       className="text-muted-foreground hover:text-primary transition-colors"
//                     >
//                       Northernwomen001@gmail.com
//                     </a>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Phone className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Phone</h3>
//                     <p className="text-muted-foreground">
//                       +234 906 737 9828 <br />
//                       +44 7793 012771
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <MapPin className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Location</h3>
//                     <p className="text-muted-foreground">
//                       No 206, Maitama Mall, Abuja. <br />
//                       Scotland, United Kingdom.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Clock className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Office Hours</h3>
//                     <p className="text-muted-foreground">
//                       Monday – Friday: 9:00 AM – 5:00 PM
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="mt-10">
//                 <h3 className="font-semibold mb-4">Follow Us</h3>
//                 <div className="flex gap-4">
//                   <a
//                     href="https://facebook.com/your-page-name"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Facebook size={24} />
//                   </a>

//                   <a
//                     href="https://www.instagram.com/northernwomen__?igsh=bDd1ZWFmOXhwcmpl"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Instagram size={24} />
//                   </a>

//                   <a
//                     href="https://wa.me/2349067379828"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51z" />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Contact;

// import React from "react";
// import { supabase } from "@/lib/supabase";
// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   Facebook,
//   Instagram,
//   Send,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const Contact = () => {
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = e.currentTarget;

//     const formData = {
//       first_name: (form.elements.namedItem("first_name") as HTMLInputElement)
//         .value,
//       last_name: (form.elements.namedItem("last_name") as HTMLInputElement)
//         .value,
//       email: (form.elements.namedItem("email") as HTMLInputElement).value,
//       subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
//       message: (form.elements.namedItem("message") as HTMLTextAreaElement)
//         .value,
//     };

//     // 1️⃣ Save to Supabase table
//     const { error } = await supabase
//       .from("contact_messages")
//       .insert([formData]);

//     if (error) {
//       console.error(error);
//       toast({
//         title: "Message failed",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // 2️⃣ Send email via Edge Function with anon key
//     try {
//       const response = await fetch(
//         "https://ponlvomzjoxsfrrdzwqz.functions.supabase.co/send-contact-email",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbmx2b216am94c2ZycmR6d3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMzE0NjQsImV4cCI6MjA4MzgwNzQ2NH0.VBPH34Tra_gtlYnrORBagg4OY737FzeLdAd1tyMDykk",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Email sending failed with status ${response.status}`);
//       }
//     } catch (emailError) {
//       console.error(emailError);
//       toast({
//         title: "Message saved, email failed",
//         description:
//           "Your message was saved, but the admin email could not be sent.",
//         variant: "destructive",
//       });
//       form.reset();
//       return;
//     }

//     toast({
//       title: "Message sent!",
//       description:
//         "Thank you for reaching out. We'll respond within 24–48 hours.",
//     });

//     form.reset();
//   };

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Contact Us
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Get in Touch
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               We'd love to hear from you. Whether you have questions, ideas, or
//               want to collaborate—reach out!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Contact Form */}
//             <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
//               <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
//                 Send Us a Message
//               </h2>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       First Name
//                     </label>
//                     <Input
//                       name="first_name"
//                       placeholder="Your first name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       Last Name
//                     </label>
//                     <Input
//                       name="last_name"
//                       placeholder="Your last name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Email Address
//                   </label>
//                   <Input
//                     name="email"
//                     type="email"
//                     placeholder="your@email.com"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Subject
//                   </label>
//                   <Input
//                     name="subject"
//                     placeholder="What is this about?"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Message
//                   </label>
//                   <Textarea
//                     name="message"
//                     placeholder="Tell us more about your inquiry..."
//                     rows={5}
//                     required
//                   />
//                 </div>

//                 <Button
//                   variant="gold"
//                   size="lg"
//                   type="submit"
//                   className="w-full"
//                 >
//                   Send Message
//                   <Send size={18} />
//                 </Button>
//               </form>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h2 className="text-2xl font-serif font-bold mb-6">
//                 Contact Information
//               </h2>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Mail className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Email</h3>
//                     <a
//                       href="mailto:ogunmodederidwan@gmail.com"
//                       className="text-muted-foreground hover:text-primary transition-colors"
//                     >
//                       ogunmodederidwan@gmail.com
//                     </a>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Phone className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Phone</h3>
//                     <p className="text-muted-foreground">
//                       +234 906 737 9828 <br />
//                       +44 7793 012771
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <MapPin className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Location</h3>
//                     <p className="text-muted-foreground">
//                       No 206, Maitama Mall, Abuja. <br />
//                       Scotland, United Kingdom.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Clock className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Office Hours</h3>
//                     <p className="text-muted-foreground">
//                       Monday – Friday: 9:00 AM – 5:00 PM
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="mt-10">
//                 <h3 className="font-semibold mb-4">Follow Us</h3>
//                 <div className="flex gap-4">
//                   <a
//                     href="https://facebook.com/your-page-name"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Facebook size={24} />
//                   </a>

//                   <a
//                     href="https://www.instagram.com/northernwomen__?igsh=bDd1ZWFmOXhwcmpl"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Instagram size={24} />
//                   </a>

//                   <a
//                     href="https://wa.me/2349067379828"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51z" />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Contact;

// import React from "react";
// import { supabase } from "@/lib/supabase";
// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   Facebook,
//   Instagram,
//   Send,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const Contact = () => {
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = e.currentTarget;

//     const formData = {
//       first_name: (form.elements.namedItem("first_name") as HTMLInputElement)
//         .value,
//       last_name: (form.elements.namedItem("last_name") as HTMLInputElement)
//         .value,
//       email: (form.elements.namedItem("email") as HTMLInputElement).value,
//       subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
//       message: (form.elements.namedItem("message") as HTMLTextAreaElement)
//         .value,
//     };

//     // 1️⃣ Save to Supabase table
//     const { error } = await supabase
//       .from("contact_messages")
//       .insert([formData]);

//     if (error) {
//       console.error(error);
//       toast({
//         title: "Message failed",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // 2️⃣ Send email via Supabase Edge Function
//     try {
//       const response = await fetch(
//         "https://ponlvomzjoxsfrrdzwqz.supabase.co/functions/v1/send-contact-email",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Email sending failed with status ${response.status}`);
//       }
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError);
//       toast({
//         title: "Message saved, email failed",
//         description:
//           "Your message was saved, but the admin email could not be sent.",
//         variant: "destructive",
//       });
//       form.reset();
//       return;
//     }

//     toast({
//       title: "Message sent!",
//       description:
//         "Thank you for reaching out. We'll respond within 24–48 hours.",
//     });

//     form.reset();
//   };

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Contact Us
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Get in Touch
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               We'd love to hear from you. Whether you have questions, ideas, or
//               want to collaborate—reach out!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Contact Form */}
//             <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
//               <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
//                 Send Us a Message
//               </h2>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       First Name
//                     </label>
//                     <Input
//                       name="first_name"
//                       placeholder="Your first name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">
//                       Last Name
//                     </label>
//                     <Input
//                       name="last_name"
//                       placeholder="Your last name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Email Address
//                   </label>
//                   <Input
//                     name="email"
//                     type="email"
//                     placeholder="your@email.com"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Subject
//                   </label>
//                   <Input
//                     name="subject"
//                     placeholder="What is this about?"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Message
//                   </label>
//                   <Textarea
//                     name="message"
//                     placeholder="Tell us more about your inquiry..."
//                     rows={5}
//                     required
//                   />
//                 </div>

//                 <Button
//                   variant="gold"
//                   size="lg"
//                   type="submit"
//                   className="w-full flex items-center justify-center gap-2"
//                 >
//                   Send Message
//                   <Send size={18} />
//                 </Button>
//               </form>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h2 className="text-2xl font-serif font-bold mb-6">
//                 Contact Information
//               </h2>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Mail className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Email</h3>
//                     <a
//                       href="mailto:Northernwomen001@gmail.com"
//                       className="text-muted-foreground hover:text-primary transition-colors"
//                     >
//                       Northernwomen001@gmail.com
//                     </a>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Phone className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Phone</h3>
//                     <p className="text-muted-foreground">
//                       +234 906 737 9828 <br />
//                       +44 7793 012771
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <MapPin className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Location</h3>
//                     <p className="text-muted-foreground">
//                       No 206, Maitama Mall, Abuja.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                     <Clock className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Office Hours</h3>
//                     <p className="text-muted-foreground">
//                       Monday – Friday: 9:00 AM – 5:00 PM
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="mt-10">
//                 <h3 className="font-semibold mb-4">Follow Us</h3>
//                 <div className="flex gap-4">
//                   <a
//                     href="https://facebook.com/your-page-name"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Facebook size={24} />
//                   </a>

//                   <a
//                     href="https://www.instagram.com/northernwomen__?igsh=bDd1ZWFmOXhwcmpl"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <Instagram size={24} />
//                   </a>

//                   <a
//                     href="https://wa.me/2349067379828"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51z" />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Contact;

import React from "react";
import { supabase } from "@/lib/supabase";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const formData = {
      first_name: (form.elements.namedItem("first_name") as HTMLInputElement)
        .value,
      last_name: (form.elements.namedItem("last_name") as HTMLInputElement)
        .value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    /* ✅ SAVE MESSAGE ONLY */
    const { error } = await supabase
      .from("contact_messages")
      .insert([formData]);

    if (error) {
      console.error("Contact insert error:", error);
      toast({
        title: "Message failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    /* ✅ SUCCESS */
    toast({
      title: "Message sent successfully",
      description:
        "Thank you for reaching out. We'll get back to you shortly.",
    });

    form.reset();
  };

  return (
    <Layout>
      {/* Hero Section */}
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
              We'd love to hear from you. Whether you have questions, ideas, or
              want to collaborate—reach out!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
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

            {/* Contact Info (unchanged) */}
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
                      Monday – Friday: 9:00 AM – 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
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
