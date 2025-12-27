import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WaitlistSection from "@/components/sections/WaitlistSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import MoodSection from "@/components/sections/MoodSection";
import ScreenshotsSection from "@/components/sections/ScreenshotsSection";
import ContactSection from "@/components/sections/ContactSection";
import EngagementWrapper from "@/components/engagement/EngagementWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-dark pt-10">
      {/* Engagement components: countdown, exit popup, social proof, floating CTA */}
      <EngagementWrapper />

      <Header />
      <HeroSection />
      <WaitlistSection />
      <FeaturesSection />
      <MoodSection />
      <ScreenshotsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
