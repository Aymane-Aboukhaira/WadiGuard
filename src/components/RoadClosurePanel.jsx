import React, { useMemo } from 'react';
import { Ban, CheckCircle2, AlertTriangle, Car } from 'lucide-react';

function RoadClosurePanel({ phase, consequences, liveAssets }) {
  const isAlert = phase.level === 'red' || phase.level === 'black';

  const gates = useMemo(() => {
    const roadAssets = (liveAssets || []).filter(a => a.type === 'road');
    if (roadAssets.length === 0) {
      // Fallback hardcoded gates
      return [
        { name: 'RN1 Gate Martil', closed: isAlert },
        { name: 'RN13 Gate Nekor', closed: isAlert },
        { name: 'VMS Pont Mghogha', closed: isAlert },
      ];
    }
    return roadAssets.map(a => ({
      name: a.shortName || a.name,
      closed: a.affected && (a.status === 'red' || a.status === 'black'),
    }));
  }, [liveAssets, isAlert]);

  const closedCount = gates.filter(g => g.closed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {gates.map((gate, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifycontent: 'space-between',
          padding: '5px 8px', borderRadius: 4,
          background: gate.closed ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.03)',
          borderLeft: `2px solid ${gate.closed ? 'var(--wg-red)' : 'var(--wg-green)'}`,
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
            {gate.closed ? <Ban size={10} color="var(--wg-red)" /> : <Car size={10} color="var(--wg-green)" />}
            <span style={{
              fontSize: 11, color: 'var(--wg-text)', fontWeight: 600,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {gate.name}
            </span>
          </div>
          <span className="mono-precision" style={{
            fontSize: 9.5, fontWeight: 800, padding: '2px 6px', borderRadius: 3,
            letterSpacing: '0.04em', flexShrink: 0,
            color: gate.closed ? '#fff' : 'var(--wg-green)',
            background: gate.closed ? 'var(--wg-red)' : 'rgba(34,197,94,0.08)',
            border: `1px solid ${gate.closed ? 'var(--wg-red)' : 'rgba(34,197,94,0.2)'}`,
            animation: gate.closed ? 'blink 1.2s infinite' : 'none',
          }}>
            {gate.closed ? 'FERMÉ' : 'OUVERT'}
          </span>
        </div>
      ))}

      {/* Summary */}
      <div style={{
        padding: '5px 8px', borderRadius: 4, textAlign: 'center',
        fontSize: 10.5, fontWeight: 700,
        color: closedCount > 0 ? 'var(--wg-red)' : 'var(--wg-green)',
        background: closedCount > 0 ? 'rgba(239,68,68,0.04)' : 'rgba(34,197,94,0.03)',
        border: `1px solid ${closedCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.08)'}`,
      }}>
        {closedCount > 0
          ? `${closedCount} route(s) fermée(s) — citoyens sécurisés`
          : 'Toutes les routes ouvertes — circulation nominale'}
      </div>
    </div>
  );
}

export default React.memo(RoadClosurePanel);
