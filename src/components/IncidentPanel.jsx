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
      <span className="mono-precision" style={{ color: 'var(--wg-muted)', fontSize: '10px' }}>[{log.at}]</span>
      {' '}
      <span style={{ color }}>{log.text}</span>
    </div>
  );
});

// Map each decisionStage to the section key it should highlight
const STAGE_TO_SECTION = {
  detection:  'decisionChain',
  validation: 'validation',
  prediction: 'decisionChain',
  alert:      'dispatch',      // also 'alert' — both open, dispatch is primary
  response:   'roads',
  report:     'logs',
};

// Badge variant helper
const getBadgeVariant = (sectionKey, phase, decisionStage, consequences, cyberState) => {
  switch (sectionKey) {
    case 'decisionChain':
      return { text: 'Pipeline', variant: phase.level !== 'green' ? 'active' : '' };
    case 'validation':
      return { text: phase.level !== 'green' ? 'ACTIF' : 'SIMULATION', variant: phase.level !== 'green' ? 'badge-green' : 'badge-cyan' };
    case 'roads':
      return consequences.roads > 0
        ? { text: `${consequences.roads} fermées`, variant: 'badge-red' }
        : { text: 'STANDBY', variant: '' };
    case 'dispatch':
      return { text: phase.level !== 'green' ? 'ACTIF' : 'STANDBY', variant: phase.level !== 'green' ? 'badge-orange' : '' };
    case 'alert':
      return { text: phase.level !== 'green' ? 'SMS/Darija' : 'STANDBY', variant: phase.level !== 'green' ? 'badge-orange' : '' };
    case 'cyber':
      return cyberState.primaryLink === 'down'
        ? { text: 'BASCULE LoRa', variant: 'badge-orange' }
        : { text: 'SÉCURISÉ', variant: 'badge-green' };
    case 'logs':
      return { text: 'AUDIT', variant: 'badge-cyan' };
    default:
      return { text: '', variant: '' };
  }
};

// Collapsible Section component (memoized)
const Section = React.memo(({
  title, icon: Icon, iconColor, children,
  isOpen, onToggle, badgeText, badgeVariant, isActiveStage, isDimmedInJury,
}) => {
  const sectionClass = [
    'collapsible-section',
    isOpen ? 'expanded' : '',
    isActiveStage ? 'active-stage scene-focus' : '',
    isDimmedInJury ? 'scene-dimmed-soft' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={sectionClass}>
      <div className="collapsible-header" onClick={onToggle}>
        <div className="collapsible-header-title">
          {Icon && <Icon size={13} color={isOpen ? (iconColor || 'var(--wg-cyan)') : 'var(--wg-muted)'} style={{ flexShrink: 0 }} />}
          <span>{title}</span>
        </div>
        <div className="collapsible-header-right">
          {badgeText && (
            <span className={`collapsible-header-badge ${badgeVariant || ''} ${isActiveStage ? 'active' : ''}`}>
              {badgeText}
            </span>
          )}
          <span className="collapsible-chevron">▾</span>
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
    logs: true,
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
        logs: false,
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

  // Helper: should this section be softly dimmed (jury mode, not active)?
  const getActiveSection = () => STAGE_TO_SECTION[decisionStage];
  const isDimmed = (sectionKey) => {
    if (demoMode !== 'jury') return false;
    const activeSection = getActiveSection();
    // In alert stage both dispatch and alert are active
    if (decisionStage === 'alert' && (sectionKey === 'dispatch' || sectionKey === 'alert')) return false;
    return sectionKey !== activeSection;
  };
  const isActive = (sectionKey) => {
    if (demoMode !== 'jury') return false;
    const activeSection = getActiveSection();
    if (decisionStage === 'alert' && (sectionKey === 'dispatch' || sectionKey === 'alert')) return true;
    return sectionKey === activeSection;
  };

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 'none', paddingRight: 2 }}>

      {/* ── Centre de Décision Header ── */}
      <div
        className="glass"
        style={{
          borderRadius: 8,
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flexShrink: 0,
          borderLeft: `3px solid ${color}`,
          ...(isAlert ? { boxShadow: `0 0 12px ${color}18` } : {}),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: color, boxShadow: `0 0 6px ${color}`,
              display: 'inline-block', position: 'relative', flexShrink: 0,
            }}>
              {isAlert && <span className="ring-expand" style={{ borderColor: color }} />}
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--wg-text)', letterSpacing: '0.02em' }}>
              Centre de Décision
            </span>
          </div>
          <span className="mono-precision" style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: '0.05em' }}>
            {meta.label}
          </span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--wg-muted)', marginLeft: 20 }}>
          {scenario.name} · <span style={{ fontWeight: 700, color }}>{decisionStage.toUpperCase()}</span>
        </p>
      </div>

      {/* ── Decision Chain ── */}
      {(() => {
        const badge = getBadgeVariant('decisionChain', phase, decisionStage, consequences, cyberState);
        return (
          <Section
            title="Chaîne de Décision"
            icon={Eye}
            isOpen={expanded.decisionChain}
            onToggle={() => toggleSection('decisionChain')}
            badgeText={badge.text}
            badgeVariant={badge.variant}
            isActiveStage={isActive('decisionChain')}
            isDimmedInJury={isDimmed('decisionChain')}
          >
            <DecisionChain currentStage={decisionStage} />
          </Section>
        );
      })()}

      {/* ── Validation Multi-Capteurs ── */}
      {(() => {
        const badge = getBadgeVariant('validation', phase, decisionStage, consequences, cyberState);
        return (
          <Section
            title="Validation Multi-Capteurs"
            icon={Scan}
            iconColor="#8B5CF6"
            isOpen={expanded.validation}
            onToggle={() => toggleSection('validation')}
            badgeText={badge.text}
            badgeVariant={badge.variant}
            isActiveStage={isActive('validation')}
            isDimmedInJury={isDimmed('validation')}
          >
            <TrustEngine phase={phase} />
          </Section>
        );
      })()}

      {/* ── Fermeture Routes ── */}
      {(() => {
        const badge = getBadgeVariant('roads', phase, decisionStage, consequences, cyberState);
        return (
          <Section
            title="Fermeture Routes"
            icon={Ban}
            iconColor="#EF4444"
            isOpen={expanded.roads}
            onToggle={() => toggleSection('roads')}
            badgeText={badge.text}
            badgeVariant={badge.variant}
            isActiveStage={isActive('roads')}
            isDimmedInJury={isDimmed('roads')}
          >
            <RoadClosurePanel phase={phase} consequences={consequences} liveAssets={liveAssets} />
          </Section>
        );
      })()}

      {/* ── Dispatch Multi-Canal ── */}
      {(() => {
        const badge = getBadgeVariant('dispatch', phase, decisionStage, consequences, cyberState);
        return (
          <Section
            title="Dispatch Multi-Canal"
            icon={MessageSquare}
            iconColor="#F59E0B"
            isOpen={expanded.dispatch}
            onToggle={() => toggleSection('dispatch')}
            badgeText={badge.text}
            badgeVariant={badge.variant}
            isActiveStage={isActive('dispatch')}
            isDimmedInJury={isDimmed('dispatch')}
          >
            <AlertDispatchMatrix activeChannels={activeChannels} />
          </Section>
        );
      })()}

      {/* ── Alerte Citoyenne ── */}
      {(() => {
        const badge = getBadgeVariant('alert', phase, decisionStage, consequences, cyberState);
        return (
          <Section
            title="Alerte Citoyenne"
            icon={MessageSquare}
            iconColor="#3B82F6"
            isOpen={expanded.alert}
            onToggle={() => toggleSection('alert')}
            badgeText={badge.text}
            badgeVariant={badge.variant}
            isActiveStage={isActive('alert')}
            isDimmedInJury={isDimmed('alert')}
          >
            <CitizenAlertPreview phase={phase} scenario={scenario} consequences={consequences} selectedAsset={selectedAsset} />
          </Section>
        );
      })()}

      {/* ── Cyber Résilience ── */}
      {(() => {
        const badge = getBadgeVariant('cyber', phase, decisionStage, consequences, cyberState);
        return (
          <Section
            title="Cyber Résilience"
            icon={ShieldCheck}
            iconColor="#22C55E"
            isOpen={expanded.cyber}
            onToggle={() => toggleSection('cyber')}
            badgeText={badge.text}
            badgeVariant={badge.variant}
            isActiveStage={demoMode === 'jury' && cyberState.primaryLink === 'down'}
            isDimmedInJury={isDimmed('cyber')}
          >
            <CyberResiliencePanel cyberState={cyberState} />
          </Section>
        );
      })()}

      {/* ── Journal Opérationnel ── */}
      {(() => {
        const badge = getBadgeVariant('logs', phase, decisionStage, consequences, cyberState);
        return (
          <Section
            title="Journal Opérationnel"
            icon={Radio}
            isOpen={expanded.logs}
            onToggle={() => toggleSection('logs')}
            badgeText={badge.text}
            badgeVariant={badge.variant}
            isActiveStage={isActive('logs')}
            isDimmedInJury={isDimmed('logs')}
          >
            <div style={{
              height: 150, overflowY: 'auto', borderRadius: 4, padding: 5,
              background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              {logs.slice(0, 14).map((log, i) => <LogEntry key={`${log.text}-${i}`} log={log} />)}
            </div>
            <button
              onClick={onGenerateReport}
              className="btn btn-primary"
              style={{ marginTop: 8, width: '100%', justifyContent: 'center', height: 32, fontSize: 12 }}
            >
              <Download size={12} style={{ marginRight: 4 }} /> Rapport Gouvernemental
            </button>
          </Section>
        );
      })()}

    </aside>
  );
}

export default React.memo(IncidentPanel);
