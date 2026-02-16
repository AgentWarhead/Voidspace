'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Void portal particle effect
function VoidParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create particles around the edges
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 40;
      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        color: Math.random() > 0.5 ? '#00EC97' : '#8B5CF6',
      });
    }
    
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        // Calculate direction to center (void pull)
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Gravitational pull toward center
        const force = 0.15;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        
        // Apply velocity with damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        // Fade as approaching center
        p.alpha = Math.min(0.8, dist / 100);
        
        // Reset if too close to center
        if (dist < 20) {
          const angle = Math.random() * Math.PI * 2;
          const spawnDist = 80 + Math.random() * 40;
          p.x = centerX + Math.cos(angle) * spawnDist;
          p.y = centerY + Math.sin(angle) * spawnDist;
          p.vx = 0;
          p.vy = 0;
          p.alpha = 0.5;
        }
        
        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={240} 
      height={60} 
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export function HeroCTA() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="flex flex-col items-center gap-4">
      <Link href="/opportunities">
        <motion.div
          className="relative"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Void portal glow effect */}
          <motion.div
            className="absolute -inset-2 rounded-xl bg-gradient-to-r from-void-purple/30 via-void-cyan/20 to-void-purple/30 blur-xl"
            animate={{
              opacity: isHovered ? [0.5, 0.8, 0.5] : 0.3,
              scale: isHovered ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Particle canvas */}
          {isHovered && <VoidParticles />}
          
          {/* Button */}
          <motion.button
            className="relative shimmer-btn text-background font-semibold px-6 sm:px-8 py-3.5 rounded-lg text-sm sm:text-base inline-flex items-center gap-2 overflow-hidden min-h-[44px]"
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 0 40px rgba(0,236,151,0.5), 0 0 80px rgba(139,92,246,0.3)' 
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Void ripple effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-void-purple/20 to-transparent rounded-lg"
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <span className="relative z-10">Explore Voids</span>
            <motion.span
              animate={isHovered ? { x: [0, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="relative z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.span>
          </motion.button>
        </motion.div>
      </Link>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-text-muted font-mono">
          AI-Powered
        </p>
        <span className="hidden sm:inline text-text-muted/30">·</span>
        <Link href="/learn" className="text-xs text-near-green/70 hover:text-near-green font-mono transition-colors min-h-[44px] flex items-center active:scale-[0.97]">
          New to NEAR? Start here →
        </Link>
      </motion.div>
    </div>
  );
}
