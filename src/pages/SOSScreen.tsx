import React, { useState, memo } from 'react';
import { AlertTriangle, Phone, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from '@/context/TranslationContext';
import { useAppStore } from '@/store/appStore';

const SOSScreen = () => {
  const { t } = useTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const triggerSOS = useAppStore(s => s.triggerSOS);
  const sosAlerts = useAppStore(s => s.sosAlerts);

  const handleSOSPress = () => {
    setIsEmergency(true);
    setShowConfirmation(true);
    triggerSOS();
    setTimeout(() => setIsEmergency(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="px-lg py-xl space-y-lg">
        {/* SOS Button */}
        <div className="flex-1 flex items-center justify-center py-2xl">
          <div className="text-center">
            <Button
              size="lg"
              className={`w-40 h-40 rounded-full text-xl font-bold shadow-strong transition-all duration-300 ${
                isEmergency 
                  ? 'bg-destructive hover:bg-destructive animate-pulse scale-110' 
                  : 'bg-destructive hover:bg-destructive/90 hover:scale-105'
              }`}
              onClick={handleSOSPress}
              disabled={isEmergency}
            >
              <div className="flex flex-col items-center gap-sm">
                <AlertTriangle className="h-12 w-12" />
                <span className="text-base">{t('sosButton')}</span>
                <span className="text-sm font-normal">{t('sosEmergency')}</span>
              </div>
            </Button>
            <p className="mt-lg text-sm text-muted-foreground max-w-xs mx-auto">
              {t('sosSubtitle')}
            </p>
          </div>
        </div>

        {/* Confirmation Alert */}
        {showConfirmation && (
          <Alert className="border-success bg-success/10">
            <Shield className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              {isEmergency ? (
                <div className="flex items-center gap-sm">
                  <div className="animate-pulse">⚡</div>
                  {t('sosSending')}
                </div>
              ) : (
                t('sosSent')
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Emergency Contacts */}
        <div>
          <h3 className="text-base font-semibold mb-md">{t('quickContacts')}</h3>
          <div className="grid grid-cols-2 gap-md">
            <Button variant="outline" className="h-14 flex-col gap-xs border-sky-blue text-sky-blue hover:bg-sky-blue hover:text-white">
              <Phone className="h-5 w-5" />
              <span className="text-sm">{t('police')}</span>
            </Button>
            <Button variant="outline" className="h-14 flex-col gap-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Shield className="h-5 w-5" />
              <span className="text-sm">{t('volunteers')}</span>
            </Button>
          </div>
        </div>

        {/* Recent Alerts */}
        {sosAlerts.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader className="pb-md">
              <CardTitle className="text-base flex items-center gap-sm">
                <Clock className="h-4 w-4" />
                {t('recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-sm">
              {sosAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-md bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{t('sosAlert')}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-sm py-xs rounded-full text-xs font-medium ${
                      alert.status === 'resolved' 
                        ? 'bg-success/20 text-success' 
                        : alert.status === 'responded'
                        ? 'bg-sky-blue/20 text-sky-blue'
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {alert.status === 'resolved' ? t('resolved') : alert.status === 'responded' ? t('responded') : t('sent')}
                    </span>
                    {alert.responder && (
                      <p className="text-xs text-muted-foreground mt-xs">{alert.responder}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default memo(SOSScreen);
