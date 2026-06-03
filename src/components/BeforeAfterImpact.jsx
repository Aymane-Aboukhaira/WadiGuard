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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '3px 6px', borderRadius: 4,
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)',
        }}>
          <ShieldOff size={9} color="#EF4444" />
          <span style={{ fontSize: 8, fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sans WadiGuard</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '3px 6px', borderRadius: 4,
          background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)',
        }}>
          <ShieldCheck size={9} color="#22C55E" />
          <span style={{ fontSize: 8, fontWeight: 800, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avec WadiGuard</span>
        </div>
      </div>

      {/* Rows */}
      {kpis.map(kpi => (
        <div key={kpi.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <div style={{ padding: '2px 6px', borderRadius: 3, borderLeft: '2px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.02)' }}>
            <span style={{ fontSize: 7, color: 'var(--wg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</span>
            <p className="mono-precision" style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', marginTop: 0 }}>{kpi.sans}</p>
          </div>
          <div style={{ padding: '2px 6px', borderRadius: 3, borderLeft: '2px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.02)' }}>
            <span style={{ fontSize: 7, color: 'var(--wg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</span>
            <p className="mono-precision" style={{ fontSize: 10, fontWeight: 700, color: '#22C55E', marginTop: 0 }}>{kpi.avec}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(BeforeAfterImpact);
