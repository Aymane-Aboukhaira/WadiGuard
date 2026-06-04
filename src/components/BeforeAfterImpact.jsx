import React, { useMemo } from 'react';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { formatNum } from '../utils';

function BeforeAfterImpact({ consequences, phase }) {
  const kpis = useMemo(() => [
    {
      label: 'Délai d\'alerte',
      sans: '> 45 min',
      avec: '< 30 sec',
    },
    {
      label: 'Routes dangereuses',
      sans: 'Encore ouvertes',
      avec: 'Fermées auto.',
    },
    {
      label: 'Population alertée',
      sans: 'Inconnue',
      avec: formatNum(consequences.population || 0),
    },
    {
      label: 'Vérification',
      sans: 'Manuelle',
      avec: 'Multi-capteurs',
    },
    {
      label: 'Rapport officiel',
      sans: 'Après événement',
      avec: 'Immédiat (CAP)',
    },
    {
      label: 'Fausses alarmes',
      sans: 'Non filtrées',
      avec: 'TinyML 97%',
    },
  ], [consequences]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', borderRadius: 4,
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
        }}>
          <ShieldOff size={11} color="#EF4444" />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Sans WadiGuard
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', borderRadius: 4,
          background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)',
        }}>
          <ShieldCheck size={11} color="#22C55E" />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Avec WadiGuard
          </span>
        </div>
      </div>

      {/* KPI rows */}
      {kpis.map(kpi => (
        <div key={kpi.label} className="impact-row">
          <div className="impact-cell impact-cell-sans">
            <p className="impact-kpi-label">{kpi.label}</p>
            <p className="impact-kpi-value" style={{ color: '#EF4444' }}>{kpi.sans}</p>
          </div>
          <div className="impact-cell impact-cell-avec">
            <p className="impact-kpi-label">{kpi.label}</p>
            <p className="impact-kpi-value" style={{ color: '#22C55E' }}>{kpi.avec}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(BeforeAfterImpact);
