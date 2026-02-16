'use client';

import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'What is 1 credit?',
    a: '$1 of AI compute in Sanctum. A typical build session uses ~$5 in credits.',
  },
  {
    q: 'Do subscription credits roll over?',
    a: 'No. Subscription credits reset each billing cycle. Use them or lose them.',
  },
  {
    q: 'Do top-up credits expire?',
    a: 'Never. Top-up credits stay in your account until you use them.',
  },
  {
    q: 'Which credits are used first?',
    a: 'Subscription credits burn first. Top-ups are only used after subscription credits run out.',
  },
  {
    q: 'Can I top up on the Free tier?',
    a: 'Yes! Top-ups are available to all tiers, including Free.',
  },
];

export function FAQSection() {
  return (
    <motion.div
      className="mt-16 sm:mt-24 max-w-2xl mx-auto px-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <h3 className="text-lg sm:text-xl font-bold text-center mb-6 sm:mb-8">
        How credits work
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="bg-surface border border-border rounded-lg p-4 sm:p-5"
          >
            <p className="font-medium text-sm sm:text-base mb-1">{faq.q}</p>
            <p className="text-text-muted text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
