import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ArrowRight, Shield } from 'lucide-react';
import simhasthLogo from '@/assets/simhasth-logo.png';

interface OnboardingProps {
  onComplete: (language: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleNext = () => {
    onComplete(selectedLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-light via-background to-sky-blue-light flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={simhasthLogo} 
                alt="Simhasth Saathi Logo" 
                className="h-24 w-24 rounded-2xl shadow-medium"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 shadow-soft">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl-mobile font-bold text-foreground font-devanagari">
              सिंहस्थ साथी
            </h1>
            <h2 className="text-2xl-mobile font-bold text-saffron-dark">
              Simhasth Saathi
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Your safety companion for Simhastha
            </p>
            <p className="text-muted-foreground text-base font-devanagari">
              सिंहस्थ के लिए आपका सुरक्षा साथी
            </p>
          </div>
        </div>

        {/* Language Selection Card */}
        <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl-mobile font-semibold text-foreground mb-2">
                Choose Your Language
              </h3>
              <p className="text-sm text-muted-foreground font-devanagari">
                अपनी भाषा चुनें
              </p>
            </div>
            
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </Card>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium"
        >
          <span className="flex items-center justify-center gap-3 text-lg font-medium">
            {selectedLanguage === 'hi' ? 'आगे बढ़ें' : 'Continue'}
            <ArrowRight className="h-5 w-5" />
          </span>
        </Button>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            { icon: '🗺️', text: 'Group Tracking' },
            { icon: '🚨', text: 'SOS Alerts' },
            { icon: '🛡️', text: 'Safety First' },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl mb-1">{feature.icon}</div>
              <p className="text-xs text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};