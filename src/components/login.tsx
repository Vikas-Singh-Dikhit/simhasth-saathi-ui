import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Phone, Shield, UserCheck } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation(); // ✅ use context for real-time translation
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const otpSubtitle = t('otpSubtitle')?.replace('{phoneNumber}', phoneNumber) || '';

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('otp');
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onLoginSuccess();
  };

  const handleGuestMode = () => {
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-light via-background to-saffron-light flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center space-y-2"
          key={step}
          initial={{ opacity: 0, x: step === 'otp' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div 
              className="bg-primary/10 p-4 rounded-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: step === 'otp' ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Shield className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>
          </div>
          <motion.h1 
            className="text-2xl-mobile font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {step === 'phone' ? t('loginTitle') : t('otpTitle')}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {step === 'phone' ? t('loginSubtitle') : otpSubtitle}
          </motion.p>
        </motion.div>

        {/* Form */}
        <AnimatedCard 
          key={step}
          className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm"
          delay={0.1}
        >
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {step === 'phone' ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="text-sm font-medium text-foreground">{t('phoneLabel')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder={t('phonePlaceholder')}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 h-12 text-base"
                    maxLength={13}
                  />
                </div>
                <AnimatedButton
                  onClick={handleSendOtp}
                  disabled={phoneNumber.length < 10 || isLoading}
                  loading={isLoading}
                  className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? t('sending') : t('sendOtp')}
                  <ArrowRight className="h-4 w-4" />
                </AnimatedButton>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="text-sm font-medium text-foreground">{t('otpLabel')}</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                >
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest h-12"
                    maxLength={6}
                  />
                </motion.div>
                <AnimatedButton
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 6 || isLoading}
                  loading={isLoading}
                  className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? t('verifying') : t('verifyOtp')}
                  <UserCheck className="h-4 w-4" />
                </AnimatedButton>
                <AnimatedButton
                  variant="outline"
                  onClick={() => setStep('phone')}
                  className="w-full"
                  disabled={isLoading}
                >
                  {t('resendOtp')}
                </AnimatedButton>
              </motion.div>
            )}
          </motion.div>
        </AnimatedCard>

        {/* Guest Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatedButton
            variant="outline"
            onClick={handleGuestMode}
            className="w-full h-12 border-primary/20 hover:bg-primary/5"
          >
            {t('guestMode')}
          </AnimatedButton>
        </motion.div>

        {/* Security Notice */}
        <motion.p 
          className="text-xs text-muted-foreground flex items-center justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Shield className="h-3 w-3" />
          {t('securityNotice')}
        </motion.p>
      </motion.div>
    </div>
  );
};
