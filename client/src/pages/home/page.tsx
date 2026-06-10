import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import HeroSection from "./components/HeroSection";
import TrustBar from "./components/TrustBar";
import FeaturedServices from "./components/FeaturedServices";
import WhyUs from "./components/WhyUs";
import DNASimulatorBanner from "./components/DNASimulatorBanner";
import TeamPreview from "./components/TeamPreview";
import FeaturedPackages from "./components/FeaturedPackages";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import { OffersTopStrip, OffersPopupBanner } from "./components/OffersBanner";

export default function Home() {
  return (
    <div className="min-h-screen" dir="rtl">
      <OffersTopStrip />
      <Navbar hasTopStrip />
      <HeroSection />
      <TrustBar />
      <FeaturedServices />
      <WhyUs />
      <DNASimulatorBanner />
      <TeamPreview />
      <FeaturedPackages />
      <Testimonials />
      <CTASection />
      <Footer />
      <OffersPopupBanner />
    </div>
  );
}
