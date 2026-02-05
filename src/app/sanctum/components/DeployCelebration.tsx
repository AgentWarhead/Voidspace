'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Rocket, ExternalLink, Copy, Sparkles } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  velocity: { x: number; y: number };
}

interface DeployCelebrationProps {
  isVisible: boolean;
  contractId?: string;
  explorerUrl?: string;
  onClose: () => void;
}

const CONFETTI_COLORS = [
  '#00EC97', // NEAR green
  '#00D4FF', // Cyan
  '#9D4EDD', // Purple
  '#FFD700', // Gold
  '#FF6B6B', // Coral
  '#4ECDC4', // Teal
];

export function DeployCelebration({ isVisible, contractId, explorerUrl, onClose }: DeployCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [copied, setCopied] = useState(false);

  // Generate confetti particles
  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 10,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: 3 + Math.random() * 5,
        },
      });
    }
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    if (!isVisible) {
      setParticles([]);
      return;
    }

    createParticles();
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            rotation: p.rotation + 5,
            velocity: {
              x: p.velocity.x * 0.99,
              y: p.velocity.y + 0.1, // gravity
            },
          }))
          .filter(p => p.y < window.innerHeight + 50)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [isVisible, createParticles]);

  const handleCopy = () => {
    if (contractId) {
      navigator.clipboard.writeText(contractId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Confetti layer */}
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size * 0.6,
                  backgroundColor: particle.color,
                  transform: `rotate(${particle.rotation}deg)`,
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>

          {/* Modal overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void-black/80 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative bg-void-gray border border-near-green/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-near-green/20"
              onClick={e => e.stopPropagation()}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-near-green/10 to-transparent rounded-2xl" />
              
              {/* Success icon with pulse */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 200 }}
                className="relative flex justify-center mb-6"
              >
                <div className="relative">
                  {/* Pulse rings */}
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-near-green/30"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="absolute inset-0 rounded-full bg-near-green/20"
                  />
                  
                  {/* Icon */}
                  <div className="relative w-20 h-20 rounded-full bg-near-green/20 flex items-center justify-center border-2 border-near-green">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Rocket className="w-10 h-10 text-near-green" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Text content */}
              <div className="relative text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-text-primary mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    Contract Deployed!
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Your smart contract is now live on NEAR Protocol!
                  </p>
                </motion.div>

                {/* Contract ID */}
                {contractId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Contract ID</p>
                    <div className="flex items-center gap-2 bg-void-black/50 rounded-lg p-3 border border-border-subtle">
                      <code className="flex-1 text-near-green font-mono text-sm truncate">
                        {contractId}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        title="Copy contract ID"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-near-green" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3"
                >
                  {explorerUrl && (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg border border-near-green/30 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Explorer
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-text-primary rounded-lg border border-border-subtle transition-all"
                  >
                    Continue Building
                  </button>
                </motion.div>
              </div>

              {/* Achievement badge */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="absolute -top-3 -right-3 bg-amber-500 text-void-black text-xs font-bold px-3 py-1 rounded-full shadow-lg"
              >
                +100 XP
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
