'use client';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ShowcaseSections from "@/components/sections/ShowcaseSections";
import SocialBand from "@/components/sections/SocialBand";
import FeatureGrid from "@/components/sections/FeatureGrid";
import HowItWorks from "@/components/sections/HowItWorks";
import FAQ from "@/components/sections/FAQ";
import DownloadSection from "@/components/sections/DownloadSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-deep">
      <Header />
      <HeroSection />
      <ShowcaseSections />
      {/* After the five solo features, the turn to "and there are other people
          here". Its own banded background separates the two halves. */}
      <SocialBand />
      <FeatureGrid />
      <HowItWorks />
      <FAQ />
      <DownloadSection />
      <Footer />
    </main>
  );
}
