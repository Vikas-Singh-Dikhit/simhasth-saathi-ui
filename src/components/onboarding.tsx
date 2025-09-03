import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ArrowRight, Shield } from 'lucide-react';
import simhasthLogo from '@/assets/simhasth-logo.png';
import { LanguageCode, useTranslation } from '@/context/TranslationContext';

interface OnboardingProps {
  onComplete: (language: LanguageCode) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { language, setLanguage, t, tArray } = useTranslation();

  const handleNext = () => {
    onComplete(language); // context language is already updated
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-light via-background to-sky-blue-light flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and Title */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex justify-center">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.img 
                src={simhasthLogo} 
                alt="Simhasth Saathi Logo" 
                className="h-24 w-24 rounded-2xl shadow-medium"
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 shadow-soft"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
              >
                <Shield className="h-4 w-4 text-primary-foreground" />
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h1 
              className="text-3xl-mobile font-bold text-foreground font-devanagari"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {t('welcomeTitle')}
            </motion.h1>
            <motion.h2 
              className="text-2xl-mobile font-bold text-saffron-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {t('welcomeTitle')}
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {t('welcomeSubtitle')}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Language Selection */}
        <AnimatedCard 
          className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm"
          delay={0.9}
        >
          <div className="space-y-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="text-xl-mobile font-semibold text-foreground mb-2">
                {t('chooseLanguage')}
              </h3>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
            >
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={setLanguage}
              />
            </motion.div>
          </div>
        </AnimatedCard>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <AnimatedButton
            onClick={handleNext}
            size="lg"
            className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium"
          >
            <span className="flex items-center justify-center gap-3 text-lg font-medium">
              {t('next')}
              <ArrowRight className="h-5 w-5" />
            </span>
          </AnimatedButton>
        </motion.div>

        {/* Features */}
        <motion.div 
          className="grid grid-cols-3 gap-4 pt-4"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {tArray('features').map((feature, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-2xl mb-1"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  delay: 1.5 + index * 0.2,
                  duration: 0.5 
                }}
              >
                {['🗺️', '🚨', '🛡️'][index]}
              </motion.div>
              <p className="text-xs text-muted-foreground">{feature}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
