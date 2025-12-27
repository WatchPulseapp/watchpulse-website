import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WaitlistSection from "@/components/sections/WaitlistSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import MoodSection from "@/components/sections/MoodSection";
import ScreenshotsSection from "@/components/sections/ScreenshotsSection";
import ContactSection from "@/components/sections/ContactSection";
import EngagementWrapper from "@/components/engagement/EngagementWrapper";
import CountdownBanner from "@/components/engagement/CountdownBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-dark">
      {/* Fixed Header */}
      <Header />

      {/* Countdown Banner - Right below header */}
      <div className="pt-16 md:pt-20">
        <CountdownBanner />
      </div>

      {/* Main Content */}
      <HeroSection />
      <WaitlistSection />
      <FeaturesSection />
      <MoodSection />
      <ScreenshotsSection />
      <ContactSection />
      <Footer />

      {/* Engagement components: exit popup, social proof, floating CTA, push notification */}
      <EngagementWrapper />
    </main>
  );
}
