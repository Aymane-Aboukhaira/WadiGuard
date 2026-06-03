import React from 'react';
import { levelColor } from '../utils';

function BottomStatus({ assets, consequences, phase, simTime, running }) {
  const online = assets.filter(a => a.online).length;
  const redZones = assets.filter(a => a.status === 'red' || a.status === 'black').length;
  const avgBat = Math.round(assets.reduce((s, a) => s + a.battery, 0) / assets.length);
  const avgLat = Math.round(assets.reduce((s, a) => s + a.latency, 0) / assets.length);
  const color = levelColor(phase.level);

  const items = [
    { label: 'Capteurs',    value: `${online}/${assets.length}`, w: '42px', color: online === assets.length ? '#10B981' : '#F59E0B' },
    { label: 'Critiques',   value: String(redZones),             w: '16px', color: redZones > 0 ? '#EF4444' : '#4A5568' },
    { label: 'Batterie',    value: `${avgBat}%`,                 w: '34px', color: avgBat > 70 ? '#10B981' : '#F59E0B' },
    { label: 'Population',  value: consequences.population.toLocaleString('fr-MA'), w: '55px', color: consequences.population > 0 ? '#EF4444' : '#4A5568' },
    { label: 'ETA',         value: consequences.eta,             w: '70px', color: '#00F0FF' },
    { label: 'Latence',     value: `${avgLat}ms`,                w: '40px', color: avgLat < 200 ? '#10B981' : '#F59E0B' },
    { label: 'Éq. terrain', value: String(consequences.teams),   w: '20px', color: consequences.teams > 0 ? '#F59E0B' : '#4A5568' },
    { label: 'Routes',      value: `${consequences.roads} fermées`, w: '65px', color: consequences.roads > 0 ? '#EF4444' : '#4A5568' },
  ];

  return (
    <footer className="bottombar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '11px', color: '#7F8E9F', height: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Level indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: `${color}10`, border: `1px solid ${color}25` }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}` }} />
          <span className="mono-precision" style={{ fontSize: 9, fontWeight: 800, color, letterSpacing: '0.06em' }}>
            {phase.level === 'green' ? 'NOMINAL' : phase.level === 'orange' ? 'VIGILANCE' : phase.level === 'red' ? 'ALERTE ROUGE' : 'ALERTE NOIRE'}
          </span>
        </div>

        <span style={{ color: '#1E2530', userSelect: 'none' }}>│</span>

        {items.map((item, idx) => (
          <React.Fragment key={item.label}>
            {idx > 0 && <span style={{ color: '#1E2530', userSelect: 'none' }}>·</span>}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              <span className="layout-lock" style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.04em' }}>{item.label}</span>
              <span className="mono-precision" style={{ display: 'inline-block', minWidth: item.w, color: item.color, fontWeight: '700', textAlign: 'left', fontSize: '10px' }}>
                {item.value}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="mono-precision" style={{ fontSize: '10px', color: running ? '#00F0FF' : '#1E2530', letterSpacing: '0.04em' }}>
          {running ? `SIM T+${Math.round(simTime)}s` : 'SURVEILLANCE'}
        </span>
        <span className="mono-precision" style={{ fontSize: '9px', color: '#4A5568', letterSpacing: '0.06em' }}>WADIGUARD V4 · ABH LOUKKOS</span>
      </div>
    </footer>
  );
}

export default React.memo(BottomStatus);
