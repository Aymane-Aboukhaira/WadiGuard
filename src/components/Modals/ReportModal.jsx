import { useRef } from 'react';
import { LEVELS } from '../../data/assets';
import { levelColor, levelSoft, dateStamp, generateRef, formatNum } from '../../utils';
import { X, Printer, CheckCircle2, Users, Route, Siren, MessageSquare, ShieldCheck, Lock, Radio, FileText } from 'lucide-react';

function InfoBlock({ label, value, valueColor }) {
  return (
    <div style={{ borderRadius: 6, padding: '7px 10px', background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)' }}>
      <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--wg-muted)', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 12, fontWeight: 700, color: valueColor ?? 'var(--wg-text)', marginTop: 2, margin: '2px 0 0' }}>{value}</p>
    </div>
  );
}

function KpiReport({ icon: Icon, label, value, color }) {
  return (
    <div style={{ borderRadius: 8, padding: 10, background: 'var(--wg-bg-deep)', border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`, textAlign: 'center' }}>
      <Icon size={13} color={color} style={{ marginBottom: 3 }} />
      <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--wg-muted)', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 900, color, marginTop: 2, fontFamily: 'JetBrains Mono, monospace', margin: '2px 0 0' }}>{value}</p>
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
          background: 'linear-gradient(135deg, var(--wg-surface) 0%, var(--wg-bg-deep) 100%)',
          borderBottom: '3px solid #D4AF37'
        }}>
          {/* Header Controls (Close button on top right) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: '2px 6px', height: 'auto', minHeight: 'unset', color: 'var(--wg-muted)', border: 'none', background: 'transparent' }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15 }}>
            {/* Left: Ministry & Agency Details in French */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '40%' }}>
              <p style={{ fontSize: 8.5, fontWeight: 900, color: '#D4AF37', letterSpacing: '0.05em', margin: 0 }}>ROYAUME DU MAROC</p>
              <p style={{ fontSize: 7.5, color: 'var(--wg-muted)', fontWeight: 600, lineHeight: 1.1, margin: 0 }}>Ministère de l'Équipement et de l'Eau</p>
              <p style={{ fontSize: 7.5, color: 'var(--wg-muted)', fontWeight: 600, lineHeight: 1.1, margin: 0 }}>Direction Générale de l'Hydraulique</p>
              <p style={{ fontSize: 7.5, color: 'var(--wg-text)', fontWeight: 700, lineHeight: 1.1, margin: 0 }}>ABH Loukkos · Tanger-Tétouan-Al Hoceïma</p>
            </div>

            {/* Center: Kingdom Seal / Emblem */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2.5" fill="var(--wg-bg-deep)" />
                <path d="M50 15 L61 48 L93 48 L67 67 L77 100 L50 80 L23 100 L33 67 L7 48 L39 48 Z" 
                  stroke="var(--wg-green)" strokeWidth="3" fill="#D4AF37" strokeLinejoin="round" />
                <path d="M40 18 L45 8 L50 12 L55 8 L60 18 Z" fill="#D4AF37" />
              </svg>
              <span style={{ fontSize: 6.5, fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fiche Incident</span>
            </div>

            {/* Right: Ministry & Agency Details in Arabic */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, maxWidth: '40%', textAlign: 'right' }}>
              <p style={{ fontSize: 9.5, fontWeight: 900, color: '#D4AF37', fontFamily: 'serif', margin: 0 }}>المملكة المغربية</p>
              <p style={{ fontSize: 7.5, color: 'var(--wg-muted)', fontWeight: 600, lineHeight: 1.1, margin: 0 }}>وزارة التجهيز والماء</p>
              <p style={{ fontSize: 7.5, color: 'var(--wg-muted)', fontWeight: 600, lineHeight: 1.1, margin: 0 }}>المديرية العامة للهندسة المائية</p>
              <p style={{ fontSize: 7.5, color: 'var(--wg-text)', fontWeight: 700, lineHeight: 1.1, margin: 0 }}>وكالة الحوض المائي لللوكوس</p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--wg-border)', marginTop: 8, paddingTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--wg-cyan)', letterSpacing: '0.05em', margin: 0 }}>
              RAPPORT DE VIGILANCE CRUE ÉCLAIR
            </p>
            <p style={{ fontSize: 8, color: 'var(--wg-muted)', margin: 0 }}>
              Réf: {refId.current} · Édité le: {today}
            </p>
          </div>
        </div>

        <div style={{ padding: '14px 20px', overflowY: 'auto', maxHeight: 'calc(88vh - 80px)' }}>
          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
            <InfoBlock label="Scénario" value={scenario.name} />
            <InfoBlock label="Niveau maximum" value={meta.label} valueColor={color} />
            <InfoBlock label="Commandement" value={scenario.command} />
            <InfoBlock label="Actifs affectés" value={`${affected.length}/13 actifs`} />
            <InfoBlock label="Zones critiques" value={`${redCount} zone(s)`} valueColor={redCount > 0 ? 'var(--wg-red)' : 'var(--wg-green)'} />
            <InfoBlock label="Zone concernée" value={scenario.zones.slice(0,3).map(z => z.charAt(0).toUpperCase() + z.slice(1)).join(', ')} />
          </div>

          {/* KPIs */}
          <div style={{ borderRadius: 8, padding: 12, marginBottom: 12, background: 'var(--wg-surface)', border: '1px solid var(--wg-border)' }}>
            <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--wg-muted)', marginBottom: 8, margin: '0 0 8px' }}>Indicateurs clés</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              <KpiReport icon={Users}         label="Population exposée"  value={formatNum(consequences.population)} color={color} />
              <KpiReport icon={Route}         label="Routes bloquées"     value={consequences.roads}                 color="var(--wg-orange)" />
              <KpiReport icon={Siren}         label="Équipes déployées"   value={consequences.teams}                 color="var(--wg-blue)" />
              <KpiReport icon={MessageSquare} label="Alertes SMS"         value={formatNum(consequences.sms)}        color="#2E75B6" />
            </div>
          </div>

          {/* Decision Summary */}
          <div style={{ borderRadius: 8, padding: 12, marginBottom: 12, background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)' }}>
            <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--wg-muted)', marginBottom: 6, margin: '0 0 6px' }}>Résumé décisionnel</p>
            <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: 4, padding: 0, margin: 0 }}>
              {phase.actions.slice(0, 6).map((action, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 11, color: 'var(--wg-text)' }}>
                  <span style={{ color, fontWeight: 'bold' }}>▸</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Affected Assets Table */}
          {affected.length > 0 && (
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--wg-border)', marginBottom: 12 }}>
              <div style={{ padding: '8px 12px', background: 'var(--wg-bg-deep)', borderBottom: '1px solid var(--wg-border)' }}>
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--wg-muted)', margin: 0 }}>Actifs hydrauliques impactés</p>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                <thead>
                  <tr style={{ background: 'var(--wg-bg-deep)' }}>
                    {['Actif','Province','Eau %','Pluie','Risque','Statut'].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--wg-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {affected.map((a, i) => {
                    const lv = LEVELS[a.status]; const c = levelColor(a.status);
                    return (
                      <tr key={a.id} style={{ borderTop: '1px solid var(--wg-border)', background: i%2===0 ? 'var(--wg-bg-deep)' : 'transparent' }}>
                        <td style={{ padding: '6px 8px', fontWeight: 700, color: 'var(--wg-text)', fontSize: 11 }}>{a.shortName}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--wg-muted)', fontSize: 10.5 }}>{a.province}</td>
                        <td style={{ padding: '6px 8px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: c, fontSize: 11 }}>{a.water}%</td>
                        <td style={{ padding: '6px 8px', fontFamily: 'JetBrains Mono,monospace', color: '#4A9FE0', fontSize: 11 }}>{a.rain}</td>
                        <td style={{ padding: '6px 8px', fontFamily: 'JetBrains Mono,monospace', color: a.riskScore>70?'var(--wg-red)':a.riskScore>40?'var(--wg-orange)':'var(--wg-green)', fontSize: 11 }}>{a.riskScore}/100</td>
                        <td style={{ padding: '6px 8px' }}>
                          <span style={{ borderRadius: 4, padding: '1.5px 6px', fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', color: c, background: levelSoft(a.status), border: `1px solid ${c}30` }}>{lv.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Cybersecurity Audit Trail */}
          <div style={{ borderRadius: 8, padding: 12, marginBottom: 12, background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <ShieldCheck size={12} color="var(--wg-green)" />
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--wg-muted)', margin: 0 }}>Audit de sécurité</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {[
                { icon: Lock, label: 'TLS 1.3', value: 'ACTIF', color: 'var(--wg-green)' },
                { icon: Radio, label: 'LoRa Fallback', value: 'STANDBY', color: 'var(--wg-muted)' },
                { icon: ShieldCheck, label: 'Journal audit', value: 'IMMUTABLE', color: 'var(--wg-green)' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', borderRadius: 4, background: 'var(--wg-surface)' }}>
                  <row.icon size={10} color={row.color} />
                  <span style={{ fontSize: 9.5, color: 'var(--wg-text)' }}>{row.label}:</span>
                  <span className="mono-precision" style={{ fontSize: 8.5, fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Log excerpt */}
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--wg-border)', marginBottom: 12 }}>
            <div style={{ padding: '8px 12px', background: 'var(--wg-bg-deep)', borderBottom: '1px solid var(--wg-border)' }}>
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--wg-muted)', margin: 0 }}>Journal opérationnel — 10 derniers événements</p>
            </div>
            <div style={{ padding: 10, background: 'var(--wg-bg-deep)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {logs.slice(0, 10).map((log, i) => (
                <div key={i} style={{ color: LEVELS[log.level]?.color ?? 'var(--wg-muted)' }}>
                  <span style={{ color: 'var(--wg-muted)' }}>[{log.at}]</span> {log.text}
                </div>
              ))}
            </div>
          </div>

          {/* Signature block */}
          <div style={{ borderRadius: 8, padding: 12, border: '1px solid var(--wg-border)', background: 'var(--wg-surface)', marginBottom: 12 }}>
            <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--wg-muted)', marginBottom: 8, margin: '0 0 8px' }}>Validation et signature</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { title: 'Directeur ABH Loukkos', name: '________________________' },
                { title: 'Chef Protection Civile', name: '________________________' },
                { title: 'Wali Région TTH', name: '________________________' },
              ].map(sig => (
                <div key={sig.title} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--wg-text)', marginBottom: 16 }}>{sig.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--wg-muted)', borderTop: '1px solid var(--wg-border)', paddingTop: 4, margin: '16px 0 0' }}>Signature</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', height: 32 }}>Fermer</button>
            <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: 6, height: 32 }}>
              <Printer size={13} /> Imprimer / Export PDF
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 9.5, color: 'var(--wg-muted)', marginTop: 10, fontStyle: 'italic', margin: '10px 0 0' }}>
            Document officiel — DGH · ABH Loukkos · Protection Civile · {today}
          </p>
          <p style={{ textAlign: 'center', fontSize: 8.5, color: 'var(--wg-muted)', marginTop: 2, margin: '2px 0 0' }}>
            Toutes les intégrations externes sont simulées · Export PDF via impression navigateur
          </p>
        </div>
      </div>
    </div>
  );
}
