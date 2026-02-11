'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/effects/GradientText';
import { Button } from '@/components/ui/Button';

export default function BottomCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-near-green/5 to-transparent" />
      
      {/* Particle constellation animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particles">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Headline */}
        <GradientText as="h2" className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Fill the Void?
        </GradientText>

        {/* Subtext */}
        <p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          The NEAR ecosystem needs builders. The voids are mapped. The tools are ready. 
          The only missing piece is you.
        </p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/opportunities">
            <Button variant="primary" size="lg">
              Find Your Void
            </Button>
          </Link>
          <Link href="/sanctum">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50"
            >
              Enter the Sanctum
            </Button>
          </Link>
          <Link href="/observatory">
            <Button variant="ghost" size="lg">
              Explore the Observatory
            </Button>
          </Link>
        </motion.div>

        {/* Fine print */}
        <motion.p
          className="text-sm text-text-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Free to start. No credit card required for 3 Void Briefs per month.
        </motion.p>
      </motion.div>

      <style jsx>{`
        .particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #00EC97;
          border-radius: 50%;
          opacity: 0;
          animation: drift linear infinite;
          box-shadow: 0 0 4px rgba(0, 236, 151, 0.8),
                      0 0 8px rgba(0, 236, 151, 0.4);
        }

        @keyframes drift {
          0%, 100% {
            opacity: 0;
            transform: translate(0, 0) scale(0.5);
          }
          10% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
            transform: translate(var(--drift-x, 20px), var(--drift-y, -30px)) scale(1);
          }
          90% {
            opacity: 0.4;
          }
        }

        .particle:nth-child(3n) {
          --drift-x: -25px;
          --drift-y: 40px;
        }

        .particle:nth-child(3n+1) {
          --drift-x: 30px;
          --drift-y: -20px;
        }

        .particle:nth-child(3n+2) {
          --drift-x: -15px;
          --drift-y: -35px;
        }

        .particle:nth-child(4n) {
          animation-duration: 10s;
        }

        .particle:nth-child(5n) {
          width: 3px;
          height: 3px;
        }
      `}</style>
    </section>
  );
}
