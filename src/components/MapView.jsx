import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LEVELS } from '../data/assets';
import { RIVERS, IMPACT_ZONES, CRITICAL_INFRA, EVACUATION_ROUTES } from '../data/regions';
import { levelColor } from '../utils';
import { SlidersHorizontal, MapPin, Route, Navigation, AlertOctagon } from 'lucide-react';

const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_SAT  = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const TILE_TOPO = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';

const INFRA_ICONS = {
  hospital: {
    svg: `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
    color: '#EF4444'
  },
  school: {
    svg: `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
    color: '#F59E0B'
  },
  bridge: {
    svg: `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 8v8M21 8v8M6 12a6 6 0 0 1 12 0"/></svg>`,
    color: '#3B82F6'
  },
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
}

function MapView({ assets, selectedAsset, setSelectedAssetId, layers, setLayers, scenario, phase, theme = 'dark', fullscreen = false }) {
  const [mapType, setMapType] = React.useState('dark');
  const center = selectedAsset ? selectedAsset.coord : [35.48, -5.18];
  const zoom = fullscreen ? 9 : (selectedAsset ? 10 : 8);
  const isAlert = phase.level === 'red' || phase.level === 'black';
  const isActive = phase.level !== 'green';
  const demoMode = phase.storyStep ? 'jury' : 'live';
  const decisionStage = phase.decisionStage || 'detection';

  const activeTileUrl = useMemo(() => {
    if (mapType === 'satellite') return TILE_SAT;
    if (mapType === 'topographic') return TILE_TOPO;
    return theme === 'light' ? TILE_LIGHT : TILE_DARK;
  }, [mapType, theme]);

  const getRiskColor = (score) => {
    if (score > 70) return '#EF4444';
    if (score > 40) return '#F59E0B';
    return '#10B981';
  };

  // Road closure labels from affected gate/road assets
  const roadClosureAssets = useMemo(() => {
    if (!isAlert) return [];
    return assets.filter(a =>
      a.type === 'road' && a.affected && (a.status === 'red' || a.status === 'black')
    );
  }, [assets, isAlert]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 8, border: '1px solid var(--wg-border)', flex: 1, minHeight: 0, height: '100%' }}>

      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        attributionControl={true}
        style={{ width: '100%', height: '100%', background: 'var(--wg-bg-deep)' }}
      >
        <ChangeView center={center} zoom={zoom} />

        <TileLayer
          url={activeTileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* ── Rivers (Animated flood wave propagation) ── */}
        {layers.rivers && Object.entries(RIVERS).map(([key, coords]) => {
          const active = scenario.affected.some(id => id.toLowerCase().includes(key));
          const riverColor = active && isActive
            ? (isAlert ? '#EF4444' : phase.level === 'orange' ? '#F59E0B' : 'var(--wg-cyan)')
            : '#1E2530';
          const riverClass = active && isActive
            ? (isAlert ? 'river-active-red' : phase.level === 'orange' ? 'river-active-orange' : 'river-active')
            : '';
          return (
            <Polyline
              key={key}
              positions={coords}
              pathOptions={{
                color: riverColor,
                weight: active && isActive ? (isAlert ? 5.5 : 4) : 2,
                opacity: active && isActive ? 0.95 : 0.35,
                lineCap: 'round', lineJoin: 'round',
                className: riverClass,
              }}
            />
          );
        })}

        {/* ── Evacuation Routes ── */}
        {layers.impacts && EVACUATION_ROUTES.map(route => {
          const showActive = isAlert;
          return (
            <Polyline
              key={route.id}
              positions={route.coords}
              pathOptions={{
                color: showActive ? '#22C55E' : '#1A2F4A',
                weight: showActive ? 3 : 1.5,
                opacity: showActive ? 0.8 : 0.25,
                dashArray: showActive ? '8 6' : '4 4',
                className: showActive ? 'evac-route-active' : '',
              }}
            >
              <Popup>
                <div style={{ padding: 6, color: 'var(--wg-text)', background: 'var(--wg-bg-deep)', fontFamily: 'Outfit, sans-serif', minWidth: 150 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#22C55E' }}>🚶 {route.name}</p>
                  <p style={{ fontSize: 9, color: 'var(--wg-muted)', marginTop: 2 }}>{route.province}</p>
                  <p style={{ fontSize: 9, color: showActive ? '#22C55E' : 'var(--wg-muted)', marginTop: 2, fontWeight: 600 }}>
                    {showActive ? '● ROUTE D\'ÉVACUATION ACTIVE' : 'Standby'}
                  </p>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* ── Evacuation Route Labels ── */}
        {layers.impacts && isAlert && EVACUATION_ROUTES.map(route => {
          const mid = route.coords[Math.floor(route.coords.length / 2)];
          const evacIcon = L.divIcon({
            className: 'custom-noc-icon',
            html: `<div class="map-evac-label">
              <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px;color:#22C55E;"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8l4 4-4 4M8 12h8"/></svg>
              ÉVAC · ${route.name.split(' ').slice(0,2).join(' ')}
            </div>`,
            iconSize: [120, 16],
            iconAnchor: [60, 20],
          });
          return <Marker key={`evac-lbl-${route.id}`} position={mid} icon={evacIcon} zIndexOffset={700} />;
        })}

        {/* ── Impact Zone Polygons ── */}
        {layers.impacts && isActive && scenario.zones.map((zk) => {
          const coords = IMPACT_ZONES[zk];
          if (!coords) return null;
          const c = levelColor(phase.level);
          const isPredictFocus = demoMode === 'jury' && decisionStage === 'prediction';
          const polyClass = isAlert
            ? (isPredictFocus ? 'impact-zone-alert scene-focus' : 'impact-zone-alert')
            : (isPredictFocus ? 'scene-focus' : '');

          return (
            <Polygon
              key={zk}
              positions={coords}
              pathOptions={{
                color: c,
                fillColor: c,
                fillOpacity: phase.level === 'black' ? 0.22 : phase.level === 'red' ? 0.14 : 0.08,
                weight: 2,
                opacity: 0.8,
                dashArray: isAlert ? '6 4' : '',
                className: polyClass,
              }}
            />
          );
        })}

        {/* ── ETA / Situation Badges (floating map labels) ── */}
        {isActive && selectedAsset && (() => {
          const badges = [];
          // Upstream detection badge near first affected asset
          const upstreamAsset = assets.find(a => a.affected && a.type !== 'road');
          const isDetectFocus = demoMode === 'jury' && decisionStage === 'detection';
          
          if (upstreamAsset) {
            const upIcon = L.divIcon({
              className: `custom-noc-icon ${isDetectFocus ? 'scene-focus focus-pulse' : ''}`,
              html: `<div class="map-eta-badge ${isAlert ? 'alert' : 'warning'}">
                <span>Détection amont</span>
              </div>`,
              iconSize: [140, 22],
              iconAnchor: [70, 30],
            });
            badges.push(
              <Marker key="eta-upstream" position={upstreamAsset.coord} icon={upIcon} zIndexOffset={900} />
            );
          }
          // ETA badge near selected asset
          if (selectedAsset.etaMinutes && isAlert) {
            const isPredictStage = demoMode === 'jury' && decisionStage === 'prediction';
            const etaIcon = L.divIcon({
              className: `custom-noc-icon ${isPredictStage ? 'scene-focus' : ''}`,
              html: `<div class="map-eta-badge alert">
                <span>⏱ Impact estimé : ${selectedAsset.etaMinutes} min</span>
              </div>`,
              iconSize: [160, 22],
              iconAnchor: [80, -6],
            });
            badges.push(
              <Marker key="eta-impact" position={selectedAsset.coord} icon={etaIcon} zIndexOffset={900} />
            );
          }
          // Impact zone label at center of first zone
          const firstZone = scenario.zones?.[0];
          const zoneCoords = firstZone && IMPACT_ZONES[firstZone];
          if (zoneCoords && isAlert) {
            const centerLat = zoneCoords.reduce((s, c) => s + c[0], 0) / zoneCoords.length;
            const centerLng = zoneCoords.reduce((s, c) => s + c[1], 0) / zoneCoords.length;
            const zoneIcon = L.divIcon({
              className: 'custom-noc-icon',
              html: `<div class="map-zone-label">Zone d'impact prédite</div>`,
              iconSize: [130, 18],
              iconAnchor: [65, 9],
            });
            badges.push(
              <Marker key="zone-label" position={[centerLat, centerLng]} icon={zoneIcon} zIndexOffset={850} />
            );
          }
          return badges;
        })()}

        {/* Critical Infra */}
        {layers.impacts && CRITICAL_INFRA.map(ci => {
          const meta = INFRA_ICONS[ci.type] || INFRA_ICONS.bridge;
          const infraIcon = L.divIcon({
            className: 'custom-noc-icon',
            html: `<div class="infra-marker ${isAlert ? 'alert' : ''}" style="--ic: ${meta.color};">
              <span class="infra-emoji" style="display:grid;place-items:center;width:100%;height:100%;color:${meta.color};">${meta.svg}</span>
            </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          return (
            <Marker key={ci.id} position={ci.coord} icon={infraIcon}>
              <Popup>
                <div style={{ padding: 6, color: 'var(--wg-text)', background: 'var(--wg-bg-deep)', fontFamily: 'Outfit, sans-serif', minWidth: 140 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: meta.color }}>Infrastructure critique</p>
                  <p style={{ fontSize: 9, color: 'var(--wg-muted)', marginTop: 2 }}>{ci.name} · {ci.province}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ── Road Closure Labels ── */}
        {roadClosureAssets.map(asset => {
          const isResponseStage = demoMode === 'jury' && decisionStage === 'response';
          const closureIcon = L.divIcon({
            className: `custom-noc-icon ${isResponseStage ? 'scene-focus' : ''}`,
            html: `<div class="road-closure-label">
              <span>
                <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;color:#fff;"><circle cx="12" cy="12" r="10" fill="#EF4444" stroke="none"/><path d="M8 12h8"/></svg>
                ${asset.shortName || asset.name.split(' ').slice(0,2).join(' ')} — FERMÉE
              </span>
            </div>`,
            iconSize: [140, 24],
            iconAnchor: [70, 12],
          });
          return (
            <Marker key={`closure-${asset.id}`} position={asset.coord} icon={closureIcon} zIndexOffset={800}>
              <Popup>
                <div style={{ padding: 6, color: 'var(--wg-text)', background: 'var(--wg-bg-deep)', fontFamily: 'Outfit, sans-serif', minWidth: 160 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#EF4444' }}>🚧 {asset.name}</p>
                  <p style={{ fontSize: 9, color: 'var(--wg-muted)', marginTop: 2 }}>VMS : ROUTE FERMÉE — CRUE EN COURS</p>
                  <p style={{ fontSize: 9, color: '#F59E0B', marginTop: 2 }}>Barrière abaissée · Feux rouges clignotants</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ── Asset Markers with Scene Highlighting ── */}
        {assets
          .filter(a => a.type === 'dam' ? layers.dams : a.type === 'road' ? layers.roads : layers.rivers)
          .map((asset) => {
            const isSelected = asset.id === selectedAsset.id;
            const rColor = getRiskColor(asset.riskScore);

            let pulseClass = '';
            if (asset.status === 'red') pulseClass = 'marker-pulse-red';
            if (asset.status === 'black') pulseClass = 'marker-pulse-black';

            // Calculate scene focus class for the 90s demo
            let sceneClass = '';
            if (demoMode === 'jury') {
              if (decisionStage === 'detection') {
                const isUpstream = asset.affected && asset.type === 'sensor';
                if (isUpstream) sceneClass = 'scene-focus focus-contour focus-pulse';
                else sceneClass = 'scene-dimmed';
              } else if (decisionStage === 'validation') {
                if (asset.type === 'sensor' && asset.affected) sceneClass = 'scene-focus focus-contour';
                else sceneClass = 'scene-dimmed';
              } else if (decisionStage === 'prediction') {
                sceneClass = 'scene-dimmed';
              } else if (decisionStage === 'alert') {
                if (asset.status === 'red' || asset.status === 'black') sceneClass = 'scene-focus';
                else sceneClass = 'scene-dimmed';
              } else if (decisionStage === 'response') {
                if (asset.type === 'road') sceneClass = 'scene-focus focus-contour';
                else sceneClass = 'scene-dimmed';
              } else if (decisionStage === 'report') {
                sceneClass = 'scene-dimmed';
              }
            }

            const markerHtml = `
              <div class="noc-marker ${isSelected ? 'selected' : ''} ${pulseClass}" style="--mc: ${rColor};">
                <div class="noc-marker-core" style="background: ${rColor};"></div>
                <div class="noc-marker-ring" style="border-color: ${rColor};"></div>
              </div>
            `;

            const customIcon = L.divIcon({
              className: `custom-noc-icon ${sceneClass}`,
              html: markerHtml,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            const isRoadClosed = asset.type === 'road' && asset.affected && isAlert;
            const currentAction = phase.actions?.[0] || '';

            return (
              <Marker
                key={asset.id}
                position={asset.coord}
                icon={customIcon}
                eventHandlers={{ click: () => setSelectedAssetId(asset.id) }}
                zIndexOffset={isSelected ? 1000 : asset.status === 'red' || asset.status === 'black' ? 500 : 0}
              >
                <Popup>
                  <div style={{ padding: 8, minWidth: 190, color: 'var(--wg-text)', background: 'var(--wg-bg-deep)', fontFamily: 'Outfit, sans-serif' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: rColor, boxShadow: `0 0 6px ${rColor}` }} />
                      <b style={{ fontSize: 12, color: 'var(--wg-text)' }}>{asset.name}</b>
                    </div>

                    {/* Telemetry grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 6 }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--wg-border)', padding: '3px 5px', borderRadius: 4, textAlign: 'center' }}>
                        <p style={{ fontSize: 7, color: 'var(--wg-muted)', textTransform: 'uppercase', margin: 0 }}>Eau</p>
                        <p className="mono-precision" style={{ fontWeight: 700, fontSize: 11, margin: 0, color: rColor }}>{asset.water}%</p>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--wg-border)', padding: '3px 5px', borderRadius: 4, textAlign: 'center' }}>
                        <p style={{ fontSize: 7, color: 'var(--wg-muted)', textTransform: 'uppercase', margin: 0 }}>Pluie</p>
                        <p className="mono-precision" style={{ fontWeight: 700, fontSize: 11, margin: 0, color: 'var(--wg-cyan)' }}>{asset.rain}mm</p>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--wg-border)', padding: '3px 5px', borderRadius: 4, textAlign: 'center' }}>
                        <p style={{ fontSize: 7, color: 'var(--wg-muted)', textTransform: 'uppercase', margin: 0 }}>Risque</p>
                        <p className="mono-precision" style={{ fontWeight: 700, fontSize: 11, margin: 0, color: rColor }}>{asset.riskScore}</p>
                      </div>
                    </div>

                    {/* Province + Basin */}
                    <p style={{ fontSize: 9, color: 'var(--wg-muted)', margin: '0 0 3px' }}>{asset.province} · {asset.basin}</p>

                    {/* ETA */}
                    {asset.etaMinutes && (
                      <p style={{ color: rColor, fontSize: 10, margin: '3px 0', fontWeight: 700 }}>⏱ ETA Impact : {asset.etaMinutes} min</p>
                    )}

                    {/* Active action */}
                    {asset.affected && currentAction && (
                      <p style={{ fontSize: 9, color: 'var(--wg-cyan)', margin: '3px 0', borderTop: '1px solid var(--wg-border)', paddingTop: 3 }}>
                        ▸ {currentAction}
                      </p>
                    )}

                    {/* Road closure */}
                    {isRoadClosed && (
                      <div style={{ marginTop: 3, padding: '3px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', textAlign: 'center' }}>
                        <p style={{ fontSize: 9, fontWeight: 800, color: '#EF4444', margin: 0 }}>🚧 ROUTE FERMÉE</p>
                      </div>
                    )}

                    {/* Status badge */}
                    <div style={{ marginTop: 4, display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{
                        fontSize: 8, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        color: levelColor(asset.status),
                        background: `${levelColor(asset.status)}15`,
                        border: `1px solid ${levelColor(asset.status)}30`,
                      }}>
                        {LEVELS[asset.status]?.label}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Top-left: Tactical location label */}
      <div className="glass-deep text-truncate-precision" style={{ position: 'absolute', left: 10, top: 10, zIndex: 500, borderRadius: 6, padding: '5px 10px', pointerEvents: 'none', border: `1px solid ${isAlert ? levelColor(phase.level) + '30' : 'var(--wg-border)'}` }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: 'var(--wg-text)' }}>
          <MapPin size={11} color={isActive ? levelColor(phase.level) : 'var(--wg-cyan)'} />
          {isActive ? `${scenario.name}` : 'Surveillance Nominale · TTA'}
        </p>
        <p style={{ fontSize: 8.5, color: 'var(--wg-muted)', marginTop: 1 }} className="mono-precision">
          {isActive ? `Bassins: ${scenario.zones.map(z => z.charAt(0).toUpperCase() + z.slice(1)).join(' · ')}` : 'Bassins Loukkos · Martil · Nekor'}
        </p>
      </div>

      {/* Controls: Overlays panel */}
      <div className="glass-deep" style={{ position: 'absolute', right: 10, top: 10, zIndex: 500, borderRadius: 6, padding: '8px 10px', minWidth: 130, border: '1px solid var(--wg-border)' }}>
        <p className="section-label" style={{ marginBottom: 4, fontSize: '7.5px' }}>Fonds de carte</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 }}>
          {[['dark', 'Dark Mode'], ['satellite', 'Satellite'], ['topographic', 'Topographic']].map(([val, label]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--wg-text)', cursor: 'pointer' }}>
              <input type="radio" name="mapType" checked={mapType === val} onChange={() => setMapType(val)} style={{ accentColor: 'var(--wg-cyan)' }} />
              {label}
            </label>
          ))}
        </div>
        <p className="section-label" style={{ marginBottom: 4, fontSize: '7.5px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <SlidersHorizontal size={9} /> Overlays
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[['dams', 'Barrages'], ['rivers', 'Oueds'], ['roads', 'Routes/Gates'], ['impacts', 'Zones d\'impact']].map(([k, l]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--wg-text)', cursor: 'pointer' }}>
              <input type="checkbox" checked={layers[k]} onChange={() => setLayers(cur => ({ ...cur, [k]: !cur[k] }))} style={{ accentColor: 'var(--wg-cyan)', cursor: 'pointer' }} />
              {l}
            </label>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-deep" style={{ position: 'absolute', left: 10, bottom: 10, zIndex: 500, borderRadius: 6, padding: '5px 7px', pointerEvents: 'none', border: '1px solid var(--wg-border)' }}>
        <p className="section-label" style={{ fontSize: '7px', marginBottom: 3 }}>Légende</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(LEVELS).map(([k, lv]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8.5, color: 'var(--wg-muted)' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: lv.color, flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: 'var(--wg-text)' }}>{lv.label}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--wg-border)', marginTop: 3, paddingTop: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            [`<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`, 'Infrastructure'],
            [`<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#22C55E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8l4 4-4 4M8 12h8"/></svg>`, 'Évacuation'],
            [`<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>`, 'Route fermée'],
            [`<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`, "Zone d'impact"],
          ].map(([svg, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, color: 'var(--wg-muted)' }}>
              <span style={{ width: 10, height: 10, display: 'grid', placeItems: 'center' }} dangerouslySetInnerHTML={{ __html: svg }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        {isActive && (
          <p style={{ fontSize: 7, color: 'var(--wg-muted)', marginTop: 3, fontStyle: 'italic', borderTop: '1px solid var(--wg-border)', paddingTop: 2 }}>Simulation</p>
        )}
      </div>
    </div>
  );
}

export default React.memo(MapView);
