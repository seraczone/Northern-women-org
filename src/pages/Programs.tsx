import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Users,
  Home,
  Handshake,
} from "lucide-react";

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

const Programs = () => {
  return (
    <Layout>
      {/* Hero Section */}
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

      {/* Core Initiatives */}
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
                  <p className="text-muted-foreground text-lg">{item.desc}</p>
                </div>
              ))}

              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer md:col-span-2">
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

      {/* Weekly Motivation */}
      <section id="motivation" className="section-padding bg-muted">
        <div className="container-section">
          <div className="max-w-4xl mx-auto text-center">
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
              <p className="text-lg italic text-muted-foreground mb-4">
                "Success is not just about what you accomplish in your life; it's
                about what you inspire others to do."
              </p>
              <p className="font-serif font-semibold text-foreground">
                — This Week's Message
              </p>
            </div>
            <Button variant="gold" size="lg" className="mt-8" asChild>
              <Link to="/get-involved">
                Subscribe to Weekly Messages
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Structure */}
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
              A dedicated team working together to deliver impact across all our
              initiatives.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamStructure.map((dept) => (
              <div
                key={dept.title}
                className="bg-card rounded-2xl p-8 border border-border card-hover"
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

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-section text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join our programs and become part of a movement transforming lives
            across the North.
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
};

export default Programs;
