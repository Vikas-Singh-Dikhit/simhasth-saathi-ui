import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Onboarding } from '@/components/onboarding';
import { Login } from '@/components/login';
import { GroupSetup } from '@/components/group-setup';

type AppStep = 'onboarding' | 'login' | 'group-setup' | 'dashboard';

const Index = () => {
  const navigate = useNavigate();

  // Initialize based on localStorage
  const initialStep: AppStep =
    localStorage.getItem('groupEnabled') === 'true' ? 'dashboard' : 'onboarding';

  const [currentStep, setCurrentStep] = useState<AppStep>(initialStep);
  const [language, setLanguage] = useState('en');
  const [groupCode, setGroupCode] = useState('');

  const handleLanguageComplete = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setCurrentStep('login');
  };

  const handleLoginSuccess = () => {
    setCurrentStep('group-setup');
  };

  const handleGroupCreated = (code: string) => {
    setGroupCode(code);
    localStorage.setItem('groupEnabled', 'true');
    setCurrentStep('dashboard');
  };

  // ✅ jabhi dashboard step set ho, navigate to /dashboard
  useEffect(() => {
    if (currentStep === 'dashboard') {
      navigate('/dashboard');
    }
  }, [currentStep, navigate]);

  switch (currentStep) {
    case 'onboarding':
      return <Onboarding onComplete={handleLanguageComplete} />;

    case 'login':
      return <Login onLoginSuccess={handleLoginSuccess} />;

    case 'group-setup':
      return <GroupSetup onGroupCreated={handleGroupCreated} language={language} />;

    // 👇 ye return karne ki zarurat nahi, navigate handle karega
    case 'dashboard':
      return null;

    default:
      return null;
  }
};

export default Index;
