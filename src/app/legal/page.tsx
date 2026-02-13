import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal | Voidspace',
  description: 'Legal information for Voidspace — Terms, Privacy, Disclaimer, Cookies, and Acceptable Use.',
};

const legalPages = [
  { href: '/legal/terms', title: 'Terms of Service', desc: 'Rules and conditions for using Voidspace and Sanctum.' },
  { href: '/legal/privacy', title: 'Privacy Policy', desc: 'How we collect, use, and protect your data.' },
  { href: '/legal/disclaimer', title: 'Disclaimer', desc: 'Important limitations, risk disclosures, and liability information.' },
  { href: '/legal/cookies', title: 'Cookie Policy', desc: 'What cookies we use and how to manage them.' },
  { href: '/legal/acceptable-use', title: 'Acceptable Use Policy', desc: 'Rules for responsible use of the Platform.' },
];

export default function LegalIndexPage() {
  return (
    <article>
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">Legal</h1>
        <p className="text-text-secondary">
          All legal documents for Voidspace. Last updated February 2026.
        </p>
      </header>

      <div className="grid gap-4">
        {legalPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group block p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-near-green/5 hover:border-near-green/20 transition-all"
          >
            <h2 className="text-lg font-semibold text-text-primary group-hover:text-near-green transition-colors mb-1">
              {page.title} →
            </h2>
            <p className="text-sm text-text-muted">{page.desc}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
