import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { FileText, Shield, CreditCard, AlertCircle, RefreshCw, XCircle, Scale, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use - WatchPulse',
  description: 'WatchPulse Terms of Use and End User License Agreement (EULA). Read about our subscription terms, auto-renewal policies, and user responsibilities.',
  openGraph: {
    title: 'Terms of Use - WatchPulse',
    description: 'WatchPulse Terms of Use, EULA, and subscription policies.',
    url: 'https://watchpulseapp.com/terms',
  },
  alternates: {
    canonical: 'https://watchpulseapp.com/terms',
  },
};

export default function TermsPage() {
  const lastUpdated = 'March 8, 2026';

  return (
    <main className="min-h-screen bg-background-dark">
      <Header hideLanguageSwitcher forceEnglish />

      <div className="pt-24 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-6">
                <FileText className="w-8 h-8 text-brand-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Terms of Use
              </h1>
              <p className="text-text-secondary text-sm">
                End User License Agreement (EULA)
              </p>
              <p className="text-text-muted text-sm mt-2">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Introduction */}
            <section className="mb-10">
              <p className="text-text-secondary leading-relaxed">
                These Terms of Use (&quot;Terms&quot;) constitute a legally binding agreement between you and
                WatchPulse (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) governing your use of the WatchPulse mobile
                application and related services. By downloading, installing, or using WatchPulse,
                you agree to be bound by these Terms. If you do not agree to these Terms, do not use
                the application.
              </p>
            </section>

            {/* Acceptable Use */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Acceptable Use</h2>
              </div>
              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">&bull;</span>
                    Use the app for personal, non-commercial purposes only
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">&bull;</span>
                    Do not use the app for any illegal or unauthorized purpose
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">&bull;</span>
                    Do not attempt to interfere with, compromise, or disrupt the app or its servers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">&bull;</span>
                    Do not send spam, unsolicited messages, or harass other users
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">&bull;</span>
                    Respect other users&apos; privacy and personal information
                  </li>
                </ul>
              </div>
            </section>

            {/* Premium Subscription Terms */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">WatchPulse Premium - Subscription Terms</h2>
              </div>

              <div className="space-y-6">
                {/* Subscription Plans */}
                <div className="bg-background-card rounded-xl border border-purple-500/20 p-6">
                  <h3 className="text-lg font-semibold text-purple-400 mb-4">Subscription Plans</h3>
                  <p className="text-text-secondary mb-4">
                    WatchPulse Premium is an auto-renewable subscription service that provides enhanced features
                    including ad-free experience, 20+ premium themes, unlimited collections, and collaborative
                    collections. The following subscription plans are available:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">Monthly</h4>
                          <p className="text-text-muted text-sm">1 month subscription period</p>
                        </div>
                        <span className="text-purple-400 font-bold">.99/month</span>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">6 Months</h4>
                          <p className="text-text-muted text-sm">6 month subscription period</p>
                        </div>
                        <span className="text-purple-400 font-bold">.99/6 months</span>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">Yearly</h4>
                          <p className="text-text-muted text-sm">12 month subscription period</p>
                        </div>
                        <span className="text-purple-400 font-bold">4.99/year</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-muted text-sm mt-4">
                    Prices shown are in USD. Actual prices may vary by region and currency. The price displayed
                    in the App Store at the time of purchase will be the price charged.
                  </p>
                </div>

                {/* Auto-Renewal */}
                <div className="bg-background-card rounded-xl border border-purple-500/20 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-purple-400">Auto-Renewal</h3>
                  </div>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">&bull;</span>
                      Your subscription automatically renews at the end of each subscription period unless cancelled at least 24 hours before the end of the current period.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">&bull;</span>
                      Your Apple ID or Google Play account will be charged for renewal within 24 hours prior to the end of the current period at the same price.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">&bull;</span>
                      You can manage and cancel your subscription at any time through your device&apos;s subscription settings (App Store or Google Play Store).
                    </li>
                  </ul>
                </div>

                {/* Cancellation */}
                <div className="bg-background-card rounded-xl border border-purple-500/20 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <XCircle className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-purple-400">Cancellation</h3>
                  </div>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">&bull;</span>
                      You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">&bull;</span>
                      No refunds will be provided for any unused portion of a subscription period.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">&bull;</span>
                      Upon cancellation, you will continue to have access to premium features until the end of your current billing period.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">&bull;</span>
                      <strong className="text-white">iOS:</strong> Go to Settings &gt; Apple ID &gt; Subscriptions &gt; WatchPulse &gt; Cancel Subscription
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">&bull;</span>
                      <strong className="text-white">Android:</strong> Go to Google Play Store &gt; Menu &gt; Subscriptions &gt; WatchPulse &gt; Cancel
                    </li>
                  </ul>
                </div>

                {/* Payment */}
                <div className="bg-background-card rounded-xl border border-purple-500/20 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-purple-400">Payment</h3>
                  </div>
                  <p className="text-text-secondary">
                    Payment will be charged to your Apple ID account (iOS) or Google Play account (Android)
                    at confirmation of purchase. The subscription automatically renews unless auto-renew is
                    turned off at least 24 hours before the end of the current period. Your account will be
                    charged for renewal within 24 hours prior to the end of the current period.
                  </p>
                </div>
              </div>
            </section>

            {/* Content Disclaimer */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Content Disclaimer</h2>
              </div>
              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">&bull;</span>
                    Movie and TV show data is provided by The Movie Database (TMDB) API. We do not guarantee the accuracy or completeness of this data.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">&bull;</span>
                    Streaming availability information may not always be accurate and is subject to change without notice.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">&bull;</span>
                    WatchPulse does not host, stream, or provide any movie or TV show content. We only provide information and recommendations.
                  </li>
                </ul>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Governing Law</h2>
              </div>
              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <p className="text-text-secondary">
                  These Terms shall be governed by and construed in accordance with the laws of the
                  Republic of Turkey. Any disputes arising from these Terms shall be subject to the
                  exclusive jurisdiction of the courts of Istanbul, Turkey.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-10">
              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Changes to These Terms</h2>
                <p className="text-text-secondary">
                  We reserve the right to modify these Terms at any time. We will notify users of any
                  material changes by updating the &quot;Last updated&quot; date and, where appropriate, providing
                  notice through the app. Your continued use of WatchPulse after such changes constitutes
                  your acceptance of the new Terms.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <div className="bg-brand-primary/10 rounded-xl border border-brand-primary/30 p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                <p className="text-text-secondary mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <a
                  href="mailto:watchpulseapp@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  watchpulseapp@gmail.com
                </a>
              </div>
            </section>

            {/* Related Links */}
            <div className="text-center space-y-3">
              <Link
                href="/privacy"
                className="text-brand-primary hover:text-brand-accent transition-colors block"
              >
                Privacy Policy &rarr;
              </Link>
              <Link
                href="/"
                className="text-text-muted hover:text-brand-primary transition-colors block"
              >
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Footer forceEnglish />
    </main>
  );
}
