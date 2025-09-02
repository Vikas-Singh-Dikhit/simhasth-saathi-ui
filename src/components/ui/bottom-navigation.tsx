import React from 'react';
import { Home, Map, AlertTriangle, HelpCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BottomNavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  labelHindi?: string;
}

const navItems: BottomNavItem[] = [
  { path: '/dashboard', icon: Home, label: 'Home', labelHindi: 'होम' },
  { path: '/map', icon: Map, label: 'Map', labelHindi: 'मानचित्र' },
  { path: '/sos', icon: AlertTriangle, label: 'SOS', labelHindi: 'SOS' },
  { path: '/helpdesk', icon: HelpCircle, label: 'Help', labelHindi: 'सहायता' },
  { path: '/profile', icon: User, label: 'Profile', labelHindi: 'प्रोफ़ाइल' },
];

interface BottomNavigationProps {
  currentLanguage?: 'en' | 'hi' | 'mr' | 'sa';
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  currentLanguage = 'en' 
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border shadow-strong z-50">
      <div className="flex items-center justify-around px-2 py-2" style={{ height: 'var(--nav-height)' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 rounded-md transition-all duration-200',
                'min-h-touch px-2 py-2',
                isActive
                  ? 'text-primary bg-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={cn(
                    'h-6 w-6 mb-1',
                    isActive ? 'text-primary' : 'text-current'
                  )} 
                />
                <span className="text-xs font-medium leading-none">
                  {currentLanguage === 'hi' && item.labelHindi ? item.labelHindi : item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};