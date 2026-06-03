import React from 'react';
import { LEVELS } from '../data/assets';
import { levelColor, levelSoft } from '../utils';
import { Layers, CheckCircle2 } from 'lucide-react';

const REGIONS_DATA = [
  { name: 'Tanger', total: 17, count: 13, level: 'green' },
  { name: 'Tétouan', total: 11, count: 13, level: 'green' },
  { name: 'Chefchaouen', total: 4, count: 10, level: 'orange' },
  { name: 'Al Hoceïma', total: 3, count: 7, level: 'orange' },
  { name: 'Al Hoceïma', total: 2, count: 3, level: 'red' },
  { name: 'Tétouan', total: 0, count: 1, level: 'black' },
  { name: 'Chefendan', total: 0, count: 1, level: 'red' },
];

// Circular Gauge Component (Memoized)
const CircularGauge = React.memo(({ value, label, trendData, color }) => {
  const size = 50;
  const radius = 20;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const sparklinePath = React.useMemo(() => {
    if (!trendData || trendData.length === 0) return '';
    const w = 55;
    const h = 18;
    const maxVal = Math.max(...trendData, 1);
    const minVal = Math.min(...trendData, 0);
    const range = maxVal - minVal || 1;
    const points = trendData.map((val, idx) => {
      const x = (idx / (trendData.length - 1)) * w;
      const y = h - ((val - minVal) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${points.join(' L ')}`;
  }, [trendData]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(5,6,8,0.25)', border: '1px solid var(--wg-border)', borderRadius: '6px', padding: '6px 10px', height: '62px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#E2E8F0" fontSize="10px" className="mono-precision" fontWeight="700">
            {value}%
          </text>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="section-label" style={{ fontSize: '10px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          {sparklinePath && (
            <svg width="55" height="18" style={{ overflow: 'visible', flexShrink: 0 }}>
              <path d={sparklinePath} fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
});

// Linear Gauge Component (Memoized)
const LinearGauge = React.memo(({ value, max = 100, label, trendData, color }) => {
  const percent = Math.min((value / max) * 100, 100);

  const sparklinePath = React.useMemo(() => {
    if (!trendData || trendData.length === 0) return '';
    const w = 55;
    const h = 18;
    const maxVal = Math.max(...trendData, 1);
    const minVal = Math.min(...trendData, 0);
    const range = maxVal - minVal || 1;
    const points = trendData.map((val, idx) => {
      const x = (idx / (trendData.length - 1)) * w;
      const y = h - ((val - minVal) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${points.join(' L ')}`;
  }, [trendData]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(5,6,8,0.25)', border: '1px solid var(--wg-border)', borderRadius: '6px', padding: '6px 10px', height: '62px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span className="section-label" style={{ fontSize: '10px' }}>{label}</span>
          <span className="mono-precision" style={{ fontSize: '11px', fontWeight: '700', color }}>{value}mm/h</span>
        </div>
        <div className="progress-bar" style={{ height: '3px', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="progress-bar-fill" style={{ width: `${percent}%`, background: color }} />
        </div>
      </div>
      {sparklinePath && (
        <svg width="55" height="18" style={{ overflow: 'visible', flexShrink: 0, marginLeft: 4 }}>
          <path d={sparklinePath} fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
});

// Risk Score Gauge Component (Memoized)
const RiskGauge = React.memo(({ value, label, trendData, color }) => {
  const size = 50;
  const radius = 20;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const sparklinePath = React.useMemo(() => {
    if (!trendData || trendData.length === 0) return '';
    const w = 55;
    const h = 18;
    const maxVal = Math.max(...trendData, 1);
    const minVal = Math.min(...trendData, 0);
    const range = maxVal - minVal || 1;
    const points = trendData.map((val, idx) => {
      const x = (idx / (trendData.length - 1)) * w;
      const y = h - ((val - minVal) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${points.join(' L ')}`;
  }, [trendData]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(5,6,8,0.25)', border: '1px solid var(--wg-border)', borderRadius: '6px', padding: '6px 10px', height: '62px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#E2E8F0" fontSize="11px" className="mono-precision" fontWeight="700">
            {value}
          </text>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="section-label" style={{ fontSize: '10px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          {sparklinePath && (
            <svg width="55" height="18" style={{ overflow: 'visible', flexShrink: 0 }}>
              <path d={sparklinePath} fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
});

export default function RegionalPanel({ province, setProvince, assets, selectedAsset, setSelectedAssetId, onOpenAsset, timelineData = [] }) {
  
  // Extract histories for the current selected asset
  const waterHistory = React.useMemo(() => timelineData.map(d => d.water), [timelineData]);
  const rainHistory = React.useMemo(() => timelineData.map(d => d.rain), [timelineData]);
  const riskHistory = React.useMemo(() => timelineData.map(d => d.risk), [timelineData]);

  // Color helper for region circles
  const getCircleColors = (level) => {
    if (level === 'green') return { bg: 'rgba(16,185,129,0.1)', border: 'var(--wg-green)', color: 'var(--wg-green)' };
    if (level === 'orange') return { bg: 'rgba(245,158,11,0.1)', border: 'var(--wg-orange)', color: 'var(--wg-orange)' };
    if (level === 'red') return { bg: 'rgba(239,68,68,0.1)', border: 'var(--wg-red)', color: 'var(--wg-red)' };
    return { bg: 'rgba(127,29,29,0.2)', border: '#7F1D1D', color: '#EF4444' };
  };

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflow: 'hidden' }}>
      
      {/* ── Regional Coverage Card ── */}
      <div className="glass" style={{ borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <p className="section-label">Couverture Régionale</p>
            <h2 className="section-title">Réseau Tanger-Tétouan</h2>
          </div>
          <Layers size={14} color="var(--wg-cyan)" />
        </div>

        {/* Regions list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', maxHeight: '120px', paddingRight: 4 }}>
          {REGIONS_DATA.map((reg, idx) => {
            const styleCircle = getCircleColors(reg.level);
            const isSelected = province === reg.name;
            return (
              <button key={idx} 
                onClick={() => {
                  const nextProv = isSelected ? 'Tous' : reg.name;
                  setProvince(nextProv);
                  if (nextProv !== 'Tous') {
                    const firstInProv = assets.find(a => a.province === nextProv);
                    if (firstInProv) setSelectedAssetId(firstInProv.id);
                  }
                }}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', 
                  background: isSelected ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255,255,255,0.01)', 
                  border: `1px solid ${isSelected ? 'var(--wg-cyan)' : 'rgba(255,255,255,0.02)'}`, 
                  borderRadius: 4, cursor: 'pointer', outline: 'none', transition: 'all 0.15s ease', textAlign: 'left'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: styleCircle.color, flexShrink: 0 }} />
                  <span className="layout-lock" style={{ fontSize: '11px', color: isSelected ? 'var(--wg-cyan)' : '#E2E8F0', fontWeight: isSelected ? '700' : '500' }}>{reg.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* Total */}
                  <div className="mono-precision" style={{
                    width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--wg-border)', color: 'var(--wg-muted)', fontSize: '10px', fontWeight: '700'
                  }}>
                    {reg.total}
                  </div>
                  {/* Active status indicator */}
                  <div className="mono-precision" style={{
                    width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: styleCircle.bg, border: `1px solid ${styleCircle.border}`, color: styleCircle.color, fontSize: '10px', fontWeight: '700'
                  }}>
                    {reg.count}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Asset Interactive Selector List ── */}
      <div className="glass" style={{ borderRadius: 8, padding: '10px 12px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p className="section-label" style={{ fontSize: '10px', flexShrink: 0 }}>Liste des actifs ({assets.length})</p>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 4 }}>
          {assets.map(asset => {
            const isSelected = asset.id === selectedAsset.id;
            const color = levelColor(asset.status);
            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '6px 8px', borderRadius: '4px',
                  background: isSelected ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${isSelected ? 'var(--wg-cyan)' : 'var(--wg-border)'}`,
                  color: '#E2E8F0', cursor: 'pointer', textAlign: 'left', outline: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span className="layout-lock" style={{ fontSize: '11px', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'var(--wg-cyan)' : '#E2E8F0' }}>
                    {asset.shortName}
                  </span>
                </div>
                <span className="mono-precision" style={{ fontSize: '10px', color: isSelected ? 'var(--wg-cyan)' : 'var(--wg-muted)' }}>
                  {asset.water}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected Asset Details & High-Fidelity Gauges ── */}
      <div className="glass" style={{ borderRadius: 8, padding: 12, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <p className="section-label">Actif Sélectionné</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 2 }}>
            <h3 className="section-title text-truncate-precision" style={{ fontSize: '12.5px', margin: 0 }}>{selectedAsset.name}</h3>
            <button 
              onClick={() => onOpenAsset(selectedAsset)}
              style={{ background: 'none', border: 'none', color: 'var(--wg-cyan)', fontSize: '10px', fontWeight: '700', cursor: 'pointer', padding: 0 }}
            >
              INFOS ↗
            </button>
          </div>
          <p style={{ fontSize: '10.5px', color: 'var(--wg-muted)', marginTop: 1 }} className="text-truncate-precision">{selectedAsset.basin} · {selectedAsset.province}</p>
        </div>

        {/* Dynamic Gauges Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <CircularGauge
            value={selectedAsset.water}
            label="NIVEAU D'EAU"
            trendData={waterHistory}
            color={levelColor(selectedAsset.status)}
          />
          <LinearGauge
            value={selectedAsset.rain}
            max={130}
            label="PLUVIOMÉTRIE"
            trendData={rainHistory}
            color="#00F0FF"
          />
          <RiskGauge
            value={selectedAsset.riskScore}
            label="RISQUE LOCAL"
            trendData={riskHistory}
            color={selectedAsset.riskScore > 70 ? 'var(--wg-red)' : selectedAsset.riskScore > 40 ? 'var(--wg-orange)' : 'var(--wg-green)'}
          />
        </div>

        {/* Asset Summary Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px', color: '#E2E8F0', marginTop: 2, tableLayout: 'fixed' }}>
          <tbody>
            {[
              { label: 'Capacité', val: selectedAsset.capacity || '—' },
              { label: 'Priorité', val: selectedAsset.priority || 'Urbain' },
              { label: 'Latence', val: `${selectedAsset.latency}ms`, class: 'mono-precision' },
              { label: 'Batterie', val: `${selectedAsset.battery}%`, class: 'mono-precision' },
              { label: 'Sync', val: `${selectedAsset.lastSync || 'Just now'} ago` },
            ].map((row, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.015)' }}>
                <td className="section-label" style={{ padding: '4px 0', width: '80px', fontSize: '10px', color: 'var(--wg-muted)' }}>{row.label}</td>
                <td className={row.class || ''} style={{ padding: '4px 0', textAlign: 'right', fontWeight: '600' }}>
                  <div className="layout-lock" style={{ display: 'inline-block', minWidth: '45px', textAlign: 'right' }}>
                    {row.val}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Decision Box */}
        <div style={{ padding: '6px 8px', background: levelSoft(selectedAsset.status), border: `1px solid ${levelColor(selectedAsset.status)}25`, borderRadius: '4px' }}>
          <p className="section-label" style={{ fontSize: '10px', color: 'var(--wg-muted)' }}>Décision automatique</p>
          <p style={{ fontSize: '10.5px', fontWeight: '700', color: levelColor(selectedAsset.status), marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={10} color={levelColor(selectedAsset.status)} />
            {LEVELS[selectedAsset.status]?.action || 'Surveillance active'}
          </p>
        </div>

      </div>

    </aside>
  );
}
