import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, Navigation, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useTranslation } from '@/context/TranslationContext';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  position: { lat: number; lng: number };
  status: 'safe' | 'warning' | 'danger';
}

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Recenter map component
const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], map.getZoom());
  return null;
};

// Routing component
const RoutingMachine: React.FC<{ from: L.LatLngExpression; to: L.LatLngExpression }> = ({ from, to }) => {
  const map = useMap();
  useEffect(() => {
    if (!from || !to) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      lineOptions: { styles: [{ color: 'blue', weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    } as any).addTo(map);

    // cleanup correctly
    return () => {
      map.removeControl(control);
    };
  }, [from, to, map]);
  return null;
};

const MapScreen: React.FC = () => {
  const { t } = useTranslation(); // ✅ Translation hook
  const [showGeofenceAlert, setShowGeofenceAlert] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const mapRef = React.useRef<L.Map | null>(null);

  // Track user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        setGroupMembers([
          { id: '1', name: 'राम शर्मा', avatar: '👴', position: { lat: userLat + 0.0005, lng: userLng + 0.0005 }, status: 'safe' },
          { id: '2', name: 'सीता देवी', avatar: '👵', position: { lat: userLat - 0.0004, lng: userLng + 0.0006 }, status: 'safe' },
          { id: '3', name: 'अर्जुन', avatar: '👨', position: { lat: userLat + 0.0006, lng: userLng - 0.0005 }, status: 'warning' },
        ]);
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const groupStatus = groupMembers.every(m => m.status === 'safe') ? 'safe' : 'warning';

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Status Panel */}
      <div className="px-4 py-3 bg-card border-b border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-card-foreground">{t('groupStatus')}</h2>
              <p className="text-sm text-muted-foreground">{groupMembers.length} {t('members')}</p>
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
              अर्जुन {t('safe')} क्षेत्र से बाहर गए हैं
              <Button
                variant="outline"
                size="sm"
                className="ml-2 h-6 px-2 text-xs border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                onClick={() => setShowGeofenceAlert(false)}
              >
                {t('viewMap')}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Leaflet Map */}
      <div className="flex-1">
        <div className="absolute bottom-[11rem] right-[10%] translate-x-1/2 z-[999]">
          <Button
            variant="default"
            size="sm"
            className="p-2 rounded-full shadow-md bg-[white] w-[51px] h-[51px] hover:bg-[white]"
            onClick={() => {
              if (userLocation) mapRef.current?.flyTo([userLocation.lat, userLocation.lng], 18);
            }}
          >
            <Locate className='!w-[50px] !h-[50px] text-blue-600' strokeWidth={2.25} />
          </Button>
        </div>

        <MapContainer center={userLocation ?? [23.2599, 77.4126]} zoom={18} className="h-full w-full" ref={mapRef}>
          <TileLayer url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={['mt0','mt1','mt2','mt3']} />
          {userLocation && <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />}
          {userLocation && <Marker position={[userLocation.lat, userLocation.lng]}><Popup>{t('youAreHere')}</Popup></Marker>}

          {groupMembers.map(member => (
            <Marker key={member.id} position={[member.position.lat, member.position.lng]} eventHandlers={{ click: () => setSelectedMember(member) }}>
              <Tooltip permanent direction="top" offset={[0, -10]}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{member.avatar}</span>
                  <span>{member.name}</span>
                </div>
              </Tooltip>
            </Marker>
          ))}

          {userLocation && selectedMember && (
            <RoutingMachine from={[userLocation.lat, userLocation.lng]} to={[selectedMember.position.lat, selectedMember.position.lng]} />
          )}
        </MapContainer>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-card border-t border-card-border">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12 text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            <Navigation className="h-5 w-5 mr-2" />
            {t('focusOnGroup')}
          </Button>
          <Button variant="outline" className="h-12 px-4" onClick={() => setShowGeofenceAlert(true)}>
            <AlertCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
