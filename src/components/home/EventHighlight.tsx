// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
// import summitImage from "@/assets/summit-event.jpg";

// interface TimeLeft {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// const EventHighlight = () => {
//   const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//   useEffect(() => {
//     // Set target date to November 1st, 2026
//     const targetDate = new Date("2026-11-01T09:00:00").getTime();

//     const calculateTimeLeft = () => {
//       const now = new Date().getTime();
//       const difference = targetDate - now;

//       if (difference > 0) {
//         setTimeLeft({
//           days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//           hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//           minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
//           seconds: Math.floor((difference % (1000 * 60)) / 1000),
//         });
//       }
//     };

//     calculateTimeLeft();
//     const timer = setInterval(calculateTimeLeft, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const TimeBlock = ({ value, label }: { value: number; label: string }) => (
//     <div className="text-center">
//       <div className="bg-primary text-primary-foreground text-3xl md:text-4xl font-serif font-bold w-16 md:w-20 h-16 md:h-20 rounded-xl flex items-center justify-center shadow-lg">
//         {value.toString().padStart(2, "0")}
//       </div>
//       <div className="text-xs md:text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">
//         {label}
//       </div>
//     </div>
//   );

//   return (
//     <section className="section-padding bg-muted">
//       <div className="container-section">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Image */}
//           <div className="relative rounded-2xl overflow-hidden shadow-elevated">
//             <img
//               src={summitImage}
//               alt="Northern Women Summit"
//               className="w-full h-[400px] object-cover"
//             />
//             <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-medium text-sm">
//               Featured Event
//             </div>
//           </div>

//           {/* Content */}
//           <div>
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">Upcoming Event</span>
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
//               Northern Women Summit 2026
//             </h2>
//             <p className="text-muted-foreground text-lg mb-6">
//               Join hundreds of Northern women for a day of inspiration, networking, skill-building, 
//               and celebration. Together, we'll learn, grow, and strengthen our bonds as a community.
//             </p>

//             {/* Event Details */}
//             <div className="flex flex-wrap gap-6 mb-8">
//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Calendar size={20} className="text-primary" />
//                 <span>November 1st, 2026</span>
//               </div>
//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <MapPin size={20} className="text-primary" />
//                 <span>Northern Nigeria</span>
//               </div>
//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Users size={20} className="text-primary" />
//                 <span>500+ Attendees Expected</span>
//               </div>
//             </div>

//             {/* Countdown */}
//             <div className="mb-8">
//               <p className="text-sm font-medium text-foreground mb-4">Event starts in:</p>
//               <div className="flex gap-4">
//                 <TimeBlock value={timeLeft.days} label="Days" />
//                 <TimeBlock value={timeLeft.hours} label="Hours" />
//                 <TimeBlock value={timeLeft.minutes} label="Mins" />
//                 <TimeBlock value={timeLeft.seconds} label="Secs" />
//               </div>
//             </div>

//             <Button variant="gold" size="xl" asChild>
//               <Link to="/events">
//                 Register Now
//                 <ArrowRight size={20} />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventHighlight;

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

// import summitImage from "@/assets/summit-event.jpg";
// import summitImage1 from "@/assets/count1.jpg";
// import summitImage2 from "@/assets/count2.jpg";
// import summitImage3 from "@/assets/count3.jpg";

// interface TimeLeft {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// const images = [
//   summitImage,
//   summitImage1,
//   summitImage2,
//   summitImage3,
// ];

// const EventHighlight = () => {
//   const [timeLeft, setTimeLeft] = useState<TimeLeft>({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   /* 🔁 Auto image change (every 4 seconds) */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) =>
//         prev === images.length - 1 ? 0 : prev + 1
//       );
//     }, 4000); // milliseconds

//     return () => clearInterval(interval);
//   }, []);

//   /* ⏳ Countdown logic */
//   useEffect(() => {
//     const targetDate = new Date("2026-11-01T09:00:00").getTime();

//     const calculateTimeLeft = () => {
//       const now = new Date().getTime();
//       const difference = targetDate - now;

//       if (difference > 0) {
//         setTimeLeft({
//           days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//           hours: Math.floor(
//             (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//           ),
//           minutes: Math.floor(
//             (difference % (1000 * 60 * 60)) / (1000 * 60)
//           ),
//           seconds: Math.floor((difference % (1000 * 60)) / 1000),
//         });
//       }
//     };

//     calculateTimeLeft();
//     const timer = setInterval(calculateTimeLeft, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const TimeBlock = ({ value, label }: { value: number; label: string }) => (
//     <div className="text-center">
//       <div className="bg-primary text-primary-foreground text-3xl md:text-4xl font-serif font-bold w-16 md:w-20 h-16 md:h-20 rounded-xl flex items-center justify-center shadow-lg">
//         {value.toString().padStart(2, "0")}
//       </div>
//       <div className="text-xs md:text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">
//         {label}
//       </div>
//     </div>
//   );

//   return (
//     <section className="section-padding bg-muted">
//       <div className="container-section">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* 🖼 Image Section */}
//           <div className="relative rounded-2xl overflow-hidden shadow-elevated">
//             <img
//               src={images[currentImageIndex]}
//               alt="Northern Women Summit"
//               loading="lazy"
//               className="
//                 w-full 
//                 h-[260px] 
//                 sm:h-[320px] 
//                 md:h-[400px] 
//                 object-cover 
//                 transition-opacity 
//                 duration-700 
//                 ease-in-out
//               "
//               sizes="(max-width: 640px) 100vw, 50vw"
//             />

//             <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-medium text-sm">
//               Featured Event
//             </div>
//           </div>

//           {/* 📄 Content */}
//           <div>
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Upcoming Event
//             </span>

//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
//               Northern Women Summit 2026
//             </h2>

//             <p className="text-muted-foreground text-lg mb-6">
//               Join hundreds of Northern women for a day of inspiration,
//               networking, skill-building, and celebration. Together, we'll
//               learn, grow, and strengthen our bonds as a community.
//             </p>

//             {/* 📍 Event Details */}
//             <div className="flex flex-wrap gap-6 mb-8">
//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Calendar size={20} className="text-primary" />
//                 <span>November 1st, 2026</span>
//               </div>

//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <MapPin size={20} className="text-primary" />
//                 <span>Northern Nigeria</span>
//               </div>

//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Users size={20} className="text-primary" />
//                 <span>500+ Attendees Expected</span>
//               </div>
//             </div>

//             {/* ⏰ Countdown */}
//             <div className="mb-8">
//               <p className="text-sm font-medium text-foreground mb-4">
//                 Event starts in:
//               </p>

//               <div className="flex gap-4 flex-wrap">
//                 <TimeBlock value={timeLeft.days} label="Days" />
//                 <TimeBlock value={timeLeft.hours} label="Hours" />
//                 <TimeBlock value={timeLeft.minutes} label="Mins" />
//                 <TimeBlock value={timeLeft.seconds} label="Secs" />
//               </div>
//             </div>

//             <Button variant="gold" size="xl" asChild>
//               <Link to="/events">
//                 Register Now
//                 <ArrowRight size={20} />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// // export default EventHighlight;
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

// import summitImage from "@/assets/summit-event.jpg";
// import count1 from "@/assets/count1.jpg";
// import count2 from "@/assets/count2.jpg";
// import count3 from "@/assets/count3.jpg";
// import count4 from "@/assets/count4.jpg";
// import count5 from "@/assets/count5.jpg";
// import count6 from "@/assets/count6.jpg";
// import count7 from "@/assets/count7.jpg";
// import count9 from "@/assets/count9.jpg";
// import count10 from "@/assets/count10.jpg";

// interface TimeLeft {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// const images = [
//   summitImage,
//   count1,
//   count2,
//   count3,
//   count4,
//   count5,
//   count6,
//   count7,
//   count9,
//   count10,
// ];

// const EventHighlight = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState<TimeLeft>({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   /* ---------------- IMAGE AUTO ROTATION ---------------- */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % images.length);
//     }, 1200); // milliseconds (smooth but fast)

//     return () => clearInterval(interval);
//   }, []);

//   /* ---------------- COUNTDOWN TIMER ---------------- */
//   useEffect(() => {
//     const targetDate = new Date("2026-11-01T09:00:00").getTime();

//     const calculateTimeLeft = () => {
//       const now = new Date().getTime();
//       const difference = targetDate - now;

//       if (difference > 0) {
//         setTimeLeft({
//           days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//           hours: Math.floor(
//             (difference % (1000 * 60 * 60 * 24)) /
//               (1000 * 60 * 60)
//           ),
//           minutes: Math.floor(
//             (difference % (1000 * 60 * 60)) / (1000 * 60)
//           ),
//           seconds: Math.floor((difference % (1000 * 60)) / 1000),
//         });
//       }
//     };

//     calculateTimeLeft();
//     const timer = setInterval(calculateTimeLeft, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   /* ---------------- TIME BLOCK ---------------- */
//   const TimeBlock = ({ value, label }: { value: number; label: string }) => (
//     <div className="text-center">
//       <div className="bg-primary text-primary-foreground text-3xl md:text-4xl font-serif font-bold w-16 md:w-20 h-16 md:h-20 rounded-xl flex items-center justify-center shadow-lg">
//         {value.toString().padStart(2, "0")}
//       </div>
//       <div className="text-xs md:text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">
//         {label}
//       </div>
//     </div>
//   );

//   return (
//     <section className="section-padding bg-muted">
//       <div className="container-section">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
          
//           {/* ---------------- IMAGE SECTION ---------------- */}
//           <div className="relative rounded-2xl overflow-hidden shadow-elevated aspect-[4/3] bg-muted flex items-center justify-center">
//             <img
//               src={images[currentImageIndex]}
//               alt="Northern Women Summit"
//               loading="lazy"
//               className="
//                 max-w-full
//                 max-h-full
//                 object-contain
//                 transition-opacity
//                 duration-700
//                 ease-in-out
//               "
//               sizes="(max-width: 768px) 100vw, 50vw"
//             />

//             <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-medium text-sm">
//               Featured Event
//             </div>
//           </div>

//           {/* ---------------- CONTENT SECTION ---------------- */}
//           <div>
//             <span className="text-secondary font-medium text-sm uppercase tracking-wider">
//               Upcoming Event
//             </span>

//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
//               Northern Women Summit 2026
//             </h2>

//             <p className="text-muted-foreground text-lg mb-6">
//               Join hundreds of Northern women for a day of inspiration,
//               networking, skill-building, and celebration. Together, we’ll
//               learn, grow, and strengthen our bonds as a community.
//             </p>

//             {/* Event Details */}
//             <div className="flex flex-wrap gap-6 mb-8">
//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Calendar size={20} className="text-primary" />
//                 <span>November 1st, 2026</span>
//               </div>

//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <MapPin size={20} className="text-primary" />
//                 <span>Northern Nigeria</span>
//               </div>

//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Users size={20} className="text-primary" />
//                 <span>500+ Attendees Expected</span>
//               </div>
//             </div>

//             {/* Countdown */}
//             <div className="mb-8">
//               <p className="text-sm font-medium text-foreground mb-4">
//                 Event starts in:
//               </p>
//               <div className="flex gap-4 flex-wrap">
//                 <TimeBlock value={timeLeft.days} label="Days" />
//                 <TimeBlock value={timeLeft.hours} label="Hours" />
//                 <TimeBlock value={timeLeft.minutes} label="Mins" />
//                 <TimeBlock value={timeLeft.seconds} label="Secs" />
//               </div>
//             </div>

//             <Button variant="gold" size="xl" asChild>
//               <Link to="/events" className="flex items-center gap-2">
//                 Register Now
//                 <ArrowRight size={20} />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventHighlight;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

/* ================= TYPES ================= */

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/* ================= SUPABASE IMAGES ================= */

const images: string[] = [
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/summit-event.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count1.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count2.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count3.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count4.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count5.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count6.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count7.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count9.jpg",
  "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/count10.jpg",
];

/* ================= COMPONENT ================= */

const EventHighlight = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /* ---------------- IMAGE AUTO ROTATION ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 250);
    }, 1800); // smooth & mobile-safe timing

    return () => clearInterval(interval);
  }, []);

  /* ---------------- COUNTDOWN TIMER ---------------- */
  useEffect(() => {
    const targetDate = new Date("2026-11-01T09:00:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) /
              (1000 * 60 * 60)
          ),
          minutes: Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          ),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ---------------- TIME BLOCK ---------------- */
  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div className="bg-primary text-primary-foreground text-3xl md:text-4xl font-serif font-bold w-16 md:w-20 h-16 md:h-20 rounded-xl flex items-center justify-center shadow-lg">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  return (
    <section className="section-padding bg-muted">
      <div className="container-section">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ---------------- IMAGE SECTION ---------------- */}
          <div className="relative rounded-2xl overflow-hidden shadow-elevated aspect-[4/3] bg-muted flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt="Northern Women Summit"
              loading="lazy"
              className={`
                max-w-full
                max-h-full
                object-contain
                transition-opacity
                duration-500
                ease-in-out
                ${fade ? "opacity-100" : "opacity-0"}
              `}
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-medium text-sm">
              Featured Event
            </div>
          </div>

          {/* ---------------- CONTENT SECTION ---------------- */}
          <div>
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Upcoming Event
            </span>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
              Northern Women Summit 2026
            </h2>

            <p className="text-muted-foreground text-lg mb-6">
              Join hundreds of Northern women for a day of inspiration,
              networking, skill-building, and celebration. Together, we’ll
              learn, grow, and strengthen our bonds as a community.
            </p>

            {/* Event Details */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={20} className="text-primary" />
                <span>November 1st, 2026</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={20} className="text-primary" />
                <span>Northern Nigeria</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={20} className="text-primary" />
                <span>500+ Attendees Expected</span>
              </div>
            </div>

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-sm font-medium text-foreground mb-4">
                Event starts in:
              </p>
              <div className="flex gap-4 flex-wrap">
                <TimeBlock value={timeLeft.days} label="Days" />
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <TimeBlock value={timeLeft.minutes} label="Mins" />
                <TimeBlock value={timeLeft.seconds} label="Secs" />
              </div>
            </div>

            <Button variant="gold" size="xl" asChild>
              <Link to="/events" className="flex items-center gap-2">
                Register Now
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EventHighlight;
