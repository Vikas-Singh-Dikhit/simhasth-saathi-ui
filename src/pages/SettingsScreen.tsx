import React, { useState } from 'react';
import { 
  Globe, 
  Shield, 
  Wifi, 
  MessageSquare, 
  Bell, 
  Eye, 
  Users, 
  ArrowLeft,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from './Header';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    language: 'hi',
    offlineMode: false,
    smsBackup: true,
    notifications: true,
    locationSharing: 'group', // 'group', 'all', 'none'
    autoSOS: false
  });

  const languages = [
    { code: 'hi', name: 'हिंदी', nativeName: 'हिंदी' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृत' }
  ];

  const privacyOptions = [
    { value: 'group', label: 'केवल समूह सदस्य', desc: 'सिर्फ आपका समूह आपकी स्थिति देख सकता है' },
    { value: 'all', label: 'सभी उपयोगकर्ता', desc: 'सभी ऐप यूजर आपकी स्थिति देख सकते हैं' },
    { value: 'none', label: 'कोई नहीं', desc: 'कोई भी आपकी स्थिति नहीं देख सकता' }
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <>
    {/* <Header
        title={'सहायता केंद्र'}
        subtitle={'आपकी सुविधा के लिए सभी सेवाएं'}
        showNotifications
        onNotificationClick={() => console.log("Notifications clicked")}
      /> */}
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-4 py-4 bg-card border-b border-card-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-card-foreground">सेटिंग्स</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              भाषा चयन
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label>ऐप की भाषा</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.nativeName}</span>
                        {settings.language === lang.code && <Check className="h-4 w-4 text-primary" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                भाषा बदलने के लिए ऐप को रीस्टार्ट करना होगा
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Connectivity Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              कनेक्टिविटी
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="offline-mode" className="text-base font-medium">
                  ऑफलाइन मोड
                </Label>
                <p className="text-sm text-muted-foreground">इंटरनेट न होने पर भी काम करे</p>
              </div>
              <Switch 
                id="offline-mode"
                checked={settings.offlineMode}
                onCheckedChange={(checked) => updateSetting('offlineMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-backup" className="text-base font-medium">
                  SMS बैकअप
                </Label>
                <p className="text-sm text-muted-foreground">ऑफलाइन में SMS के द्वारा अलर्ट</p>
              </div>
              <Switch 
                id="sms-backup"
                checked={settings.smsBackup}
                onCheckedChange={(checked) => updateSetting('smsBackup', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              गोपनीयता नियंत्रण
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                कौन आपकी स्थिति देख सकता है?
              </Label>
              <div className="space-y-3">
                {privacyOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <div 
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                        settings.locationSharing === option.value
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                      onClick={() => updateSetting('locationSharing', option.value)}
                    >
                      {settings.locationSharing === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 cursor-pointer" onClick={() => updateSetting('locationSharing', option.value)}>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              सूचनाएं
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-base font-medium">
                  पुश नोटिफिकेशन
                </Label>
                <p className="text-sm text-muted-foreground">अलर्ट और अपडेट्स पाएं</p>
              </div>
              <Switch 
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sos" className="text-base font-medium">
                  ऑटो SOS
                </Label>
                <p className="text-sm text-muted-foreground">तेज हिलने पर अपने आप SOS भेजे</p>
              </div>
              <Switch 
                id="auto-sos"
                checked={settings.autoSOS}
                onCheckedChange={(checked) => updateSetting('autoSOS', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ऐप के बारे में</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>वर्जन</span>
              <span className="font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>अंतिम अपडेट</span>
              <span>15 जनवरी, 2024</span>
            </div>
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                सिंहस्थ साथी - आपका सुरक्षा साथी
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                भारत सरकार द्वारा प्रमाणित
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Reset */}
        <Card className="border-destructive/20">
          <CardContent className="p-6">
            <Button variant="destructive" className="w-full">
              सभी सेटिंग्स रीसेट करें
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              यह सभी व्यक्तिगत सेटिंग्स को वापस डिफ़ॉल्ट में कर देगा
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default SettingsScreen;