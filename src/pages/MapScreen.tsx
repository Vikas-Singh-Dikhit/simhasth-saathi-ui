import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { Users, AlertCircle, Navigation, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useTranslation } from '@/context/TranslationContext';
import { useGroup } from '@/context/GroupContext';

// Group members are provided by GroupContext

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const MapScreen: React.FC = () => {
  const { t } = useTranslation(); // ✅ Translation hook
  const { members, setUserLocation, userLocation } = useGroup();
  const [showGeofenceAlert, setShowGeofenceAlert] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userPathRef = useRef<L.Polyline | null>(null);
  const memberMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const lastGeoUpdateTsRef = useRef<number>(0);
  const lastHeadingRef = useRef<number | undefined>(undefined);
  const routingControlRef = useRef<any>(null);
  const routePopupRef = useRef<L.Popup | null>(null);
  const lastFitForMemberIdRef = useRef<string | null>(null);

  // Directional triangle icons (rotated by heading)
  const buildDirectionalIcon = useCallback((color: string, headingDeg?: number) => {
    const rotation = headingDeg ?? 0;
    const svg = `
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg);">
        <g>
          <polygon points="12,2 20,22 12,18 4,22" fill="${color}" stroke="white" stroke-width="2" />
        </g>
      </svg>`;
    return L.divIcon({ html: svg, className: 'direction-icon', iconSize: [24, 24], iconAnchor: [12, 12] });
  }, []);

  // Track user location with throttling (3–5s) and feed into GroupContext
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        const minInterval = 3000 + Math.random() * 2000;
        if (now - lastGeoUpdateTsRef.current < minInterval) return;
        lastGeoUpdateTsRef.current = now;
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const heading = typeof position.coords.heading === 'number' && !Number.isNaN(position.coords.heading)
          ? position.coords.heading
          : undefined;
        lastHeadingRef.current = heading;
        setUserLocation(userLat, userLng);
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [setUserLocation]);

  // Mount user marker and path once when both map and user location exist
  useEffect(() => {
    if (!mapRef.current || !userLocation || userMarkerRef.current) return;
    const marker = L.marker([userLocation.lat, userLocation.lng], { icon: buildDirectionalIcon('#2563eb', lastHeadingRef.current) }).addTo(mapRef.current);
    userMarkerRef.current = marker;
    const path = L.polyline([[userLocation.lat, userLocation.lng]], { color: '#2563eb', weight: 4, opacity: 0.7 }).addTo(mapRef.current);
    userPathRef.current = path;
    // initial view without changing zoom level drastically
    mapRef.current.setView([userLocation.lat, userLocation.lng], mapRef.current.getZoom());
  }, [userLocation, buildDirectionalIcon]);

  // Imperatively update user marker and path on userLocation change
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      userMarkerRef.current.setIcon(buildDirectionalIcon('#2563eb', lastHeadingRef.current));
    }
    if (userPathRef.current) {
      userPathRef.current.addLatLng([userLocation.lat, userLocation.lng]);
    }
    // auto-pan only if getting near viewport edge
    const map = mapRef.current;
    const bounds = map.getBounds();
    const latlng = L.latLng(userLocation.lat, userLocation.lng);
    if (!bounds.pad(-0.3).contains(latlng)) {
      map.panTo(latlng, { animate: true } as any);
    }
  }, [userLocation, buildDirectionalIcon]);

  const groupStatus = useMemo(() => 'safe' as const, []);

  const handleLocate = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], mapRef.current.getZoom());
    }
  }, [userLocation]);

  const handleMarkerClick = useCallback((member: any) => () => setSelectedMember(member), []);

  // Imperatively manage member markers for smooth updates
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const cache = memberMarkersRef.current;
    const presentIds = new Set<string>();
    members.filter(m => !m.isSelf).forEach((m) => {
      presentIds.add(m.id);
      const icon = buildDirectionalIcon('#16a34a', m.headingDeg);
      const existing = cache.get(m.id);
      if (existing) {
        existing.setLatLng([m.position.lat, m.position.lng]);
        existing.setIcon(icon);
      } else {
        const newMarker = L.marker([m.position.lat, m.position.lng], { icon })
          .addTo(map)
          .bindTooltip(m.name, { permanent: true, direction: 'top', offset: L.point(0, -10) });
        newMarker.on('click', () => setSelectedMember(m));
        cache.set(m.id, newMarker);
      }
    });
    // cleanup missing
    for (const [id, marker] of cache.entries()) {
      if (!presentIds.has(id)) {
        map.removeLayer(marker);
        cache.delete(id);
      }
    }
  }, [members, buildDirectionalIcon]);

  // Clear selected member by clicking on the map background
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const onMapClick = () => setSelectedMember(null);
    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, []);

  // Live path between user and selected member
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Resolve current selected member from live members array
    const selected = selectedMember ? members.find(m => m.id === selectedMember.id) : null;
    const userPos = userLocation ? L.latLng(userLocation.lat, userLocation.lng) : null;
    const memberPos = selected ? L.latLng(selected.position.lat, selected.position.lng) : null;

    if (userPos && memberPos && selected) {
      // Build or update routing control (OSRM)
      const waypoints = [userPos, memberPos];
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints(waypoints);
      } else {
        const osrmRouter = (L as any).Routing.OSRMv1 ? new (L as any).Routing.OSRMv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }) : undefined;
        const control = (L as any).Routing.control({
          waypoints,
          router: osrmRouter,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          show: false,
          showAlternatives: true,
          lineOptions: { styles: [{ color: '#2563eb', weight: 5, opacity: 0.9 }] },
          altLineOptions: { styles: [{ color: '#9ca3af', weight: 4, opacity: 0.6, dashArray: '6,8' }] },
        })
        .on('routesfound', (e: any) => {
          // Show popup with distance + ETA at mid point of main route
          const route = e.routes?.[0];
          if (!route) return;
          const distKm = (route.summary.totalDistance / 1000).toFixed(2);
          const etaMin = Math.round(route.summary.totalTime / 60);
          const midIndex = Math.floor(route.coordinates.length / 2);
          const mid = route.coordinates[midIndex];
          if (!routePopupRef.current) {
            routePopupRef.current = L.popup();
          }
          routePopupRef.current
            .setLatLng([mid.lat, mid.lng])
            .setContent(`<div><strong>${distKm} km</strong> • ${etaMin} min</div>`)
            .openOn(map);
        })
        .addTo(map);
        routingControlRef.current = control;
      }
      // Fit bounds only when a new member is selected
      if (lastFitForMemberIdRef.current !== selected.id) {
        const bounds = L.latLngBounds([userPos, memberPos]);
        map.fitBounds(bounds.pad(0.2), { animate: true } as any);
        lastFitForMemberIdRef.current = selected.id;
      }
    } else {
      // No active selection -> remove routing and popup if exists
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      if (routePopupRef.current) {
        map.closePopup(routePopupRef.current);
        routePopupRef.current = null;
      }
      lastFitForMemberIdRef.current = null;
    }
  }, [selectedMember, members, userLocation]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Status Panel */}
      <div className="px-4 py-3 bg-card border-b border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-card-foreground">{t('groupStatus')}</h2>
              <p className="text-sm text-muted-foreground">{members.length} {t('members')}</p>
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
        {/* Selected member history panel */}
        {selectedMember && selectedMember.path && (
          <div className="absolute top-4 right-4 z-[999] bg-card border border-card-border rounded-md shadow-medium max-w-[260px]">
            <div className="p-3 border-b border-card-border font-medium">{selectedMember.name} - Recent locations</div>
            <div className="p-3 max-h-48 overflow-auto space-y-2 text-sm">
              {[...selectedMember.path].slice(-10).reverse().map((p: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span>{p.lat.toFixed(5)}, {p.lng.toFixed(5)}</span>
                  <span className="text-xs text-muted-foreground">{new Date(p.ts).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="absolute bottom-[11rem] right-[10%] translate-x-1/2 z-[999]">
          <Button
            variant="default"
            size="sm"
            className="p-2 rounded-full shadow-md bg-[white] w-[51px] h-[51px] hover:bg-[white]"
            onClick={handleLocate}
          >
            <Locate className='!w-[50px] !h-[50px] text-blue-600' strokeWidth={2.25} />
          </Button>
        </div>

        <MapContainer center={[23.1765, 75.7884]} zoom={14} className="h-full w-full" whenReady={() => { /* assigned in ref below */ }} ref={(instance) => { if (instance) { /* @ts-ignore */ mapRef.current = instance; } }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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

export default memo(MapScreen);
