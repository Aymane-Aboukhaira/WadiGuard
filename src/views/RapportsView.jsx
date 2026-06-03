import { useState, useMemo } from 'react';
import { LEVELS } from '../data/assets';
import { levelColor, levelSoft, formatNum, dateStamp, generateRef } from '../utils';
import { FileText, Download, Plus, Calendar, CheckCircle2, AlertTriangle, Users, Clock, Copy, ShieldCheck } from 'lucide-react';
import CapPreview from '../components/CapPreview';

const HISTORY = [
  { ref: 'WG-20260528-001', date: '28/05/2026', scenario: 'Tempête Rif Nord',          level: 'red',    pop: 48600, teams: 11, roads: 8,  responseTime: '28s' },
  { ref: 'WG-20260521-002', date: '21/05/2026', scenario: 'Crue Éclair Nekor',          level: 'red',    pop: 21300, teams: 8,  roads: 5,  responseTime: '22s' },
  { ref: 'WG-20260512-003', date: '12/05/2026', scenario: 'Anti-Fausse Alarme',         level: 'green',  pop: 0,     teams: 0,  roads: 0,  responseTime: '— ' },
  { ref: 'WG-20260503-004', date: '03/05/2026', scenario: 'Loukkos + Makhazine',        level: 'orange', pop: 9200,  teams: 4,  roads: 3,  responseTime: '35s' },
  { ref: 'WG-20260418-005', date: '18/04/2026', scenario: 'Tempête Smir Méditerranée',  level: 'red',    pop: 32600, teams: 12, roads: 6,  responseTime: '18s' },
  { ref: 'WG-FA-20260405',  date: '05/04/2026', scenario: 'Anti-Fausse Alarme',         level: 'green',  pop: 0,     teams: 0,  roads: 0,  responseTime: '— ' },
  { ref: 'WG-20260320-001', date: '20/03/2026', scenario: 'Tempête Rif Nord',           level: 'black',  pop: 72800, teams: 18, roads: 12, responseTime: '15s' },
];

const S = {
  card: { borderRadius: 10, padding: 12, border: '1px solid #1A2F4A', background: 'rgba(15,30,53,0.9)' },
  kpi:  { borderRadius: 8, padding: '8px 10px', border: '1px solid #1A2F4A', background: 'rgba(6,14,26,0.85)', display: 'flex', flexDirection: 'column', gap: 2 },
};

export default function RapportsView({ logs, liveAssets, phase, scenario, consequences, onOpenReport }) {
  const [filter, setFilter] = useState('Tous');
  const today = dateStamp();

  const FILTERS = ['Tous', 'Vert', 'Orange', 'Rouge', 'Noir'];
  const LVL_MAP = { Vert: 'green', Orange: 'orange', Rouge: 'red', Noir: 'black' };

  const filtered = useMemo(() => {
    if (filter === 'Tous') return HISTORY;
    return HISTORY.filter(r => r.level === LVL_MAP[filter]);
  }, [filter]);

  const totalPop = HISTORY.reduce((s, r) => s + r.pop, 0);
  const redPlus = HISTORY.filter(r => r.level === 'red' || r.level === 'black').length;
  const falseAlarms = HISTORY.filter(r => r.level === 'green').length;
  const avgResponse = Math.round(HISTORY.filter(r => r.responseTime !== '— ').reduce((s, r) => s + parseInt(r.responseTime), 0) / Math.max(1, HISTORY.filter(r => r.responseTime !== '— ').length));

  return (
    <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Official Government Header Banner */}
      <div style={{
        ...S.card,
        padding: '16px 20px',
        borderBottom: '3px solid #D4AF37',
        background: 'linear-gradient(135deg, rgba(10,25,47,0.95) 0%, rgba(6,14,26,0.98) 100%)',
      }}>
        {/* Bilingual Header Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(26,47,74,0.5)', paddingBottom: 12, marginBottom: 12, gap: 15 }}>
          {/* Left: Ministry & Agency Details in French */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '40%' }}>
            <p style={{ fontSize: 9, fontWeight: 900, color: '#D4AF37', letterSpacing: '0.08em' }}>ROYAUME DU MAROC</p>
            <p style={{ fontSize: 8, color: '#A0B3C6', fontWeight: 600, lineHeight: 1.2 }}>Ministère de l'Équipement et de l'Eau</p>
            <p style={{ fontSize: 8, color: '#A0B3C6', fontWeight: 600, lineHeight: 1.2 }}>Direction Générale de l'Hydraulique</p>
            <p style={{ fontSize: 8, color: '#E8F4FD', fontWeight: 700, lineHeight: 1.2 }}>Agence du Bassin Hydraulique du Loukkos</p>
          </div>

          {/* Center: Kingdom Seal / Emblem */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2.5" fill="rgba(6,14,26,0.8)" />
              <path d="M50 15 L61 48 L93 48 L67 67 L77 100 L50 80 L23 100 L33 67 L7 48 L39 48 Z" 
                stroke="#22C55E" strokeWidth="3" fill="#D4AF37" strokeLinejoin="round" />
              <path d="M40 18 L45 8 L50 12 L55 8 L60 18 Z" fill="#D4AF37" />
            </svg>
            <span style={{ fontSize: 7, fontWeight: 800, color: '#D4AF37', letterSpacing: '0.15em', textTransform: 'uppercase' }}>WadiGuard NOC</span>
          </div>

          {/* Right: Ministry & Agency Details in Arabic */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, maxWidth: '40%', textAlign: 'right' }}>
            <p style={{ fontSize: 10, fontWeight: 900, color: '#D4AF37', fontFamily: 'serif' }}>المملكة المغربية</p>
            <p style={{ fontSize: 8, color: '#A0B3C6', fontWeight: 600, lineHeight: 1.2 }}>وزارة التجهيز والماء</p>
            <p style={{ fontSize: 8, color: '#A0B3C6', fontWeight: 600, lineHeight: 1.2 }}>المديرية العامة للهندسة المائية</p>
            <p style={{ fontSize: 8, color: '#E8F4FD', fontWeight: 700, lineHeight: 1.2 }}>وكالة الحوض المائي لللوكوس</p>
          </div>
        </div>

        {/* Lower Row: Action & Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#8BA3BE' }}>Module d'Archivage & CAP</p>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: '#E8F4FD', marginTop: 2 }}>Registre des Rapports Légaux</h2>
            <p style={{ fontSize: 10, color: '#8BA3BE', marginTop: 2 }}>Génération de bulletins d'alerte et transmission des fiches d'impacts au commandement national</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', gap: 2, borderRadius: 6, padding: 3, background: 'rgba(6,14,26,0.85)', border: '1px solid #1A2F4A' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  borderRadius: 5, padding: '3px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  border: 'none', outline: 'none', transition: 'all 0.15s', fontFamily: 'Outfit, sans-serif',
                  background: filter === f ? '#0E7490' : 'transparent',
                  color: filter === f ? '#fff' : '#8BA3BE',
                }}>{f}</button>
              ))}
            </div>
            <button onClick={onOpenReport} className="btn btn-primary" style={{ gap: 5, fontSize: 11 }}>
              <Plus size={12} /> Nouveau rapport
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {[
          { icon: FileText,      label: 'Rapports totaux',     value: HISTORY.length,     color: '#4A9FE0' },
          { icon: AlertTriangle, label: 'Alertes ROUGE+',      value: redPlus,            color: '#EF4444' },
          { icon: CheckCircle2,  label: 'Fausses alarmes évitées', value: falseAlarms,    color: '#22C55E' },
          { icon: Users,         label: 'Population notifiée', value: formatNum(totalPop), color: '#F59E0B' },
          { icon: Clock,         label: 'Temps moyen réponse', value: `${avgResponse}s`,  color: '#00F0FF' },
          { icon: ShieldCheck,   label: 'Rapports CAP générés', value: redPlus,           color: '#8B5CF6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={S.kpi}>
            <Icon size={12} color={color} />
            <p style={{ fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8BA3BE' }}>{label}</p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Two-column: Table + CAP Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 10 }}>
        {/* Table */}
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1A2F4A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="section-label" style={{ fontSize: 9 }}>Historique ({filtered.length} rapport{filtered.length !== 1 ? 's' : ''})</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#8BA3BE' }}>
              <Calendar size={10} /> Filtre : {filter}
            </div>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: 'rgba(6,14,26,0.7)', borderBottom: '1px solid #1A2F4A', position: 'sticky', top: 0, zIndex: 1 }}>
                  {['Réf.', 'Date', 'Scénario', 'Niveau', 'Pop.', 'Éq.', 'Rép.', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: '#8BA3BE' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const c = levelColor(r.level);
                  return (
                    <tr key={r.ref} style={{ borderTop: '1px solid #1A2F4A', background: i % 2 === 0 ? 'rgba(6,14,26,0.3)' : 'transparent' }}>
                      <td style={{ padding: '5px 8px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: '#4A9FE0', fontSize: 9.5 }}>{r.ref}</td>
                      <td style={{ padding: '5px 8px', color: '#8BA3BE', fontSize: 10 }}>{r.date}</td>
                      <td style={{ padding: '5px 8px', fontWeight: 600, color: '#E8F4FD', fontSize: 10 }}>{r.scenario}</td>
                      <td style={{ padding: '5px 8px' }}>
                        <span style={{ borderRadius: 4, padding: '1px 6px', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: c, background: levelSoft(r.level), border: `1px solid ${c}30` }}>
                          {LEVELS[r.level].label}
                        </span>
                      </td>
                      <td style={{ padding: '5px 8px', fontFamily: 'JetBrains Mono,monospace', color: r.pop > 0 ? '#F59E0B' : '#8BA3BE', fontSize: 10 }}>{r.pop > 0 ? formatNum(r.pop) : '—'}</td>
                      <td style={{ padding: '5px 8px', fontFamily: 'JetBrains Mono,monospace', color: '#4A9FE0', fontSize: 10 }}>{r.teams > 0 ? r.teams : '—'}</td>
                      <td style={{ padding: '5px 8px', fontFamily: 'JetBrains Mono,monospace', color: '#00F0FF', fontSize: 10 }}>{r.responseTime}</td>
                      <td style={{ padding: '5px 8px' }}>
                        <div style={{ display: 'flex', gap: 3 }}>
                          <button onClick={onOpenReport} className="btn btn-ghost" style={{ padding: '2px 6px', fontSize: 9 }}>Voir</button>
                          <button onClick={() => window.print()} className="btn btn-ghost" style={{ padding: '2px 6px', fontSize: 9 }}>PDF</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CAP Preview */}
        <div style={S.card}>
          <CapPreview scenario={scenario} phase={phase} consequences={consequences} />
        </div>
      </div>

      {/* Log excerpt */}
      {logs.length > 0 && (
        <div style={S.card}>
          <p className="section-label" style={{ fontSize: 9, marginBottom: 8 }}>Derniers événements — session en cours</p>
          <div style={{ borderRadius: 6, padding: 8, background: '#060E1A', border: '1px solid #1A2F4A', maxHeight: 140, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {logs.slice(0, 8).map((log, i) => (
              <div key={i} className="log-entry" style={{ color: LEVELS[log.level]?.color ?? '#8BA3BE' }}>
                <span style={{ color: '#8BA3BE', fontSize: 9 }}>[{log.at}]</span> {log.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
