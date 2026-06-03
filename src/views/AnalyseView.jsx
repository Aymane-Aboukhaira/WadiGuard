import { useMemo, useState } from 'react';
import { LEVELS } from '../data/assets';
import { levelColor, levelSoft, clamp, formatNum } from '../utils';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, Line,
} from 'recharts';
import { TrendingUp, AlertTriangle, Droplets, ShieldCheck, Brain, Target, Clock } from 'lucide-react';

const TT = { background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)', color: 'var(--wg-text)', fontSize: 11.5, borderRadius: 6 };
const RADAR_COLORS = ['#4A9FE0', 'var(--wg-green)', 'var(--wg-orange)', 'var(--wg-red)', 'var(--wg-black-alert)'];
const S = { card: { borderRadius: 8, padding: 14, border: '1px solid var(--wg-border)', background: 'var(--wg-surface)' } };

function RiskCell({ value }) {
  const bg  = value > 70 ? 'rgba(239,68,68,0.12)' : value > 40 ? 'rgba(217,119,6,0.1)' : 'rgba(5,150,105,0.08)';
  const col = value > 70 ? 'var(--wg-red)' : value > 40 ? 'var(--wg-orange)' : 'var(--wg-green)';
  return <div className="risk-cell" style={{ background: bg, color: col, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 11, padding: '2px 6px', borderRadius: 4, display: 'inline-block', minWidth: 32, textAlign: 'center' }}>{value}</div>;
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
            <Target size={12} color="var(--wg-red)" />
            <p className="section-label">Top 5 Actifs Critiques</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {top5.map((a, i) => {
              const c = levelColor(a.status);
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 5, background: i === 0 ? `${c}08` : 'transparent', borderLeft: `2px solid ${c}` }}>
                  <span className="mono-precision" style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--wg-muted)', minWidth: 14 }}>#{i+1}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--wg-text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.shortName}</span>
                  <span className="mono-precision" style={{ fontSize: 10.5, fontWeight: 700, color: c }}>{a.water}%</span>
                  <span className="mono-precision" style={{ fontSize: 10.5, color: '#4A9FE0' }}>{a.rain}mm</span>
                  <RiskCell value={a.riskScore} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Prediction Panel */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <Clock size={12} color="var(--wg-cyan)" />
            <p className="section-label">Prévision d'Impact — 30 / 60 / 90 min</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '6px 10px', fontSize: 11, padding: '2px 0' }}>
            <span style={{ fontWeight: 700, color: 'var(--wg-muted)', fontSize: 9, textTransform: 'uppercase' }}></span>
            <span style={{ fontWeight: 700, color: 'var(--wg-muted)', fontSize: 9, textTransform: 'uppercase', textAlign: 'center' }}>30 min</span>
            <span style={{ fontWeight: 700, color: 'var(--wg-muted)', fontSize: 9, textTransform: 'uppercase', textAlign: 'center' }}>60 min</span>
            <span style={{ fontWeight: 700, color: 'var(--wg-muted)', fontSize: 9, textTransform: 'uppercase', textAlign: 'center' }}>90 min</span>

            <span style={{ color: 'var(--wg-text)', fontWeight: 600 }}>Routes à risque</span>
            {['min30','min60','min90'].map(k => <span key={k} className="mono-precision" style={{ textAlign: 'center', color: 'var(--wg-orange)', fontWeight: 700 }}>{prediction[k].routes}</span>)}

            <span style={{ color: 'var(--wg-text)', fontWeight: 600 }}>Population exposée</span>
            {['min30','min60','min90'].map(k => <span key={k} className="mono-precision" style={{ textAlign: 'center', color: 'var(--wg-red)', fontWeight: 700 }}>{formatNum(prediction[k].pop)}</span>)}

            <span style={{ color: 'var(--wg-text)', fontWeight: 600 }}>Refuges requis</span>
            {['min30','min60','min90'].map(k => <span key={k} className="mono-precision" style={{ textAlign: 'center', color: 'var(--wg-green)', fontWeight: 700 }}>{prediction[k].shelters}</span>)}

            <span style={{ color: 'var(--wg-text)', fontWeight: 600 }}>Équipes requises</span>
            {['min30','min60','min90'].map(k => <span key={k} className="mono-precision" style={{ textAlign: 'center', color: 'var(--wg-blue)', fontWeight: 700 }}>{prediction[k].teams}</span>)}
          </div>
          <p style={{ fontSize: 9, color: 'var(--wg-muted)', marginTop: 8, fontStyle: 'italic', textAlign: 'center', margin: '8px 0 0' }}>
            Prévisions simulées · Modèle de propagation hydrologique
          </p>
        </div>

        {/* False Alarm Intelligence */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <Brain size={12} color="#8B5CF6" />
            <p className="section-label">Anti-Fausse Alarme · Validation Edge</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Ultrasonique', value: falseAlarmData.ultrasonic.value, status: falseAlarmData.ultrasonic.status },
              { label: 'Pression atm.', value: falseAlarmData.pressure.value, status: falseAlarmData.pressure.status },
              { label: 'Corrélation pluie', value: falseAlarmData.rainfall.value, status: falseAlarmData.rainfall.status },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 4px' }}>
                <span style={{ fontSize: 11, color: 'var(--wg-text)' }}>{row.label}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="mono-precision" style={{ fontSize: 11, color: 'var(--wg-cyan)', fontWeight: 700 }}>{row.value}</span>
                  <span style={{ fontSize: 9, color: row.status === 'normal' || row.status === 'stable' || row.status === 'faible' ? 'var(--wg-green)' : 'var(--wg-orange)', fontWeight: 700, textTransform: 'uppercase' }}>{row.status}</span>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--wg-border)', paddingTop: 5, marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 4px' }}>
                <span style={{ fontSize: 11, color: 'var(--wg-text)', fontWeight: 600 }}>TinyML Edge</span>
                <span className="mono-precision" style={{ fontSize: 11, color: falseAlarmData.tinyml.confidence === 'N/A' ? 'var(--wg-muted)' : 'var(--wg-green)', fontWeight: 800 }}>{falseAlarmData.tinyml.confidence}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 4px' }}>
                <span style={{ fontSize: 11, color: 'var(--wg-text)' }}>Classification</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: falseAlarmData.tinyml.classification === 'CRUE RÉELLE' ? 'var(--wg-red)' : 'var(--wg-green)', padding: '1px 6px', borderRadius: 3, background: falseAlarmData.tinyml.classification === 'CRUE RÉELLE' ? 'rgba(220,38,38,0.1)' : 'rgba(5,150,105,0.06)' }}>
                  {falseAlarmData.tinyml.classification}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 9.5, fontWeight: 700, color: phase.level !== 'green' ? 'var(--wg-green)' : 'var(--wg-muted)', textAlign: 'center', marginTop: 4, padding: '3px 6px', borderRadius: 4, background: phase.level !== 'green' ? 'var(--level-soft)' : 'transparent', border: phase.level !== 'green' ? '1px solid var(--level-color)' : 'none', margin: '4px 0 0' }}>
              {falseAlarmData.action}
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Risk Matrix + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 10 }}>
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <AlertTriangle size={13} color="var(--wg-orange)" />
              <p className="section-label">Matrice de risque — {filteredAssets.length} actifs</p>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[['all','Tous'],['dam','Barrages'],['river','Oueds'],['road','Gates']].map(([k,l]) => (
                <button key={k} onClick={() => setTypeFilter(k)} style={{
                  padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  border: '1px solid var(--wg-border)', fontFamily: 'Outfit, sans-serif',
                  background: typeFilter === k ? 'var(--wg-blue)' : 'transparent',
                  color: typeFilter === k ? '#fff' : 'var(--wg-muted)',
                }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 220, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--wg-border)', position: 'sticky', top: 0, background: 'var(--wg-surface)', zIndex: 1 }}>
                  {['Actif', 'Province', 'Type', 'Eau %', 'Pluie', 'Risque', 'Statut', 'ETA'].map(h => (
                    <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--wg-muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((a, i) => {
                  const lv = LEVELS[a.status]; const c = levelColor(a.status);
                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--wg-border)', background: i % 2 === 0 ? 'var(--wg-bg-deep)' : 'transparent' }}>
                      <td style={{ padding: '6px 8px', fontWeight: 700, color: 'var(--wg-text)', fontSize: 11 }}>{a.shortName}</td>
                      <td style={{ padding: '6px 8px', color: 'var(--wg-muted)', fontSize: 10.5 }}>{a.province}</td>
                      <td style={{ padding: '6px 8px', color: 'var(--wg-muted)', fontSize: 10.5 }}>{a.type === 'dam' ? 'Barrage' : a.type === 'road' ? 'Gate' : 'Oued'}</td>
                      <td style={{ padding: '6px 8px' }}><RiskCell value={a.water} /></td>
                      <td style={{ padding: '6px 8px', fontFamily: 'JetBrains Mono,monospace', color: '#4A9FE0', fontSize: 11 }}>{a.rain}</td>
                      <td style={{ padding: '6px 8px' }}><RiskCell value={a.riskScore} /></td>
                      <td style={{ padding: '6px 8px' }}>
                        <span style={{ borderRadius: 4, padding: '1.5px 6px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: c, background: levelSoft(a.status), border: `1px solid ${c}30` }}>{lv.label}</span>
                      </td>
                      <td style={{ padding: '6px 8px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, color: a.etaMinutes ? 'var(--wg-orange)' : 'var(--wg-muted)' }}>
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
          <p className="section-label" style={{ marginBottom: 6 }}>Radar — Top 5</p>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--wg-border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--wg-muted)', fontSize: 9.5 }} />
                {top5Names.map((name, i) => (
                  <Radar key={name} name={name} dataKey={name} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.08} strokeWidth={1.5} />
                ))}
                <Legend iconSize={6} wrapperStyle={{ fontSize: 9, color: 'var(--wg-muted)' }} />
                <Tooltip contentStyle={TT} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={S.card}>
          <p className="section-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Droplets size={12} color="#4A9FE0" /> Tendance niveaux — simulation
          </p>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4A9FE0" stopOpacity={0.4} /><stop offset="95%" stopColor="#4A9FE0" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--wg-red)" stopOpacity={0.35} /><stop offset="95%" stopColor="var(--wg-red)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--wg-border)" strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fill: 'var(--wg-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill: 'var(--wg-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="water" stroke="#4A9FE0" fill="url(#ag1)" strokeWidth={2} name="Eau %" />
                <Area type="monotone" dataKey="risk"  stroke="var(--wg-red)" fill="url(#ag2)" strokeWidth={2} name="Risque" />
                <Line type="monotone" dataKey="rain"  stroke="var(--wg-orange)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Pluie" />
                <Legend iconSize={6} wrapperStyle={{ fontSize: 9, color: 'var(--wg-muted)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={S.card}>
          <p className="section-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <TrendingUp size={12} color="var(--wg-green)" /> Score risque moyen par province
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
                <CartesianGrid stroke="var(--wg-border)" strokeDasharray="3 3" />
                <XAxis dataKey="province" tick={{ fill: 'var(--wg-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill: 'var(--wg-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="risque" fill="var(--wg-red)" name="Risque" radius={[3,3,0,0]} maxBarSize={18} />
                <Bar dataKey="eau"    fill="#4A9FE0" name="Eau %"  radius={[3,3,0,0]} maxBarSize={18} />
                <Legend iconSize={6} wrapperStyle={{ fontSize: 9, color: 'var(--wg-muted)' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
