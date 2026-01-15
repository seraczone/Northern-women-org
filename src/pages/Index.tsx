import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutSummary from "@/components/home/AboutSummary";
import EventHighlight from "@/components/home/EventHighlight";
import QuickLinks from "@/components/home/QuickLinks";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSummary />
      <EventHighlight />
      <QuickLinks />
    </Layout>
  );
};

export default Index;
