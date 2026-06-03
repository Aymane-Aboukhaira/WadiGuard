import React, { useState, useEffect } from 'react';
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

// Memoized collapsible section wrapper using theme styles
const Section = React.memo(({ title, icon: Icon, iconColor, children, isOpen, onToggle, badgeText, badgeActive }) => {
  return (
    <div className={`collapsible-section ${isOpen ? 'expanded' : ''} ${badgeActive ? 'active-stage' : ''}`}>
      <div className="collapsible-header" onClick={onToggle}>
        <div className="collapsible-header-title">
          {Icon && <Icon size={12} color={isOpen ? (iconColor || 'var(--wg-cyan)') : 'var(--wg-muted)'} />}
          <span>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {badgeText && (
            <span className={`collapsible-header-badge ${badgeActive ? 'active' : ''}`}>
              {badgeText}
            </span>
          )}
          <span style={{ fontSize: 9, color: 'var(--wg-muted)', transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s ease' }}>▾</span>
        </div>
      </div>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
});

function IncidentPanel({
  level, phase, scenario, consequences, selectedAsset, logs, onGenerateReport,
  decisionStage, activeChannels, cyberState, liveAssets,
}) {
  const meta = LEVELS[level];
  const color = levelColor(level);
  const isAlert = level === 'red' || level === 'black';
  const demoMode = phase.storyStep ? 'jury' : 'live';

  // Sections open/closed state
  const [expanded, setExpanded] = useState({
    decisionChain: true,
    validation: false,
    roads: false,
    dispatch: false,
    alert: false,
    cyber: false,
    logs: true
  });

  // Toggle helper
  const toggleSection = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Auto-expand relevant section during Jury Demo steps
  useEffect(() => {
    if (demoMode === 'jury') {
      const nextExpanded = {
        decisionChain: false,
        validation: false,
        roads: false,
        dispatch: false,
        alert: false,
        cyber: false,
        logs: false
      };

      if (decisionStage === 'detection') {
        nextExpanded.decisionChain = true;
      } else if (decisionStage === 'validation') {
        nextExpanded.validation = true;
      } else if (decisionStage === 'prediction') {
        nextExpanded.decisionChain = true;
      } else if (decisionStage === 'alert') {
        nextExpanded.alert = true;
        nextExpanded.dispatch = true;
      } else if (decisionStage === 'response') {
        nextExpanded.roads = true;
      } else if (decisionStage === 'report') {
        nextExpanded.logs = true;
      }
      setExpanded(nextExpanded);
    }
  }, [decisionStage, demoMode]);

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingRight: 2 }}>

      {/* Alert Level Header */}
      <div className="glass" style={{ borderRadius: 6, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0, borderLeft: `3px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, display: 'inline-block', position: 'relative' }}>
              {isAlert && <span className="ring-expand" style={{ borderColor: color }} />}
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--wg-text)', letterSpacing: '0.02em' }}>Centre de Décision</span>
          </div>
          <span className="mono-precision" style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: '0.05em' }}>
            {meta.label}
          </span>
        </div>
        <p style={{ fontSize: 10, color: 'var(--wg-muted)', marginLeft: 19 }}>
          {scenario.name} · {decisionStage.toUpperCase()}
        </p>
      </div>

      {/* Decision Chain */}
      <Section
        title="Chaîne de Décision"
        icon={Eye}
        isOpen={expanded.decisionChain}
        onToggle={() => toggleSection('decisionChain')}
        badgeText="Pipeline"
        badgeActive={demoMode === 'jury' && decisionStage === 'detection'}
      >
        <DecisionChain currentStage={decisionStage} />
      </Section>

      {/* Trust Engine — Validation Multi-capteurs */}
      <Section
        title="Validation Multi-Capteurs"
        icon={Scan}
        iconColor="#8B5CF6"
        isOpen={expanded.validation}
        onToggle={() => toggleSection('validation')}
        badgeText={phase.level !== 'green' ? "Actif" : "Simulation"}
        badgeActive={demoMode === 'jury' && decisionStage === 'validation'}
      >
        <TrustEngine phase={phase} />
      </Section>

      {/* Road Closure */}
      <Section
        title="Fermeture Routes"
        icon={Ban}
        iconColor="#EF4444"
        isOpen={expanded.roads}
        onToggle={() => toggleSection('roads')}
        badgeText={consequences.roads > 0 ? `${consequences.roads} fermées` : "Standby"}
        badgeActive={demoMode === 'jury' && decisionStage === 'response'}
      >
        <RoadClosurePanel phase={phase} consequences={consequences} liveAssets={liveAssets} />
      </Section>

      {/* Alert Dispatch */}
      <Section
        title="Dispatch Multi-Canal"
        icon={MessageSquare}
        iconColor="#F59E0B"
        isOpen={expanded.dispatch}
        onToggle={() => toggleSection('dispatch')}
        badgeText={phase.level !== 'green' ? "Actif" : "Standby"}
        badgeActive={demoMode === 'jury' && decisionStage === 'alert'}
      >
        <AlertDispatchMatrix activeChannels={activeChannels} />
      </Section>

      {/* Citizen Alert Preview */}
      <Section
        title="Alerte Citoyenne"
        icon={MessageSquare}
        iconColor="#3B82F6"
        isOpen={expanded.alert}
        onToggle={() => toggleSection('alert')}
        badgeText={phase.level !== 'green' ? "SMS/Darija" : "Standby"}
        badgeActive={demoMode === 'jury' && decisionStage === 'alert'}
      >
        <CitizenAlertPreview phase={phase} scenario={scenario} consequences={consequences} selectedAsset={selectedAsset} />
      </Section>

      {/* Cyber Resilience */}
      <Section
        title="Cyber Résilience"
        icon={ShieldCheck}
        iconColor="#22C55E"
        isOpen={expanded.cyber}
        onToggle={() => toggleSection('cyber')}
        badgeText={cyberState.primaryLink === 'down' ? "Bascule LoRa" : "Sécurisé"}
        badgeActive={demoMode === 'jury' && cyberState.primaryLink === 'down'}
      >
        <CyberResiliencePanel cyberState={cyberState} />
      </Section>

      {/* Log Feed & Report Generation */}
      <Section
        title="Journal Opérationnel"
        icon={Radio}
        isOpen={expanded.logs}
        onToggle={() => toggleSection('logs')}
        badgeText="Audit"
        badgeActive={demoMode === 'jury' && decisionStage === 'report'}
      >
        <div style={{
          height: 120, overflowY: 'auto', borderRadius: 3, padding: 4,
          background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {logs.slice(0, 12).map((log, i) => <LogEntry key={`${log.text}-${i}`} log={log} />)}
        </div>
        <button onClick={onGenerateReport} className="btn btn-primary" style={{ marginTop: 6, width: '100%', justifyContent: 'center', height: 28, fontSize: 11 }}>
          <Download size={11} style={{ marginRight: 4 }} /> Rapport Gouvernemental
        </button>
      </Section>

    </aside>
  );
}

export default React.memo(IncidentPanel);
