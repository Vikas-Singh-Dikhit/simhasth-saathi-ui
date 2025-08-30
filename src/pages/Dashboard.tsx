import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { 
  Users, 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Bell,
  Clock,
  Navigation
} from 'lucide-react';

interface DashboardProps {
  language: string;
  groupCode: string;
}

const Dashboard: React.FC<DashboardProps> = ({ language, groupCode }) => {
  const texts = {
    en: {
      welcome: 'Welcome to Simhasth Saathi',
      groupStatus: 'Group Status',
      yourGroup: 'Your Group',
      members: 'members',
      quickActions: 'Quick Actions',
      emergencyHelp: 'Emergency Help',
      findGroup: 'Find Group Members',
      helpdesk: 'Digital Helpdesk',
      recentActivity: 'Recent Activity',
      allSafe: 'All members are safe',
      lastUpdate: 'Last updated 2 min ago'
    },
    hi: {
      welcome: 'सिंहस्थ साथी में आपका स्वागत है',
      groupStatus: 'समूह की स्थिति',
      yourGroup: 'आपका समूह',
      members: 'सदस्य',
      quickActions: 'त्वरित क्रियाएं',
      emergencyHelp: 'आपातकालीन सहायता',
      findGroup: 'समूह के सदस्यों को खोजें',
      helpdesk: 'डिजिटल हेल्पडेस्क',
      recentActivity: 'हाल की गतिविधि',
      allSafe: 'सभी सदस्य सुरक्षित हैं',
      lastUpdate: '2 मिनट पहले अपडेट किया गया'
    }
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  const mockGroupMembers = [
    { name: 'राम शर्मा', status: 'safe', lastSeen: '2 min ago' },
    { name: 'सीता देवी', status: 'safe', lastSeen: '5 min ago' },
    { name: 'लक्ष्मण कुमार', status: 'safe', lastSeen: '1 min ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-light/30 via-background to-sky-blue-light/30">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-card-border shadow-soft">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl-mobile font-bold text-foreground">
                {t.welcome}
              </h1>
              <p className="text-sm text-muted-foreground">
                Group: {groupCode}
              </p>
            </div>
            <Button size="sm" variant="outline" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-danger rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-nav space-y-6">
        {/* Group Status Card */}
        <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {t.groupStatus}
              </h2>
              <StatusIndicator status="safe" size="sm" />
            </div>
            
            <div className="bg-accent/30 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">
                  {t.yourGroup} • {mockGroupMembers.length} {t.members}
                </span>
              </div>
              
              <div className="space-y-2">
                {mockGroupMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-success rounded-full"></div>
                      <span className="text-sm text-foreground">{member.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{member.lastSeen}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t.lastUpdate}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {t.quickActions}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="destructive"
              size="lg"
              className="h-20 flex-col gap-2 bg-danger hover:bg-danger/90 text-white shadow-medium"
            >
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm font-medium">SOS</span>
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/90 shadow-medium"
            >
              <MapPin className="h-6 w-6" />
              <span className="text-sm font-medium">{t.findGroup}</span>
            </Button>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-4 border-card-border shadow-soft bg-card/95 backdrop-blur-sm">
            <button className="w-full text-left">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{t.emergencyHelp}</h3>
                  <p className="text-sm text-muted-foreground">Police, Medical, Volunteers</p>
                </div>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </Card>
          
          <Card className="p-4 border-card-border shadow-soft bg-card/95 backdrop-blur-sm">
            <button className="w-full text-left">
              <div className="flex items-center gap-4">
                <div className="bg-sky-blue/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-sky-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{t.helpdesk}</h3>
                  <p className="text-sm text-muted-foreground">Lost & Found, Information</p>
                </div>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t.recentActivity}
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="h-2 w-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{t.allSafe}</p>
                <p className="text-xs text-muted-foreground">All group members checked in</p>
              </div>
              <span className="text-xs text-muted-foreground">Now</span>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavigation currentLanguage={language as 'en' | 'hi' | 'mr' | 'sa'} />
    </div>
  );
};

export default Dashboard;