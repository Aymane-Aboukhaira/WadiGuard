import React, { useState } from 'react';
import { LEVELS } from '../data/assets';
import { levelColor } from '../utils';
import { Download, Radio, ShieldCheck, Eye, Ban, Scan, MessageSquare } from 'lucide-react';

import DecisionChain from './DecisionChain';
import AlertDispatchMatrix from './AlertDispatchMatrix';
import TrustEngine from './TrustEngine';
import RoadClosurePanel from './RoadClosurePanel';
import CyberResiliencePanel from './CyberResiliencePanel';
import CitizenAlertPreview from './CitizenAlertPreview';

const LogEntry = React.memo(({ log }) => {
  const color = LEVELS[log.level]?.color ?? 'var(--wg-muted)';
  return (
    <div className={`log-entry ${log.category ?? 'event'}`}>
      <span className="mono-precision" style={{ color: 'var(--wg-muted)', fontSize: '9px' }}>[{log.at}]</span>
      {' '}
      <span style={{ color }}>{log.text}</span>
    </div>
  );
});

// Collapsible section wrapper
const Section = ({ title, icon: Icon, iconColor, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass" style={{ borderRadius: 6, flexShrink: 0, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'none', border: 'none', cursor: 'pointer', outline: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {Icon && <Icon size={9} color={iconColor || 'var(--wg-cyan)'} />}
          <span className="section-label" style={{ fontSize: 7.5, fontWeight: 700 }}>{title}</span>
        </div>
        <span style={{ fontSize: 8, color: 'var(--wg-muted)', transform: open ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}>▾</span>
      </button>
      {open && <div style={{ padding: '0 8px 6px' }}>{children}</div>}
    </div>
  );
};

function IncidentPanel({
  level, phase, scenario, consequences, selectedAsset, logs, onGenerateReport,
  decisionStage, activeChannels, cyberState, liveAssets,
}) {
  const meta = LEVELS[level];
  const color = levelColor(level);
  const isAlert = level === 'red' || level === 'black';

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingRight: 2 }}>

      {/* Alert Level Header */}
      <div className="glass" style={{ borderRadius: 6, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0, borderLeft: `3px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, display: 'inline-block', position: 'relative' }}>
              {isAlert && <span className="ring-expand" style={{ borderColor: color }} />}
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#E2E8F0', letterSpacing: '0.02em' }}>Centre de Décision</span>
          </div>
          <span className="mono-precision" style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: '0.05em' }}>
            {meta.label}
          </span>
        </div>
        <p style={{ fontSize: 8, color: 'var(--wg-muted)', marginLeft: 19 }}>
          {scenario.icon} {scenario.name} · {decisionStage.charAt(0).toUpperCase() + decisionStage.slice(1)}
        </p>
      </div>

      {/* Decision Chain */}
      <Section title="Chaîne de Décision" icon={Eye} defaultOpen={true}>
        <DecisionChain currentStage={decisionStage} />
      </Section>

      {/* Trust Engine — Validation Multi-capteurs */}
      <Section title="Validation Multi-Capteurs" icon={Scan} iconColor="#8B5CF6" defaultOpen={true}>
        <TrustEngine phase={phase} />
      </Section>

      {/* Road Closure */}
      <Section title="Fermeture Routes" icon={Ban} iconColor="#EF4444" defaultOpen={true}>
        <RoadClosurePanel phase={phase} consequences={consequences} liveAssets={liveAssets} />
      </Section>

      {/* Alert Dispatch */}
      <Section title="Dispatch Multi-Canal" icon={MessageSquare} iconColor="#F59E0B" defaultOpen={true}>
        <AlertDispatchMatrix activeChannels={activeChannels} />
      </Section>

      {/* Citizen Alert Preview */}
      <Section title="Alerte Citoyenne" icon={MessageSquare} iconColor="#3B82F6" defaultOpen={phase.level !== 'green'}>
        <CitizenAlertPreview phase={phase} scenario={scenario} consequences={consequences} selectedAsset={selectedAsset} />
      </Section>

      {/* Cyber Resilience */}
      <Section title="Cyber Résilience" icon={ShieldCheck} iconColor="#22C55E" defaultOpen={phase.level !== 'green'}>
        <CyberResiliencePanel cyberState={cyberState} />
      </Section>

      {/* Log Feed */}
      <div className="glass" style={{ borderRadius: 6, padding: '6px 8px', flex: 1, minHeight: 60, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexShrink: 0 }}>
          <span className="section-label" style={{ fontSize: 7.5 }}>Journal Opérationnel</span>
          <Radio size={9} color="var(--wg-cyan)" />
        </div>
        <div style={{
          flex: 1, minHeight: 0, overflowY: 'auto', borderRadius: 3, padding: 4,
          background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {logs.slice(0, 12).map((log, i) => <LogEntry key={`${log.text}-${i}`} log={log} />)}
        </div>
        <button onClick={onGenerateReport} className="btn btn-primary" style={{ marginTop: 4, width: '100%', justifyContent: 'center', height: 26, fontSize: 10 }}>
          <Download size={10} /> Rapport Gouvernemental
        </button>
      </div>
    </aside>
  );
}

export default React.memo(IncidentPanel);
