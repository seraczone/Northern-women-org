import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Heart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const values = [
	{
		icon: Users,
		title: "Solidarity",
		description: "Standing together as one strong community of Northern women.",
	},
	{
		icon: BookOpen,
		title: "Growth",
		description: "Continuous learning and development for personal and professional success.",
	},
	{
		icon: Heart,
		title: "Faith",
		description: "Grounded in our beliefs and committed to positive change.",
	},
	{
		icon: Sparkles,
		title: "Impact",
		description: "Creating meaningful, lasting change in our communities.",
	},
];

const AboutSummary = () => {
	const [visibleCards, setVisibleCards] = useState<number[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			setVisibleCards((prev) => {
				const nextIndex = prev.length;
				if (nextIndex < values.length) {
					return [...prev, nextIndex];
				}
				clearInterval(interval);
				return prev;
			});
		}, 500); // Adjusted timing to 500ms for faster animation

		return () => clearInterval(interval);
	}, []);

	return (
		<section className="section-padding bg-background">
			<div className="container-section">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					{/* Left Content */}
					<div>
						<span className="text-secondary font-medium text-sm Titlecase tracking-wider">
							Who We Are
						</span>
						<h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
							A Movement of Northern Women{" "}
							<span className="text-primary">Rising Together</span>
						</h2>
						<p className="text-muted-foreground text-lg mb-6">
							Northern Women Initiative For Empowerment, Growth and Development
							is a purpose-driven organisation dedicated to uplifting, empowering,
							and celebrating Northern women. We are committed to creating spaces
							where women are seen, heard, and supported — where their dreams are
							nurtured, their voices amplified, and their potential fully
							realised.
						</p>
						<p className="text-muted-foreground mb-8">
							Founded in January 2025, our initiative has, in just one year,
							grown into a vibrant movement. We proudly support over 300 registered
							women in Nigeria and have reached hundreds more through impactful
							events, including our first Northern WOMEN Meet & Greet in June 2025
							and the Northern Women’s Summit 2025 in November, which brought
							together over 500 women from diverse backgrounds — entrepreneurs,
							leaders, politicians, businesswomen, and knowledge-bearers — in a
							celebration of unity, growth, and empowerment. The summit, now
							planned as an annual flagship event, symbolizes our commitment to
							building lasting platforms for connection and development.
						</p>
						<p className="text-muted-foreground mb-8">
							We believe that every woman carries immense potential, purpose, and
							power. Through mentorship, capacity building, advocacy, and tailored
							programmes, we equip women with the tools, networks, and confidence
							they need to excel in business, leadership, and personal growth,
							while creating meaningful impact in their communities.
						</p>
						<p className="text-muted-foreground mb-8">
							More than an organisation, we are a movement, a sisterhood, and a
							bridge across continents. While our registered membership is
							currently in Nigeria, we are actively expanding to Scotland and
							across the UK, connecting Northern women at home and in the
							diaspora, so that together, we can grow, learn, and thrive.
						</p>
						<p className="text-muted-foreground mb-8">
							At Northern Women Initiative, we do not simply empower women — we
							celebrate them, walk with them, and champion their journey towards
							excellence, dignity, and leadership.
						</p>
						<Button variant="burgundy" size="lg" asChild>
							<Link to="/about">
								Learn Our Story
								<ArrowRight size={18} />
							</Link>
						</Button>
					</div>

					{/* Right - Values Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
						{values.map((value, index) => (
							<div
								key={value.title}
								className={`p-8 rounded-2xl card-hover transition-transform duration-300 ease-out ${
									visibleCards.includes(index)
										? "translate-x-0 opacity-100"
										: index % 2 === 0
										? "-translate-x-10 opacity-0"
										: "translate-x-10 opacity-0"
								} ${
									index % 2 === 0
										? "bg-muted"
										: "bg-card border border-border"
								}`}
								style={{ transitionDelay: `${index * 500}ms` }}
							>
								<div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
									<value.icon className="w-8 h-8 text-primary" />
								</div>
								<h3 className="font-serif text-xl font-semibold text-foreground mb-4">
									{value.title}
								</h3>
								<p className="text-md text-muted-foreground">
									{value.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutSummary;
