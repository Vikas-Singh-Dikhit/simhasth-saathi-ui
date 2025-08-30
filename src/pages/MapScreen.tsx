import React, { useState } from 'react';
import { Users, MapPin, AlertCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  position: { lat: number; lng: number };
  status: 'safe' | 'warning' | 'danger';
}

const MapScreen = () => {
  const [showGeofenceAlert, setShowGeofenceAlert] = useState(false);
  
  const groupMembers: GroupMember[] = [
    { id: '1', name: 'राम शर्मा', avatar: '👴', position: { lat: 23.2599, lng: 77.4126 }, status: 'safe' },
    { id: '2', name: 'सीता देवी', avatar: '👵', position: { lat: 23.2590, lng: 77.4120 }, status: 'safe' },
    { id: '3', name: 'अर्जुन', avatar: '👨', position: { lat: 23.2610, lng: 77.4140 }, status: 'warning' },
  ];

  const groupStatus = groupMembers.every(m => m.status === 'safe') ? 'safe' : 'warning';

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Status Panel */}
      <div className="px-4 py-3 bg-card border-b border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-card-foreground">समूह स्थिति</h2>
              <p className="text-sm text-muted-foreground">3 सदस्य ऑनलाइन</p>
            </div>
          </div>
          <StatusIndicator status={groupStatus} />
        </div>
      </div>

      {/* Geofence Alert */}
      {showGeofenceAlert && (
        <div className="p-4">
          <Alert className="border-warning bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              अर्जुन सुरक्षित क्षेत्र से बाहर गए हैं
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 h-6 px-2 text-xs border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                onClick={() => setShowGeofenceAlert(false)}
              >
                मानचित्र पर देखें
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="flex-1 relative bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">लाइव मानचित्र</h3>
            <p className="text-muted-foreground px-4">यहाँ आपके समूह के सदस्यों की वास्तविक स्थिति दिखाई जाएगी</p>
          </div>
        </div>

        {/* Mock Group Members on Map */}
        <div className="absolute top-20 left-10">
          <div className="bg-card rounded-full p-2 shadow-medium border-2 border-safe">
            <span className="text-2xl">👴</span>
          </div>
          <p className="text-xs text-center mt-1 font-medium">राम शर्मा</p>
        </div>
        
        <div className="absolute top-32 right-16">
          <div className="bg-card rounded-full p-2 shadow-medium border-2 border-safe">
            <span className="text-2xl">👵</span>
          </div>
          <p className="text-xs text-center mt-1 font-medium">सीता देवी</p>
        </div>
        
        <div className="absolute bottom-40 left-1/3">
          <div className="bg-card rounded-full p-2 shadow-medium border-2 border-warning">
            <span className="text-2xl">👨</span>
          </div>
          <p className="text-xs text-center mt-1 font-medium">अर्जुन</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-card border-t border-card-border">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-12 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Navigation className="h-5 w-5 mr-2" />
            समूह पर केंद्रित करें
          </Button>
          <Button 
            variant="outline" 
            className="h-12 px-4"
            onClick={() => setShowGeofenceAlert(true)}
          >
            <AlertCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;