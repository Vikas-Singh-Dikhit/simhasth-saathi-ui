import React, { useState, useMemo, useCallback, memo } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Shield, 
  Clock,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'sos' | 'group' | 'geofence' | 'system' | 'safety';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'sos': return AlertTriangle;
    case 'group': return Users;
    case 'geofence': return MapPin;
    case 'safety': return Shield;
    case 'system': return Bell;
    default: return Bell;
  }
};

const getNotificationColor = (type: string, priority: string) => {
  if (priority === 'high') return 'text-destructive';
  if (type === 'safety') return 'text-sky-blue';
  if (type === 'group') return 'text-success';
  return 'text-primary';
};

const NotificationsScreen = () => {
  const initialNotifications = useMemo<Notification[]>(() => ([
    {
      id: '1',
      type: 'sos',
      title: 'SOS अलर्ट भेजा गया',
      message: 'आपका आपातकालीन अलर्ट सफलतापूर्वक सभी समूह सदस्यों को भेजा गया है',
      time: '5 मिनट पहले',
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'geofence',
      title: 'सुरक्षित क्षेत्र चेतावनी',
      message: 'अर्जुन सुरक्षित क्षेत्र से बाहर चले गए हैं',
      time: '15 मिनट पहले',
      isRead: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: '3',
      type: 'group',
      title: 'नया सदस्य जुड़ा',
      message: 'प्रिया शर्मा आपके समूह में शामिल हो गई है',
      time: '2 घंटे पहले',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'safety',
      title: 'सुरक्षा अपडेट',
      message: 'आज शाम 6 बजे के बाद मुख्य घाट पर ज्यादा भीड़ की संभावना है',
      time: '4 घंटे पहले',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'system',
      title: 'ऐप अपडेट',
      message: 'नई सुविधाओं के साथ ऐप का नया वर्जन उपलब्ध है',
      time: '1 दिन पहले',
      isRead: false,
      priority: 'low'
    }
  ]), []);
  const [notifications, setNotifications] = useState<Notification[]>(() => initialNotifications);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-4 py-4 bg-card border-b border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-card-foreground">सूचनाएं</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} नई सूचनाएं</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              सभी पढ़े
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">कोई सूचना नहीं</h3>
            <p className="text-muted-foreground">अभी तक कोई नई सूचना नहीं आई है</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type, notification.priority);
            
            return (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-medium ${
                  !notification.isRead ? 'border-primary/30 bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-background ${iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-2">
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">तुरंत</Badge>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-2 ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{notification.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {notification.actionRequired && (
                            <Button size="sm" variant="outline" className="h-6 text-xs">
                              कार्रवाई करें
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      {notifications.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4">
          <Card className="bg-card/95 backdrop-blur border-card-border">
            <CardContent className="p-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  सभी पढ़े
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setNotifications([])}
                >
                  सभी साफ़ करें
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default memo(NotificationsScreen);