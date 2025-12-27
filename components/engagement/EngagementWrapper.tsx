'use client';

import ExitIntentPopup from './ExitIntentPopup';
import SocialProofNotification from './SocialProofNotification';
import FloatingCTA from './FloatingCTA';
import CountdownBanner from './CountdownBanner';
import PushNotificationOptIn from './PushNotificationOptIn';

export default function EngagementWrapper() {
  return (
    <>
      {/* Countdown banner at top */}
      <CountdownBanner />

      {/* Exit intent popup */}
      <ExitIntentPopup />

      {/* Social proof notifications */}
      <SocialProofNotification />

      {/* Floating CTA button */}
      <FloatingCTA />

      {/* Push notification opt-in */}
      <PushNotificationOptIn />
    </>
  );
}
