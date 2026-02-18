import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal — Terms, Privacy & Policies | Voidspace',
  description: 'Voidspace legal documentation — Terms of Service, Privacy Policy, Disclaimer, Cookie Policy, and Acceptable Use Policy. Transparent and straightforward.',
  alternates: { canonical: 'https://voidspace.io/legal' },
  openGraph: {
    title: 'Legal — Terms, Privacy & Policies | Voidspace',
    description: 'Voidspace legal documentation — Terms of Service, Privacy Policy, Disclaimer, Cookie Policy, and Acceptable Use.',
    url: 'https://voidspace.io/legal',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Legal — Voidspace',
    description: 'Terms, Privacy, Disclaimer, Cookies, and Acceptable Use policies for Voidspace.',
    creator: '@VoidSpaceIO',
  },
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
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">Legal</h1>
        <p className="text-sm sm:text-base text-text-secondary">
          All legal documents for Voidspace. Last updated February 2026.
        </p>
      </header>

      <div className="grid gap-3 sm:gap-4">
        {legalPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group block p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-near-green/5 hover:border-near-green/20 transition-all min-h-[44px] active:scale-[0.98]"
          >
            <h2 className="text-base sm:text-lg font-semibold text-text-primary group-hover:text-near-green transition-colors mb-1">
              {page.title} →
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">{page.desc}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
