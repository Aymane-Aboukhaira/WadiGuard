import React from 'react';
import { Radio, CheckCircle2, TrendingUp, Bell, Shield, FileText } from 'lucide-react';
import { DECISION_STAGES } from '../data/scenarios';

const STAGE_META = {
  detection:  { icon: Radio,        label: 'Détection',   short: 'DET' },
  validation: { icon: CheckCircle2, label: 'Validation',  short: 'VAL' },
  prediction: { icon: TrendingUp,   label: 'Prédiction',  short: 'PRE' },
  alert:      { icon: Bell,         label: 'Alerte',      short: 'ALT' },
  response:   { icon: Shield,       label: 'Réponse',     short: 'RSP' },
  report:     { icon: FileText,     label: 'Rapport',     short: 'RPT' },
};

function DecisionChain({ currentStage }) {
  const activeIdx = DECISION_STAGES.indexOf(currentStage);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%', overflow: 'hidden', padding: '4px 0' }}>
      {DECISION_STAGES.map((stage, i) => {
        const meta = STAGE_META[stage];
        const Icon = meta.icon;
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        const isFuture = i > activeIdx;

        const nodeColor = isActive ? 'var(--wg-cyan)' : isPast ? 'var(--wg-green)' : 'var(--wg-border)';
        const textColor = isActive ? 'var(--wg-cyan)' : isPast ? 'var(--wg-green)' : 'var(--wg-muted)';

        return (
          <React.Fragment key={stage}>
            {/* Connector line before node (skip first) */}
            {i > 0 && (
              <div style={{
                flex: '1 1 0', height: 1.5, minWidth: 4,
                background: isPast || isActive ? 'var(--wg-green)' : 'var(--wg-border)',
                transition: 'background 0.4s ease',
              }} />
            )}
            {/* Node */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0,
              position: 'relative',
            }}>
              <div style={{
                width: isActive ? 28 : 22,
                height: isActive ? 28 : 22,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? 'rgba(0,240,255,0.12)' : isPast ? 'rgba(5,150,105,0.08)' : 'var(--wg-bg-deep)',
                border: `1.5px solid ${nodeColor}`,
                boxShadow: isActive ? '0 0 10px rgba(0,240,255,0.3)' : 'none',
                transition: 'all 0.4s ease',
              }}>
                <Icon size={isActive ? 13 : 10} color={nodeColor} />
              </div>
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: textColor,
                transition: 'color 0.4s ease',
              }}>
                {meta.short}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default React.memo(DecisionChain);
