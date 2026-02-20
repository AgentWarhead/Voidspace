'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore - lucide-react type export bug
import { Sparkles, Target, Eye, Terminal, GraduationCap, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Slide {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    icon: Sparkles,
    title: 'Welcome to Voidspace',
    description: "NEAR's first AI-native intelligence and builder platform. See everything. Build anything.",
  },
  {
    icon: Eye,
    title: 'The Observatory',
    description: 'Void Bubbles visualize 150+ tokens in real time. Void Lens scores any wallet\'s reputation. Constellation maps relationship networks. Every project. Every wallet. Every connection.',
  },
  {
    icon: Target,
    title: 'Find the Voids',
    description: '383+ projects scanned. Every gap scored 0–100. Filter by skill level, category, and feasibility. The ecosystem\'s blind spots are your opportunities.',
  },
  {
    icon: Terminal,
    title: 'The Sanctum',
    description: '8 AI expert personas. Two modes — Learn and Void. Describe what you want to build and vibe-code smart contracts through conversation. Your AI dev team awaits.',
  },
  {
    icon: GraduationCap,
    title: 'Zero to Dangerous',
    description: '66 interactive modules across 4 tracks — Explorer, Builder, Hacker, Founder. From your first Rust line to production dApps. No permission needed.',
  },
];

export function OnboardingOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Only show onboarding on the homepage (root "/" route)
    if (pathname !== '/') return;

    // Check if user has already been onboarded (localStorage OR cookie)
    const hasBeenOnboardedLocal = localStorage.getItem('voidspace_onboarded');
    const hasBeenOnboardedCookie = document.cookie.includes('voidspace_onboarded=true');
    
    if (!hasBeenOnboardedLocal && !hasBeenOnboardedCookie) {
      setIsVisible(true);
    }
  }, [pathname]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('voidspace_onboarded', 'true');
    document.cookie = 'voidspace_onboarded=true; max-age=31536000; path=/; SameSite=Lax';
    setIsVisible(false);
  };

  const handleComplete = () => {
    localStorage.setItem('voidspace_onboarded', 'true');
    document.cookie = 'voidspace_onboarded=true; max-age=31536000; path=/; SameSite=Lax';
    setIsVisible(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (!isVisible) return null;

  const CurrentIcon = slides[currentSlide].icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={handleSkip}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative z-10 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        >
          <Card 
            variant="glass" 
            padding="none"
            className="relative border-near-green/20 shadow-[0_0_40px_rgba(0,236,151,0.1)]"
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 p-2 text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.97]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-5 sm:p-8 text-center">
              {/* Icon */}
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-6 flex justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-near-green/10 flex items-center justify-center">
                  <CurrentIcon className="w-8 h-8 text-near-green" />
                </div>
              </motion.div>

              {/* Title and Description */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6 sm:mb-8">
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mb-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`h-2 rounded-full transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center relative before:absolute before:rounded-full before:transition-all before:duration-200 ${
                      index === currentSlide 
                        ? 'before:bg-near-green before:w-6 before:h-2' 
                        : 'before:bg-text-muted hover:before:bg-text-secondary before:w-2 before:h-2'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="text-text-muted hover:text-text-secondary transition-colors text-sm min-h-[44px] min-w-[44px] active:scale-[0.97]"
                >
                  Skip
                </button>
                
                <Button
                  onClick={handleNext}
                  variant="primary"
                  size="md"
                >
                  {isLastSlide ? 'Get Started' : 'Next'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}