import React from 'react';
import { Trophy, Users, Route, Siren, ShieldCheck, Radio, FileText, Clock, XCircle, RotateCcw, Zap, CheckCircle2, TrendingUp, AlertTriangle, Shield } from 'lucide-react';

const METRICS = [
  { key: 'responseTime',         icon: Clock,      label: 'Temps de réponse',        color: 'var(--wg-cyan)',  highlight: true },
  { key: 'populationWarned',     icon: Users,      label: 'Population alertée',      color: 'var(--wg-green)',  highlight: true },
  { key: 'routesClosed',         icon: Route,      label: 'Routes fermées',          color: 'var(--wg-orange)' },
  { key: 'teamsDeployed',        icon: Siren,      label: 'Équipes déployées',       color: 'var(--wg-blue)' },
  { key: 'sheltersOpened',       icon: ShieldCheck, label: 'Refuges activés',        color: 'var(--wg-green)' },
  { key: 'falsePositivesAvoided', icon: XCircle,    label: 'Fausses alarmes évitées', color: 'var(--wg-green)' },
  { key: 'offlineResilience',    icon: Radio,      label: 'Résilience LoRa',         color: 'var(--wg-orange)' },
  { key: 'capReportsGenerated',  icon: FileText,   label: 'Rapports CAP',            color: 'var(--wg-cyan)' },
];

const CHAIN = ['Détection', 'Validation', 'Prédiction', 'Alerte', 'Réponse', 'Rapport'];
const CHAIN_ICONS = [Radio, CheckCircle2, TrendingUp, AlertTriangle, Shield, FileText];

function JurySummaryPanel({ jurySummary, onRestart, onClose }) {
  if (!jurySummary) return null;

  return (
    <div className="modal-backdrop" style={{ zIndex: 9500 }}>
      <div className="animate-fade-in" style={{
        maxWidth: 640, width: '100%', borderRadius: 12,
        background: 'linear-gradient(180deg, var(--wg-surface) 0%, var(--wg-bg-deep) 100%)',
        border: '1px solid var(--wg-border)',
        boxShadow: '0 20px 80px var(--wg-shadow)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 18px', textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(0,240,255,0.06), transparent)',
          borderBottom: '1px solid var(--wg-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <Trophy size={26} color="var(--wg-orange)" />
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--wg-text)', letterSpacing: '-0.02em', margin: 0 }}>
              Mission Accomplie
            </h2>
          </div>

          {/* Complete chain visualization */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, margin: '14px 0 10px', flexWrap: 'wrap' }}>
            {CHAIN.map((stage, i) => {
              const IconComponent = CHAIN_ICONS[i];
              return (
                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    padding: '3px 8px', borderRadius: 4,
                    background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.25)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <IconComponent size={10} color="var(--wg-cyan)" />
                    <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--wg-cyan)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stage}</span>
                  </div>
                  {i < CHAIN.length - 1 && <span style={{ fontSize: 10, color: 'var(--wg-cyan)' }}>→</span>}
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: 12, color: 'var(--wg-cyan)', fontWeight: 800, marginTop: 6, letterSpacing: '0.04em' }}>
            WadiGuard v4 — Système Autonome d'Alerte aux Crues
          </p>
          <p style={{ fontSize: 10, color: 'var(--wg-muted)', marginTop: 2 }}>
            ABH Loukkos · DGH · Protection Civile · Tanger-Tétouan-Al Hoceïma
          </p>
        </div>

        {/* Metrics grid */}
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {METRICS.map(m => {
            const Icon = m.icon;
            const val = jurySummary[m.key];
            if (val === undefined) return null;
            return (
              <div key={m.key} style={{
                padding: '12px 8px', borderRadius: 6, textAlign: 'center',
                background: m.highlight ? `color-mix(in srgb, ${m.color} 8%, transparent)` : 'var(--wg-bg-deep)',
                border: `1px solid ${m.highlight ? `color-mix(in srgb, ${m.color} 30%, transparent)` : 'var(--wg-border)'}`,
                transition: 'all 0.3s ease',
              }}>
                <Icon size={14} color={m.color} style={{ marginBottom: 4 }} />
                <p className="mono-precision" style={{
                  fontSize: 20, fontWeight: 900, color: m.color, lineHeight: 1.2,
                  textShadow: m.highlight ? `0 0 8px color-mix(in srgb, ${m.color} 30%, transparent)` : 'none',
                  margin: 0
                }}>
                  {val}
                </p>
                <p style={{ fontSize: 8.5, color: 'var(--wg-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, margin: '4px 0 0' }}>
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Key differentiator callout */}
        <div style={{ margin: '0 20px 16px', padding: '10px 14px', borderRadius: 6, background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--wg-green)', letterSpacing: '0.03em', margin: 0 }}>
            <Zap size={11} style={{ verticalAlign: '-1px', marginRight: 4, display: 'inline-block' }} />
            Alerte validée multi-capteurs · Routes fermées automatiquement · Rapport CAP généré
          </p>
          <p style={{ fontSize: 10, color: 'var(--wg-muted)', marginTop: 4, margin: '4px 0 0' }}>
            WadiGuard ne se limite pas à détecter. Il sécurise le terrain avant que les personnes n'atteignent la zone de danger.
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', display: 'flex', gap: 8, borderTop: '1px solid var(--wg-border)', background: 'var(--wg-bg-deep)' }}>
          <button onClick={onRestart} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: 6, height: 32 }}>
            <RotateCcw size={13} /> Relancer la démo
          </button>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', height: 32 }}>
            Retour au dashboard
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 8.5, color: 'var(--wg-muted)', paddingBottom: 12, margin: 0, background: 'var(--wg-bg-deep)' }}>
          Intégrations simulées · Protocole CAP Standardisé (XML)
        </p>
      </div>
    </div>
  );
}

export default React.memo(JurySummaryPanel);
