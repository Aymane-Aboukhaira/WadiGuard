import { useMemo, useState } from 'react';
import { LEVELS } from '../data/assets';
import { levelColor, levelSoft, clamp, formatNum } from '../utils';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, Line,
} from 'recharts';
import { TrendingUp, AlertTriangle, Droplets, ShieldCheck, Brain, Target, Clock } from 'lucide-react';

const TT = { background: '#060E1A', border: '1px solid #1A2F4A', color: '#E8F4FD', fontSize: 11, borderRadius: 8 };
const RADAR_COLORS = ['#4A9FE0', '#22C55E', '#F59E0B', '#EF4444', '#B91C1C'];
const S = { card: { borderRadius: 10, padding: 12, border: '1px solid #1A2F4A', background: 'rgba(15,30,53,0.9)' } };

function RiskCell({ value }) {
  const bg  = value > 70 ? 'rgba(239,68,68,0.28)' : value > 40 ? 'rgba(245,158,11,0.24)' : 'rgba(34,197,94,0.2)';
  const col = value > 70 ? '#EF4444' : value > 40 ? '#F59E0B' : '#22C55E';
  return <div className="risk-cell" style={{ background: bg, color: col, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 11, padding: '1px 5px', borderRadius: 4, display: 'inline-block', minWidth: 28, textAlign: 'center' }}>{value}</div>;
}

export default function AnalyseView({ liveAssets, phase, timelineData }) {
  const color = levelColor(phase.level);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredAssets = useMemo(() => {
    let sorted = [...liveAssets].sort((a, b) => b.riskScore - a.riskScore);
    if (typeFilter !== 'all') sorted = sorted.filter(a => a.type === typeFilter);
    return sorted;
  }, [liveAssets, typeFilter]);

  const top5 = useMemo(() => {
    return [...liveAssets].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  }, [liveAssets]);

  const top5Names = top5.map(a => a.shortName);
  const radarData = [
    { metric: 'Eau',     ...Object.fromEntries(top5.map(a => [a.shortName, a.water])) },
    { metric: 'Pluie',   ...Object.fromEntries(top5.map(a => [a.shortName, Math.min(a.rain, 100)])) },
    { metric: 'Risque',  ...Object.fromEntries(top5.map(a => [a.shortName, a.riskScore])) },
    { metric: 'Débit',   ...Object.fromEntries(top5.map(a => [a.shortName, clamp(a.flow / 2, 0, 100)])) },
    { metric: 'Batt.',   ...Object.fromEntries(top5.map(a => [a.shortName, a.battery])) },
  ];

  // Simulated prediction data
  const prediction = useMemo(() => {
    const pop = liveAssets.filter(a => a.affected).reduce((s, a) => s + a.population, 0);
    const factor = phase.level === 'black' ? 1.8 : phase.level === 'red' ? 1.4 : phase.level === 'orange' ? 1.0 : 0.2;
    return {
      min30: { routes: Math.round(3 * factor), pop: Math.round(pop * 0.6 * factor), shelters: Math.round(2 * factor), teams: Math.round(4 * factor) },
      min60: { routes: Math.round(5 * factor), pop: Math.round(pop * factor), shelters: Math.round(3 * factor), teams: Math.round(7 * factor) },
      min90: { routes: Math.round(6 * factor), pop: Math.round(pop * 1.2 * factor), shelters: Math.round(4 * factor), teams: Math.round(9 * factor) },
    };
  }, [liveAssets, phase]);

  // False alarm intelligence
  const falseAlarmData = useMemo(() => ({
    ultrasonic: { value: phase.level === 'green' ? '23.4 cm' : '67.8 cm', status: phase.level === 'green' ? 'normal' : 'élevé' },
    pressure: { value: phase.level === 'green' ? '1013 hPa' : '1002 hPa', status: phase.level === 'green' ? 'stable' : 'chute' },
    rainfall: { value: phase.level === 'green' ? '12 mm/h' : `${phase.rain || 45} mm/h`, status: phase.level === 'green' ? 'faible' : 'forte' },
    tinyml: { confidence: phase.level === 'green' ? 'N/A' : '97%', classification: phase.level === 'green' ? 'Aucun risque' : 'CRUE RÉELLE' },
    action: phase.level === 'green' ? 'Surveillance nominale' : 'Alerte validée — fausse alarme exclue',
  }), [phase]);

  return (
    <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Row 1: Top 5 Critical + Prediction + False Alarm */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {/* Top 5 Critical */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <Target size={11} color="#EF4444" />
            <p className="section-label" style={{ fontSize: 9 }}>Top 5 Actifs Critiques</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {top5.map((a, i) => {
              const c = levelColor(a.status);
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 5, background: i === 0 ? `${c}08` : 'transparent', borderLeft: `2px solid ${c}` }}>
                  <span className="mono-precision" style={{ fontSize: 10, fontWeight: 800, color: 'var(--wg-muted)', minWidth: 14 }}>#{i+1}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#E2E8F0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.shortName}</span>
                  <span className="mono-precision" style={{ fontSize: 10, fontWeight: 700, color: c }}>{a.water}%</span>
                  <span className="mono-precision" style={{ fontSize: 10, color: '#4A9FE0' }}>{a.rain}mm</span>
                  <RiskCell value={a.riskScore} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Prediction Panel */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <Clock size={11} color="#00F0FF" />
            <p className="section-label" style={{ fontSize: 9 }}>Prévision d'Impact — 30 / 60 / 90 min</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '3px 8px', fontSize: 10 }}>
            <span style={{ fontWeight: 700, color: 'var(--wg-muted)', fontSize: 8, textTransform: 'uppercase' }}></span>
            <span style={{ fontWeight: 700, color: 'var(--wg-muted)', fontSize: 8, textTransform: 'uppercase', textAlign: 'center' }}>30 min</span>
            <span style={{ fontWeight: 700, color: 'var(--wg-muted)', fontSize: 8, textTransform: 'uppercase', textAlign: 'center' }}>60 min</span>
            <span style={{ fontWeight: 700, color: 'var(--wg-muted)', fontSize: 8, textTransform: 'uppercase', textAlign: 'center' }}>90 min</span>

            <span style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 9.5 }}>Routes à risque</span>
            {['min30','min60','min90'].map(k => <span key={k} className="mono-precision" style={{ textAlign: 'center', color: '#F59E0B', fontWeight: 700 }}>{prediction[k].routes}</span>)}

            <span style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 9.5 }}>Population exposée</span>
            {['min30','min60','min90'].map(k => <span key={k} className="mono-precision" style={{ textAlign: 'center', color: '#EF4444', fontWeight: 700 }}>{formatNum(prediction[k].pop)}</span>)}

            <span style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 9.5 }}>Refuges nécessaires</span>
            {['min30','min60','min90'].map(k => <span key={k} className="mono-precision" style={{ textAlign: 'center', color: '#10B981', fontWeight: 700 }}>{prediction[k].shelters}</span>)}

            <span style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 9.5 }}>Équipes requises</span>
            {['min30','min60','min90'].map(k => <span key={k} className="mono-precision" style={{ textAlign: 'center', color: '#3B82F6', fontWeight: 700 }}>{prediction[k].teams}</span>)}
          </div>
          <p style={{ fontSize: 8, color: 'var(--wg-muted)', marginTop: 6, fontStyle: 'italic', textAlign: 'center' }}>
            Prévisions simulées — modèle de propagation hydrologique
          </p>
        </div>

        {/* False Alarm Intelligence */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <Brain size={11} color="#8B5CF6" />
            <p className="section-label" style={{ fontSize: 9 }}>Anti-Fausse Alarme · Validation Edge</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Ultrasonique', value: falseAlarmData.ultrasonic.value, status: falseAlarmData.ultrasonic.status },
              { label: 'Pression atm.', value: falseAlarmData.pressure.value, status: falseAlarmData.pressure.status },
              { label: 'Corrélation pluie', value: falseAlarmData.rainfall.value, status: falseAlarmData.rainfall.status },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px' }}>
                <span style={{ fontSize: 9.5, color: '#E2E8F0' }}>{row.label}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="mono-precision" style={{ fontSize: 10, color: '#00F0FF', fontWeight: 700 }}>{row.value}</span>
                  <span style={{ fontSize: 8, color: row.status === 'normal' || row.status === 'stable' || row.status === 'faible' ? '#22C55E' : '#F59E0B', fontWeight: 700, textTransform: 'uppercase' }}>{row.status}</span>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--wg-border)', paddingTop: 4, marginTop: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px' }}>
                <span style={{ fontSize: 9.5, color: '#E2E8F0', fontWeight: 600 }}>TinyML Edge</span>
                <span className="mono-precision" style={{ fontSize: 10, color: falseAlarmData.tinyml.confidence === 'N/A' ? 'var(--wg-muted)' : '#22C55E', fontWeight: 800 }}>{falseAlarmData.tinyml.confidence}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px' }}>
                <span style={{ fontSize: 9.5, color: '#E2E8F0' }}>Classification</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: falseAlarmData.tinyml.classification === 'CRUE RÉELLE' ? '#EF4444' : '#22C55E', padding: '1px 5px', borderRadius: 3, background: falseAlarmData.tinyml.classification === 'CRUE RÉELLE' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.06)' }}>
                  {falseAlarmData.tinyml.classification}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 8.5, fontWeight: 600, color: phase.level !== 'green' ? '#22C55E' : 'var(--wg-muted)', textAlign: 'center', marginTop: 2, padding: '2px 6px', borderRadius: 4, background: phase.level !== 'green' ? 'rgba(34,197,94,0.05)' : 'transparent' }}>
              {falseAlarmData.action}
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Risk Matrix + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 10 }}>
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <AlertTriangle size={12} color="#F59E0B" />
              <p className="section-label" style={{ fontSize: 9 }}>Matrice de risque — {filteredAssets.length} actifs</p>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[['all','Tous'],['dam','Barrages'],['river','Oueds'],['road','Gates']].map(([k,l]) => (
                <button key={k} onClick={() => setTypeFilter(k)} style={{
                  padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 700, cursor: 'pointer',
                  border: '1px solid var(--wg-border)', fontFamily: 'Outfit, sans-serif',
                  background: typeFilter === k ? 'var(--wg-blue)' : 'transparent',
                  color: typeFilter === k ? '#fff' : 'var(--wg-muted)',
                }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 220, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1A2F4A', position: 'sticky', top: 0, background: 'rgba(15,30,53,0.95)', zIndex: 1 }}>
                  {['Actif', 'Province', 'Type', 'Eau %', 'Pluie', 'Risque', 'Statut', 'ETA'].map(h => (
                    <th key={h} style={{ padding: '5px 6px', textAlign: 'left', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8BA3BE', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((a, i) => {
                  const lv = LEVELS[a.status]; const c = levelColor(a.status);
                  return (
                    <tr key={a.id} style={{ borderTop: i > 0 ? '1px solid #1A2F4A' : 'none', background: i % 2 === 0 ? 'rgba(6,14,26,0.4)' : 'transparent' }}>
                      <td style={{ padding: '4px 6px', fontWeight: 700, color: '#E8F4FD', fontSize: 10.5 }}>{a.shortName}</td>
                      <td style={{ padding: '4px 6px', color: '#8BA3BE', fontSize: 9.5 }}>{a.province}</td>
                      <td style={{ padding: '4px 6px', color: '#8BA3BE', fontSize: 9.5 }}>{a.type === 'dam' ? 'Barrage' : a.type === 'road' ? 'Gate' : 'Oued'}</td>
                      <td style={{ padding: '4px 6px' }}><RiskCell value={a.water} /></td>
                      <td style={{ padding: '4px 6px', fontFamily: 'JetBrains Mono,monospace', color: '#4A9FE0', fontSize: 10 }}>{a.rain}</td>
                      <td style={{ padding: '4px 6px' }}><RiskCell value={a.riskScore} /></td>
                      <td style={{ padding: '4px 6px' }}>
                        <span style={{ borderRadius: 4, padding: '1px 6px', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: c, background: levelSoft(a.status), border: `1px solid ${c}30` }}>{lv.label}</span>
                      </td>
                      <td style={{ padding: '4px 6px', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: a.etaMinutes ? '#F59E0B' : '#8BA3BE' }}>
                        {a.etaMinutes ? `${a.etaMinutes}min` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Radar */}
        <div style={S.card}>
          <p className="section-label" style={{ fontSize: 9, marginBottom: 6 }}>Radar — Top 5</p>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1A2F4A" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#8BA3BE', fontSize: 8 }} />
                {top5Names.map((name, i) => (
                  <Radar key={name} name={name} dataKey={name} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.08} strokeWidth={1.5} />
                ))}
                <Legend iconSize={6} wrapperStyle={{ fontSize: 8, color: '#8BA3BE' }} />
                <Tooltip contentStyle={TT} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={S.card}>
          <p className="section-label" style={{ fontSize: 9, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Droplets size={10} color="#4A9FE0" /> Tendance niveaux — simulation
          </p>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4A9FE0" stopOpacity={0.4} /><stop offset="95%" stopColor="#4A9FE0" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#1A2F4A" strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fill: '#8BA3BE', fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill: '#8BA3BE', fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="water" stroke="#4A9FE0" fill="url(#ag1)" strokeWidth={2} name="Eau %" />
                <Area type="monotone" dataKey="risk"  stroke="#EF4444" fill="url(#ag2)" strokeWidth={2} name="Risque" />
                <Line type="monotone" dataKey="rain"  stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Pluie" />
                <Legend iconSize={6} wrapperStyle={{ fontSize: 8, color: '#8BA3BE' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={S.card}>
          <p className="section-label" style={{ fontSize: 9, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <TrendingUp size={10} color="#22C55E" /> Score risque moyen par province
          </p>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={useMemo(() => {
                const PROVINCES = ['Tanger-Assilah', "M'diq-Fnideq", 'Tétouan', 'Chefchaouen', 'Larache', 'Al Hoceïma'];
                return PROVINCES.map(prov => {
                  const pvAssets = liveAssets.filter(a => a.province === prov);
                  return {
                    province: prov.split('-')[0],
                    risque: pvAssets.length ? Math.round(pvAssets.reduce((s, a) => s + a.riskScore, 0) / pvAssets.length) : 0,
                    eau:    pvAssets.length ? Math.round(pvAssets.reduce((s, a) => s + a.water,     0) / pvAssets.length) : 0,
                  };
                });
              }, [liveAssets])} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#1A2F4A" strokeDasharray="3 3" />
                <XAxis dataKey="province" tick={{ fill: '#8BA3BE', fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill: '#8BA3BE', fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="risque" fill="#EF4444" name="Risque" radius={[3,3,0,0]} maxBarSize={18} />
                <Bar dataKey="eau"    fill="#4A9FE0" name="Eau %"  radius={[3,3,0,0]} maxBarSize={18} />
                <Legend iconSize={6} wrapperStyle={{ fontSize: 8, color: '#8BA3BE' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
