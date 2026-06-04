import React, { useState, useEffect } from 'react';
import { levelColor, formatNum } from '../utils';
import { Users, Route, Siren, School, Timer, MessageSquare, Zap, ChevronDown, Radio, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

const KpiBox = React.memo(({ icon: Icon, label, value, color, alert }) => {
  return (
    <div className="kpi-card" style={{ flex: 1, minWidth: 0, borderLeft: alert ? `2px solid ${color}` : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
        <Icon size={10} color={color} style={{ flexShrink: 0 }} />
        <p className="kpi-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</p>
      </div>
      <p className="kpi-value mono-precision text-truncate-precision" style={{ color, fontSize: 15 }}>{value}</p>
    </div>
  );
});

function ImpactModel({ consequences, selectedAsset, phase, timelineData, liveAssets, decisionStage, activeChannels }) {
  const color = levelColor(phase.level);
  const isAlert = phase.level === 'red' || phase.level === 'black';
  const isWarning = phase.level === 'orange';
  const demoMode = phase.storyStep ? 'jury' : 'live';
  
  const [expanded, setExpanded] = useState(false);

  // Auto-expand during orange/red or jury demo
  useEffect(() => {
    if (isAlert || isWarning || demoMode === 'jury') {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [isAlert, isWarning, demoMode]);

  const hasImpact = consequences.population > 0;
  
  // Calculate active channels count
  const activeChannelsCount = Object.values(activeChannels || {}).filter(c => c.status === 'active' || c.status === 'sent').length;
  
  // CAP Report status
  let capStatus = 'En attente';
  let capColor = 'var(--wg-muted)';
  if (decisionStage === 'report' || phase.level === 'black') {
    capStatus = 'Généré (CAP)';
    capColor = 'var(--wg-cyan)';
  } else if (isAlert) {
    capStatus = 'Préparation...';
    capColor = 'var(--wg-orange)';
  }

  // False alarm status
  const isFalseAlarm = phase.id === 'false_alarm';

  return (
    <div className="glass" style={{
      borderRadius: 8, display: 'flex', flexDirection: 'column', flexShrink: 0,
      borderTop: isAlert ? `2px solid ${color}40` : undefined,
      transition: 'all 0.3s ease'
    }}>
      {/* Header (Clickable) */}
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '8px 12px', cursor: 'pointer',
          borderBottom: expanded ? '1px solid var(--wg-border)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={11} color={color} />
          <p className="section-label" style={{ fontSize: 10, fontWeight: 700, color: 'var(--wg-text)' }}>
            IMPACT OPÉRATIONNEL
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {hasImpact && !expanded && (
            <span className="mono-precision" style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: '0.04em' }}>
              {formatNum(consequences.population)} exposés
            </span>
          )}
          <ChevronDown size={12} color="var(--wg-muted)" style={{ 
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        display: expanded ? 'flex' : 'block', 
        flexDirection: 'column', gap: 6,
        padding: expanded ? '8px 12px' : '0 12px 8px 12px',
        opacity: 1
      }}>
        {/* Collapsed view: 3 KPIs */}
        {!expanded && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
            <KpiBox icon={Users} label="Pop. Exposée" value={formatNum(consequences.population)} color={color} alert={isAlert} />
            <KpiBox icon={Route} label="Routes" value={consequences.roads} color="#F59E0B" alert={consequences.roads > 0} />
            <KpiBox icon={Timer} label="ETA Impact" value={consequences.eta} color={color} />
          </div>
        )}
        
        {/* Expanded view: Full operational summary */}
        {expanded && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
            <KpiBox icon={Users} label="Pop. Exposée" value={formatNum(consequences.population)} color={color} alert={isAlert} />
            <KpiBox icon={MessageSquare} label="Pop. Alertée" value={formatNum(consequences.sms)} color="#3b82f6" alert={consequences.sms > 0} />
            <KpiBox icon={Route} label="Routes Fermées" value={consequences.roads} color="#F59E0B" alert={consequences.roads > 0} />
            <KpiBox icon={Timer} label="ETA Impact" value={consequences.eta} color={color} />
            
            <KpiBox icon={Siren} label="Équipes Dépl." value={consequences.teams} color="#00F0FF" />
            <KpiBox icon={School} label="Refuges Ovt." value={consequences.shelters} color="#10B981" />
            
            <div className="kpi-card" style={{ flex: 1, minWidth: 0, gridColumn: 'span 2', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                   <Radio size={10} color="#F59E0B" />
                   <p className="kpi-label">Canaux Actifs</p>
                </div>
                <p className="mono-precision" style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700 }}>{activeChannelsCount} / 6</p>
            </div>
          </div>
        )}
        
        {expanded && (
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginTop: 2 }}>
               <div className="kpi-card" style={{ padding: '6px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                     <FileText size={10} color={capColor} />
                     <p className="kpi-label">Rapport CAP</p>
                  </div>
                  <p className="mono-precision" style={{ color: capColor, fontSize: 11, fontWeight: 700 }}>{capStatus}</p>
               </div>
               
               {isFalseAlarm ? (
                 <div className="kpi-card" style={{ padding: '6px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderLeft: '2px solid var(--wg-green)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                       <CheckCircle2 size={10} color="var(--wg-green)" />
                       <p className="kpi-label">Fausse Alarme</p>
                    </div>
                    <p className="mono-precision" style={{ color: 'var(--wg-green)', fontSize: 11, fontWeight: 700 }}>Rejetée</p>
                 </div>
               ) : (
                 <div className="kpi-card" style={{ padding: '6px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderLeft: isAlert ? '2px solid var(--wg-red)' : undefined }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                       <AlertTriangle size={10} color={isAlert ? 'var(--wg-red)' : 'var(--wg-muted)'} />
                       <p className="kpi-label">Fiabilité Capteurs</p>
                    </div>
                    <p className="mono-precision" style={{ color: isAlert ? 'var(--wg-red)' : 'var(--wg-muted)', fontSize: 11, fontWeight: 700 }}>{isAlert ? 'Confirmée' : 'Nominale'}</p>
                 </div>
               )}
           </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ImpactModel);
