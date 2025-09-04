import React, { useMemo, memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import {
  Users,
  MapPin,
  Shield,
  AlertTriangle,
  Clock,
  Navigation
} from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  groupCode: string;
}

const Dashboard: React.FC<DashboardProps> = ({ groupCode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mockGroupMembers = useMemo(() => ([
    { name: 'राम शर्मा', status: 'safe', lastSeen: '2 min ago' },
    { name: 'सीता देवी', status: 'safe', lastSeen: '5 min ago' },
    { name: 'लक्ष्मण कुमार', status: 'safe', lastSeen: '1 min ago' },
  ]), []);

  return (
    <div className="min-h-screen">
      <div className="px-lg py-lg space-y-lg">
        {/* Group Status Card */}
        <Card className="p-lg border-card-border shadow-soft bg-card">
          <div className="space-y-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{t('groupStatus')}</h2>
              <StatusIndicator status="safe" size="sm" />
            </div>

            <div className="bg-accent/20 p-lg rounded-lg">
              <div className="flex items-center gap-md mb-md">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground text-sm">
                  {t('yourGroup')} • {mockGroupMembers.length} {t('members')}
                </span>
              </div>

              <div className="space-y-sm">
                {mockGroupMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                      <div className="h-1.5 w-1.5 bg-success rounded-full"></div>
                      <span className="text-sm text-foreground">{member.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{member.lastSeen}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-sm mt-md pt-md border-t border-border/30">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t('lastUpdate')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-md">
          <h2 className="text-base font-semibold text-foreground">{t('quickActions')}</h2>
          <div className="grid grid-cols-2 gap-md">
            <Button
              variant="destructive"
              size="lg"
              className="h-16 flex-col gap-sm bg-danger hover:bg-danger/90 text-white shadow-soft"
              onClick={() => navigate('/sos')}
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">SOS</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="h-16 flex-col gap-sm bg-secondary hover:bg-secondary/90 shadow-soft"
              onClick={() => navigate('/map')}   
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">{t('findGroup')}</span>
            </Button>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-sm">
          <Card className="p-lg border-card-border shadow-soft bg-card hover:shadow-medium transition-shadow">
            <button className="w-full text-left" onClick={() => navigate('/helpdesk')}>
              <div className="flex items-center gap-md">
                <div className="bg-primary/10 p-md rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm">{t('emergencyHelp')}</h3>
                  <p className="text-xs text-muted-foreground">Police, Medical, Volunteers</p>
                </div>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </Card>

          <Card className="p-lg border-card-border shadow-soft bg-card hover:shadow-medium transition-shadow">
            <button className="w-full text-left" onClick={() => navigate('/helpdesk')}>
              <div className="flex items-center gap-md">
                <div className="bg-sky-blue/10 p-md rounded-lg">
                  <Users className="h-5 w-5 text-sky-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm">{t('helpdesk')}</h3>
                  <p className="text-xs text-muted-foreground">Lost & Found, Information</p>
                </div>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-lg border-card-border shadow-soft bg-card">
          <h2 className="text-base font-semibold text-foreground mb-md">{t('recentActivity')}</h2>
          <div className="space-y-sm">
            <div className="flex items-center gap-md p-md bg-success/10 rounded-lg">
              <div className="h-1.5 w-1.5 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{t('allSafe')}</p>
                <p className="text-xs text-muted-foreground">All group members checked in</p>
              </div>
              <span className="text-xs text-muted-foreground">Now</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default memo(Dashboard);
