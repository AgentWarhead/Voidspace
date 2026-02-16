import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | Voidspace',
  description: 'Disclaimer for Voidspace — important limitations and risk disclosures.',
};

export default function DisclaimerPage() {
  return (
    <article className="legal-content">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">Disclaimer</h1>
        <p className="text-xs sm:text-sm text-text-muted">Last updated: February 2026</p>
      </header>

      <Section title="General Disclaimer">
        <p>
          <strong className="text-amber-400">THE VOIDSPACE PLATFORM, INCLUDING ALL TOOLS, CONTENT, DATA, AND AI-GENERATED
          OUTPUT, IS PROVIDED &quot;AS-IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND</strong>, WHETHER EXPRESS,
          IMPLIED, OR STATUTORY.
        </p>
        <p>
          We make no representations or warranties regarding the accuracy, completeness, reliability, suitability,
          or availability of the Platform or any information, products, services, or related content contained on the Platform.
        </p>
      </Section>

      <Section title="Not Financial Advice">
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5 my-4">
          <p className="text-amber-300 font-medium mb-2">⚠️ Important</p>
          <p>
            <strong>Nothing on Voidspace constitutes financial, investment, tax, or legal advice.</strong> All ecosystem
            analytics, opportunity data (&quot;Voids&quot;), token information, yield data, project metrics, and AI-generated
            insights are provided for <strong>informational and educational purposes only</strong>.
          </p>
          <p className="mt-2">
            Always do your own research (DYOR) and consult qualified professionals before making any financial decisions.
            Past performance does not guarantee future results. Cryptocurrency markets are highly volatile.
          </p>
        </div>
      </Section>

      <Section title="AI-Generated Content">
        <p>
          Voidspace uses artificial intelligence to power features including Sanctum (smart contract builder),
          analytics summaries, and educational content. AI-generated output may:
        </p>
        <ul>
          <li>Contain errors, inaccuracies, or outdated information</li>
          <li>Produce smart contract code with bugs or security vulnerabilities</li>
          <li>Generate content that is misleading or incomplete</li>
          <li>Not reflect the most current state of the NEAR ecosystem</li>
        </ul>
        <p>
          <strong>You are solely responsible</strong> for verifying, reviewing, and auditing any AI-generated content
          before relying on it or deploying it on-chain.
        </p>
      </Section>

      <Section title="Smart Contract Risks">
        <p>
          Smart contracts deployed through or inspired by Sanctum carry inherent risks:
        </p>
        <ul>
          <li>Code may contain undiscovered bugs or vulnerabilities</li>
          <li>On-chain transactions are <strong>irreversible</strong></li>
          <li>Smart contracts may interact with other contracts in unexpected ways</li>
          <li>Loss of funds is possible and may be unrecoverable</li>
          <li>Regulatory treatment of smart contracts varies by jurisdiction</li>
        </ul>
        <p>
          <strong className="text-red-400">Voidspace is NOT responsible for any smart contracts deployed via Sanctum.</strong>{' '}
          Professional security audits are strongly recommended before any mainnet deployment.
        </p>
      </Section>

      <Section title="Third-Party Content &amp; Links">
        <p>
          Voidspace may contain links to third-party websites, protocols, or services. We do not control and are not
          responsible for the content, accuracy, or practices of any third-party sites. Inclusion of a link does not
          imply endorsement.
        </p>
      </Section>

      <Section title="NEAR Protocol Disclaimer">
        <p>
          Voidspace is an <strong>independent, third-party tool</strong> built for the NEAR ecosystem. We are not
          affiliated with, endorsed by, or part of the NEAR Foundation or NEAR Protocol core team. NEAR Protocol
          has its own risks, terms, and governance. Your use of the NEAR blockchain is at your own risk.
        </p>
      </Section>

      <Section title="No Guarantees">
        <p>We do not guarantee:</p>
        <ul>
          <li>The accuracy or timeliness of ecosystem data</li>
          <li>The security or correctness of AI-generated code</li>
          <li>Uninterrupted or error-free service</li>
          <li>That the Platform will meet your specific requirements</li>
          <li>Any particular outcome from using our tools or information</li>
        </ul>
      </Section>

      <Section title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Voidspace and its team shall not be liable for any direct, indirect,
          incidental, special, consequential, or punitive damages — including but not limited to loss of profits,
          data, digital assets, or goodwill — arising from your use of, or inability to use, the Platform.
        </p>
        <p>
          <strong>You use Voidspace entirely at your own risk.</strong> By accessing the Platform, you acknowledge that
          you have read, understood, and accepted this disclaimer in full.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 sm:mb-3">{title}</h2>
      <div className="space-y-3 text-text-secondary text-sm sm:text-[15px] leading-relaxed max-w-prose [&_ul]:list-disc [&_ul]:pl-5 sm:[&_ul]:pl-6 [&_ul]:space-y-1.5 [&_li]:text-text-secondary [&_strong]:text-text-primary [&_a]:min-h-[44px] [&_a]:inline-flex [&_a]:items-center break-words">
        {children}
      </div>
    </section>
  );
}
