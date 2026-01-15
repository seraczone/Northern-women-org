// // import React from "react";
// // import Layout from "@/components/layout/Layout";
// // import founder from "@/assets/founder.jpg";
// // import karima from "@/assets/karima.jpg";
// // import badriyya from "@/assets/badriyya.jpg";
// // import jamila from "@/assets/jamila.jpg";
// // import aminah from "@/assets/aminah.jpg";
// // import rukayya from "@/assets/rukayya.jpg";
// // import aisha from "@/assets/aisha.jpg";
// // import sadiya from "@/assets/sadiya.jpg";
// // import hauwa from "@/assets/hauwa.jpg";

// // // Team members with real roles
// // const teamMembers = [
// //   {
// //     name: "Mrs MARIAM NASIR",
// //     role: "Founder",
// //     image: founder,
// //   },
// //   {
// //     name: "KARIMA ZAILANI",
// //     role: "PA to the Founder",
// //     image: karima,
// //   },
// //   {
// //     name: "BADRIYYA KALARAWI",
// //     role: "Journalist, BBC",
// //     image: badriyya,
// //   },
// //   {
// //     name: "JAMILA MUSA AHAYA",
// //     role: "CEO, Baljam Ventures",
// //     image: jamila,
// //   },
// //   {
// //     name: "AMINAH HAMZA",
// //     role: "CEO, Amis Army Concept",
// //     image: aminah,
// //   },
// //   {
// //     name: "RUKAYYA GURAMA",
// //     role: "CEO, Baby Blossom",
// //     image: rukayya,
// //   },
// //   {
// //     name: "AISHA MOHAMMED GALADIMA",
// //     role: "XXXXXXXXXXX",
// //     image: aisha,
// //   },
// //   {
// //     name: "SADIYA ZAILANI",
// //     role: "Founder, Lazeez Pops",
// //     image: sadiya,
// //   },
// //   {
// //     name: "Dr. HAUWA MUSTAPHA BABURA",
// //     role: "XXXXXXXX",
// //     image: hauwa,
// //   },
// // ];

// // const partners = [
// //   { name: "NITDA", logo: "/assets/partners/nitda.png" },
// //   { name: "Ministry Of Women Affair, Nigeria", logo: "/assets/partners/ministry-women.png" },
// // ];

// // const OurTeam: React.FC = () => {
// //   return (
// //     <Layout>
// //       {/* Hero Section - matches About page structure and colors */}
// //       <section className="bg-gradient-hero py-20">
// //         <div className="container-section">
// //           <div className="max-w-3xl">
// //             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// //               Our Team
// //             </span>
// //             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// //               Northern Women Initiative Team
// //             </h1>
// //             <p className="text-lg text-primary-foreground/90">
// //               A dedicated team working together to deliver impact across all our programs.
// //             </p>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Team and Partners Section */}
// //       <div className="max-w-6xl mx-auto py-12 px-4">
// //         <h1 className="text-4xl font-bold mb-8 text-center">Meet the Team</h1>
// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
// //           {teamMembers.map((member) => (
// //             <div
// //               key={member.name}
// //               className="bg-white rounded-lg shadow p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg group cursor-pointer"
// //             >
// //               <img
// //                 src={member.image}
// //                 alt={member.name}
// //                 className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary group-hover:border-secondary"
// //                 onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96')}
// //               />
// //               <h2 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors duration-200">{member.name}</h2>
// //               <p className="text-gray-600 group-hover:text-secondary transition-colors duration-200">{member.role}</p>
// //             </div>
// //           ))}
// //         </div>

// //         <h1 className="text-3xl font-bold mb-6 text-center">Our Partners</h1>
// //         <div className="flex flex-wrap justify-center gap-8">
// //           {partners.map((partner) => (
// //             <div
// //               key={partner.name}
// //               className="flex flex-col items-center transition-transform duration-200 hover:scale-105 cursor-pointer"
// //             >
// //               <img
// //                 src={partner.logo}
// //                 alt={partner.name}
// //                 className="w-32 h-16 object-contain mb-2 bg-white rounded shadow"
// //                 onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/128x64')}
// //               />
// //               <span className="text-gray-700 text-sm text-center">{partner.name}</span>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // };

// // export default OurTeam;

// // // import React from "react";
// // // import Layout from "@/components/layout/Layout";
// // // import founder from "@/assets/founder.jpg";
// // // import karima from "@/assets/karima.jpg";
// // // import badriyya from "@/assets/badriyya.jpg";
// // // import jamila from "@/assets/jamila.jpg";
// // // import aminah from "@/assets/aminah.jpg";
// // // import rukayya from "@/assets/rukayya.jpg";
// // // import aisha from "@/assets/aisha.jpg";
// // // import sadiya from "@/assets/sadiya.jpg";
// // // import hauwa from "@/assets/hauwa.jpg";

// // // // Team members
// // // const teamMembers = [
// // //   { name: "Mrs MARIAM NASIR", role: "Founder", image: founder },
// // //   { name: "KARIMA ZAILANI", role: "PA to the Founder", image: karima },
// // //   { name: "BADRIYYA KALARAWI", role: "Journalist, BBC", image: badriyya },
// // //   { name: "JAMILA MUSA AHAYA", role: "CEO, Baljam Ventures", image: jamila },
// // //   { name: "AMINAH HAMZA", role: "CEO, Amis Army Concept", image: aminah },
// // //   { name: "RUKAYYA GURAMA", role: "CEO, Baby Blossom", image: rukayya },
// // //   { name: "AISHA MOHAMMED GALADIMA", role: "XXXXXXXXXXX", image: aisha },
// // //   { name: "SADIYA ZAILANI", role: "Founder, Lazeez Pops", image: sadiya },
// // //   { name: "Dr. HAUWA MUSTAPHA BABURA", role: "XXXXXXXX", image: hauwa },
// // // ];

// // // const OurTeam: React.FC = () => {
// // //   return (
// // //     <Layout>
// // //       {/* Hero Section */}
// // //       <section className="bg-gradient-hero py-20">
// // //         <div className="container-section max-w-3xl">
// // //           <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// // //             Our Team
// // //           </span>
// // //           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// // //             Northern Women Initiative Team
// // //           </h1>
// // //           <p className="text-lg text-primary-foreground/90">
// // //             A dedicated team working together to deliver impact across all our programs.
// // //           </p>
// // //         </div>
// // //       </section>

// // //       {/* Team Grid */}
// // //       <section className="max-w-6xl mx-auto py-12 px-4">
// // //         <h2 className="text-4xl font-bold mb-10 text-center">
// // //           Meet the Team
// // //         </h2>

// // //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
// // //           {teamMembers.map((member) => (
// // //             <div
// // //               key={member.name}
// // //               className="flex flex-col items-center text-center group transition-transform duration-300 hover:scale-[1.02]"
// // //             >
// // //               <img
// // //                 src={member.image}
// // //                 alt={member.name}
// // //                 className="w-full h-[320px] sm:h-[360px] object-cover"
// // //                 onError={(e) =>
// // //                   (e.currentTarget.src = "https://via.placeholder.com/400x500")
// // //                 }
// // //               />

// // //               <h3 className="mt-4 text-lg font-semibold text-gray-900">
// // //                 {member.name}
// // //               </h3>
// // //               <p className="text-sm text-gray-600">
// // //                 {member.role}
// // //               </p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </section>
// // //     </Layout>
// // //   );
// // // };

// // // export default OurTeam;

// // import React from "react";
// // import Layout from "@/components/layout/Layout";
// // import founder from "@/assets/founder.jpg";
// // import karima from "@/assets/karima.jpg";
// // import badriyya from "@/assets/badriyya.jpg";
// // import jamila from "@/assets/jamila.jpg";
// // import aminah from "@/assets/aminah.jpg";
// // import rukayya from "@/assets/rukayya.jpg";
// // import aisha from "@/assets/aisha.jpg";
// // import sadiya from "@/assets/sadiya.jpg";
// // import hauwa from "@/assets/hauwa.jpg";

// // // Team members
// // const teamMembers = [
// //   { name: "Mrs MARIAM NASIR", role: "Founder", image: founder },
// //   { name: "KARIMA ZAILANI", role: "PA to the Founder", image: karima },
// //   { name: "BADRIYYA KALARAWI", role: "Journalist, BBC", image: badriyya },
// //   { name: "JAMILA MUSA AHAYA", role: "CEO, Baljam Ventures", image: jamila },
// //   { name: "AMINAH HAMZA", role: "CEO, Amis Army Concept", image: aminah },
// //   { name: "RUKAYYA GURAMA", role: "CEO, Baby Blossom", image: rukayya },
// //   { name: "AISHA MOHAMMED GALADIMA", role: "XXXXXXXXXXX", image: aisha },
// //   { name: "SADIYA ZAILANI", role: "Founder, Lazeez Pops", image: sadiya },
// //   { name: "Dr. HAUWA MUSTAPHA BABURA", role: "XXXXXXXX", image: hauwa },
// // ];

// // const OurTeam: React.FC = () => {
// //   return (
// //     <Layout>
// //       {/* Hero Section */}
// //       <section className="bg-gradient-hero py-20">
// //         <div className="container-section max-w-3xl">
// //           <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// //             Our Team
// //           </span>
// //           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// //             Northern Women Initiative Team
// //           </h1>
// //           <p className="text-lg text-primary-foreground/90">
// //             A dedicated team working together to deliver impact across all our programs.
// //           </p>
// //         </div>
// //       </section>

// //       {/* Team Grid */}
// //       <section className="max-w-6xl mx-auto py-12 px-4">
// //         <h2 className="text-4xl font-bold mb-12 text-center">
// //           Meet the Team
// //         </h2>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
// //           {teamMembers.map((member) => (
// //             <div
// //               key={member.name}
// //               className="group flex flex-col text-center transition-transform duration-300 hover:scale-[1.02]"
// //             >
// //               {/* Image Wrapper */}
// //               <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm ring-1 ring-primary/20">
// //                 <img
// //                   src={member.image}
// //                   alt={member.name}
// //                   className="w-full h-[320px] sm:h-[360px] object-cover"
// //                   onError={(e) =>
// //                     (e.currentTarget.src =
// //                       "https://via.placeholder.com/400x500")
// //                   }
// //                 />

// //                 {/* Editorial Gradient Overlay */}
// //                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
// //               </div>

// //               {/* Accent Line */}
// //               <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full" />

// //               {/* Text */}
// //               <h3 className="mt-4 text-lg font-semibold text-gray-900">
// //                 {member.name}
// //               </h3>
// //               <p className="text-sm text-gray-600">
// //                 {member.role}
// //               </p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>
// //     </Layout>
// //   );
// // };

// // export default OurTeam;
// // import React from "react";
// // import Layout from "@/components/layout/Layout";
// // import founder from "@/assets/founder.jpg";
// // import karima from "@/assets/karima.jpg";
// // import badriyya from "@/assets/badriyya.jpg";
// // import jamila from "@/assets/jamila.jpg";
// // import aminah from "@/assets/aminah.jpg";
// // import rukayya from "@/assets/rukayya.jpg";
// // import aisha from "@/assets/aisha.jpg";
// // import sadiya from "@/assets/sadiya.jpg";
// // import hauwa from "@/assets/hauwa.jpg";

// // // Team members
// // const teamMembers = [
// //   { name: "Mrs MARIAM NASIR", role: "Founder", image: founder },
// //   { name: "KARIMA ZAILANI", role: "PA to the Founder", image: karima },
// //   { name: "BADRIYYA KALARAWI", role: "Journalist, BBC", image: badriyya },
// //   { name: "JAMILA MUSA AHAYA", role: "CEO, Baljam Ventures", image: jamila },
// //   { name: "AMINAH HAMZA", role: "CEO, Amis Army Concept", image: aminah },
// //   { name: "RUKAYYA GURAMA", role: "CEO, Baby Blossom", image: rukayya },
// //   { name: "AISHA MOHAMMED GALADIMA", role: "XXXXXXXXXXX", image: aisha },
// //   { name: "SADIYA ZAILANI", role: "Founder, Lazeez Pops", image: sadiya },
// //   { name: "Dr. HAUWA MUSTAPHA BABURA", role: "XXXXXXXX", image: hauwa },
// // ];

// // // Partners
// // const partners = [
// //   { name: "NITDA", logo: "/assets/partners/nitda.png" },
// //   { name: "Ministry of Women Affairs, Nigeria", logo: "/assets/partners/ministry-women.png" },
// //   { name: "Partner Three", logo: "/assets/partners/partner3.png" },
// //   { name: "Partner Four", logo: "/assets/partners/partner4.png" },
// // ];

// // const OurTeam: React.FC = () => {
// //   return (
// //     <Layout>
// //       {/* Hero Section */}
// //       <section className="bg-gradient-hero py-20">
// //         <div className="container-section max-w-3xl">
// //           <span className="text-secondary font-medium text-sm uppercase tracking-wider">
// //             Our Team
// //           </span>
// //           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
// //             Northern Women Initiative Team
// //           </h1>
// //           <p className="text-lg text-primary-foreground/90">
// //             A dedicated team working together to deliver impact across all our programs.
// //           </p>
// //         </div>
// //       </section>

// //       {/* Team Section */}
// //       <section className="max-w-6xl mx-auto py-12 px-4">
// //         <h2 className="text-4xl font-bold mb-12 text-center">
// //           Meet the Team
// //         </h2>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
// //           {teamMembers.map((member) => (
// //             <div
// //               key={member.name}
// //               className="group flex flex-col text-center transition-transform duration-300 hover:scale-[1.02]"
// //             >
// //               <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm ring-1 ring-primary/20">
// //                 <img
// //                   src={member.image}
// //                   alt={member.name}
// //                   className="w-full h-[320px] sm:h-[360px] object-cover"
// //                 />
// //                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
// //               </div>

// //               <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full" />

// //               <h3 className="mt-4 text-lg font-semibold text-gray-900">
// //                 {member.name}
// //               </h3>
// //               <p className="text-sm text-gray-600">
// //                 {member.role}
// //               </p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* Partner Section */}
// //       <section className="bg-gray-50 py-16">
// //         <div className="max-w-6xl mx-auto px-4">
// //           <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
// //             OUR PARTNER
// //           </h2>

// //           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 items-center">
// //             {partners.map((partner) => (
// //               <div
// //                 key={partner.name}
// //                 className="flex flex-col items-center text-center group transition-transform duration-300 hover:scale-105"
// //               >
// //                 <div className="w-full h-28 flex items-center justify-center border border-gray-200 rounded-lg bg-white shadow-sm">
// //                   <img
// //                     src={partner.logo}
// //                     alt={partner.name}
// //                     className="max-h-16 object-contain"
// //                     onError={(e) =>
// //                       (e.currentTarget.src =
// //                         "https://via.placeholder.com/160x80")
// //                     }
// //                   />
// //                 </div>

// //                 <p className="mt-3 text-sm font-medium text-gray-700">
// //                   {partner.name}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>
// //     </Layout>
// //   );
// // };

// // export default OurTeam;

// import React from "react";
// import Layout from "@/components/layout/Layout";
// import founder from "@/assets/founder.jpg";
// import karima from "@/assets/karima.jpg";
// import badriyya from "@/assets/badriyya.jpg";
// import jamila from "@/assets/jamila.jpg";
// import aminah from "@/assets/aminah.jpg";
// import rukayya from "@/assets/rukayya.jpg";
// import aisha from "@/assets/aisha.jpg";
// import sadiya from "@/assets/sadiya.jpg";
// import hauwa from "@/assets/hauwa.jpg";

// // Team members
// const teamMembers = [
//   { name: "Mrs MARIAM NASIR", role: "Founder", image: founder },
//   { name: "KARIMA ZAILANI", role: "PA to the Founder", image: karima },
//   { name: "BADRIYYA KALARAWI", role: "Journalist, BBC", image: badriyya },
//   { name: "JAMILA MUSA AHAYA", role: "CEO, Baljam Ventures", image: jamila },
//   { name: "AMINAH HAMZA", role: "CEO, Amis Army Concept", image: aminah },
//   { name: "RUKAYYA GURAMA", role: "CEO, Baby Blossom", image: rukayya },
//   { name: "AISHA MOHAMMED GALADIMA", role: "XXXXXXXXXXX", image: aisha },
//   { name: "SADIYA ZAILANI", role: "Founder, Lazeez Pops", image: sadiya },
//   { name: "Dr. HAUWA MUSTAPHA BABURA", role: "XXXXXXXX", image: hauwa },
// ];

// // Partners
// const partners = [
//   { name: "NITDA", logo: "/assets/partners/nitda.png" },
//   { name: "Ministry Of Women Affair, Nigeria", logo: "/assets/partners/ministry-women.png" },
// ];

// const OurTeam: React.FC = () => {
//   return (
//     <Layout>
//       {/* Hero Section – MATCHES ORIGINAL LAYOUT */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Our Team
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Northern Women Initiative Team
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               A dedicated team working together to deliver impact across all our programs.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="max-w-6xl mx-auto py-12 px-4">
//         <h2 className="text-4xl font-bold mb-12 text-center">
//           Meet the Team
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
//           {teamMembers.map((member) => (
//             <div
//               key={member.name}
//               className="group flex flex-col text-center transition-transform duration-300 hover:scale-[1.02]"
//             >
//               {/* Image */}
//               <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm ring-1 ring-primary/20">
//                 <img
//                   src={member.image}
//                   alt={member.name}
//                   className="w-full h-[320px] sm:h-[360px] object-cover"
//                   onError={(e) =>
//                     (e.currentTarget.src =
//                       "https://via.placeholder.com/400x500")
//                   }
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
//               </div>

//               {/* Accent */}
//               <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full" />

//               {/* Text */}
//               <h3 className="mt-4 text-lg font-semibold text-gray-900">
//                 {member.name}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {member.role}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Partner Section */}
//       <section className="bg-gray-50 py-16">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
//             OUR PARTNER
//           </h2>

//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 items-center">
//             {partners.map((partner) => (
//               <div
//                 key={partner.name}
//                 className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
//               >
//                 <div className="w-full h-28 flex items-center justify-center border border-gray-200 rounded-lg bg-white shadow-sm">
//                   <img
//                     src={partner.logo}
//                     alt={partner.name}
//                     className="max-h-16 object-contain"
//                     onError={(e) =>
//                       (e.currentTarget.src =
//                         "https://via.placeholder.com/160x80")
//                     }
//                   />
//                 </div>

//                 <p className="mt-3 text-sm font-medium text-gray-700">
//                   {partner.name}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default OurTeam;


// import React from "react";
// import Layout from "@/components/layout/Layout";
// import founder from "@/assets/founder.jpg";
// import karima from "@/assets/karima.jpg";
// import badriyya from "@/assets/badriyya.jpg";
// import jamila from "@/assets/jamila.jpg";
// import aminah from "@/assets/aminah.jpg";
// import rukayya from "@/assets/rukayya.jpg";
// import aisha from "@/assets/aisha.jpg";
// import sadiya from "@/assets/sadiya.jpg";
// import hauwa from "@/assets/hauwa.jpg";

// // Founder
// const founderMember = {
//   name: "Mrs. MARIAM MOHAMMED NASIR",
//   role: "Founder",
//   image: founder,
// };

// // Other Team Members
// const teamMembers = [
//   { name: "KARIMA ZAILANI", role: "PA to the Founder", image: karima },
//   { name: "BADRIYYA KALARAWI", role: "Journalist, BBC", image: badriyya },
//   { name: "JAMILA MUSA AHAYA", role: "CEO, Baljam Ventures", image: jamila },
//   { name: "AMINAH HAMZA", role: "CEO, Amis Army Concept", image: aminah },
//   { name: "RUKAYYA GURAMA", role: "CEO, Baby Blossom", image: rukayya },
//   { name: "AISHA MOHAMMED GALADIMA", role: "XXXXXXXXXXX", image: aisha },
//   { name: "SADIYA ZAILANI", role: "Founder, Lazeez Pops", image: sadiya },
//   { name: "Dr. HAUWA MUSTAPHA BABURA", role: "XXXXXXXX", image: hauwa },
// ];

// // Partners (8)
// const partners = [
//   { name: "NITDA", logo: "/assets/partners/nitda.png" },
//   { name: "Ministry Of Women Affair, Nigeria", logo: "/assets/partners/ministry-women.png" },
//   { name: "UN Women", logo: "/assets/partners/un-women.png" },
//   { name: "UNICEF", logo: "/assets/partners/unicef.png" },
//   { name: "WHO", logo: "/assets/partners/who.png" },
//   { name: "World Bank", logo: "/assets/partners/world-bank.png" },
//   { name: "African Development Bank", logo: "/assets/partners/afdb.png" },
//   { name: "NGO Partner", logo: "/assets/partners/partner8.png" },
// ];

// const OurTeam: React.FC = () => {
//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="bg-gradient-hero py-20">
//         <div className="container-section">
//           <div className="max-w-3xl">
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Our Team
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
//               Northern Women Initiative Team
//             </h1>
//             <p className="text-lg text-primary-foreground/90">
//               A dedicated team working together to deliver impact across all our programs.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="max-w-6xl mx-auto py-12 px-4">
//         <h2 className="text-4xl font-bold mb-12 text-center">
//           Meet the Team
//         </h2>

//         {/* Founder Highlight */}
//         <div className="flex justify-center mb-16">
//           <div className="max-w-sm text-center group transition-transform duration-300 hover:scale-[1.02]">
//             <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm ring-1 ring-primary/20">
//               <img
//                 src={founderMember.image}
//                 alt={founderMember.name}
//                 className="w-full h-[380px] object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
//             </div>

//             <div className="h-1 w-16 bg-primary mx-auto mt-4 rounded-full" />

//             <h3 className="mt-4 text-xl font-semibold text-gray-900">
//               {founderMember.name}
//             </h3>
//             <p className="text-sm text-gray-600">
//               {founderMember.role}
//             </p>
//           </div>
//         </div>

//         {/* Other Team Members */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
//           {teamMembers.map((member) => (
//             <div
//               key={member.name}
//               className="group flex flex-col text-center transition-transform duration-300 hover:scale-[1.02]"
//             >
//               <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm ring-1 ring-primary/20">
//                 <img
//                   src={member.image}
//                   alt={member.name}
//                   className="w-full h-[320px] object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
//               </div>

//               <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full" />

//               <h3 className="mt-4 text-lg font-semibold text-gray-900">
//                 {member.name}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {member.role}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default OurTeam;

import React from "react";
import Layout from "@/components/layout/Layout";

// Founder
const founderMember = {
  name: "Mrs. MARIAM MOHAMMED NASIR",
  role: "Founder",
  image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/founder.jpg",
};

// Other Team Members
const teamMembers = [
  {
    name: "KARIMA ZAILANI",
    role: "PA to the Founder",
    image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/karima.jpg",
  },
  {
    name: "BADRIYYA KALARAWI",
    role: "Journalist, BBC",
    image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/badriyya.jpg",
  },
  {
    name: "JAMILA MUSA AHAYA",
    role: "CEO, Baljam Ventures",
    image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/jamila.jpg",
  },
  {
    name: "AMINAH HAMZA",
    role: "CEO, Amis Army Concept",
    image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/aminah.jpg",
  },
  {
    name: "RUKAYYA GURAMA",
    role: "CEO, Baby Blossom",
    image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/rukayya.jpg",
  },
  {
    name: "AISHA MOHAMMED GALADIMA",
    role: "XXXXXXXXXXX",
    image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/aisha.jpg",
  },
  {
    name: "SADIYA ZAILANI",
    role: "Founder, Lazeez Pops",
    image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/sadiya.jpg",
  },
  {
    name: "Dr. HAUWA MUSTAPHA BABURA",
    role: "XXXXXXXX",
    image: "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/hauwa.jpg",
  },
];

// Partners (unchanged)
const partners = [
  { name: "NITDA", logo: "/assets/partners/nitda.png" },
  { name: "Ministry Of Women Affair, Nigeria", logo: "/assets/partners/ministry-women.png" },
  { name: "UN Women", logo: "/assets/partners/un-women.png" },
  { name: "UNICEF", logo: "/assets/partners/unicef.png" },
  { name: "WHO", logo: "/assets/partners/who.png" },
  { name: "World Bank", logo: "/assets/partners/world-bank.png" },
  { name: "African Development Bank", logo: "/assets/partners/afdb.png" },
  { name: "NGO Partner", logo: "/assets/partners/partner8.png" },
];

const OurTeam: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <div className="max-w-3xl">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Our Team
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
              Northern Women Initiative Team
            </h1>
            <p className="text-lg text-primary-foreground/90">
              A dedicated team working together to deliver impact across all our programs.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Meet the Team
        </h2>

        {/* Founder Highlight */}
        <div className="flex justify-center mb-16">
          <div className="max-w-sm text-center group transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm ring-1 ring-primary/20">
              <img
                src={founderMember.image}
                alt={founderMember.name}
                className="w-full h-[380px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            <div className="h-1 w-16 bg-primary mx-auto mt-4 rounded-full" />

            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {founderMember.name}
            </h3>
            <p className="text-sm text-gray-600">
              {founderMember.role}
            </p>
          </div>
        </div>

        {/* Other Team Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group flex flex-col text-center transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm ring-1 ring-primary/20">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[320px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full" />

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default OurTeam;
