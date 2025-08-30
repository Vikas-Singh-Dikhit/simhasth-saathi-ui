import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowRight, Phone, Shield, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginProps {
  onLoginSuccess: () => void;
  language: string;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, language }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    en: {
      title: 'Secure Login',
      subtitle: 'Enter your phone number to get started',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+91 00000 00000',
      otpLabel: 'Enter OTP',
      otpSubtitle: `We sent a 6-digit code to ${phoneNumber}`,
      sendOtp: 'Send OTP',
      verifyOtp: 'Verify & Continue',
      guestMode: 'Continue as Guest',
      resendOtp: 'Resend OTP'
    },
    hi: {
      title: 'सुरक्षित लॉगिन',
      subtitle: 'शुरू करने के लिए अपना फोन नंबर दर्ज करें',
      phoneLabel: 'फोन नंबर',
      phonePlaceholder: '+91 00000 00000',
      otpLabel: 'OTP दर्ज करें',
      otpSubtitle: `हमने ${phoneNumber} पर 6-अंकीय कोड भेजा है`,
      sendOtp: 'OTP भेजें',
      verifyOtp: 'सत्यापित करें और जारी रखें',
      guestMode: 'अतिथि के रूप में जारी रखें',
      resendOtp: 'OTP पुनः भेजें'
    }
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('otp');
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onLoginSuccess();
  };

  const handleGuestMode = () => {
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-light via-background to-saffron-light flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl-mobile font-bold text-foreground">
            {t.title}
          </h1>
          <p className="text-muted-foreground">
            {step === 'phone' ? t.subtitle : t.otpSubtitle}
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
          <div className="space-y-6">
            {step === 'phone' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t.phoneLabel}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 h-12 text-base"
                      maxLength={13}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleSendOtp}
                  disabled={phoneNumber.length < 10 || isLoading}
                  className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Sending...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t.sendOtp}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t.otpLabel}
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest h-12"
                    maxLength={6}
                  />
                </div>
                
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 6 || isLoading}
                  className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Verifying...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t.verifyOtp}
                      <UserCheck className="h-4 w-4" />
                    </span>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setStep('phone')}
                  className="w-full"
                  disabled={isLoading}
                >
                  {t.resendOtp}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Guest Mode */}
        <Button
          variant="outline"
          onClick={handleGuestMode}
          className="w-full h-12 border-primary/20 hover:bg-primary/5"
        >
          {t.guestMode}
        </Button>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};