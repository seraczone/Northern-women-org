import Layout from "@/components/layout/Layout";
import { HeartHandshake } from "lucide-react";

const SupportUs = () => {
	return (
		<Layout>
			{/* Hero Section */}
			<section className="bg-gradient-hero py-20">
				<div className="container-section">
					<div className="max-w-3xl">
						<span className="text-secondary font-medium text-sm uppercase tracking-wider">
							Support Us
						</span>
						<h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-3 mb-6">
							Support Our Work
						</h1>
						<p className="text-lg text-primary-foreground/90">
							Your support helps us empower Northern women and girls, strengthen communities,
							and create lasting impact.
						</p>
					</div>
				</div>
			</section>

			{/* Support Information */}
			<section className="section-padding bg-background">
				<div className="container-section">
					<div className="max-w-3xl mx-auto text-center">
						<div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
							<HeartHandshake className="w-10 h-10 text-primary" />
						</div>

						<h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
							Support Us by Paying Into the Account Below
						</h2>

						<p className="text-muted-foreground text-lg mb-10">
							Every contribution—big or small—directly supports our programs, initiatives,
							and outreach efforts across Northern Nigeria.
						</p>

						{/* Bank Details Card */}
						<div className="bg-muted rounded-2xl p-10 shadow-card text-left max-w-xl mx-auto">
							<div className="space-y-6">
								<div>
									<p className="text-sm uppercase tracking-wider text-muted-foreground">
										Account Name
									</p>
									<p className="text-xl font-semibold text-foreground">
										Northern Women Initiative
									</p>
								</div>

								<div>
									<p className="text-sm uppercase tracking-wider text-muted-foreground">
										Account Number
									</p>
									<p className="text-xl font-semibold text-foreground">
										0000000000
									</p>
								</div>

								<div>
									<p className="text-sm uppercase tracking-wider text-muted-foreground">
										Bank Name
									</p>
									<p className="text-xl font-semibold text-foreground">
										Jaiz Bank
									</p>
								</div>
							</div>
						</div>

						<p className="text-muted-foreground text-lg mt-10 italic">
							May your support be rewarded with lasting impact and blessings.
						</p>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default SupportUs;
