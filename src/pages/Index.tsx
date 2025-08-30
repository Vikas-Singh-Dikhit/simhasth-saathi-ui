import React, { useState } from 'react';
import { Onboarding } from '@/components/onboarding';
import { Login } from '@/components/login';
import { GroupSetup } from '@/components/group-setup';
import { Dashboard } from '@/pages/Dashboard';

type AppStep = 'onboarding' | 'login' | 'group-setup' | 'dashboard';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('onboarding');
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
    setCurrentStep('dashboard');
  };

  switch (currentStep) {
    case 'onboarding':
      return <Onboarding onComplete={handleLanguageComplete} />;
    
    case 'login':
      return <Login onLoginSuccess={handleLoginSuccess} language={language} />;
    
    case 'group-setup':
      return <GroupSetup onGroupCreated={handleGroupCreated} language={language} />;
    
    case 'dashboard':
      return <Dashboard language={language} groupCode={groupCode} />;
    
    default:
      return null;
  }
};

export default Index;
