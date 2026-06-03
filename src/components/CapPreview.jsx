import React, { useMemo, useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { generateRef, dateStamp, timeStamp } from '../utils';

function CapPreview({ scenario, phase, consequences }) {
  const [copied, setCopied] = useState(false);

  const capMessage = useMemo(() => {
    const now = new Date();
    return {
      identifier: generateRef('CAP-WG'),
      sender: 'WadiGuard v4 — ABH Loukkos',
      sent: now.toISOString(),
      status: 'Actual',
      msgType: 'Alert',
      scope: 'Public',
      code: 'IPP-WG-TTA-2026',
      info: {
        language: 'fr-MA',
        category: 'Met',
        event: scenario?.name || 'Crue',
        responseType: 'Evacuate',
        urgency: phase.level === 'red' || phase.level === 'black' ? 'Immediate' : 'Expected',
        severity: phase.level === 'black' ? 'Extreme' : phase.level === 'red' ? 'Severe' : phase.level === 'orange' ? 'Moderate' : 'Minor',
        certainty: 'Observed',
        audience: 'Population et autorités — Région Tanger-Tétouan-Al Hoceïma',
        effective: now.toISOString(),
        expires: new Date(now.getTime() + 6 * 3600000).toISOString(),
        senderName: 'Direction Générale de l\'Hydraulique — ABH Loukkos',
        headline: `${scenario?.icon || '⚠️'} ${scenario?.name || 'Alerte hydrologique'} — Région TTA`,
        description: `Alerte hydrologique niveau ${phase.level?.toUpperCase()}. Population exposée : ${consequences?.population || 0}. Routes affectées : ${consequences?.roads || 0}. Équipes déployées : ${consequences?.teams || 0}.`,
        instruction: 'Suivre les instructions des autorités locales. Éviter les zones basses et les oueds. Se réfugier en hauteur.',
        area: {
          areaDesc: scenario?.zones?.map(z => z.charAt(0).toUpperCase() + z.slice(1)).join(', ') || 'Région TTA',
          geocode: 'MA-01 Tanger-Tétouan-Al Hoceïma',
        },
      },
    };
  }, [scenario, phase, consequences]);

  const jsonStr = useMemo(() => JSON.stringify(capMessage, null, 2), [capMessage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FileText size={11} color="#00F0FF" />
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--wg-muted)' }}>
            CAP Alert Preview
          </span>
          <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.2)', color: '#00F0FF', fontWeight: 700 }}>
            SIMULÉ
          </span>
        </div>
        <button onClick={handleCopy} style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4,
          background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'var(--wg-border)'}`,
          color: copied ? '#22C55E' : 'var(--wg-muted)',
          fontSize: 9, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
          fontFamily: 'Outfit, sans-serif',
        }}>
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? 'Copié' : 'Copier JSON'}
        </button>
      </div>

      {/* Key fields */}
      <div style={{
        padding: 8, borderRadius: 6, background: 'var(--wg-bg-deep)',
        border: '1px solid var(--wg-border)', maxHeight: 160, overflowY: 'auto',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, lineHeight: 1.6,
        color: 'var(--wg-muted)',
      }}>
        <div><span style={{ color: '#F59E0B' }}>identifier:</span> <span style={{ color: '#00F0FF' }}>{capMessage.identifier}</span></div>
        <div><span style={{ color: '#F59E0B' }}>sender:</span> <span style={{ color: '#E2E8F0' }}>{capMessage.sender}</span></div>
        <div><span style={{ color: '#F59E0B' }}>status:</span> {capMessage.status}</div>
        <div><span style={{ color: '#F59E0B' }}>severity:</span> <span style={{ color: capMessage.info.severity === 'Extreme' ? '#EF4444' : capMessage.info.severity === 'Severe' ? '#EF4444' : '#F59E0B' }}>{capMessage.info.severity}</span></div>
        <div><span style={{ color: '#F59E0B' }}>urgency:</span> <span style={{ color: capMessage.info.urgency === 'Immediate' ? '#EF4444' : '#F59E0B' }}>{capMessage.info.urgency}</span></div>
        <div><span style={{ color: '#F59E0B' }}>certainty:</span> {capMessage.info.certainty}</div>
        <div><span style={{ color: '#F59E0B' }}>areaDesc:</span> <span style={{ color: '#E2E8F0' }}>{capMessage.info.area.areaDesc}</span></div>
        <div style={{ marginTop: 4, color: '#E2E8F0', fontSize: 8.5 }}>
          <span style={{ color: '#F59E0B' }}>instruction:</span> {capMessage.info.instruction}
        </div>
      </div>

      <p style={{ fontSize: 8, color: 'var(--wg-muted)', textAlign: 'center', fontStyle: 'italic' }}>
        Format conforme OGC CAP v1.2 · Intégration API future soumise à convention institutionnelle
      </p>
    </div>
  );
}

export default React.memo(CapPreview);
