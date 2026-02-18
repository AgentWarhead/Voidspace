import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy — Voidspace',
  description: 'Rules for responsible use of Voidspace and Sanctum. No malicious contracts, no abuse of AI tools, no exploitation of the platform or its users.',
  alternates: { canonical: 'https://voidspace.io/legal/acceptable-use' },
  openGraph: {
    title: 'Acceptable Use Policy — Voidspace',
    description: 'Rules for responsible use of Voidspace and Sanctum. Build responsibly on NEAR Protocol.',
    url: 'https://voidspace.io/legal/acceptable-use',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Acceptable Use Policy — Voidspace',
    description: 'Rules for responsible use of Voidspace — no malicious contracts, no platform abuse.',
    creator: '@VoidSpaceIO',
  },
};

export default function AcceptableUsePage() {
  return (
    <article className="legal-content">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">Acceptable Use Policy</h1>
        <p className="text-xs sm:text-sm text-text-muted">Last updated: February 2026</p>
      </header>

      <Section title="Purpose">
        <p>
          This Acceptable Use Policy (&quot;AUP&quot;) outlines the rules and expectations for using Voidspace,
          including Sanctum, Observatory, and all other features. By using the Platform, you agree to comply
          with this AUP in addition to our <a href="/legal/terms" className="text-near-green hover:underline">Terms of Service</a>.
        </p>
      </Section>

      <Section title="Prohibited Activities">
        <p>You may <strong className="text-red-400">NOT</strong> use Voidspace to:</p>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">Malicious Smart Contracts</h3>
        <ul>
          <li>Create contracts designed to steal funds, tokens, or NFTs from other users</li>
          <li>Build rug-pull mechanisms, hidden mint functions, or deceptive token contracts</li>
          <li>Deploy contracts intended to exploit vulnerabilities in other protocols</li>
          <li>Create contracts for money laundering, sanctions evasion, or terrorist financing</li>
        </ul>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">Exploits &amp; Attacks</h3>
        <ul>
          <li>Attempt to hack, exploit, or compromise Voidspace infrastructure</li>
          <li>Perform denial-of-service attacks against the Platform</li>
          <li>Attempt to access other users&apos; data, sessions, or wallet connections</li>
          <li>Probe for vulnerabilities without explicit written authorization</li>
          <li>Attempt to bypass rate limits, paywalls, or access controls</li>
        </ul>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">AI Feature Abuse</h3>
        <ul>
          <li>Prompt injection attacks to bypass Sanctum&apos;s safety guardrails</li>
          <li>Using AI features to generate harmful, illegal, or deceptive content</li>
          <li>Automated scraping or bulk querying of AI features</li>
          <li>Attempting to extract training data or model weights</li>
          <li>Misrepresenting AI-generated code as professionally audited or verified</li>
        </ul>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">Illegal Activity</h3>
        <ul>
          <li>Any activity that violates applicable local, state, national, or international law</li>
          <li>Creating tools for illegal gambling, unregistered securities, or unlicensed financial services</li>
          <li>Facilitating the sale of illegal goods or services</li>
          <li>Infringing on intellectual property rights of others</li>
        </ul>

        <h3 className="text-lg font-medium text-text-primary mt-4 mb-2">Harmful Content</h3>
        <ul>
          <li>Uploading or generating malware, viruses, or malicious code</li>
          <li>Distributing spam, phishing content, or deceptive materials</li>
          <li>Harassment, hate speech, or threatening behavior toward other users</li>
          <li>Impersonating Voidspace team members, NEAR Foundation, or other projects</li>
        </ul>
      </Section>

      <Section title="Responsible Use of Sanctum">
        <p>When using Sanctum (AI smart contract builder), you agree to:</p>
        <ul>
          <li><strong>Review all generated code</strong> before deployment — AI output may contain errors</li>
          <li><strong>Test on testnet first</strong> before any mainnet deployment</li>
          <li><strong>Get a professional audit</strong> for any contract handling real funds</li>
          <li><strong>Not misrepresent</strong> AI-generated code as manually written or professionally audited</li>
          <li><strong>Accept full responsibility</strong> for any contracts you deploy</li>
          <li><strong>Be 18 or older</strong> to use Sanctum and AI features</li>
        </ul>
      </Section>

      <Section title="Rate Limits &amp; Fair Use">
        <p>
          To ensure a good experience for all users, we may impose rate limits on API calls, Sanctum sessions,
          and other features. Attempting to circumvent these limits is a violation of this AUP.
        </p>
      </Section>

      <Section title="Reporting Violations">
        <p>
          If you discover a violation of this AUP, please email us at{' '}
          <a href="mailto:team@voidspace.io" className="text-near-green hover:underline">
            team@voidspace.io
          </a>{' '}
          or report it to us on X at{' '}
          <a href="https://x.com/VoidSpaceIO" target="_blank" rel="noopener noreferrer" className="text-near-green hover:underline">
            @VoidSpaceIO
          </a>.
          We take reports seriously and will investigate promptly.
        </p>
      </Section>

      <Section title="Enforcement">
        <p>Violation of this AUP may result in:</p>
        <ul>
          <li><strong>Warning</strong> — for minor or first-time violations</li>
          <li><strong>Temporary suspension</strong> — restricted access to features</li>
          <li><strong>Permanent termination</strong> — complete ban from the Platform</li>
          <li><strong>Legal action</strong> — for serious violations involving illegal activity</li>
        </ul>
        <p>
          We reserve the right to take action at our sole discretion, with or without notice. Decisions regarding
          enforcement are final.
        </p>
      </Section>

      <Section title="Changes to This Policy">
        <p>
          We may update this AUP as the Platform evolves. Material changes will be indicated by updating the
          &quot;Last updated&quot; date. Continued use after changes constitutes acceptance.
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
