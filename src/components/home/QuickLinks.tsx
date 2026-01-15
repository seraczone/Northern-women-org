import { Link } from "react-router-dom";
import { GraduationCap, Heart, Briefcase, MessageCircle, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: GraduationCap,
    title: "Women Empowerment Programs",
    description: "Leadership training, skill development, and career guidance for Northern women.",
    link: "/programs#empowerment",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MessageCircle,
    title: "Weekly Motivational Series",
    description: "Inspiring messages and guidance to keep you motivated throughout your journey.",
    link: "/programs#motivation",
    color: "bg-secondary/20 text-secondary-foreground",
  },
  {
    icon: Heart,
    title: "Charity & Community Work",
    description: "Outreach programs supporting vulnerable women and strengthening communities.",
    link: "/programs#charity",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Briefcase,
    title: "Northern Women Enterprise",
    description: "Business training, market access, and networking for women entrepreneurs.",
    link: "/programs#enterprise",
    color: "bg-secondary/20 text-secondary-foreground",
  },
];

const QuickLinks = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-section">
        <div className="text-center mb-12">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">Our Programs</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-4">
            How We Make a Difference
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Through our comprehensive programs, we address the diverse needs of Northern women 
            and create pathways to success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <Link
              key={program.title}
              to={program.link}
              className="group p-8 rounded-2xl bg-card border border-border card-hover"
            >
              <div className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center mb-6`}>
                <program.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {program.title}
              </h3>
              <p className="text-muted-foreground mb-4">{program.description}</p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <span>Learn More</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
