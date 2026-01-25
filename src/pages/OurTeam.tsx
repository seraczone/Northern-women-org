import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

/* ================= FOUNDER ================= */
const founderMember = {
  name: "Mrs. MARYAM MOHAMMED NASIR",
  role: "Founder",
  image:
    "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/founder.jpg",
};

/* ================= TRUSTEES ================= */
const trustees = [
  {
    name: "AMB. ZAINAB BELLO MAHMOOD",
    role: "Trustee",
    image:
      "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/Amb.jpg",
    objectPosition: "center 20%",
  },
  {
    name: "AHMAD SA'AD",
    role: "Trustee",
    image:
      "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/Ahmad.jpg",
    objectPosition: "center 15%",
  },
];

/* ================= LEADERSHIP ================= */
const leadership = [
  {
    name: "ALI MUHAMMAD SA'AD",
    role: "Secretary & Trustee",
    image:
      "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/Ali.jpg",
    objectPosition: "center top",
  },
  {
    name: "KARIMA ZAILANI",
    role: "Program Lead & Trustee",
    image:
      "https://ponlvomzjoxsfrrdzwqz.supabase.co/storage/v1/object/public/assets/karima.jpg",
    objectPosition: "center",
  },
];

export default function OurTeam() {
  return (
    <Layout>
      {/* HERO */}
      <section className="bg-gradient-hero py-20">
        <div className="container-section">
          <span className="text-secondary uppercase text-sm tracking-wider">
            Our Team
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-4 mb-6">
            Northern Women Initiative Team
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-3xl">
            A dedicated leadership team driving impact across all our programs.
          </p>
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">
          Meet the Team
        </h2>

        {/* FOUNDER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-24"
        >
          <div className="max-w-sm text-center">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <img
                src={founderMember.image}
                alt={founderMember.name}
                className="w-full h-[440px] object-cover object-top"
              />
            </div>

            <div className="h-1 w-16 bg-primary mx-auto mt-4 rounded-full" />
            <h3 className="mt-5 text-xl font-semibold">
              {founderMember.name}
            </h3>
            <p className="text-gray-600">{founderMember.role}</p>
          </div>
        </motion.div>

        {/* TRUSTEES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 mb-24 max-w-3xl mx-auto">
          {trustees.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="overflow-hidden rounded-2xl shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[280px] object-cover"
                  style={{ objectPosition: member.objectPosition }}
                />
              </div>

              <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full" />
              <h3 className="mt-4 text-lg font-semibold">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* SECRETARY & PROGRAM LEAD (SAME SIZE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 max-w-3xl mx-auto">
          {leadership.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="overflow-hidden rounded-2xl shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[320px] object-cover"
                  style={{ objectPosition: member.objectPosition }}
                />
              </div>

              <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full" />
              <h3 className="mt-4 text-lg font-semibold">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
