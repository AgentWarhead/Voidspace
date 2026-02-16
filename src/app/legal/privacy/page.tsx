import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Voidspace',
  description: 'Privacy Policy for Voidspace — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <article className="legal-content">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">Privacy Policy</h1>
        <p className="text-xs sm:text-sm text-text-muted">Last updated: February 2026</p>
      </header>

      <Section title="1. Overview">
        <p>
          Voidspace (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This Privacy Policy explains what data we collect,
          how we use it, and your rights regarding that data. We believe in <strong className="text-near-green">minimal data collection</strong> —
          we only collect what&apos;s necessary to provide and improve our services.
        </p>
      </Section>

      <Section title="2. Data We Collect">
        <p>We collect the following categories of information:</p>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">2.1 Wallet Information</h3>
        <ul>
          <li>NEAR wallet addresses connected to the Platform</li>
          <li>On-chain transaction data related to Sanctum deployments (publicly available on-chain)</li>
        </ul>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">2.2 Usage Analytics</h3>
        <ul>
          <li>Page views, feature usage, and navigation patterns</li>
          <li>Sanctum session data (categories selected, tokens used — not conversation content)</li>
          <li>Device type, browser, and general location (country level)</li>
          <li>Collected via Google Analytics 4 (GA4: <code className="text-near-green/80 bg-near-green/10 px-1.5 py-0.5 rounded text-sm">G-T0WSNESD0W</code>)</li>
        </ul>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">2.3 Payment Information</h3>
        <ul>
          <li>For Sanctum Pro subscribers: payment details are processed and stored by <strong>Stripe</strong></li>
          <li>We do not store credit card numbers or full payment details on our servers</li>
          <li>We may retain transaction records (amount, date, subscription status)</li>
        </ul>
      </Section>

      <Section title="3. What We Do NOT Collect">
        <ul>
          <li>Private keys or wallet seed phrases — <strong>never</strong></li>
          <li>Full conversation transcripts from Sanctum sessions (processed in real-time, not stored long-term)</li>
          <li>Personal identification documents</li>
          <li>Email addresses (unless voluntarily provided for support)</li>
        </ul>
      </Section>

      <Section title="4. How We Use Your Data">
        <ul>
          <li>To provide, maintain, and improve Platform features</li>
          <li>To track usage patterns and optimize user experience</li>
          <li>To process subscription payments via Stripe</li>
          <li>To detect and prevent abuse, fraud, or violations of our Terms</li>
          <li>To generate aggregated, anonymized analytics (no individual identification)</li>
        </ul>
      </Section>

      <Section title="5. Cookies &amp; Tracking">
        <p>
          We use cookies for analytics and essential Platform functionality. See our{' '}
          <a href="/legal/cookies" className="text-near-green hover:underline">Cookie Policy</a> for full details
          on what cookies we use, including Google Analytics and Stripe cookies.
        </p>
      </Section>

      <Section title="6. Third-Party Services">
        <p>We use the following third-party services that may process your data:</p>
        <ul>
          <li><strong>Google Analytics (GA4)</strong> — usage analytics and traffic measurement</li>
          <li><strong>Stripe</strong> — payment processing for subscriptions</li>
          <li><strong>NEAR Protocol</strong> — blockchain interactions (public by nature)</li>
          <li><strong>Vercel</strong> — hosting and edge network delivery</li>
        </ul>
        <p>Each service has its own privacy policy. We encourage you to review them.</p>
      </Section>

      <Section title="7. Data Retention">
        <p>
          Analytics data is retained according to Google Analytics default retention policies (up to 14 months).
          Payment records are retained as required by financial regulations. Wallet connection data may be retained
          for the duration of your active use of the Platform.
        </p>
      </Section>

      <Section title="8. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Request access to your personal data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of analytics tracking (see Cookie Policy)</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>
          To exercise these rights, email us at{' '}
          <a href="mailto:team@voidspace.io" className="text-near-green hover:underline">
            team@voidspace.io
          </a>{' '}
          or contact us on X at{' '}
          <a href="https://x.com/voidspacenear" target="_blank" rel="noopener noreferrer" className="text-near-green hover:underline">
            @VoidSpaceNear
          </a>.
        </p>
      </Section>

      <Section title="9. Data Security">
        <p>
          We implement reasonable security measures to protect your data. However, no method of transmission over the
          Internet is 100% secure. We cannot guarantee absolute security of data transmitted to or from the Platform.
        </p>
      </Section>

      <Section title="10. Children&apos;s Privacy">
        <p>
          Voidspace does not knowingly collect data from children under 13. Sanctum and on-chain features require users
          to be 18 or older. If we discover that we have collected data from a child under 13, we will delete it promptly.
        </p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be reflected by the &quot;Last updated&quot; date
          at the top of this page.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 sm:mb-3">{title}</h2>
      <div className="space-y-3 text-text-secondary text-sm sm:text-[15px] leading-relaxed max-w-prose [&_ul]:list-disc [&_ul]:pl-5 sm:[&_ul]:pl-6 [&_ul]:space-y-1.5 [&_li]:text-text-secondary [&_strong]:text-text-primary [&_h3]:text-text-primary [&_a]:min-h-[44px] [&_a]:inline-flex [&_a]:items-center break-words">
        {children}
      </div>
    </section>
  );
}
