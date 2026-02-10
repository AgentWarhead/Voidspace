'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Settings, Globe, X } from 'lucide-react';
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
    description: 'We scan the NEAR blockchain ecosystem to find gaps — places where builders like you can make the biggest impact.',
  },
  {
    icon: Target,
    title: 'Discover Opportunities',
    description: "Each 'Void' is an opportunity scored 0-100. Higher scores = bigger gaps = more potential. Filter by your skill level and interests.",
  },
  {
    icon: Settings,
    title: 'Build with AI',
    description: "The Sanctum is your AI-powered development studio. Describe what you want to build, and we'll generate smart contracts, webapps, and deployment — all through conversation.",
  },
  {
    icon: Globe,
    title: 'Analyze the Ecosystem',
    description: 'The Observatory gives you real-time intelligence: wallet reputation scoring, relationship mapping, and live transaction feeds.',
  },
];

export function OnboardingOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check if user has already been onboarded (localStorage OR cookie)
    const hasBeenOnboardedLocal = localStorage.getItem('voidspace_onboarded');
    const hasBeenOnboardedCookie = document.cookie.includes('voidspace_onboarded=true');
    
    if (!hasBeenOnboardedLocal && !hasBeenOnboardedCookie) {
      setIsVisible(true);
    }
  }, []);

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
          className="relative z-10 w-full max-w-lg"
        >
          <Card 
            variant="glass" 
            padding="none"
            className="relative border-near-green/20 shadow-[0_0_40px_rgba(0,236,151,0.1)]"
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
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
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-text-secondary leading-relaxed mb-8">
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
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentSlide 
                        ? 'bg-near-green w-6' 
                        : 'bg-text-muted hover:bg-text-secondary'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="text-text-muted hover:text-text-secondary transition-colors text-sm"
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