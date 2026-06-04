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
    return { color: 'var(--wg-green)', bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.2)', label: value.toUpperCase() };
  if (v.includes('down') || v.includes('perte') || v.includes('inactif'))
    return { color: 'var(--wg-red)', bg: 'rgba(220,38,38,0.1)', border: 'rgba(220,38,38,0.25)', label: 'DOWN' };
  if (v.includes('standby'))
    return { color: 'var(--wg-muted)', bg: 'rgba(127,142,159,0.05)', border: 'var(--wg-border)', label: 'STANDBY' };
  if (v.includes('lora active') || v.includes('lora'))
    return { color: 'var(--wg-orange)', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.25)', label: 'LORA ACTIF' };
  if (v === 'local' || v.includes('edge'))
    return { color: 'var(--wg-cyan)', bg: 'rgba(0,240,255,0.06)', border: 'rgba(0,240,255,0.2)', label: 'LOCAL' };
  if (v === 'degraded' || v.includes('dégradé'))
    return { color: 'var(--wg-orange)', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)', label: 'DÉGRADÉ' };
  if (v === 'none' || v === 'no threat')
    return { color: 'var(--wg-green)', bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.15)', label: 'AUCUN' };
  if (v.includes('isolated') || v.includes('isolé'))
    return { color: 'var(--wg-red)', bg: 'rgba(220,38,38,0.1)', border: 'rgba(220,38,38,0.25)', label: 'ISOLÉ' };
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
            padding: '4px 6px', borderRadius: 3,
            background: st.color === 'var(--wg-red)' ? 'rgba(220,38,38,0.03)' : 'var(--wg-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
              <Icon size={11} color={st.color} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--wg-text)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {row.label}
              </span>
            </div>
            <span className="mono-precision" style={{
              fontSize: 9.5, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
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
          marginTop: 4, padding: '5px 8px', borderRadius: 4,
          background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)',
          fontSize: 10, color: 'var(--wg-orange)', fontWeight: 600, textAlign: 'center',
        }}>
          Perte 4G simulée — bascule LoRa — décision locale maintenue
        </div>
      )}
    </div>
  );
}

export default React.memo(CyberResiliencePanel);
