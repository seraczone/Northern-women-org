
// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRight, Calendar, MapPin, Users, Clock } from "lucide-react";
// import { motion, Variants } from "framer-motion";
// import { useState } from "react";

// /* ================= LOCAL PROGRAM IMAGES ================= */
// import ramadan from "@/assets/ramadan.jpg";
// import schoolgirl from "@/assets/schoolgirl.jpg";
// import womenbusiness from "@/assets/womenbusiness.jpg";
// import businesssupport from "@/assets/businesssupport.jpg";

// /* ================= SUPABASE ASSETS ================= */
// const summitImage =
//   "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/summit-event.jpg";

// const highlightVideo =
//   "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/nsvideo.mp4";

// /* ================= PROGRAMS ================= */
// const programs = [
//   {
//     id: "ramadan",
//     title: "Ramadan Feeding Initiative",
//     description:
//       "Providing nutritious meals to communities during Ramadan, spreading hope, care, and support to those in need.",
//     image: ramadan,
//   },
//   {
//     id: "schoolgirls",
//     title: "Supporting School Girls",
//     description:
//       "Supplying essential educational materials to girls, ensuring they have the tools they need to succeed academically.",
//     image: schoolgirl,
//   },
//   {
//     id: "womenbusiness",
//     title: "Empowering Small Business Women",
//     description:
//       "Offering financial support and resources to women entrepreneurs, helping them grow sustainable businesses.",
//     image: womenbusiness,
//   },
//   {
//     id: "mentorship",
//     title: "Mentorship & Business Support",
//     description:
//       "Guiding women through mentorship, business advisory, advertising, and market access.",
//     image: businesssupport,
//   },
// ];

// /* ================= GALLERIES ================= */
// // Meet & Greet — LANDSCAPE
// const meetGreetImages = Array.from({ length: 12 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/meet${i + 1}.jpg`
// );

// // Meet & Greet — PORTRAIT
// const meetGreetPortraitImages = Array.from({ length: 9 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/meet${i + 13}.jpg`
// );

// // Northern Women Summit — ns1 → ns58
// const summitImages = Array.from({ length: 58 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/ns${i + 1}.jpg`
// );

// /* ================= ANIMATIONS ================= */
// const container: Variants = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.15 } },
// };

// const slideLeft: Variants = {
//   hidden: { opacity: 0, x: -60 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
// };

// const slideRight: Variants = {
//   hidden: { opacity: 0, x: 60 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
// };

// const fadeInUp: Variants = {
//   hidden: { opacity: 0, y: 40 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
// };

// /* ================= PAGE ================= */
// export default function Events() {
//   const [lightbox, setLightbox] = useState<{ open: boolean; img?: string }>({
//     open: false,
//   });

//   const navigate = useNavigate();

//   return (
//     <Layout>
//       {/* HERO */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <span className="text-secondary uppercase text-sm font-medium">
//             Events
//           </span>
//           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//             Our Events & Programs
//           </h1>
//           <p className="text-lg text-primary-foreground/90">
//             Empowering Northern women through impactful gatherings and initiatives.
//           </p>
//         </div>
//       </section>

//       {/* FEATURED EVENT */}
//       <section className="section-padding bg-background">
//         <div className="container-section grid lg:grid-cols-2 gap-12 items-center">
//           <img
//             src={summitImage}
//             alt="Northern Women Summit"
//             className="rounded-2xl h-[380px] w-full object-contain bg-muted"
//             loading="lazy"
//           />
//           <div>
//             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
//               Northern Women Summit 2026
//             </h2>
//             <div className="space-y-3 text-muted-foreground mb-6">
//               <div className="flex gap-3">
//                 <Calendar size={18} /> Nov 1, 2026
//               </div>
//               <div className="flex gap-3">
//                 <Clock size={18} /> 9AM – 5PM
//               </div>
//               <div className="flex gap-3">
//                 <MapPin size={18} /> Northern Nigeria
//               </div>
//               <div className="flex gap-3">
//                 <Users size={18} /> 500+ Attendees
//               </div>
//             </div>
//             <Button variant="gold" size="xl" asChild>
//               <Link to="/get-involved">
//                 Register Now <ArrowRight size={18} />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* PROGRAMS */}
//       <section className="section-padding bg-muted">
//         <div className="container-section">
//           <h2 className="text-center text-4xl font-serif font-bold text-gold mb-14">
//             Our 2026 Programs
//           </h2>

//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="space-y-24"
//           >
//             {programs.map((p, i) => {
//               const isEven = i % 2 === 0;
//               return (
//                 <section
//                   key={p.id}
//                   className="grid lg:grid-cols-2 gap-10 items-center"
//                 >
//                   {isEven && (
//                     <motion.div variants={slideLeft}>
//                       <h3 className="text-3xl font-serif font-bold mb-4">
//                         {p.title}
//                       </h3>
//                       <p className="text-lg text-muted-foreground mb-6">
//                         {p.description}
//                       </p>
//                       <Button
//                         variant="burgundy"
//                         onClick={() => navigate("/donate")}
//                       >
//                         Donate
//                       </Button>
//                     </motion.div>
//                   )}

//                   <motion.div variants={isEven ? slideRight : slideLeft}>
//                     <img
//                       src={p.image}
//                       alt={p.title}
//                       className="rounded-2xl h-[300px] w-full object-cover"
//                       loading="lazy"
//                     />
//                   </motion.div>

//                   {!isEven && (
//                     <motion.div variants={slideRight}>
//                       <h3 className="text-3xl font-serif font-bold mb-4">
//                         {p.title}
//                       </h3>
//                       <p className="text-lg text-muted-foreground mb-6">
//                         {p.description}
//                       </p>
//                       <Button
//                         variant="burgundy"
//                         onClick={() => navigate("/donate")}
//                       >
//                         Donate
//                       </Button>
//                     </motion.div>
//                   )}
//                 </section>
//               );
//             })}
//           </motion.div>
//         </div>
//       </section>

//       {/* PREVIOUS EVENTS */}
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <h2 className="text-center text-4xl font-serif font-bold mb-12">
//             Our Previous Events
//           </h2>

//           {/* MEET & GREET */}
//           <h3 className="text-3xl font-serif font-bold text-burgundy mb-8 text-center">
//             Meet & Greet
//           </h3>

//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20"
//           >
//             {meetGreetImages.map((src, i) => (
//               <motion.div
//                 key={i}
//                 variants={fadeInUp}
//                 className="rounded-2xl bg-muted overflow-hidden cursor-pointer"
//                 onClick={() => setLightbox({ open: true, img: src })}
//               >
//                 <img
//                   src={src}
//                   alt={`Meet & Greet ${i + 1}`}
//                   className="h-64 w-full object-contain"
//                   loading="lazy"
//                 />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* PORTRAIT GRID */}
//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20"
//           >
//             {meetGreetPortraitImages.map((src, i) => (
//               <motion.div
//                 key={i}
//                 variants={fadeInUp}
//                 className="rounded-2xl bg-muted overflow-hidden cursor-pointer"
//                 onClick={() => setLightbox({ open: true, img: src })}
//               >
//                 <img
//                   src={src}
//                   alt={`Meet & Greet Portrait ${i + 13}`}
//                   className="h-[420px] w-full object-cover object-center"
//                   loading="lazy"
//                 />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* NORTHERN WOMEN SUMMIT */}
//           <h3 className="text-3xl font-serif font-bold text-burgundy mb-8 text-center">
//             Northern Women Summit 2025
//           </h3>

//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
//           >
//             {summitImages.map((img, i) => {
//               const isPortrait = i === summitImages.length - 1; // ns58
//               return (
//                 <motion.div
//                   key={i}
//                   variants={fadeInUp}
//                   className="rounded-2xl overflow-hidden bg-muted"
//                 >
//                   <img
//                     src={img}
//                     alt={`Summit ${i + 1}`}
//                     className={
//                       isPortrait
//                         ? "h-[420px] w-full object-contain"
//                         : "h-56 w-full object-cover"
//                     }
//                     loading="lazy"
//                   />
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         </div>
//       </section>

//       {/* LIGHTBOX */}
//       {lightbox.open && (
//         <div
//           className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
//           onClick={() => setLightbox({ open: false })}
//         >
//           <img
//             src={lightbox.img}
//             alt="Preview"
//             className="max-w-[90%] max-h-[90%] object-contain rounded-xl"
//           />
//         </div>
//       )}

//       {/* EVENT HIGHLIGHT VIDEO */}
//       <section className="section-padding bg-muted">
//         <div className="container-section text-center">
//           <h2 className="text-4xl font-serif font-bold text-burgundy mb-10">
//             Event Highlight Video
//           </h2>

//           <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
//             <video
//               src={highlightVideo}
//               controls
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// }

// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRight, Calendar, MapPin, Users, Clock } from "lucide-react";
// import { motion, Variants } from "framer-motion";
// import { useState } from "react";

// /* ================= SUPABASE PROGRAM IMAGES ================= */
// const programs = [
//   {
//     id: "ramadan",
//     title: "Ramadan Feeding Initiative",
//     description:
//       "Providing nutritious meals to communities during Ramadan, spreading hope, care, and support to those in need.",
//     image:
//       "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/ramadan.jpg",
//   },
//   {
//     id: "schoolgirls",
//     title: "Supporting School Girls",
//     description:
//       "Supplying essential educational materials to girls, ensuring they have the tools they need to succeed academically.",
//     image:
//       "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/schoolgirl.jpg",
//   },
//   {
//     id: "womenbusiness",
//     title: "Empowering Small Business Women",
//     description:
//       "Offering financial support and resources to women entrepreneurs, helping them grow sustainable businesses.",
//     image:
//       "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/womenbusiness.jpg",
//   },
//   {
//     id: "mentorship",
//     title: "Mentorship & Business Support",
//     description:
//       "Guiding women through mentorship, business advisory, advertising, and market access.",
//     image:
//       "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/businesssupport.jpg",
//   },
// ];

// /* ================= SUPABASE ASSETS ================= */
// const summitImage =
//   "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/summit-event.jpg";

// const highlightVideo =
//   "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/nsvideo.mp4";

// /* ================= GALLERIES ================= */
// // Meet & Greet — LANDSCAPE
// const meetGreetImages = Array.from({ length: 12 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/meet${i + 1}.jpg`
// );

// // Meet & Greet — PORTRAIT
// const meetGreetPortraitImages = Array.from({ length: 9 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/meet${i + 13}.jpg`
// );

// // Northern Women Summit — ns1 → ns58
// const summitImages = Array.from({ length: 58 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/ns${i + 1}.jpg`
// );

// /* ================= ANIMATIONS ================= */
// const container: Variants = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.15 } },
// };

// const slideLeft: Variants = {
//   hidden: { opacity: 0, x: -60 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
// };

// const slideRight: Variants = {
//   hidden: { opacity: 0, x: 60 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
// };

// const fadeInUp: Variants = {
//   hidden: { opacity: 0, y: 40 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
// };

// /* ================= PAGE ================= */
// export default function Events() {
//   const [lightbox, setLightbox] = useState<{ open: boolean; img?: string }>({
//     open: false,
//   });

//   const navigate = useNavigate();

//   return (
//     <Layout>
//       {/* HERO */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <span className="text-secondary uppercase text-sm font-medium">
//             Events
//           </span>
//           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//             Our Events & Programs
//           </h1>
//           <p className="text-lg text-primary-foreground/90">
//             Empowering Northern women through impactful gatherings and initiatives.
//           </p>
//         </div>
//       </section>

//       {/* FEATURED EVENT */}
//       <section className="section-padding bg-background">
//         <div className="container-section grid lg:grid-cols-2 gap-12 items-center">
//           <img
//             src={summitImage}
//             alt="Northern Women Summit"
//             className="rounded-2xl h-[380px] w-full object-contain bg-muted"
//             loading="lazy"
//           />
//           <div>
//             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
//               Northern Women Summit 2026
//             </h2>
//             <div className="space-y-3 text-muted-foreground mb-6">
//               <div className="flex gap-3">
//                 <Calendar size={18} /> Nov 1, 2026
//               </div>
//               <div className="flex gap-3">
//                 <Clock size={18} /> 9AM – 5PM
//               </div>
//               <div className="flex gap-3">
//                 <MapPin size={18} /> Northern Nigeria
//               </div>
//               <div className="flex gap-3">
//                 <Users size={18} /> 500+ Attendees
//               </div>
//             </div>
//             <Button variant="gold" size="xl" asChild>
//               <Link to="/get-involved">
//                 Register Now <ArrowRight size={18} />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* PROGRAMS */}
//       <section className="section-padding bg-muted">
//         <div className="container-section">
//           <h2 className="text-center text-4xl font-serif font-bold text-gold mb-14">
//             Our 2026 Programs
//           </h2>

//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="space-y-24"
//           >
//             {programs.map((p, i) => {
//               const isEven = i % 2 === 0;
//               return (
//                 <section
//                   key={p.id}
//                   className="grid lg:grid-cols-2 gap-10 items-center"
//                 >
//                   {isEven && (
//                     <motion.div variants={slideLeft}>
//                       <h3 className="text-3xl font-serif font-bold mb-4">
//                         {p.title}
//                       </h3>
//                       <p className="text-lg text-muted-foreground mb-6">
//                         {p.description}
//                       </p>
//                       <Button
//                         variant="burgundy"
//                         onClick={() => navigate("/donate")}
//                       >
//                         Donate
//                       </Button>
//                     </motion.div>
//                   )}

//                   <motion.div variants={isEven ? slideRight : slideLeft}>
//                     <img
//                       src={p.image}
//                       alt={p.title}
//                       className="rounded-2xl h-[300px] w-full object-cover"
//                       loading="lazy"
//                     />
//                   </motion.div>

//                   {!isEven && (
//                     <motion.div variants={slideRight}>
//                       <h3 className="text-3xl font-serif font-bold mb-4">
//                         {p.title}
//                       </h3>
//                       <p className="text-lg text-muted-foreground mb-6">
//                         {p.description}
//                       </p>
//                       <Button
//                         variant="burgundy"
//                         onClick={() => navigate("/donate")}
//                       >
//                         Donate
//                       </Button>
//                     </motion.div>
//                   )}
//                 </section>
//               );
//             })}
//           </motion.div>
//         </div>
//       </section>

//       {/* PREVIOUS EVENTS */}
//       <section className="section-padding bg-background">
//         <div className="container-section">
//           <h2 className="text-center text-4xl font-serif font-bold mb-12">
//             Our Previous Events
//           </h2>

//           {/* MEET & GREET */}
//           <h3 className="text-3xl font-serif font-bold text-burgundy mb-8 text-center">
//             Meet & Greet
//           </h3>

//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20"
//           >
//             {meetGreetImages.map((src, i) => (
//               <motion.div
//                 key={i}
//                 variants={fadeInUp}
//                 className="rounded-2xl bg-muted overflow-hidden cursor-pointer"
//                 onClick={() => setLightbox({ open: true, img: src })}
//               >
//                 <img
//                   src={src}
//                   alt={`Meet & Greet ${i + 1}`}
//                   className="h-64 w-full object-contain"
//                   loading="lazy"
//                 />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* PORTRAIT GRID */}
//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20"
//           >
//             {meetGreetPortraitImages.map((src, i) => (
//               <motion.div
//                 key={i}
//                 variants={fadeInUp}
//                 className="rounded-2xl bg-muted overflow-hidden cursor-pointer"
//                 onClick={() => setLightbox({ open: true, img: src })}
//               >
//                 <img
//                   src={src}
//                   alt={`Meet & Greet Portrait ${i + 13}`}
//                   className="h-[420px] w-full object-cover object-center"
//                   loading="lazy"
//                 />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* NORTHERN WOMEN SUMMIT */}
//           <h3 className="text-3xl font-serif font-bold text-burgundy mb-8 text-center">
//             Northern Women Summit 2025
//           </h3>

//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
//           >
//             {summitImages.map((img, i) => {
//               const isPortrait = i === summitImages.length - 1; // ns58
//               return (
//                 <motion.div
//                   key={i}
//                   variants={fadeInUp}
//                   className="rounded-2xl overflow-hidden bg-muted"
//                 >
//                   <img
//                     src={img}
//                     alt={`Summit ${i + 1}`}
//                     className={
//                       isPortrait
//                         ? "h-[420px] w-full object-contain"
//                         : "h-56 w-full object-cover"
//                     }
//                     loading="lazy"
//                   />
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         </div>
//       </section>

//       {/* LIGHTBOX */}
//       {lightbox.open && (
//         <div
//           className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
//           onClick={() => setLightbox({ open: false })}
//         >
//           <img
//             src={lightbox.img}
//             alt="Preview"
//             className="max-w-[90%] max-h-[90%] object-contain rounded-xl"
//           />
//         </div>
//       )}

//       {/* EVENT HIGHLIGHT VIDEO */}
//       <section className="section-padding bg-muted">
//         <div className="container-section text-center">
//           <h2 className="text-4xl font-serif font-bold text-burgundy mb-10">
//             Event Highlight Video
//           </h2>

//           <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
//             <video
//               src={highlightVideo}
//               controls
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// }

// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRight, Calendar, MapPin, Users, Clock } from "lucide-react";
// import { motion, Variants } from "framer-motion";
// import { useState } from "react";

// /* ================= SUPABASE PROGRAM IMAGES ================= */
// const programs = [
//   {
//     id: "ramadan",
//     title: "Ramadan Feeding Initiative",
//     description:
//       "Providing nutritious meals to communities during Ramadan, spreading hope, care, and support to those in need.",
//     image:
//       "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/ramadan.jpg",
//   },
//   {
//     id: "schoolgirls",
//     title: "Supporting School Girls",
//     description:
//       "Supplying essential educational materials to girls, ensuring they have the tools they need to succeed academically.",
//     image:
//       "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/schoolgirl.jpg",
//   },
//   {
//     id: "womenbusiness",
//     title: "Empowering Small Business Women",
//     description:
//       "Offering financial support and resources to women entrepreneurs, helping them grow sustainable businesses.",
//     image:
//       "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/womenbusiness.jpg",
//   },
//   {
//     id: "mentorship",
//     title: "Mentorship & Business Support",
//     description:
//       "Guiding women through mentorship, business advisory, advertising, and market access.",
//     image:
//       "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/businesssupport.jpg",
//   },
// ];

// /* ================= SUPABASE ASSETS ================= */
// const summitImage =
//   "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/summit-event.jpg";

// const highlightVideo =
//   "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/nsvideo.mp4";

// /* ================= GALLERIES ================= */
// const meetGreetImages = Array.from({ length: 12 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/meet${i + 1}.jpg`
// );

// const meetGreetPortraitImages = Array.from({ length: 9 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/meet${i + 13}.jpg`
// );

// const summitImages = Array.from({ length: 58 }, (_, i) =>
//   `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/ns${i + 1}.jpg`
// );

// /* ================= ANIMATIONS ================= */
// const container: Variants = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.15 } },
// };

// const slideLeft: Variants = {
//   hidden: { opacity: 0, x: -60 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
// };

// const slideRight: Variants = {
//   hidden: { opacity: 0, x: 60 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
// };

// const fadeInUp: Variants = {
//   hidden: { opacity: 0, y: 40 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// /* ================= PAGE ================= */
// export default function Events() {
//   const [lightbox, setLightbox] = useState<{ open: boolean; img?: string }>({
//     open: false,
//   });

//   const navigate = useNavigate();

//   const eventTitle = "Northern Women Summit 2026";

//   return (
//     <Layout>
//       {/* HERO */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <span className="text-secondary uppercase text-sm font-medium">
//             Events
//           </span>
//           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//             Our Events & Programs
//           </h1>
//           <p className="text-lg text-primary-foreground/90">
//             Empowering Northern women through impactful gatherings and initiatives.
//           </p>
//         </div>
//       </section>

//       {/* FEATURED EVENT */}
//       <section className="section-padding bg-background">
//         <div className="container-section grid lg:grid-cols-2 gap-12 items-center">
//           <img
//             src={summitImage}
//             alt="Northern Women Summit"
//             className="rounded-2xl h-[380px] w-full object-contain bg-muted"
//           />
//           <div>
//             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
//               {eventTitle}
//             </h2>

//             <div className="space-y-3 text-muted-foreground mb-6">
//               <div className="flex gap-3">
//                 <Calendar size={18} /> Nov 1, 2026
//               </div>
//               <div className="flex gap-3">
//                 <Clock size={18} /> 9AM – 5PM
//               </div>
//               <div className="flex gap-3">
//                 <MapPin size={18} /> Northern Nigeria
//               </div>
//               <div className="flex gap-3">
//                 <Users size={18} /> 500+ Attendees
//               </div>
//             </div>

//             <Button variant="gold" size="xl" asChild>
//               <Link
//                 to={`/register-event?event=${encodeURIComponent(eventTitle)}`}
//               >
//                 Register Now <ArrowRight size={18} />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* PROGRAMS */}
//       <section className="section-padding bg-muted">
//         <div className="container-section">
//           <h2 className="text-center text-4xl font-serif font-bold text-gold mb-14">
//             Our 2026 Programs
//           </h2>

//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="space-y-24"
//           >
//             {programs.map((p, i) => {
//               const isEven = i % 2 === 0;
//               return (
//                 <section key={p.id} className="grid lg:grid-cols-2 gap-10 items-center">
//                   {isEven && (
//                     <motion.div variants={slideLeft}>
//                       <h3 className="text-3xl font-serif font-bold mb-4">
//                         {p.title}
//                       </h3>
//                       <p className="text-lg text-muted-foreground mb-6">
//                         {p.description}
//                       </p>
//                       <Button
//                         variant="burgundy"
//                         onClick={() => navigate("/donate")}
//                       >
//                         Donate
//                       </Button>
//                     </motion.div>
//                   )}

//                   <motion.div variants={isEven ? slideRight : slideLeft}>
//                     <img
//                       src={p.image}
//                       alt={p.title}
//                       className="rounded-2xl h-[300px] w-full object-cover"
//                     />
//                   </motion.div>

//                   {!isEven && (
//                     <motion.div variants={slideRight}>
//                       <h3 className="text-3xl font-serif font-bold mb-4">
//                         {p.title}
//                       </h3>
//                       <p className="text-lg text-muted-foreground mb-6">
//                         {p.description}
//                       </p>
//                       <Button
//                         variant="burgundy"
//                         onClick={() => navigate("/donate")}
//                       >
//                         Donate
//                       </Button>
//                     </motion.div>
//                   )}
//                 </section>
//               );
//             })}
//           </motion.div>
//         </div>
//       </section>

//       {/* PREVIOUS EVENTS + VIDEO remain unchanged */}
//     </Layout>
//   );
// }

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Users, Clock } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

/* ================= SUPABASE PROGRAM IMAGES ================= */
const programs = [
  {
    id: "ramadan",
    title: "Ramadan Feeding Initiative",
    description:
      "Providing nutritious meals to communities during Ramadan, spreading hope, care, and support to those in need.",
    image:
      "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/ramadan.jpg",
  },
  {
    id: "schoolgirls",
    title: "Supporting School Girls",
    description:
      "Supplying essential educational materials to girls, ensuring they have the tools they need to succeed academically.",
    image:
      "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/schoolgirl.jpg",
  },
  {
    id: "womenbusiness",
    title: "Empowering Small Business Women",
    description:
      "Offering financial support and resources to women entrepreneurs, helping them grow sustainable businesses.",
    image:
      "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/womenbusiness.jpg",
  },
  {
    id: "mentorship",
    title: "Mentorship & Business Support",
    description:
      "Guiding women through mentorship, business advisory, advertising, and market access.",
    image:
      "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/businesssupport.jpg",
  },
];

/* ================= SUPABASE ASSETS ================= */
const summitImage =
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/summit-event.jpg";

const highlightVideo =
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/nsvideo.mp4";

/* ================= GALLERIES ================= */
const meetGreetImages = Array.from({ length: 12 }, (_, i) =>
  `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/meet${i + 1}.jpg`
);

const meetGreetPortraitImages = Array.from({ length: 9 }, (_, i) =>
  `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/meet${i + 13}.jpg`
);

const summitImages = Array.from({ length: 58 }, (_, i) =>
  `https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/ns${i + 1}.jpg`
);

/* ================= ANIMATIONS ================= */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* ================= PAGE ================= */
export default function Events() {
  const [lightbox, setLightbox] = useState<{ open: boolean; img?: string }>({
    open: false,
  });

  const navigate = useNavigate();

  const eventTitle = "Northern Women Summit 2026";

  return (
    <Layout>
      {/* HERO */}
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <span className="text-secondary uppercase text-sm font-medium">
            Events
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
            Our Events & Programs
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Empowering Northern women through impactful gatherings and initiatives.
          </p>
        </div>
      </section>

      {/* FEATURED EVENT */}
      <section className="section-padding bg-background">
        <div className="container-section grid lg:grid-cols-2 gap-12 items-center">
          <img
            src={summitImage}
            alt="Northern Women Summit"
            className="rounded-2xl h-[380px] w-full object-contain bg-muted"
          />
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {eventTitle}
            </h2>

            <div className="space-y-3 text-muted-foreground mb-6">
              <div className="flex gap-3">
                <Calendar size={18} /> Nov 1, 2026
              </div>
              <div className="flex gap-3">
                <Clock size={18} /> 9AM – 5PM
              </div>
              <div className="flex gap-3">
                <MapPin size={18} /> Northern Nigeria
              </div>
              <div className="flex gap-3">
                <Users size={18} /> 500+ Attendees
              </div>
            </div>

            <Button variant="gold" size="xl" asChild>
              <Link
                to={`/register-event?event=${encodeURIComponent(eventTitle)}`}
              >
                Register Now <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section-padding bg-muted">
        <div className="container-section">
          <h2 className="text-center text-4xl font-serif font-bold text-gold mb-14">
            Our 2026 Programs
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-24"
          >
            {programs.map((p, i) => {
              const isEven = i % 2 === 0;
              return (
                <section
                  key={p.id}
                  className="grid lg:grid-cols-2 gap-10 items-center"
                >
                  {isEven && (
                    <motion.div variants={slideLeft}>
                      <h3 className="text-3xl font-serif font-bold mb-4">
                        {p.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        {p.description}
                      </p>
                      <Button
                        variant="burgundy"
                        onClick={() => navigate("/donate")}
                      >
                        Donate
                      </Button>
                    </motion.div>
                  )}

                  <motion.div variants={isEven ? slideRight : slideLeft}>
                    <img
                      src={p.image}
                      alt={p.title}
                      className="rounded-2xl h-[300px] w-full object-cover"
                    />
                  </motion.div>

                  {!isEven && (
                    <motion.div variants={slideRight}>
                      <h3 className="text-3xl font-serif font-bold mb-4">
                        {p.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        {p.description}
                      </p>
                      <Button
                        variant="burgundy"
                        onClick={() => navigate("/donate")}
                      >
                        Donate
                      </Button>
                    </motion.div>
                  )}
                </section>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* PREVIOUS EVENTS */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <h2 className="text-center text-4xl font-serif font-bold mb-12">
            Our Previous Events
          </h2>

          {/* MEET & GREET */}
          <h3 className="text-3xl font-serif font-bold text-burgundy mb-8 text-center">
            Meet & Greet
          </h3>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20"
          >
            {meetGreetImages.map((src, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="rounded-2xl bg-muted overflow-hidden cursor-pointer"
                onClick={() => setLightbox({ open: true, img: src })}
              >
                <img
                  src={src}
                  alt={`Meet & Greet ${i + 1}`}
                  className="h-64 w-full object-contain"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* PORTRAIT GRID */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20"
          >
            {meetGreetPortraitImages.map((src, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="rounded-2xl bg-muted overflow-hidden cursor-pointer"
                onClick={() => setLightbox({ open: true, img: src })}
              >
                <img
                  src={src}
                  alt={`Meet & Greet Portrait ${i + 13}`}
                  className="h-[420px] w-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* SUMMIT */}
          <h3 className="text-3xl font-serif font-bold text-burgundy mb-8 text-center">
            Northern Women Summit 2025
          </h3>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {summitImages.map((img, i) => {
              const isPortrait = i === summitImages.length - 1;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="rounded-2xl overflow-hidden bg-muted"
                >
                  <img
                    src={img}
                    alt={`Summit ${i + 1}`}
                    className={
                      isPortrait
                        ? "h-[420px] w-full object-contain"
                        : "h-56 w-full object-cover"
                    }
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox.open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setLightbox({ open: false })}
        >
          <img
            src={lightbox.img}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] object-contain rounded-xl"
          />
        </div>
      )}

      {/* EVENT HIGHLIGHT VIDEO */}
      <section className="section-padding bg-muted">
        <div className="container-section text-center">
          <h2 className="text-4xl font-serif font-bold text-burgundy mb-10">
            Event Highlight Video
          </h2>

          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
            <video
              src={highlightVideo}
              controls
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
