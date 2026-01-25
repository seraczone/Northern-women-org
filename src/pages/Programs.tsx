// // // import Layout from "@/components/layout/Layout";
// // // import { Button } from "@/components/ui/button";
// // // import { Link } from "react-router-dom";
// // // import {
// // //   ArrowRight,
// // //   Heart,
// // //   MessageCircle,
// // //   Users,
// // //   Home,
// // //   Handshake,
// // // } from "lucide-react";

// // // const teamStructure = [
// // //   {
// // //     title: "Executive Leadership",
// // //     roles: ["Founder & President", "Vice President", "Executive Director"],
// // //     icon: Users,
// // //   },
// // //   {
// // //     title: "Programs & Events",
// // //     roles: ["Workshop coordination", "Volunteer management", "Summit planning"],
// // //     icon: Users,
// // //   },
// // //   {
// // //     title: "Education & Mentorship",
// // //     roles: ["Curriculum development", "Mentor matching", "Education support"],
// // //     icon: Users,
// // //   },
// // //   {
// // //     title: "Community & Welfare",
// // //     roles: ["Outreach programs", "Donation management", "Social support"],
// // //     icon: Home,
// // //   },
// // //   {
// // //     title: "Media & Communications",
// // //     roles: ["Social media", "Website content", "Public relations"],
// // //     icon: MessageCircle,
// // //   },
// // //   {
// // //     title: "Partnerships",
// // //     roles: ["Corporate sponsorships", "NGO collaborations", "Strategic alliances"],
// // //     icon: Handshake,
// // //   },
// // // ];

// // // const Programs = () => {
// // //   return (
// // //     <Layout>
// // //       {/* Hero Section */}
// // //       <section className="bg-gradient-hero py-20">
// // //         <div className="container-section">
// // //           <div className="max-w-3xl">
// // //             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// // //               What We Do
// // //             </span>
// // //             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// // //               Programs & Initiatives
// // //             </h1>
// // //             <p className="text-lg text-primary-foreground/90">
// // //               At Northern Women Initiative For Empowerment, Growth and Development,
// // //               we create opportunities and platforms that uplift Northern women and
// // //               girls to thrive in every area of life.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Core Initiatives */}
// // //       <section className="section-padding bg-background">
// // //         <div className="container-section">
// // //           <div className="max-w-4xl mx-auto">
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // //               {[
// // //                 {
// // //                   title: "Empower Entrepreneurs",
// // //                   desc: "Supporting women in business with mentorship, skills training, and access to strong networks that help their businesses grow sustainably.",
// // //                 },
// // //                 {
// // //                   title: "Champion Education",
// // //                   desc: "Advocating for girl-child education and providing learning opportunities that empower women and girls to reach their full potential.",
// // //                 },
// // //                 {
// // //                   title: "Host Impactful Events",
// // //                   desc: "Bringing women together through summits, meet & greets, workshops, and forums that inspire connection, learning, and growth.",
// // //                 },
// // //                 {
// // //                   title: "Mentor & Develop Leaders",
// // //                   desc: "Guiding women to become confident leaders in their communities, professions, and personal lives through mentorship and development.",
// // //                 },
// // //                 {
// // //                   title: "Promote Gender Equality",
// // //                   desc: "Creating awareness, advocacy, and programs that challenge systemic barriers and support inclusion in all areas of life.",
// // //                 },
// // //                 {
// // //                   title: "Build Community & Solidarity",
// // //                   desc: "Creating safe spaces where women celebrate each other, share experiences, and build strong systems of support.",
// // //                 },
// // //               ].map((item) => (
// // //                 <div
// // //                   key={item.title}
// // //                   className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer"
// // //                 >
// // //                   <h3 className="font-serif text-xl font-bold text-primary mb-2">
// // //                     {item.title}
// // //                   </h3>
// // //                   <p className="text-muted-foreground text-lg">{item.desc}</p>
// // //                 </div>
// // //               ))}

// // //               <div className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer md:col-span-2">
// // //                 <h3 className="font-serif text-xl font-bold text-primary mb-2 text-center">
// // //                   Celebrate Achievements
// // //                 </h3>
// // //                 <p className="text-muted-foreground text-lg text-center">
// // //                   Highlighting successes through initiatives like our magazine,
// // //                   events, and recognition programs to inspire and uplift others.
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <p className="mt-10 text-muted-foreground text-lg text-center">
// // //               Through these initiatives, we ensure that Northern women and girls
// // //               are equipped, empowered, and celebrated—creating lasting impact for
// // //               families, communities, and future generations.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Weekly Motivation */}
// // //       <section id="motivation" className="section-padding bg-muted">
// // //         <div className="container-section">
// // //           <div className="max-w-4xl mx-auto text-center">
// // //             <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-6">
// // //               <MessageCircle className="w-8 h-8 text-secondary-foreground" />
// // //             </div>
// // //             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
// // //               Weekly Motivational Series
// // //             </h2>
// // //             <p className="text-muted-foreground text-lg mb-8">
// // //               Every week, we share inspiring messages designed to uplift and
// // //               encourage Northern women on their journey.
// // //             </p>
// // //             <div className="bg-card rounded-2xl p-8 shadow-card text-left">
// // //               <p className="text-lg italic text-muted-foreground mb-4">
// // //                 "Success is not just about what you accomplish in your life; it's
// // //                 about what you inspire others to do."
// // //               </p>
// // //               <p className="font-serif font-semibold text-foreground">
// // //                 — This Week's Message
// // //               </p>
// // //             </div>
// // //             <Button variant="gold" size="lg" className="mt-8" asChild>
// // //               <Link to="/get-involved">
// // //                 Subscribe to Weekly Messages
// // //                 <ArrowRight size={18} />
// // //               </Link>
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Team Structure */}
// // //       <section className="section-padding bg-background">
// // //         <div className="container-section">
// // //           <div className="text-center mb-12">
// // //             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// // //               Our Structure
// // //             </span>
// // //             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
// // //               Northern Women Charity Team
// // //             </h2>
// // //             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
// // //               A dedicated team working together to deliver impact across all our
// // //               initiatives.
// // //             </p>
// // //           </div>

// // //           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
// // //             {teamStructure.map((dept) => (
// // //               <div
// // //                 key={dept.title}
// // //                 className="bg-card rounded-2xl p-8 border border-border card-hover"
// // //               >
// // //                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
// // //                   <dept.icon className="w-6 h-6 text-primary" />
// // //                 </div>
// // //                 <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
// // //                   {dept.title}
// // //                 </h3>
// // //                 <ul className="space-y-2">
// // //                   {dept.roles.map((role) => (
// // //                     <li
// // //                       key={role}
// // //                       className="text-sm text-muted-foreground flex items-center gap-2"
// // //                     >
// // //                       <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
// // //                       {role}
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* CTA */}
// // //       <section className="section-padding bg-primary">
// // //         <div className="container-section text-center">
// // //           <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
// // //             Ready to Make a Difference?
// // //           </h2>
// // //           <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
// // //             Join our programs and become part of a movement transforming lives
// // //             across the North.
// // //           </p>
// // //           <Button variant="hero" size="xl" asChild>
// // //             <Link to="/get-involved">
// // //               Get Started Today
// // //               <ArrowRight size={20} />
// // //             </Link>
// // //           </Button>
// // //         </div>
// // //       </section>
// // //     </Layout>
// // //   );
// // // };

// // // export default Programs;

// // // import { useEffect, useState } from "react";
// // // import Layout from "@/components/layout/Layout";
// // // import { Button } from "@/components/ui/button";
// // // import { Link } from "react-router-dom";
// // // import { ArrowRight, MessageCircle, Users, Home, Handshake } from "lucide-react";
// // // import { supabase } from "@/lib/supabase";
// // // import { motion, Variants } from "framer-motion";

// // // /* ===== ANIMATIONS ===== */
// // // const fadeInUp: Variants = {
// // //   hidden: { opacity: 0, y: 40 },
// // //   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// // // };

// // // /* ===== TEAM STRUCTURE ===== */
// // // const teamStructure = [
// // //   { title: "Executive Leadership", roles: ["Founder & President", "Vice President", "Executive Director"], icon: Users },
// // //   { title: "Programs & Events", roles: ["Workshop coordination", "Volunteer management", "Summit planning"], icon: Users },
// // //   { title: "Education & Mentorship", roles: ["Curriculum development", "Mentor matching", "Education support"], icon: Users },
// // //   { title: "Community & Welfare", roles: ["Outreach programs", "Donation management", "Social support"], icon: Home },
// // //   { title: "Media & Communications", roles: ["Social media", "Website content", "Public relations"], icon: MessageCircle },
// // //   { title: "Partnerships", roles: ["Corporate sponsorships", "NGO collaborations", "Strategic alliances"], icon: Handshake },
// // // ];

// // // /* ===== QUOTE INTERFACE ===== */
// // // interface Quote {
// // //   id: number;
// // //   quote_text: string;
// // //   author?: string;
// // //   week_number: number;
// // // }

// // // /* ===== PAGE COMPONENT ===== */
// // // const Programs = () => {
// // //   const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

// // //   useEffect(() => {
// // //     const fetchQuote = async () => {
// // //       const startOfYear = new Date(new Date().getFullYear(), 0, 1);
// // //       const today = new Date();
// // //       const weekNumber = Math.ceil(
// // //         ((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
// // //       );

// // //       const { data } = await supabase
// // //         .from("weekly_quotes")
// // //         .select("*")
// // //         .eq("week_number", weekNumber)
// // //         .single();

// // //       setCurrentQuote(data);
// // //     };
// // //     fetchQuote();
// // //   }, []);

// // //   return (
// // //     <Layout>
// // //       {/* Hero Section */}
// // //       <section className="bg-gradient-hero py-20">
// // //         <div className="container-section">
// // //           <div className="max-w-3xl">
// // //             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// // //               What We Do
// // //             </span>
// // //             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// // //               Programs & Initiatives
// // //             </h1>
// // //             <p className="text-lg text-primary-foreground/90">
// // //               At Northern Women Initiative For Empowerment, Growth and Development,
// // //               we create opportunities and platforms that uplift Northern women and
// // //               girls to thrive in every area of life.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Core Initiatives */}
// // //       <section className="section-padding bg-background">
// // //         <div className="container-section">
// // //           <div className="max-w-4xl mx-auto">
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // //               {[
// // //                 { title: "Empower Entrepreneurs", desc: "Supporting women in business with mentorship, skills training, and access to strong networks that help their businesses grow sustainably." },
// // //                 { title: "Champion Education", desc: "Advocating for girl-child education and providing learning opportunities that empower women and girls to reach their full potential." },
// // //                 { title: "Host Impactful Events", desc: "Bringing women together through summits, meet & greets, workshops, and forums that inspire connection, learning, and growth." },
// // //                 { title: "Mentor & Develop Leaders", desc: "Guiding women to become confident leaders in their communities, professions, and personal lives through mentorship and development." },
// // //                 { title: "Promote Gender Equality", desc: "Creating awareness, advocacy, and programs that challenge systemic barriers and support inclusion in all areas of life." },
// // //                 { title: "Build Community & Solidarity", desc: "Creating safe spaces where women celebrate each other, share experiences, and build strong systems of support." },
// // //               ].map((item) => (
// // //                 <div key={item.title} className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
// // //                   <h3 className="font-serif text-xl font-bold text-primary mb-2">{item.title}</h3>
// // //                   <p className="text-muted-foreground text-lg">{item.desc}</p>
// // //                 </div>
// // //               ))}

// // //               <div className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer md:col-span-2">
// // //                 <h3 className="font-serif text-xl font-bold text-primary mb-2 text-center">Celebrate Achievements</h3>
// // //                 <p className="text-muted-foreground text-lg text-center">
// // //                   Highlighting successes through initiatives like our magazine,
// // //                   events, and recognition programs to inspire and uplift others.
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <p className="mt-10 text-muted-foreground text-lg text-center">
// // //               Through these initiatives, we ensure that Northern women and girls
// // //               are equipped, empowered, and celebrated—creating lasting impact for
// // //               families, communities, and future generations.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Weekly Motivational Quote */}
// // //       <section id="motivation" className="section-padding bg-muted">
// // //         <div className="container-section">
// // //           <motion.div
// // //             variants={fadeInUp}
// // //             initial="hidden"
// // //             animate="visible"
// // //             className="max-w-4xl mx-auto text-center"
// // //           >
// // //             <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-6">
// // //               <MessageCircle className="w-8 h-8 text-secondary-foreground" />
// // //             </div>
// // //             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
// // //               Weekly Motivational Series
// // //             </h2>
// // //             <p className="text-muted-foreground text-lg mb-8">
// // //               Every week, we share inspiring messages designed to uplift and
// // //               encourage Northern women on their journey.
// // //             </p>
// // //             <motion.div
// // //               variants={fadeInUp}
// // //               initial="hidden"
// // //               animate="visible"
// // //               className="bg-card rounded-2xl p-8 shadow-card text-left"
// // //             >
// // //               <p className="text-lg italic text-muted-foreground mb-4">
// // //                 "{currentQuote?.quote_text || 'Stay motivated this week!'}"
// // //               </p>
// // //               <p className="font-serif font-semibold text-foreground">
// // //                 — {currentQuote?.author || "This Week's Message"}
// // //               </p>
// // //             </motion.div>
// // //             <Button variant="gold" size="lg" className="mt-8" asChild>
// // //               <Link to="/get-involved">
// // //                 Subscribe to Weekly Messages
// // //                 <ArrowRight size={18} />
// // //               </Link>
// // //             </Button>
// // //           </motion.div>
// // //         </div>
// // //       </section>

// // //       {/* Team Structure */}
// // //       <section className="section-padding bg-background">
// // //         <div className="container-section">
// // //           <div className="text-center mb-12">
// // //             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// // //               Our Structure
// // //             </span>
// // //             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
// // //               Northern Women Charity Team
// // //             </h2>
// // //             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
// // //               A dedicated team working together to deliver impact across all our initiatives.
// // //             </p>
// // //           </div>

// // //           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
// // //             {teamStructure.map((dept) => (
// // //               <div key={dept.title} className="bg-card rounded-2xl p-8 border border-border card-hover">
// // //                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
// // //                   <dept.icon className="w-6 h-6 text-primary" />
// // //                 </div>
// // //                 <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
// // //                   {dept.title}
// // //                 </h3>
// // //                 <ul className="space-y-2">
// // //                   {dept.roles.map((role) => (
// // //                     <li key={role} className="text-sm text-muted-foreground flex items-center gap-2">
// // //                       <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
// // //                       {role}
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* CTA Section */}
// // //       <section className="section-padding bg-primary">
// // //         <div className="container-section text-center">
// // //           <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
// // //             Ready to Make a Difference?
// // //           </h2>
// // //           <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
// // //             Join our programs and become part of a movement transforming lives across the North.
// // //           </p>
// // //           <Button variant="hero" size="xl" asChild>
// // //             <Link to="/get-involved">
// // //               Get Started Today
// // //               <ArrowRight size={20} />
// // //             </Link>
// // //           </Button>
// // //         </div>
// // //       </section>
// // //     </Layout>
// // //   );
// // // };

// // // export default Programs;
// // // import { useEffect, useState } from "react";
// // // import Layout from "@/components/layout/Layout";
// // // import { Button } from "@/components/ui/button";
// // // import { Link } from "react-router-dom";
// // // import { ArrowRight, MessageCircle, Users, Home, Handshake } from "lucide-react";
// // // import { supabase } from "@/lib/supabase";
// // // import { motion, Variants } from "framer-motion";

// // // /* ===== ANIMATIONS ===== */
// // // const fadeInUp: Variants = {
// // //   hidden: { opacity: 0, y: 40 },
// // //   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// // // };

// // // /* ===== TEAM STRUCTURE ===== */
// // // const teamStructure = [
// // //   { title: "Executive Leadership", roles: ["Founder & President", "Vice President", "Executive Director"], icon: Users },
// // //   { title: "Programs & Events", roles: ["Workshop coordination", "Volunteer management", "Summit planning"], icon: Users },
// // //   { title: "Education & Mentorship", roles: ["Curriculum development", "Mentor matching", "Education support"], icon: Users },
// // //   { title: "Community & Welfare", roles: ["Outreach programs", "Donation management", "Social support"], icon: Home },
// // //   { title: "Media & Communications", roles: ["Social media", "Website content", "Public relations"], icon: MessageCircle },
// // //   { title: "Partnerships", roles: ["Corporate sponsorships", "NGO collaborations", "Strategic alliances"], icon: Handshake },
// // // ];

// // // /* ===== QUOTE INTERFACE ===== */
// // // interface Quote {
// // //   id: number;
// // //   quote_text: string;
// // //   author?: string;
// // //   week_number: number;
// // // }

// // // /* ===== PAGE COMPONENT ===== */
// // // const Programs = () => {
// // //   const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

// // //   /* ===== FETCH CURRENT WEEK QUOTE ===== */
// // //   useEffect(() => {
// // //     const fetchQuote = async () => {
// // //       const startOfYear = new Date(new Date().getFullYear(), 0, 1);
// // //       const today = new Date();
// // //       const weekNumber = Math.ceil(
// // //         ((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
// // //       );

// // //       try {
// // //         const { data, error } = await supabase
// // //           .from("weekly_quotes")
// // //           .select("*")
// // //           .eq("week_number", weekNumber)
// // //           .single();

// // //         if (error) console.error("Supabase fetch error:", error);
// // //         setCurrentQuote(data || null);
// // //       } catch (err) {
// // //         console.error("Error fetching quote:", err);
// // //       }
// // //     };
// // //     fetchQuote();
// // //   }, []);

// // //   return (
// // //     <Layout>
// // //       {/* Hero Section */}
// // //       <section className="bg-gradient-hero py-20">
// // //         <div className="container-section">
// // //           <div className="max-w-3xl">
// // //             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// // //               What We Do
// // //             </span>
// // //             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// // //               Programs & Initiatives
// // //             </h1>
// // //             <p className="text-lg text-primary-foreground/90">
// // //               At Northern Women Initiative For Empowerment, Growth and Development, we create opportunities and platforms that uplift Northern women and girls to thrive in every area of life.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Core Initiatives */}
// // //       <section className="section-padding bg-background">
// // //         <div className="container-section">
// // //           <div className="max-w-4xl mx-auto">
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // //               {[
// // //                 { title: "Empower Entrepreneurs", desc: "Supporting women in business with mentorship, skills training, and access to strong networks that help their businesses grow sustainably." },
// // //                 { title: "Champion Education", desc: "Advocating for girl-child education and providing learning opportunities that empower women and girls to reach their full potential." },
// // //                 { title: "Host Impactful Events", desc: "Bringing women together through summits, meet & greets, workshops, and forums that inspire connection, learning, and growth." },
// // //                 { title: "Mentor & Develop Leaders", desc: "Guiding women to become confident leaders in their communities, professions, and personal lives through mentorship and development." },
// // //                 { title: "Promote Gender Equality", desc: "Creating awareness, advocacy, and programs that challenge systemic barriers and support inclusion in all areas of life." },
// // //                 { title: "Build Community & Solidarity", desc: "Creating safe spaces where women celebrate each other, share experiences, and build strong systems of support." },
// // //               ].map((item) => (
// // //                 <div key={item.title} className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
// // //                   <h3 className="font-serif text-xl font-bold text-primary mb-2">{item.title}</h3>
// // //                   <p className="text-muted-foreground text-lg">{item.desc}</p>
// // //                 </div>
// // //               ))}

// // //               <div className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer md:col-span-2">
// // //                 <h3 className="font-serif text-xl font-bold text-primary mb-2 text-center">Celebrate Achievements</h3>
// // //                 <p className="text-muted-foreground text-lg text-center">
// // //                   Highlighting successes through initiatives like our magazine, events, and recognition programs to inspire and uplift others.
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <p className="mt-10 text-muted-foreground text-lg text-center">
// // //               Through these initiatives, we ensure that Northern women and girls are equipped, empowered, and celebrated—creating lasting impact for families, communities, and future generations.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Weekly Motivational Quote */}
// // //       <section id="motivation" className="section-padding bg-muted">
// // //         <div className="container-section">
// // //           <motion.div
// // //             variants={fadeInUp}
// // //             initial="hidden"
// // //             animate="visible"
// // //             className="max-w-4xl mx-auto text-center"
// // //           >
// // //             <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-6">
// // //               <MessageCircle className="w-8 h-8 text-secondary-foreground" />
// // //             </div>
// // //             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
// // //               Weekly Motivational Series
// // //             </h2>
// // //             <p className="text-muted-foreground text-lg mb-8">
// // //               Every week, we share inspiring messages designed to uplift and encourage Northern women on their journey.
// // //             </p>
// // //             <motion.div
// // //               variants={fadeInUp}
// // //               initial="hidden"
// // //               animate="visible"
// // //               className="bg-card rounded-2xl p-8 shadow-card text-left max-w-2xl mx-auto"
// // //             >
// // //               <p className="text-lg italic text-muted-foreground mb-4">
// // //                 "{currentQuote?.quote_text || 'Stay motivated this week!'}"
// // //               </p>
// // //               <p className="font-serif font-semibold text-foreground">
// // //                 — {currentQuote?.author || "This Week's Message"}
// // //               </p>
// // //               {currentQuote && (
// // //                 <p className="text-sm text-muted-foreground mt-2">
// // //                   Week {currentQuote.week_number}
// // //                 </p>
// // //               )}
// // //             </motion.div>
// // //             <Button variant="gold" size="lg" className="mt-8" asChild>
// // //               <Link to="/get-involved">
// // //                 Subscribe to Weekly Messages
// // //                 <ArrowRight size={18} />
// // //               </Link>
// // //             </Button>
// // //           </motion.div>
// // //         </div>
// // //       </section>

// // //       {/* Team Structure */}
// // //       <section className="section-padding bg-background">
// // //         <div className="container-section">
// // //           <div className="text-center mb-12">
// // //             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// // //               Our Structure
// // //             </span>
// // //             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
// // //               Northern Women Charity Team
// // //             </h2>
// // //             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
// // //               A dedicated team working together to deliver impact across all our initiatives.
// // //             </p>
// // //           </div>

// // //           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
// // //             {teamStructure.map((dept) => (
// // //               <div key={dept.title} className="bg-card rounded-2xl p-8 border border-border card-hover">
// // //                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
// // //                   <dept.icon className="w-6 h-6 text-primary" />
// // //                 </div>
// // //                 <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
// // //                   {dept.title}
// // //                 </h3>
// // //                 <ul className="space-y-2">
// // //                   {dept.roles.map((role) => (
// // //                     <li key={role} className="text-sm text-muted-foreground flex items-center gap-2">
// // //                       <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
// // //                       {role}
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* CTA Section */}
// // //       <section className="section-padding bg-primary">
// // //         <div className="container-section text-center">
// // //           <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
// // //             Ready to Make a Difference?
// // //           </h2>
// // //           <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
// // //             Join our programs and become part of a movement transforming lives across the North.
// // //           </p>
// // //           <Button variant="hero" size="xl" asChild>
// // //             <Link to="/get-involved">
// // //               Get Started Today
// // //               <ArrowRight size={20} />
// // //             </Link>
// // //           </Button>
// // //         </div>
// // //       </section>
// // //     </Layout>
// // //   );
// // // };

// // // export default Programs;

// // import { useEffect, useState } from "react";
// // import Layout from "@/components/layout/Layout";
// // import { Button } from "@/components/ui/button";
// // import { Link } from "react-router-dom";
// // import {
// //   ArrowRight,
// //   MessageCircle,
// //   Users,
// //   Home,
// //   Handshake,
// // } from "lucide-react";
// // import { supabase } from "@/lib/supabase";
// // import { motion, Variants } from "framer-motion";

// // /* ===== ANIMATION ===== */
// // const fadeInUp: Variants = {
// //   hidden: { opacity: 0, y: 40 },
// //   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// // };

// // /* ===== TEAM STRUCTURE ===== */
// // const teamStructure = [
// //   { title: "Executive Leadership", roles: ["Founder & President", "Vice President", "Executive Director"], icon: Users },
// //   { title: "Programs & Events", roles: ["Workshop coordination", "Volunteer management", "Summit planning"], icon: Users },
// //   { title: "Education & Mentorship", roles: ["Curriculum development", "Mentor matching", "Education support"], icon: Users },
// //   { title: "Community & Welfare", roles: ["Outreach programs", "Donation management", "Social support"], icon: Home },
// //   { title: "Media & Communications", roles: ["Social media", "Website content", "Public relations"], icon: MessageCircle },
// //   { title: "Partnerships", roles: ["Corporate sponsorships", "NGO collaborations", "Strategic alliances"], icon: Handshake },
// // ];

// // /* ===== QUOTE TYPE ===== */
// // interface Quote {
// //   id: number;
// //   quote_text: string;
// //   author?: string;
// //   week_number: number;
// //   year: number;
// // }

// // /* ===== HELPER: GET CURRENT WEEK ===== */
// // function getCurrentWeek() {
// //   const today = new Date();
// //   const startOfYear = new Date(today.getFullYear(), 0, 1);
// //   const days = Math.floor(
// //     (today.getTime() - startOfYear.getTime()) / 86400000
// //   );
// //   return Math.ceil((days + startOfYear.getDay() + 1) / 7);
// // }

// // /* ===== PAGE ===== */
// // export default function Programs() {
// //   const [quote, setQuote] = useState<Quote | null>(null);
// //   const [loadingQuote, setLoadingQuote] = useState(true);

// //   useEffect(() => {
// //     const fetchWeeklyQuote = async () => {
// //       const week = getCurrentWeek();
// //       const year = new Date().getFullYear();

// //       const { data, error } = await supabase
// //         .from("weekly_quotes")
// //         .select("*")
// //         .eq("week_number", week)
// //         .eq("year", year)
// //         .single();

// //       if (!error) {
// //         setQuote(data);
// //       }

// //       setLoadingQuote(false);
// //     };

// //     fetchWeeklyQuote();
// //   }, []);

// //   return (
// //     <Layout>
// //       {/* HERO */}
// //       <section className="bg-gradient-hero py-20">
// //         <div className="container-section max-w-3xl">
// //           <span className="text-secondary text-sm uppercase tracking-wider">
// //             What We Do
// //           </span>
// //           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// //             Programs & Initiatives
// //           </h1>
// //           <p className="text-lg text-primary-foreground/90">
// //             We create opportunities that uplift Northern women and girls.
// //           </p>
// //         </div>
// //       </section>

// //       {/* CORE INITIATIVES */}
// //       <section className="section-padding bg-background">
// //         <div className="container-section max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
// //           {[
// //             ["Empower Entrepreneurs", "Mentorship, skills training, and strong business networks."],
// //             ["Champion Education", "Supporting girl-child education and learning opportunities."],
// //             ["Host Impactful Events", "Summits, meet & greets, and workshops."],
// //             ["Mentor & Develop Leaders", "Leadership growth through mentorship."],
// //             ["Promote Gender Equality", "Advocacy and inclusion programs."],
// //             ["Build Community", "Safe spaces for connection and support."],
// //           ].map(([title, desc]) => (
// //             <div
// //               key={title}
// //               className="bg-card p-6 rounded-2xl shadow hover:scale-105 transition"
// //             >
// //               <h3 className="font-serif font-bold text-xl mb-2">{title}</h3>
// //               <p className="text-muted-foreground">{desc}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* WEEKLY QUOTE PREVIEW */}
// //       <section className="section-padding bg-muted" id="motivation">
// //         <div className="container-section">
// //           <motion.div
// //             variants={fadeInUp}
// //             initial="hidden"
// //             animate="visible"
// //             className="max-w-4xl mx-auto text-center"
// //           >
// //             <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-6">
// //               <MessageCircle className="w-8 h-8 text-secondary-foreground" />
// //             </div>

// //             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
// //               Weekly Motivational Series
// //             </h2>

// //             <div className="bg-card rounded-2xl p-8 shadow text-left">
// //               {loadingQuote ? (
// //                 <p className="text-muted-foreground italic">
// //                   Loading this week’s message…
// //                 </p>
// //               ) : quote ? (
// //                 <>
// //                   <p className="italic text-lg mb-4">
// //                     “{quote.quote_text}”
// //                   </p>
// //                   <p className="font-semibold">
// //                     — {quote.author || "Northern Women Initiative"}
// //                   </p>
// //                 </>
// //               ) : (
// //                 <p className="italic text-muted-foreground">
// //                   No quote set for this week yet.
// //                 </p>
// //               )}
// //             </div>

// //             <Button variant="gold" size="lg" className="mt-8" asChild>
// //               <Link to="/get-involved">
// //                 Subscribe to Weekly Messages
// //                 <ArrowRight size={18} />
// //               </Link>
// //             </Button>
// //           </motion.div>
// //         </div>
// //       </section>

// //       {/* TEAM STRUCTURE */}
// //       <section className="section-padding bg-background">
// //         <div className="container-section grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {teamStructure.map((dept) => (
// //             <div key={dept.title} className="bg-card p-6 rounded-2xl">
// //               <dept.icon className="w-6 h-6 mb-3 text-primary" />
// //               <h3 className="font-serif font-bold mb-2">{dept.title}</h3>
// //               <ul className="text-sm text-muted-foreground space-y-1">
// //                 {dept.roles.map((r) => (
// //                   <li key={r}>• {r}</li>
// //                 ))}
// //               </ul>
// //             </div>
// //           ))}
// //         </div>
// //       </section>
// //     </Layout>
// //   );
// // }

// // import { useEffect, useState } from "react";
// // import Layout from "@/components/layout/Layout";
// // import { supabase } from "@/lib/supabase";

// // interface WeeklyQuote {
// //   id: number;
// //   quote_text: string;
// //   author: string | null;
// //   is_active: boolean;
// // }

// // export default function Programs() {
// //   const [weeklyQuote, setWeeklyQuote] = useState<WeeklyQuote | null>(null);

// //   useEffect(() => {
// //     fetchWeeklyQuote();
// //   }, []);

// //   const fetchWeeklyQuote = async () => {
// //     const { data, error } = await supabase
// //       .from("weekly_quotes")
// //       .select("*")
// //       .eq("is_active", true)
// //       .single();

// //     if (!error) {
// //       setWeeklyQuote(data);
// //     }
// //   };

// //   return (
// //     <Layout>
// //       {/* 🔥 WEEKLY QUOTE PREVIEW (PUBLIC) */}
// //       <section className="py-16 bg-muted">
// //         <div className="max-w-3xl mx-auto text-center px-4">
// //           <h2 className="text-3xl font-serif font-bold mb-4">
// //             This Week’s Motivation
// //           </h2>

// //           <p className="italic text-lg text-muted-foreground">
// //             “{weeklyQuote?.quote_text ||
// //               "Stay strong, stay inspired, and keep rising."}”
// //           </p>

// //           {weeklyQuote?.author && (
// //             <p className="mt-3 font-semibold">
// //               — {weeklyQuote.author}
// //             </p>
// //           )}
// //         </div>
// //       </section>

// //       {/* EXISTING PROGRAMS CONTENT */}
// //       {/* <section className="section-padding">
// //         <div className="container-section">
// //           <h2 className="text-3xl font-bold mb-6">
// //             Our Programs
// //           </h2> */}

// //           {/* Your existing program cards/components remain unchanged */}
// //         {/* </div>
// //       </section>
// //     </Layout>
// //   );
// // } */}

// import { useEffect, useState } from "react";
// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import {
//   ArrowRight,
//   MessageCircle,
//   Users,
//   Home,
//   Handshake,
// } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { motion, Variants } from "framer-motion";

// /* ================= ANIMATION ================= */
// const fadeInUp: Variants = {
//   hidden: { opacity: 0, y: 40 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// /* ================= TEAM STRUCTURE ================= */
// const teamStructure = [
//   {
//     title: "Executive Leadership",
//     roles: ["Founder & President", "Vice President", "Executive Director"],
//     icon: Users,
//   },
//   {
//     title: "Programs & Events",
//     roles: ["Workshop coordination", "Volunteer management", "Summit planning"],
//     icon: Users,
//   },
//   {
//     title: "Education & Mentorship",
//     roles: ["Curriculum development", "Mentor matching", "Education support"],
//     icon: Users,
//   },
//   {
//     title: "Community & Welfare",
//     roles: ["Outreach programs", "Donation management", "Social support"],
//     icon: Home,
//   },
//   {
//     title: "Media & Communications",
//     roles: ["Social media", "Website content", "Public relations"],
//     icon: MessageCircle,
//   },
//   {
//     title: "Partnerships",
//     roles: ["Corporate sponsorships", "NGO collaborations", "Strategic alliances"],
//     icon: Handshake,
//   },
// ];

// /* ================= TYPES ================= */
// interface Quote {
//   id: number;
//   quote_text: string;
//   author?: string | null;
//   week_number: number;
//   year: number;
// }

// /* ================= HELPERS ================= */
// function getCurrentWeek() {
//   const today = new Date();
//   const startOfYear = new Date(today.getFullYear(), 0, 1);
//   const days = Math.floor(
//     (today.getTime() - startOfYear.getTime()) / 86400000
//   );
//   return Math.ceil((days + startOfYear.getDay() + 1) / 7);
// }

// /* ================= PAGE ================= */
// export default function Programs() {
//   const [quote, setQuote] = useState<Quote | null>(null);
//   const [loadingQuote, setLoadingQuote] = useState(true);

//   useEffect(() => {
//     fetchWeeklyQuote();
//   }, []);

//   const fetchWeeklyQuote = async () => {
//     const week = getCurrentWeek();
//     const year = new Date().getFullYear();

//     const { data, error } = await supabase
//       .from("weekly_quotes")
//       .select("*")
//       .eq("week_number", week)
//       .eq("year", year)
//       .single();

//     if (!error && data) {
//       setQuote(data);
//     }

//     setLoadingQuote(false);
//   };

//   return (
//     <Layout>
//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section max-w-3xl">
//           <span className="text-secondary text-sm uppercase tracking-wider">
//             What We Do
//           </span>
//           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//             Programs & Initiatives
//           </h1>
//           <p className="text-lg text-primary-foreground/90">
//             We create opportunities and platforms that uplift Northern women
//             and girls to thrive in every area of life.
//           </p>
//         </div>
//       </section>

//       {/* ================= CORE INITIATIVES ================= */}
//       <section className="section-padding bg-background">
//         <div className="container-section max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
//           {[
//             ["Empower Entrepreneurs", "Mentorship, skills training, and strong business networks."],
//             ["Champion Education", "Supporting girl-child education and learning opportunities."],
//             ["Host Impactful Events", "Summits, meet & greets, and workshops."],
//             ["Mentor & Develop Leaders", "Leadership growth through mentorship."],
//             ["Promote Gender Equality", "Advocacy and inclusion programs."],
//             ["Build Community", "Safe spaces for connection and support."],
//           ].map(([title, desc]) => (
//             <div
//               key={title}
//               className="bg-card p-6 rounded-2xl shadow hover:scale-105 transition"
//             >
//               <h3 className="font-serif font-bold text-xl mb-2">{title}</h3>
//               <p className="text-muted-foreground">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ================= WEEKLY QUOTE ================= */}
//       <section className="section-padding bg-muted" id="motivation">
//         <div className="container-section">
//           <motion.div
//             variants={fadeInUp}
//             initial="hidden"
//             animate="visible"
//             className="max-w-4xl mx-auto text-center"
//           >
//             <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-6">
//               <MessageCircle className="w-8 h-8 text-secondary-foreground" />
//             </div>

//             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
//               Weekly Motivational Series
//             </h2>

//             <div className="bg-card rounded-2xl p-8 shadow text-left">
//               {loadingQuote ? (
//                 <p className="text-muted-foreground italic">
//                   Loading this week’s message…
//                 </p>
//               ) : quote ? (
//                 <>
//                   <p className="italic text-lg mb-4">
//                     “{quote.quote_text}”
//                   </p>
//                   <p className="font-semibold">
//                     — {quote.author || "Northern Women Initiative"}
//                   </p>
//                 </>
//               ) : (
//                 <p className="italic text-muted-foreground">
//                   No quote set for this week yet.
//                 </p>
//               )}
//             </div>

//             <Button variant="gold" size="lg" className="mt-8" asChild>
//               <Link to="/get-involved">
//                 Subscribe to Weekly Messages
//                 <ArrowRight size={18} />
//               </Link>
//             </Button>
//           </motion.div>
//         </div>
//       </section>

//       {/* ================= TEAM STRUCTURE ================= */}
//       <section className="section-padding bg-background">
//         <div className="container-section grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {teamStructure.map((dept) => (
//             <div key={dept.title} className="bg-card p-6 rounded-2xl">
//               <dept.icon className="w-6 h-6 mb-3 text-primary" />
//               <h3 className="font-serif font-bold mb-2">{dept.title}</h3>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 {dept.roles.map((r) => (
//                   <li key={r}>• {r}</li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </section>
//     </Layout>
//   );
// }

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Users,
  Home,
  Handshake,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, Variants } from "framer-motion";

/* ===== ANIMATIONS ===== */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* ===== TEAM STRUCTURE ===== */
const teamStructure = [
  {
    title: "Executive Leadership",
    roles: ["Founder & President", "Vice President", "Executive Director"],
    icon: Users,
  },
  {
    title: "Programs & Events",
    roles: ["Workshop coordination", "Volunteer management", "Summit planning"],
    icon: Users,
  },
  {
    title: "Education & Mentorship",
    roles: ["Curriculum development", "Mentor matching", "Education support"],
    icon: Users,
  },
  {
    title: "Community & Welfare",
    roles: ["Outreach programs", "Donation management", "Social support"],
    icon: Home,
  },
  {
    title: "Media & Communications",
    roles: ["Social media", "Website content", "Public relations"],
    icon: MessageCircle,
  },
  {
    title: "Partnerships",
    roles: ["Corporate sponsorships", "NGO collaborations", "Strategic alliances"],
    icon: Handshake,
  },
];

/* ===== TYPES ===== */
interface Quote {
  id: number;
  quote_text: string;
  author?: string | null;
  week_number: number;
  year: number;
}

/* ===== HELPERS ===== */
function getCurrentWeek() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const days = Math.floor(
    (today.getTime() - startOfYear.getTime()) / 86400000
  );
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

/* ===== PAGE ===== */
export default function Programs() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  useEffect(() => {
    fetchWeeklyQuote();
  }, []);

  const fetchWeeklyQuote = async () => {
    const week = getCurrentWeek();
    const year = new Date().getFullYear();

    const { data, error } = await supabase
      .from("weekly_quotes")
      .select("*")
      .eq("week_number", week)
      .eq("year", year)
      .single();

    if (!error && data) {
      setQuote(data);
    }

    setLoadingQuote(false);
  };

  return (
    <Layout>
      {/* ================= HERO (LEFT ALIGNED) ================= */}
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              What We Do
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
              Programs & Initiatives
            </h1>
            <p className="text-lg text-primary-foreground/90">
              At Northern Women Initiative For Empowerment, Growth and Development,
              we create opportunities and platforms that uplift Northern women and
              girls to thrive in every area of life.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CORE INITIATIVES ================= */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Empower Entrepreneurs",
                  desc: "Supporting women in business with mentorship, skills training, and access to strong networks that help their businesses grow sustainably.",
                },
                {
                  title: "Champion Education",
                  desc: "Advocating for girl-child education and providing learning opportunities that empower women and girls to reach their full potential.",
                },
                {
                  title: "Host Impactful Events",
                  desc: "Bringing women together through summits, meet & greets, workshops, and forums that inspire connection, learning, and growth.",
                },
                {
                  title: "Mentor & Develop Leaders",
                  desc: "Guiding women to become confident leaders in their communities, professions, and personal lives through mentorship and development.",
                },
                {
                  title: "Promote Gender Equality",
                  desc: "Creating awareness, advocacy, and programs that challenge systemic barriers and support inclusion in all areas of life.",
                },
                {
                  title: "Build Community & Solidarity",
                  desc: "Creating safe spaces where women celebrate each other, share experiences, and build strong systems of support.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer"
                >
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {item.desc}
                  </p>
                </div>
              ))}

              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg md:col-span-2">
                <h3 className="font-serif text-xl font-bold text-primary mb-2 text-center">
                  Celebrate Achievements
                </h3>
                <p className="text-muted-foreground text-lg text-center">
                  Highlighting successes through initiatives like our magazine,
                  events, and recognition programs to inspire and uplift others.
                </p>
              </div>
            </div>

            <p className="mt-10 text-muted-foreground text-lg text-center">
              Through these initiatives, we ensure that Northern women and girls
              are equipped, empowered, and celebrated—creating lasting impact for
              families, communities, and future generations.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WEEKLY MOTIVATION ================= */}
      <section id="motivation" className="section-padding bg-muted">
        <div className="container-section">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-secondary-foreground" />
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Weekly Motivational Series
            </h2>

            <p className="text-muted-foreground text-lg mb-8">
              Every week, we share inspiring messages designed to uplift and
              encourage Northern women on their journey.
            </p>

            <div className="bg-card rounded-2xl p-8 shadow-card text-left">
              {loadingQuote ? (
                <p className="italic text-muted-foreground">
                  Loading this week’s message…
                </p>
              ) : quote ? (
                <>
                  <p className="text-lg italic text-muted-foreground mb-4">
                    “{quote.quote_text}”
                  </p>
                  <p className="font-serif font-semibold text-foreground">
                    — {quote.author || "This Week’s Message"}
                  </p>
                </>
              ) : (
                <p className="italic text-muted-foreground">
                  No quote has been set for this week yet.
                </p>
              )}
            </div>

            {/* <Button variant="gold" size="lg" className="mt-8" asChild>
              <Link to="/get-involved">
                Subscribe to Weekly Messages
                <ArrowRight size={18} />
              </Link>
            </Button> */}
          </motion.div>
        </div>
      </section>

      {/* ================= TEAM STRUCTURE ================= */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Our Structure
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
              Northern Women Charity Team
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A dedicated team working together to deliver impact across all our initiatives.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamStructure.map((dept) => (
              <div
                key={dept.title}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <dept.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {dept.title}
                </h3>
                <ul className="space-y-2">
                  {dept.roles.map((role) => (
                    <li
                      key={role}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="section-padding bg-primary">
        <div className="container-section text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join our programs and become part of a movement transforming lives across the North.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/get-involved">
              Get Started Today
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
