// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import Slider from "react-slick";
// import { motion } from "framer-motion";
// import heroImage1 from "@/assets/hero-women1.jpg";
// import heroImage2 from "@/assets/hero-women2.jpg";
// import heroImage3 from "@/assets/hero-women3.jpg";
// import heroImage4 from "@/assets/hero-women4.jpg";

// const HeroSection = () => {
//   const CustomPrevArrow = ({ onClick, className }: any) => {
//     return (
//       <button
//         className={className}
//         onClick={onClick}
//         aria-label="Previous slide"
//       >
//         <ArrowLeft size={24} />
//       </button>
//     );
//   };

//   const CustomNextArrow = ({ onClick, className }: any) => {
//     return (
//       <button
//         className={className}
//         onClick={onClick}
//         aria-label="Next slide"
//       >
//         <ArrowRight size={24} />
//       </button>
//     );
//   };

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     arrows: true,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//   };

//   return (
//     <section className="relative min-h-[90vh] flex items-center overflow-hidden">
//       {/* Background Carousel */}
//       <div className="absolute inset-0 z-0">
//         <Slider {...settings}>
//           <div>
//             <img
//               src={heroImage1}
//               alt="Empowered Northern Women 1"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <img
//               src={heroImage2}
//               alt="Empowered Northern Women 2"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <img
//               src={heroImage3}
//               alt="Empowered Northern Women 3"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <img
//               src={heroImage4}
//               alt="Empowered Northern Women 4"
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </Slider>
//         <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
//       </div>

//       {/* Content */}
//       <div className="container-section relative z-10 py-20">
//         <div className="max-w-3xl">
//           <motion.div
//             className="mb-6"
//             initial={{ opacity: 0, y: -30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//           >
//             <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-serif text-gradient-gold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-600 to-orange-500 tracking-wide text-center drop-shadow-lg mb-2">
//               Northern Women Initiative For Empowerment, Growth and Development.
//             </h2>
//           </motion.div>
//           <motion.h1
//             className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight mb-6 text-center"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//           >
//             Empowering Northern Women.{' '}
//             <span className="text-gradient-gold">Strengthening Communities.</span>
//           </motion.h1>

//           <motion.p
//             className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.5 }}
//           >
//             Building confidence, providing opportunities, and creating lasting impact across the North.
//             Together, we rise.
//           </motion.p>

//           <motion.div
//             className="flex flex-wrap gap-4"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 1 }}
//           >
//             <Button variant="hero" size="xl" asChild>
//               <Link to="/get-involved">
//                 Join the Initiative
//                 <ArrowRight size={20} />
//               </Link>
//             </Button>
//             <Button variant="heroOutline" size="xl" asChild>
//               <Link to="/about">Support the Mission</Link>
//             </Button>
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 1.5 }}
//           >
//             <div>
//               <div className="text-3xl md:text-4xl font-serif font-bold text-secondary">500+</div>
//               <div className="text-sm text-primary-foreground/70 mt-1">Women Empowered</div>
//             </div>
//             <div>
//               <div className="text-3xl md:text-4xl font-serif font-bold text-secondary">20+</div>
//               <div className="text-sm text-primary-foreground/70 mt-1">Communities Reached</div>
//             </div>
//             <div>
//               <div className="text-3xl md:text-4xl font-serif font-bold text-secondary">50+</div>
//               <div className="text-sm text-primary-foreground/70 mt-1">Programs Delivered</div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Slider from "react-slick";
import { motion } from "framer-motion";

const HeroSection = () => {
  const CustomPrevArrow = ({ onClick, className }: any) => {
    return (
      <button
        className={className}
        onClick={onClick}
        aria-label="Previous slide"
      >
        <ArrowLeft size={24} />
      </button>
    );
  };

  const CustomNextArrow = ({ onClick, className }: any) => {
    return (
      <button
        className={className}
        onClick={onClick}
        aria-label="Next slide"
      >
        <ArrowRight size={24} />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Slider {...settings}>
          <div>
            <img
              src="https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/hero-women1.jpg"
              alt="Empowered Northern Women 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/hero-women2.jpg"
              alt="Empowered Northern Women 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/hero-women3.jpg"
              alt="Empowered Northern Women 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/hero-women4.jpg"
              alt="Empowered Northern Women 4"
              className="w-full h-full object-cover"
            />
          </div>
        </Slider>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="container-section relative z-10 py-20">
        <div className="max-w-3xl">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-serif text-gradient-gold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-600 to-orange-500 tracking-wide text-center drop-shadow-lg mb-2">
              Northern Women Initiative For Empowerment, Growth and Development.
            </h2>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight mb-6 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Empowering Northern Women.{" "}
            <span className="text-gradient-gold">Strengthening Communities.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Building confidence, providing opportunities, and creating lasting impact across the North.
            Together, we rise.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/get-involved">
                Join the Initiative
                <ArrowRight size={20} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/about">Support the Mission</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div>
              <div className="text-3xl md:text-4xl font-serif font-bold text-secondary">500+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Women Empowered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-serif font-bold text-secondary">20+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Communities Reached</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-serif font-bold text-secondary">50+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Programs Delivered</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
