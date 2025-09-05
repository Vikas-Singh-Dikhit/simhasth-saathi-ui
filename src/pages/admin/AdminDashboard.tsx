import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Users, MapPin, Shield, Clock, Activity, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { SOSAlertsPanel } from '@/components/admin/SOSAlertsPanel';
import { GroupMapView } from '@/components/admin/GroupMapView';
import { LostFoundDesk } from '@/components/admin/LostFoundDesk';
import { AnalyticsSection } from '@/components/admin/AnalyticsSection';
import { GeoFenceAlerts } from '@/components/admin/GeoFenceAlerts';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { OfflineBanner } from '@/components/admin/OfflineBanner';

interface DashboardStats {
  activeSOS: number;
  totalGroups: number;
  onlineVolunteers: number;
  resolvedAlerts: number;
  crowdDensity: number;
  lastUpdate: string;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeSOS: 3,
    totalGroups: 42,
    onlineVolunteers: 18,
    resolvedAlerts: 156,
    crowdDensity: 75,
    lastUpdate: new Date().toLocaleTimeString()
  });

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check offline mode
    const offlineMode = localStorage.getItem('offlineMode') === 'true';
    setIsOffline(offlineMode);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeSOS: Math.max(0, prev.activeSOS + (Math.random() > 0.7 ? 1 : -1)),
        onlineVolunteers: Math.max(10, prev.onlineVolunteers + (Math.random() > 0.5 ? 1 : -1)),
        crowdDensity: Math.max(0, Math.min(100, prev.crowdDensity + (Math.random() - 0.5) * 10)),
        lastUpdate: new Date().toLocaleTimeString()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Active SOS',
      value: stats.activeSOS,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      trend: '+2 from last hour'
    },
    {
      title: 'Total Groups',
      value: stats.totalGroups,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '+5 new today'
    },
    {
      title: 'Online Volunteers',
      value: stats.onlineVolunteers,
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      trend: 'All stations covered'
    },
    {
      title: 'Resolved Alerts',
      value: stats.resolvedAlerts,
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      trend: '94% resolution rate'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      {isOffline && <OfflineBanner />}
      
      <div className="container mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sos">SOS Alerts</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
            <TabsTrigger value="geofence">Geo-Fence</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <SOSAlertsPanel />
              <GeoFenceAlerts />
            </div>
            <GroupMapView />
          </TabsContent>

          <TabsContent value="sos">
            <SOSAlertsPanel expanded />
          </TabsContent>

          <TabsContent value="groups">
            <GroupMapView expanded />
          </TabsContent>

          <TabsContent value="lost-found">
            <LostFoundDesk />
          </TabsContent>

          <TabsContent value="geofence">
            <GeoFenceAlerts expanded />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsSection />
          </TabsContent>
        </Tabs>

        {/* Last Update Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last updated: {stats.lastUpdate}
        </div>
      </div>
    </div>
  );
};