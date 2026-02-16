'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/effects/GradientText';

const faqs = [
  {
    q: 'What is 1 credit?',
    a: '$1 of AI compute in Sanctum. Free tier runs on Claude Sonnet 4.5 — fast and capable. Paid tiers unlock Claude Opus 4.6, Anthropic\'s most powerful model, for deeper reasoning and better code. A typical build session uses ~$1.50–2 on Sonnet or ~$5–8 on Opus.',
  },
  {
    q: 'Why is Opus 4.6 worth upgrading for?',
    a: 'Opus 4.6 produces more complete contracts, catches edge cases Sonnet misses, and handles complex multi-contract architectures that Sonnet struggles with. It\'s the difference between a working prototype and production-ready code. Credits burn faster (bigger model = more tokens), but the output quality makes up for it.',
  },
  {
    q: 'Do subscription credits roll over?',
    a: 'No — subscription credits reset each billing cycle. This keeps pricing low for everyone. Pro tip: if you\'re not using all your credits, you\'re on the wrong tier. Downgrade and top up as needed instead.',
  },
  {
    q: 'Do top-up credits expire?',
    a: 'Never. Top-up credits stay in your account forever until you use them. Buy once, build whenever inspiration strikes.',
  },
  {
    q: 'Which credits are used first?',
    a: 'Subscription credits burn first, protecting your top-ups. Think of subscription credits as your monthly runway, and top-ups as your safety net.',
  },
  {
    q: 'Can I top up on the Free tier?',
    a: 'Absolutely. You don\'t need a subscription to buy credits. Start free, top up $5 when you need more, and only subscribe when you\'re building consistently. Top-up purchasers also get cloud conversation history.',
  },
  {
    q: 'What happens when I run out of credits?',
    a: 'Sanctum pauses — your projects, code, and history are all saved. Top up or wait for your next subscription cycle to pick up right where you left off. Nothing is ever lost.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel in one click from your profile. You keep access through the end of your billing period, and any unused top-up credits stay in your account permanently.',
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
      <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">
        How credits work
      </h3>
      <p className="text-center text-text-muted text-sm mb-6 sm:mb-8">
        Simple, transparent, no surprises. You always know exactly what you&apos;re paying for.
      </p>
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
