import React, { useState } from 'react';
import { QrCode, Phone, Shield, MapPin, Camera, Search, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const HelpdeskScreen = () => {
  const [activeTab, setActiveTab] = useState('digital');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const digitalHelpOptions = [
    {
      icon: Phone,
      title: 'स्वयंसेवक से बात करें',
      subtitle: '24/7 उपलब्ध सहायता',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      action: () => console.log('Call volunteer')
    },
    {
      icon: Shield,
      title: 'पुलिस से संपर्क करें',
      subtitle: 'तत्काल सुरक्षा सहायता',
      color: 'text-sky-blue',
      bgColor: 'bg-sky-blue/10',
      action: () => console.log('Contact police')
    },
    {
      icon: MapPin,
      title: 'निकटतम सहायता केंद्र',
      subtitle: 'आपके पास का हेल्प डेस्क',
      color: 'text-success',
      bgColor: 'bg-success/10',
      action: () => console.log('Find help center')
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-6 bg-card border-b border-card-border">
        <h1 className="text-2xl font-bold text-center text-card-foreground">सहायता केंद्र</h1>
        <p className="text-center text-muted-foreground mt-1">आपकी सुविधा के लिए सभी सेवाएं</p>
      </div>

      {/* Tabs */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="digital" className="text-sm">डिजिटल सहायता</TabsTrigger>
            <TabsTrigger value="lost-found" className="text-sm">खोया-पाया</TabsTrigger>
          </TabsList>

          {/* Digital Helpdesk Tab */}
          <TabsContent value="digital" className="flex-1 p-4 space-y-4">
            <div className="grid gap-4">
              {digitalHelpOptions.map((option, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-medium transition-shadow" onClick={option.action}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${option.bgColor}`}>
                        <option.icon className={`h-6 w-6 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                      </div>
                      <div className="text-muted-foreground">→</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">आपातकालीन नंबर</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">पुलिस कंट्रोल रूम</span>
                  <span className="font-mono text-primary">100</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">मेडिकल इमरजेंसी</span>
                  <span className="font-mono text-primary">108</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">सिंहस्थ हेल्पलाइन</span>
                  <span className="font-mono text-primary">1800-123-4567</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lost & Found Tab */}
          <TabsContent value="lost-found" className="flex-1 p-4 space-y-4">
            {!showQRScanner ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setShowQRScanner(true)}
                  >
                    <QrCode className="h-8 w-8 mb-2" />
                    <span className="text-sm">QR स्कैन करें</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <UserX className="h-8 w-8 mb-2" />
                    <span className="text-sm">गुमशुदा रिपोर्ट</span>
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      व्यक्ति खोजें
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="search-name">नाम</Label>
                      <Input id="search-name" placeholder="गुमशुदा व्यक्ति का नाम" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="search-age">उम्र</Label>
                      <Input id="search-age" placeholder="अनुमानित उम्र" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="search-desc">विवरण</Label>
                      <Textarea id="search-desc" placeholder="पहचान की जानकारी (कपड़े, शारीरिक निशान आदि)" className="mt-1" />
                    </div>
                    <Button className="w-full">खोजें</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">हाल की रिपोर्ट्स</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">राजेश कुमार</p>
                        <p className="text-sm text-muted-foreground">65 वर्ष • 2 घंटे पहले</p>
                      </div>
                      <span className="bg-warning/20 text-warning px-2 py-1 rounded-full text-xs">खोजा जा रहा</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">सुनीता देवी</p>
                        <p className="text-sm text-muted-foreground">58 वर्ष • 1 दिन पहले</p>
                      </div>
                      <span className="bg-success/20 text-success px-2 py-1 rounded-full text-xs">मिल गई</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // QR Scanner View
              <div className="text-center space-y-6">
                <div className="mx-auto w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-primary font-medium">QR कोड स्कैन करें</p>
                    <p className="text-sm text-muted-foreground mt-2">कैमरा व्यू यहाँ दिखेगा</p>
                  </div>
                </div>
                <p className="text-muted-foreground">व्यक्ति की पहचान के लिए QR कोड को कैमरे के सामने रखें</p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowQRScanner(false)}
                  className="w-full"
                >
                  वापस जाएं
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpdeskScreen;