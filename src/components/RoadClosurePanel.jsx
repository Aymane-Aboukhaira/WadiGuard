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
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '3px 6px', borderRadius: 4,
          background: gate.closed ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.03)',
          borderLeft: `2px solid ${gate.closed ? '#EF4444' : '#22C55E'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
            {gate.closed ? <Ban size={9} color="#EF4444" /> : <Car size={9} color="#22C55E" />}
            <span style={{
              fontSize: 9, color: '#E2E8F0', fontWeight: 600,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {gate.name}
            </span>
          </div>
          <span className="mono-precision" style={{
            fontSize: 7.5, fontWeight: 800, padding: '1px 5px', borderRadius: 3,
            letterSpacing: '0.04em', flexShrink: 0,
            color: gate.closed ? '#fff' : '#22C55E',
            background: gate.closed ? 'rgba(239,68,68,0.85)' : 'rgba(34,197,94,0.08)',
            border: `1px solid ${gate.closed ? '#EF4444' : 'rgba(34,197,94,0.2)'}`,
            animation: gate.closed ? 'blink 1.5s infinite' : 'none',
          }}>
            {gate.closed ? '🚧 FERMÉ' : 'OUVERT'}
          </span>
        </div>
      ))}

      {/* Summary */}
      <div style={{
        padding: '3px 6px', borderRadius: 3, textAlign: 'center',
        fontSize: 8, fontWeight: 700,
        color: closedCount > 0 ? '#EF4444' : '#22C55E',
        background: closedCount > 0 ? 'rgba(239,68,68,0.04)' : 'rgba(34,197,94,0.03)',
      }}>
        {closedCount > 0
          ? `${closedCount} route(s) fermée(s) — citoyens protégés`
          : 'Toutes les routes ouvertes — circulation normale'}
      </div>
    </div>
  );
}

export default React.memo(RoadClosurePanel);
