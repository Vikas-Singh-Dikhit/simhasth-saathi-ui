import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
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

interface DashboardProps {
  groupCode: string;
}

const Dashboard: React.FC<DashboardProps> = ({ groupCode }) => {
  const { t } = useTranslation();

  const mockGroupMembers = [
    { name: 'राम शर्मा', status: 'safe', lastSeen: '2 min ago' },
    { name: 'सीता देवी', status: 'safe', lastSeen: '5 min ago' },
    { name: 'लक्ष्मण कुमार', status: 'safe', lastSeen: '1 min ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-light/30 via-background to-sky-blue-light/30">
      <motion.div 
        className="px-4 py-6 pb-nav space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Group Status Card */}
        <AnimatedCard className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{t('groupStatus')}</h2>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <StatusIndicator status="safe" size="sm" />
              </motion.div>
            </div>

            <motion.div 
              className="bg-accent/30 p-4 rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Users className="h-5 w-5 text-primary" />
                </motion.div>
                <span className="font-medium text-foreground">
                  {t('yourGroup')} • {mockGroupMembers.length} {t('members')}
                </span>
              </div>

              <div className="space-y-2">
                {mockGroupMembers.map((member, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="h-2 w-2 bg-success rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                      />
                      <span className="text-sm text-foreground">{member.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{member.lastSeen}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t('lastUpdate')}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatedCard>

        {/* Quick Actions */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground">{t('quickActions')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <AnimatedButton
              variant="destructive"
              size="lg"
              className="h-20 flex-col gap-2 bg-danger hover:bg-danger/90 text-white shadow-medium"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <AlertTriangle className="h-6 w-6" />
              </motion.div>
              <span className="text-sm font-medium">SOS</span>
            </AnimatedButton>

            <AnimatedButton
              variant="secondary"
              size="lg"
              className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/90 shadow-medium"
            >
              <MapPin className="h-6 w-6" />
              <span className="text-sm font-medium">{t('findGroup')}</span>
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-4 border-card-border shadow-soft bg-card/95 backdrop-blur-sm">
            <button className="w-full text-left">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{t('emergencyHelp')}</h3>
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
                  <h3 className="font-semibold text-foreground">{t('helpdesk')}</h3>
                  <p className="text-sm text-muted-foreground">Lost & Found, Information</p>
                </div>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('recentActivity')}</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="h-2 w-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{t('allSafe')}</p>
                <p className="text-xs text-muted-foreground">All group members checked in</p>
              </div>
              <span className="text-xs text-muted-foreground">Now</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
