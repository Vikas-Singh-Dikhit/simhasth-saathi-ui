import React, { useState } from 'react';
import { User, Users, Phone, MapPin, Settings, Share, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { StatusIndicator } from '@/components/ui/status-indicator';

const ProfileScreen = () => {
  const [shareLocation, setShareLocation] = useState(true);
  
  const userProfile = {
    name: 'राम प्रकाश शर्मा',
    age: 68,
    groupId: 'GRP-2024-001',
    phone: '+91 98765 43210',
    emergencyContacts: [
      { name: 'अजय शर्मा (बेटा)', phone: '+91 98765 43211', relation: 'पुत्र' },
      { name: 'प्रिया शर्मा (बहू)', phone: '+91 98765 43212', relation: 'पुत्रवधू' }
    ]
  };

  const handleShareLocation = () => {
    // Mock SMS sharing
    const message = `मैं सिंहस्थ में हूँ। मेरी स्थिति: https://maps.google.com/?q=23.2599,77.4126 - राम प्रकाश`;
    console.log('Sharing location via SMS:', message);
  };

  const copyGroupId = () => {
    navigator.clipboard.writeText(userProfile.groupId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-card border-b border-card-border">
        <h1 className="text-2xl font-bold text-center text-card-foreground">प्रोफ़ाइल</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {userProfile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-card-foreground">{userProfile.name}</h2>
                <p className="text-muted-foreground">उम्र: {userProfile.age} वर्ष</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusIndicator status="safe" size="sm" />
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="font-mono">{userProfile.phone}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>समूह ID: {userProfile.groupId}</span>
                <Button variant="ghost" size="sm" onClick={copyGroupId}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">आपातकालीन संपर्क</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userProfile.emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.relation}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{contact.phone}</p>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-3">
              <Phone className="h-4 w-4 mr-2" />
              संपर्क जोड़ें
            </Button>
          </CardContent>
        </Card>

        {/* Location Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">स्थान साझाकरण</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location-sharing" className="text-base font-medium">
                  समूह के साथ स्थान साझा करें
                </Label>
                <p className="text-sm text-muted-foreground">आपका समूह आपकी स्थिति देख सकेगा</p>
              </div>
              <Switch 
                id="location-sharing"
                checked={shareLocation}
                onCheckedChange={setShareLocation}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleShareLocation}
              disabled={!shareLocation}
            >
              <Share className="h-4 w-4 mr-2" />
              SMS के द्वारा स्थान भेजें
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              ऑफलाइन मोड में SMS के माध्यम से अपनी स्थिति साझा करें
            </p>
          </CardContent>
        </Card>

        {/* Group Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">समूह जानकारी</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>कुल सदस्य</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ऑनलाइन सदस्य</span>
                <span className="font-semibold text-success">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>समूह बनाया</span>
                <span className="text-sm text-muted-foreground">2 दिन पहले</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              <Users className="h-4 w-4 mr-2" />
              समूह सदस्य देखें
            </Button>
          </CardContent>
        </Card>

        {/* Settings Link */}
        <Button 
          variant="outline" 
          className="w-full h-12 text-left justify-start"
          onClick={() => window.location.href = '/settings'}
        >
          <Settings className="h-5 w-5 mr-3" />
          <div>
            <p className="font-medium">सेटिंग्स</p>
            <p className="text-sm text-muted-foreground">भाषा, गोपनीयता और अन्य विकल्प</p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;