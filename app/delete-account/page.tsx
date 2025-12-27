import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Trash2, Mail, Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Delete Account - WatchPulse',
  description: 'Learn how to delete your WatchPulse account and all associated data. We respect your privacy and make account deletion simple.',
  openGraph: {
    title: 'Delete Account - WatchPulse',
    description: 'Learn how to delete your WatchPulse account and all associated data.',
    url: 'https://watchpulseapp.com/delete-account',
  },
  alternates: {
    canonical: 'https://watchpulseapp.com/delete-account',
  },
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-background-dark">
      <Header hideLanguageSwitcher forceEnglish />

      <div className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Delete Your Account
              </h1>
              <p className="text-lg text-text-secondary">
                We&apos;re sorry to see you go. Here&apos;s how to delete your WatchPulse account.
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-yellow-400 mb-2">
                    Important Information
                  </h2>
                  <p className="text-text-secondary">
                    Deleting your account is permanent and cannot be undone. All your data, including watchlists, preferences, and viewing history will be permanently removed.
                  </p>
                </div>
              </div>
            </div>

            {/* What Gets Deleted */}
            <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-primary" />
                What Gets Deleted
              </h2>
              <ul className="space-y-3">
                {[
                  'Your account profile and personal information',
                  'All watchlists and saved movies/TV shows',
                  'Viewing history and preferences',
                  'Mood-based recommendation data',
                  'All app settings and configurations',
                  'Any connected social accounts'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-text-secondary">
                    <CheckCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Delete */}
            <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                How to Delete Your Account
              </h2>

              {/* Method 1: In-App */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-brand-primary mb-4">
                  Method 1: Delete from the App
                </h3>
                <ol className="space-y-4">
                  {[
                    'Open the WatchPulse app on your device',
                    'Go to Settings (tap the gear icon)',
                    'Scroll down and tap "Account"',
                    'Select "Delete Account"',
                    'Confirm your decision by entering your password',
                    'Tap "Delete Permanently"'
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-text-secondary pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Method 2: Email */}
              <div>
                <h3 className="text-lg font-medium text-brand-primary mb-4">
                  Method 2: Request via Email
                </h3>
                <p className="text-text-secondary mb-4">
                  If you cannot access the app or prefer to request deletion via email:
                </p>
                <div className="bg-background-dark rounded-lg p-4 border border-brand-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-brand-primary" />
                    <span className="text-white font-medium">Send an email to:</span>
                  </div>
                  <a
                    href="mailto:support@watchpulseapp.com?subject=Account%20Deletion%20Request"
                    className="text-brand-accent hover:text-brand-gold transition-colors text-lg"
                  >
                    support@watchpulseapp.com
                  </a>
                  <p className="text-text-muted text-sm mt-3">
                    Please include &quot;Account Deletion Request&quot; in the subject line and provide the email address associated with your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6 mb-8">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-brand-primary flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Processing Time
                  </h2>
                  <p className="text-text-secondary">
                    Account deletion requests are processed within <span className="text-white font-medium">48 hours</span>.
                    You will receive a confirmation email once your account and all associated data have been permanently deleted.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Data Retention Policy
              </h2>
              <p className="text-text-secondary mb-4">
                After account deletion:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-brand-primary">•</span>
                  All personal data is permanently deleted from our servers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-primary">•</span>
                  Anonymized analytics data may be retained for service improvement
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-primary">•</span>
                  Legal compliance records may be kept as required by law
                </li>
              </ul>
            </div>

            {/* Need Help */}
            <div className="text-center">
              <p className="text-text-secondary mb-4">
                Having trouble or need assistance?
              </p>
              <a
                href="mailto:support@watchpulseapp.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </a>
            </div>

            {/* Back Link */}
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="text-text-muted hover:text-brand-primary transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Footer forceEnglish />
    </main>
  );
}
