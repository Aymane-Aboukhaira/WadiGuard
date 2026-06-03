import React from 'react';
import { levelColor, formatNum } from '../utils';
import { Users, Route, Siren, School, Timer, MessageSquare, BarChart3, Zap } from 'lucide-react';
import BeforeAfterImpact from './BeforeAfterImpact';

const KpiBox = React.memo(({ icon: Icon, label, value, color, alert }) => {
  return (
    <div className="kpi-card" style={{ flex: 1, minWidth: 0, borderLeft: alert ? `2px solid ${color}` : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 1 }}>
        <Icon size={9} color={color} style={{ flexShrink: 0 }} />
        <p className="kpi-label" style={{ fontSize: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</p>
      </div>
      <p className="kpi-value mono-precision text-truncate-precision" style={{ color, fontSize: 15 }}>{value}</p>
    </div>
  );
});

function ImpactModel({ consequences, selectedAsset, phase, timelineData, liveAssets }) {
  const color = levelColor(phase.level);
  const isAlert = phase.level === 'red' || phase.level === 'black';
  const hasImpact = consequences.population > 0;

  return (
    <div className="glass" style={{
      borderRadius: 8, padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0,
      borderTop: isAlert ? `2px solid ${color}40` : undefined,
    }}>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Zap size={10} color={color} />
          <p className="section-label" style={{ fontSize: 7.5, fontWeight: 700 }}>
            {isAlert ? 'IMPACT ACTIF — Avant / Après WadiGuard' : 'Impact Régional — Sans vs Avec WadiGuard'}
          </p>
        </div>
        {hasImpact && (
          <span className="mono-precision" style={{ fontSize: 9, fontWeight: 800, color, letterSpacing: '0.04em' }}>
            {formatNum(consequences.population)} exposés
          </span>
        )}
      </div>

      {/* Two-column layout: KPIs left, Before/After right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {/* Left: KPI cards in 3x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
          <KpiBox icon={Users} label="Population" value={formatNum(consequences.population)} color={color} alert={isAlert} />
          <KpiBox icon={Route} label="Routes fermées" value={consequences.roads} color="#F59E0B" alert={consequences.roads > 0} />
          <KpiBox icon={Siren} label="Équipes" value={consequences.teams} color="#00F0FF" />
          <KpiBox icon={School} label="Refuges" value={consequences.shelters} color="#10B981" />
          <KpiBox icon={MessageSquare} label="SMS envoyés" value={formatNum(consequences.sms)} color="#3b82f6" alert={consequences.sms > 0} />
          <KpiBox icon={Timer} label="ETA Impact" value={consequences.eta} color={color} />
        </div>

        {/* Right: Before/After comparison */}
        <BeforeAfterImpact consequences={consequences} phase={phase} />
      </div>
    </div>
  );
}

export default React.memo(ImpactModel);
