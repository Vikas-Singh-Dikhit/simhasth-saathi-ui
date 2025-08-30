import React, { useState } from 'react';
import { AlertTriangle, Phone, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SOSAlert {
  id: string;
  time: string;
  status: 'sent' | 'responded' | 'resolved';
  responder?: string;
}

const SOSScreen = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  const recentAlerts: SOSAlert[] = [
    { id: '1', time: '2 घंटे पहले', status: 'resolved', responder: 'स्वयंसेवक राहुल' },
    { id: '2', time: '1 दिन पहले', status: 'responded', responder: 'पुलिस टीम A' },
  ];

  const handleSOSPress = () => {
    setIsEmergency(true);
    setShowConfirmation(true);
    // Simulate sending SOS
    setTimeout(() => {
      setIsEmergency(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-background p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">आपातकालीन सहायता</h1>
        <p className="text-muted-foreground">तुरंत सहायता के लिए SOS बटन दबाएं</p>
      </div>

      {/* SOS Button */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Button
            size="lg"
            className={`w-48 h-48 rounded-full text-2xl font-bold shadow-strong transition-all duration-300 ${
              isEmergency 
                ? 'bg-destructive hover:bg-destructive animate-pulse scale-110' 
                : 'bg-destructive hover:bg-destructive/90 hover:scale-105'
            }`}
            onClick={handleSOSPress}
            disabled={isEmergency}
          >
            <div className="flex flex-col items-center">
              <AlertTriangle className="h-16 w-16 mb-2" />
              <span>SOS</span>
              <span className="text-lg font-normal">आपातकाल</span>
            </div>
          </Button>
          
          <p className="mt-6 text-sm text-muted-foreground max-w-xs">
            इस बटन को दबाने पर आपके समूह, पुलिस और स्वयंसेवकों को तुरंत अलर्ट भेजा जाएगा
          </p>
        </div>
      </div>

      {/* Confirmation Alert */}
      {showConfirmation && (
        <div className="mb-6">
          <Alert className="border-success bg-success/10">
            <Shield className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              {isEmergency ? (
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">⚡</div>
                  आपका SOS अलर्ट भेजा जा रहा है...
                </div>
              ) : (
                "आपका SOS अलर्ट सफलतापूर्वक भेजा गया। सहायता आ रही है।"
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">त्वरित संपर्क</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-16 flex-col border-sky-blue text-sky-blue hover:bg-sky-blue hover:text-white">
            <Phone className="h-6 w-6 mb-1" />
            <span className="text-sm">पुलिस</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Shield className="h-6 w-6 mb-1" />
            <span className="text-sm">स्वयंसेवक</span>
          </Button>
        </div>
      </div>

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              हाल की गतिविधि
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">SOS अलर्ट</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    alert.status === 'resolved' 
                      ? 'bg-success/20 text-success' 
                      : alert.status === 'responded'
                      ? 'bg-sky-blue/20 text-sky-blue'
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {alert.status === 'resolved' ? 'समाधान' : alert.status === 'responded' ? 'जवाब मिला' : 'भेजा गया'}
                  </span>
                  {alert.responder && (
                    <p className="text-xs text-muted-foreground mt-1">{alert.responder}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SOSScreen;