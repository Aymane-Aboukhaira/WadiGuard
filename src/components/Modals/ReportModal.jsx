import { useRef } from 'react';
import { LEVELS } from '../../data/assets';
import { levelColor, levelSoft, dateStamp, generateRef, formatNum } from '../../utils';
import { X, Printer, CheckCircle2, Users, Route, Siren, MessageSquare, ShieldCheck, Lock, Radio, FileText } from 'lucide-react';

function InfoBlock({ label, value, valueColor }) {
  return (
    <div style={{ borderRadius: 6, padding: '7px 10px', background: 'rgba(6,14,26,0.7)', border: '1px solid #1A2F4A' }}>
      <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8BA3BE' }}>{label}</p>
      <p style={{ fontSize: 12, fontWeight: 700, color: valueColor ?? '#E8F4FD', marginTop: 2 }}>{value}</p>
    </div>
  );
}

function KpiReport({ icon: Icon, label, value, color }) {
  return (
    <div style={{ borderRadius: 8, padding: 8, background: 'rgba(6,14,26,0.6)', border: `1px solid ${color}20`, textAlign: 'center' }}>
      <Icon size={12} color={color} style={{ marginBottom: 2 }} />
      <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8BA3BE' }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 900, color, marginTop: 1, fontFamily: 'JetBrains Mono, monospace' }}>{value}</p>
    </div>
  );
}

export default function ReportModal({ scenario, phase, consequences, liveAssets, logs, onClose }) {
  const refId   = useRef(generateRef('WG'));
  const meta    = LEVELS[phase.level];
  const color   = levelColor(phase.level);
  const today   = dateStamp();
  const affected = liveAssets.filter(a => a.affected);
  const redCount = liveAssets.filter(a => a.status === 'red' || a.status === 'black').length;

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-scale-in" style={{ maxWidth: 740 }}>
        {/* Official Header */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px 12px 0 0',
          background: 'linear-gradient(135deg, rgba(10,25,47,0.98) 0%, rgba(6,14,26,0.99) 100%)',
          borderBottom: '3px solid #D4AF37'
        }}>
          {/* Header Controls (Close button on top right) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: '2px 6px', height: 'auto', minHeight: 'unset', color: '#8BA3BE' }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15 }}>
            {/* Left: Ministry & Agency Details in French */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '40%' }}>
              <p style={{ fontSize: 8.5, fontWeight: 900, color: '#D4AF37', letterSpacing: '0.05em' }}>ROYAUME DU MAROC</p>
              <p style={{ fontSize: 7.5, color: '#A0B3C6', fontWeight: 600, lineHeight: 1.1 }}>Ministère de l'Équipement et de l'Eau</p>
              <p style={{ fontSize: 7.5, color: '#A0B3C6', fontWeight: 600, lineHeight: 1.1 }}>Direction Générale de l'Hydraulique</p>
              <p style={{ fontSize: 7.5, color: '#E8F4FD', fontWeight: 700, lineHeight: 1.1 }}>ABH Loukkos · Tanger-Tétouan-Al Hoceïma</p>
            </div>

            {/* Center: Kingdom Seal / Emblem */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2.5" fill="rgba(6,14,26,0.8)" />
                <path d="M50 15 L61 48 L93 48 L67 67 L77 100 L50 80 L23 100 L33 67 L7 48 L39 48 Z" 
                  stroke="#22C55E" strokeWidth="3" fill="#D4AF37" strokeLinejoin="round" />
                <path d="M40 18 L45 8 L50 12 L55 8 L60 18 Z" fill="#D4AF37" />
              </svg>
              <span style={{ fontSize: 6.5, fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fiche Incident</span>
            </div>

            {/* Right: Ministry & Agency Details in Arabic */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, maxWidth: '40%', textAlign: 'right' }}>
              <p style={{ fontSize: 9.5, fontWeight: 900, color: '#D4AF37', fontFamily: 'serif' }}>المملكة المغربية</p>
              <p style={{ fontSize: 7.5, color: '#A0B3C6', fontWeight: 600, lineHeight: 1.1 }}>وزارة التجهيز والماء</p>
              <p style={{ fontSize: 7.5, color: '#A0B3C6', fontWeight: 600, lineHeight: 1.1 }}>المديرية العامة للهندسة المائية</p>
              <p style={{ fontSize: 7.5, color: '#E8F4FD', fontWeight: 700, lineHeight: 1.1 }}>وكالة الحوض المائي لللوكوس</p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(26,47,74,0.5)', marginTop: 8, paddingTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: '#00F0FF', letterSpacing: '0.05em' }}>
              RAPPORT DE VIGILANCE CRUE ÉCLAIR
            </p>
            <p style={{ fontSize: 8, color: '#8BA3BE' }}>
              Réf: {refId.current} · Édité le: {today}
            </p>
          </div>
        </div>

        <div style={{ padding: '14px 20px', overflowY: 'auto', maxHeight: 'calc(88vh - 80px)' }}>
          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
            <InfoBlock label="Scénario" value={`${scenario.icon} ${scenario.name}`} />
            <InfoBlock label="Niveau maximum" value={meta.label} valueColor={color} />
            <InfoBlock label="Commandement" value={scenario.command} />
            <InfoBlock label="Actifs affectés" value={`${affected.length}/13 actifs`} />
            <InfoBlock label="Zones critiques" value={`${redCount} zone(s)`} valueColor={redCount > 0 ? '#EF4444' : '#22C55E'} />
            <InfoBlock label="Zone concernée" value={scenario.zones.slice(0,3).map(z => z.charAt(0).toUpperCase() + z.slice(1)).join(', ')} />
          </div>

          {/* KPIs */}
          <div style={{ borderRadius: 8, padding: 10, marginBottom: 12, background: 'rgba(6,14,26,0.8)', border: '1px solid #1A2F4A' }}>
            <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8BA3BE', marginBottom: 8 }}>Indicateurs clés</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              <KpiReport icon={Users}         label="Population exposée"  value={formatNum(consequences.population)} color={color} />
              <KpiReport icon={Route}         label="Routes bloquées"     value={consequences.roads}                 color="#F59E0B" />
              <KpiReport icon={Siren}         label="Équipes déployées"   value={consequences.teams}                 color="#4A9FE0" />
              <KpiReport icon={MessageSquare} label="Alertes SMS"         value={formatNum(consequences.sms)}        color="#2E75B6" />
            </div>
          </div>

          {/* Decision Summary */}
          <div style={{ borderRadius: 8, padding: 10, marginBottom: 12, background: 'rgba(6,14,26,0.6)', border: '1px solid #1A2F4A' }}>
            <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8BA3BE', marginBottom: 6 }}>Résumé décisionnel</p>
            <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {phase.actions.slice(0, 6).map((action, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 10, color: '#E2E8F0' }}>
                  <span style={{ color, fontWeight: 'bold' }}>▸</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Affected Assets Table */}
          {affected.length > 0 && (
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #1A2F4A', marginBottom: 12 }}>
              <div style={{ padding: '8px 12px', background: 'rgba(6,14,26,0.9)', borderBottom: '1px solid #1A2F4A' }}>
                <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#8BA3BE' }}>Actifs hydrauliques impactés</p>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: 'rgba(6,14,26,0.7)' }}>
                    {['Actif','Province','Eau %','Pluie','Risque','Statut'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8BA3BE', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {affected.map((a, i) => {
                    const lv = LEVELS[a.status]; const c = levelColor(a.status);
                    return (
                      <tr key={a.id} style={{ borderTop: '1px solid #1A2F4A', background: i%2===0 ? 'rgba(6,14,26,0.5)' : 'transparent' }}>
                        <td style={{ padding: '5px 8px', fontWeight: 700, color: '#E8F4FD', fontSize: 10.5 }}>{a.shortName}</td>
                        <td style={{ padding: '5px 8px', color: '#8BA3BE', fontSize: 10 }}>{a.province}</td>
                        <td style={{ padding: '5px 8px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: c, fontSize: 10 }}>{a.water}%</td>
                        <td style={{ padding: '5px 8px', fontFamily: 'JetBrains Mono,monospace', color: '#4A9FE0', fontSize: 10 }}>{a.rain}</td>
                        <td style={{ padding: '5px 8px', fontFamily: 'JetBrains Mono,monospace', color: a.riskScore>70?'#EF4444':a.riskScore>40?'#F59E0B':'#22C55E', fontSize: 10 }}>{a.riskScore}/100</td>
                        <td style={{ padding: '5px 8px' }}>
                          <span style={{ borderRadius: 4, padding: '1px 5px', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: c, background: levelSoft(a.status), border: `1px solid ${c}30` }}>{lv.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Cybersecurity Audit Trail */}
          <div style={{ borderRadius: 8, padding: 10, marginBottom: 12, background: 'rgba(6,14,26,0.6)', border: '1px solid #1A2F4A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <ShieldCheck size={11} color="#22C55E" />
              <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#8BA3BE' }}>Audit de sécurité</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {[
                { icon: Lock, label: 'TLS 1.3', value: 'ACTIF', color: '#22C55E' },
                { icon: Radio, label: 'LoRa Fallback', value: 'STANDBY', color: 'var(--wg-muted)' },
                { icon: ShieldCheck, label: 'Journal audit', value: 'IMMUTABLE', color: '#22C55E' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.01)' }}>
                  <row.icon size={9} color={row.color} />
                  <span style={{ fontSize: 9, color: '#E2E8F0' }}>{row.label}:</span>
                  <span className="mono-precision" style={{ fontSize: 8, fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Log excerpt */}
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #1A2F4A', marginBottom: 12 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(6,14,26,0.9)', borderBottom: '1px solid #1A2F4A' }}>
              <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#8BA3BE' }}>Journal opérationnel — 10 derniers événements</p>
            </div>
            <div style={{ padding: 8, background: '#060E1A', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {logs.slice(0, 10).map((log, i) => (
                <div key={i} style={{ color: LEVELS[log.level]?.color ?? '#8BA3BE' }}>
                  <span style={{ color: '#8BA3BE' }}>[{log.at}]</span> {log.text}
                </div>
              ))}
            </div>
          </div>

          {/* Signature block */}
          <div style={{ borderRadius: 8, padding: 12, border: '1px solid #1A2F4A', background: 'rgba(6,14,26,0.4)', marginBottom: 12 }}>
            <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#8BA3BE', marginBottom: 8 }}>Validation et signature</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { title: 'Directeur ABH Loukkos', name: '________________________' },
                { title: 'Chef Protection Civile', name: '________________________' },
                { title: 'Wali Région TTH', name: '________________________' },
              ].map(sig => (
                <div key={sig.title} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 9, fontWeight: 600, color: '#E2E8F0', marginBottom: 16 }}>{sig.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--wg-muted)', borderTop: '1px solid #1A2F4A', paddingTop: 4 }}>Signature</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Fermer</button>
            <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
              <Printer size={12} /> Imprimer / Export PDF
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 9, color: '#8BA3BE', marginTop: 8, fontStyle: 'italic' }}>
            Document officiel — DGH · ABH Loukkos · Protection Civile · {today}
          </p>
          <p style={{ textAlign: 'center', fontSize: 8, color: 'var(--wg-muted)', marginTop: 2 }}>
            Toutes les intégrations externes sont simulées · Export PDF via impression navigateur
          </p>
        </div>
      </div>
    </div>
  );
}
