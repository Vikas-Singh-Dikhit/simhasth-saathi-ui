import React, { useState } from 'react';
import { User, Users, Phone, MapPin, Settings, Share, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/context/TranslationContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    const message = `${t('locationMessage')} - ${userProfile.name}`;
    console.log('Sharing location via SMS:', message);
  };

  const copyGroupId = () => {
    navigator.clipboard.writeText(userProfile.groupId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
                <p className="text-muted-foreground">{t('age')}: {userProfile.age}</p>
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
                <span>{t('groupId')}: {userProfile.groupId}</span>
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
            <CardTitle className="text-lg">{t('emergencyContacts')}</CardTitle>
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
              {t('addContact')}
            </Button>
          </CardContent>
        </Card>

        {/* Location Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('locationSharing')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location-sharing" className="text-base font-medium">
                  {t('shareLocation')}
                </Label>
                <p className="text-sm text-muted-foreground">{t('shareLocationDesc')}</p>
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
              {t('sendLocationSMS')}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {t('offlineLocationInfo')}
            </p>
          </CardContent>
        </Card>

        {/* Group Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('groupInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>{t('totalMembers')}</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('onlineMembers')}</span>
                <span className="font-semibold text-success">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('groupCreated')}</span>
                <span className="text-sm text-muted-foreground">2 दिन पहले</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              <Users className="h-4 w-4 mr-2" />
              {t('viewGroupMembers')}
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
            <p className="font-medium">{t('settings')}</p>
            <p className="text-sm text-muted-foreground">{t('settingsDesc')}</p>
          </div>
        </Button>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full mt-6"
          onClick={() => {
            localStorage.removeItem('groupEnabled');
            localStorage.removeItem('groupCode');
            navigate('/');
          }}
        >
          <User className="h-4 w-4 mr-2" />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;
