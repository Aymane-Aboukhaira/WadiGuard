import React from 'react';
import { Shield, Lock, Radio, WifiOff, Server, Activity, KeyRound, Wifi } from 'lucide-react';

const ROWS = [
  { key: 'primaryLink',    icon: Wifi,     label: '4G/LTE' },
  { key: 'fallbackLink',   icon: Radio,    label: 'LoRa Secours' },
  { key: 'edgeCache',      icon: Server,   label: 'Décision Edge' },
  { key: 'tls',            icon: Lock,     label: 'TLS 1.3' },
  { key: 'vlanIsolation',  icon: Shield,   label: 'VLAN Isolation' },
  { key: 'rogueSensor',    icon: WifiOff,  label: 'Capteur suspect' },
  { key: 'auditLog',       icon: KeyRound, label: 'Journal d\'audit' },
];

const statusStyle = (value) => {
  const v = (value || '').toLowerCase();
  if (v === 'active' || v === 'immutable' || v === '4g/lte')
    return { color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', label: value.toUpperCase() };
  if (v.includes('down') || v.includes('perte'))
    return { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', label: '⛔ DOWN' };
  if (v.includes('standby'))
    return { color: 'var(--wg-muted)', bg: 'rgba(127,142,159,0.05)', border: 'var(--wg-border)', label: 'STANDBY' };
  if (v.includes('lora active') || v.includes('lora'))
    return { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', label: '📡 LORA ACTIF' };
  if (v === 'local' || v.includes('edge'))
    return { color: '#00F0FF', bg: 'rgba(0,240,255,0.06)', border: 'rgba(0,240,255,0.2)', label: '⚡ LOCAL' };
  if (v === 'degraded' || v.includes('dégradé'))
    return { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', label: '⚠️ DÉGRADÉ' };
  if (v === 'none' || v === 'no threat')
    return { color: '#22C55E', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.15)', label: 'AUCUN' };
  if (v.includes('isolated') || v.includes('isolé'))
    return { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', label: 'ISOLÉ' };
  return { color: 'var(--wg-muted)', bg: 'transparent', border: 'var(--wg-border)', label: value };
};

function CyberResiliencePanel({ cyberState }) {
  // Detect if in fallback mode
  const isFallback = cyberState.primaryLink && cyberState.primaryLink.toLowerCase().includes('down');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {ROWS.map(row => {
        const value = cyberState[row.key] || '—';
        const st = statusStyle(value);
        const Icon = row.icon;

        return (
          <div key={row.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '2px 5px', borderRadius: 3,
            background: st.color === '#EF4444' ? 'rgba(239,68,68,0.03)' : 'rgba(255,255,255,0.01)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
              <Icon size={9} color={st.color} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: '#E2E8F0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {row.label}
              </span>
            </div>
            <span className="mono-precision" style={{
              fontSize: 7, fontWeight: 700, padding: '1px 4px', borderRadius: 3,
              background: st.bg, border: `1px solid ${st.border}`, color: st.color,
              letterSpacing: '0.03em', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {st.label}
            </span>
          </div>
        );
      })}

      {/* Fallback status message */}
      {isFallback && (
        <div style={{
          marginTop: 2, padding: '3px 6px', borderRadius: 4,
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
          fontSize: 8, color: '#F59E0B', fontWeight: 600, textAlign: 'center',
        }}>
          Perte 4G simulée — bascule LoRa — décision locale maintenue
        </div>
      )}
    </div>
  );
}

export default React.memo(CyberResiliencePanel);
