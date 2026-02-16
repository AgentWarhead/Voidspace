import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Voidspace',
  description: 'Cookie Policy for Voidspace — what cookies we use and why.',
};

export default function CookiesPage() {
  return (
    <article className="legal-content">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">Cookie Policy</h1>
        <p className="text-xs sm:text-sm text-text-muted">Last updated: February 2026</p>
      </header>

      <Section title="What Are Cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a website. They help the site remember
          your preferences and understand how you use the service. Voidspace uses a minimal set of cookies to
          provide analytics and essential functionality.
        </p>
      </Section>

      <Section title="Cookies We Use">
        <div className="overflow-x-auto my-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-xs sm:text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-white/[0.1]">
                <th className="text-left py-3 pr-3 sm:pr-4 text-text-primary font-medium">Cookie</th>
                <th className="text-left py-3 pr-3 sm:pr-4 text-text-primary font-medium">Provider</th>
                <th className="text-left py-3 pr-3 sm:pr-4 text-text-primary font-medium">Purpose</th>
                <th className="text-left py-3 text-text-primary font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/[0.05]">
                <td className="py-3 pr-4 font-mono text-xs text-near-green/80">_ga</td>
                <td className="py-3 pr-4">Google Analytics</td>
                <td className="py-3 pr-4">Distinguishes unique users</td>
                <td className="py-3">2 years</td>
              </tr>
              <tr className="border-b border-white/[0.05]">
                <td className="py-3 pr-4 font-mono text-xs text-near-green/80">_ga_T0WSNESD0W</td>
                <td className="py-3 pr-4">Google Analytics</td>
                <td className="py-3 pr-4">Maintains session state (GA4)</td>
                <td className="py-3">2 years</td>
              </tr>
              <tr className="border-b border-white/[0.05]">
                <td className="py-3 pr-4 font-mono text-xs text-near-green/80">_gid</td>
                <td className="py-3 pr-4">Google Analytics</td>
                <td className="py-3 pr-4">Distinguishes users (24h)</td>
                <td className="py-3">24 hours</td>
              </tr>
              <tr className="border-b border-white/[0.05]">
                <td className="py-3 pr-4 font-mono text-xs text-near-green/80">__stripe_mid</td>
                <td className="py-3 pr-4">Stripe</td>
                <td className="py-3 pr-4">Fraud prevention for payments</td>
                <td className="py-3">1 year</td>
              </tr>
              <tr className="border-b border-white/[0.05]">
                <td className="py-3 pr-4 font-mono text-xs text-near-green/80">__stripe_sid</td>
                <td className="py-3 pr-4">Stripe</td>
                <td className="py-3 pr-4">Payment session identifier</td>
                <td className="py-3">30 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Cookie Categories">
        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">Essential Cookies</h3>
        <p>
          These cookies are necessary for the Platform to function properly. They include session management,
          security tokens, and wallet connection state. You cannot opt out of essential cookies as the Platform
          would not work without them.
        </p>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">Analytics Cookies</h3>
        <p>
          We use <strong>Google Analytics 4</strong> (measurement ID: <code className="text-near-green/80 bg-near-green/10 px-1.5 py-0.5 rounded text-sm">G-T0WSNESD0W</code>)
          to understand how visitors use Voidspace. This helps us improve the Platform. Analytics data is aggregated
          and does not personally identify you.
        </p>
        <p>Data collected by GA4 includes:</p>
        <ul>
          <li>Pages visited and time spent</li>
          <li>Features used (e.g., Sanctum sessions, Observatory views)</li>
          <li>Device type, browser, and general geographic region</li>
          <li>Referral source (how you found Voidspace)</li>
        </ul>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">Payment Cookies</h3>
        <p>
          If you subscribe to Sanctum Pro, <strong>Stripe</strong> sets cookies for fraud prevention and payment
          processing. These cookies are only active during and after payment interactions. See{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-near-green hover:underline">
            Stripe&apos;s Privacy Policy
          </a>{' '}
          for details.
        </p>
      </Section>

      <Section title="How to Manage Cookies">
        <p>You can control cookies through your browser settings:</p>
        <ul>
          <li><strong>Block all cookies</strong> — may break Platform functionality</li>
          <li><strong>Block third-party cookies</strong> — will disable analytics but Platform will still work</li>
          <li><strong>Clear cookies</strong> — removes all stored cookies (you may need to reconnect your wallet)</li>
        </ul>
        <p>
          To opt out of Google Analytics specifically, you can install the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-near-green hover:underline">
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>
      </Section>

      <Section title="Do Not Track">
        <p>
          We currently do not respond to &quot;Do Not Track&quot; (DNT) browser signals. However, you can opt out of
          analytics tracking using the methods described above.
        </p>
      </Section>

      <Section title="Changes to This Policy">
        <p>
          We may update this Cookie Policy as our use of cookies evolves. Changes will be reflected by the
          &quot;Last updated&quot; date at the top of this page.
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
