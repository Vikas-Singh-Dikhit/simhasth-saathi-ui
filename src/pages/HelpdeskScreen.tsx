import React, { useState, useMemo, memo } from 'react';
import { QrCode, Phone, Shield, MapPin, Camera, Search, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/context/TranslationContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAppStore } from '@/store/appStore';

const HelpdeskScreen = () => {
  const [activeTab, setActiveTab] = useState('digital');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedPerson, setScannedPerson] = useState<null | { id: string; name: string; age: number; description: string; lastSeen: string }>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState<{ name: string; age: string; description: string; lastSeen: string }>({ name: '', age: '', description: '', lastSeen: '' });
  const [reportPreview, setReportPreview] = useState<typeof reportForm | null>(null);
  const [searchForm, setSearchForm] = useState<{ name: string; age: string; description: string }>({ name: '', age: '', description: '' });
  const [results, setResults] = useState<Array<{ id: string; name: string; age: number; description: string; lastSeen: string; found?: boolean }>>([]);
  const { t } = useTranslation();
  const submitReportToStore = useAppStore(s => s.submitReport);
  const markFoundInStore = useAppStore(s => s.markFound);
  const addQrScan = useAppStore(s => s.addQrScan);

  const digitalHelpOptions = useMemo(() => ([
    {
      icon: Phone,
      title: t('callVolunteer'),
      subtitle: '24/7 उपलब्ध सहायता',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      action: () => console.log('Call volunteer')
    },
    {
      icon: Shield,
      title: t('contactPolice'),
      subtitle: 'तत्काल सुरक्षा सहायता',
      color: 'text-sky-blue',
      bgColor: 'bg-sky-blue/10',
      action: () => console.log('Contact police')
    },
    {
      icon: MapPin,
      title: t('nearestHelpCenter'),
      subtitle: 'आपके पास का हेल्प डेस्क',
      color: 'text-success',
      bgColor: 'bg-success/10',
      action: () => console.log('Find help center')
    }
  ]), [t]);

  const mockPersons = useMemo(() => ([
    { id: 'LOST12345', name: 'Ravi Kumar', age: 12, description: 'Wearing blue shirt, short hair', lastSeen: 'Ramghat Entrance' },
    { id: 'LOST67890', name: 'Sita Devi', age: 65, description: 'Green saree, spectacles', lastSeen: 'Mahakal Gate 2' },
    { id: 'LOST54321', name: 'Mohan Das', age: 40, description: 'White kurta, cap', lastSeen: 'Kalideh Palace Road' },
  ]), []);

  const simulateScan = () => {
    const pick = mockPersons[Math.floor(Math.random() * mockPersons.length)];
    setScannedPerson(pick);
    addQrScan({ id: pick.id, name: pick.name });
    toast.success(`QR scanned: ${pick.id}`);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.name.trim() || !reportForm.age.trim()) {
      toast.error('Name and Age are required');
      return;
    }
    setReportPreview(reportForm);
    submitReportToStore({
      name: reportForm.name,
      age: parseInt(reportForm.age || '0', 10) || undefined,
      description: reportForm.description,
      lastSeen: reportForm.lastSeen,
    });
    setReportOpen(false);
    toast.success('Report submitted (mock)');
  };

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nf = searchForm.name.trim().toLowerCase();
    const af = parseInt(searchForm.age || '0', 10);
    const df = searchForm.description.trim().toLowerCase();
    const filtered = mockPersons.filter(p => {
      const nameOk = nf ? p.name.toLowerCase().includes(nf) : true;
      const ageOk = af ? p.age === af : true;
      const descOk = df ? p.description.toLowerCase().includes(df) : true;
      return nameOk && ageOk && descOk;
    }).map(p => ({ ...p }));
    setResults(filtered);
    toast(filtered.length ? `Found ${filtered.length} result(s)` : 'No results');
  };

  const markFound = (id: string) => {
    setResults(prev => prev.map(p => p.id === id ? { ...p, found: true } : p));
    markFoundInStore(id, true);
    toast.success('Marked as found');
  };

  return (
    <div className="flex flex-col h-[90vh] bg-background">

      {/* Tabs */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="digital" className="text-sm">{t('digitalHelp')}</TabsTrigger>
            <TabsTrigger value="lost-found" className="text-sm">{t('lostFound')}</TabsTrigger>
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
                <CardTitle className="text-lg">{t('emergencyNumbers')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{t('policeControlRoom')}</span>
                  <span className="font-mono text-primary">100</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{t('medicalEmergency')}</span>
                  <span className="font-mono text-primary">108</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{t('simhasthHelpline')}</span>
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
                    <span className="text-sm">{t('scanQR')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setReportOpen(true)}
                  >
                    <UserX className="h-8 w-8 mb-2" />
                    <span className="text-sm">{t('missingReport')}</span>
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      {t('searchPerson')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={runSearch} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="search-name">{t('searchName')}</Label>
                        <Input id="search-name" value={searchForm.name} onChange={(e) => setSearchForm(s => ({ ...s, name: e.target.value }))} placeholder={t('searchName')} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="search-age">{t('searchAge')}</Label>
                        <Input id="search-age" value={searchForm.age} onChange={(e) => setSearchForm(s => ({ ...s, age: e.target.value }))} placeholder={t('searchAge')} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="search-desc">{t('searchDescription')}</Label>
                        <Input id="search-desc" value={searchForm.description} onChange={(e) => setSearchForm(s => ({ ...s, description: e.target.value }))} placeholder={t('searchDescription')} className="mt-1" />
                      </div>
                      <div className="md:col-span-3">
                        <Button type="submit" className="w-full">{t('next')}</Button>
                      </div>
                    </form>

                    {results.length > 0 && (
                      <div className="grid grid-cols-1 gap-3">
                        {results.map((p) => (
                          <Card key={p.id} className="transition hover:shadow-medium hover:scale-[1.01]">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{p.name} • {p.age}</div>
                                <div className={`text-xs ${p.found ? 'text-success' : 'text-muted-foreground'}`}>{p.found ? 'Found' : p.id}</div>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">{p.description}</div>
                              <div className="text-xs mt-1">Last seen: {p.lastSeen}</div>
                              <div className="mt-3 flex gap-2">
                                <Button size="sm" onClick={() => markFound(p.id)} disabled={!!p.found}>{p.found ? 'Marked' : 'Mark Found'}</Button>
                                <Button size="sm" variant="outline" onClick={() => console.log('Open details', p.id)}>Details</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              // QR Scanner View
              <div className="text-center space-y-6">
                <div className="mx-auto w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-primary font-medium">{t('qrScannerTitle')}</p>
                    <p className="text-sm text-muted-foreground mt-2">{t('qrScannerCameraView')}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{t('scanQRInstruction')}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={simulateScan} className="w-full">Scan</Button>
                  <Button variant="outline" onClick={() => setShowQRScanner(false)} className="w-full">{t('back')}</Button>
                </div>

                {scannedPerson && (
                  <div className="mt-4 text-left">
                    <Card>
                      <CardContent className="p-4 space-y-1">
                        <div className="font-semibold">{scannedPerson.name} • {scannedPerson.age}</div>
                        <div className="text-sm">{scannedPerson.description}</div>
                        <div className="text-xs text-muted-foreground">Last seen: {scannedPerson.lastSeen} (QR: {scannedPerson.id})</div>
                        <div className="mt-2">
                          <Button size="sm" variant="outline" onClick={simulateScan}>Retry Scan</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Missing Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('missingReport')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReportSubmit} className="space-y-3">
            <div>
              <Label htmlFor="rname">{t('searchName')}</Label>
              <Input id="rname" value={reportForm.name} onChange={(e) => setReportForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="rage">{t('age')}</Label>
              <Input id="rage" value={reportForm.age} onChange={(e) => setReportForm(f => ({ ...f, age: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="rdesc">{t('searchDescription')}</Label>
              <Textarea id="rdesc" value={reportForm.description} onChange={(e) => setReportForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="rlast">Last Seen Location</Label>
              <Input id="rlast" value={reportForm.lastSeen} onChange={(e) => setReportForm(f => ({ ...f, lastSeen: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Submit</Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setReportForm({ name: '', age: '', description: '', lastSeen: '' })}>Reset</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Report Preview below (if submitted) */}
      {reportPreview && (
        <div className="px-4 pb-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div><span className="font-medium">Name:</span> {reportPreview.name}</div>
              <div><span className="font-medium">Age:</span> {reportPreview.age}</div>
              <div><span className="font-medium">Description:</span> {reportPreview.description || '-'}</div>
              <div><span className="font-medium">Last Seen:</span> {reportPreview.lastSeen || '-'}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default memo(HelpdeskScreen);
