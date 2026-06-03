import React from 'react';
import { Trophy, Users, Route, Siren, ShieldCheck, Radio, FileText, Clock, XCircle, RotateCcw, Zap } from 'lucide-react';

const METRICS = [
  { key: 'responseTime',         icon: Clock,      label: 'Temps de réponse',        color: '#00F0FF',  highlight: true },
  { key: 'populationWarned',     icon: Users,      label: 'Population alertée',      color: '#22C55E',  highlight: true },
  { key: 'routesClosed',         icon: Route,      label: 'Routes fermées',          color: '#F59E0B' },
  { key: 'teamsDeployed',        icon: Siren,      label: 'Équipes déployées',       color: '#3B82F6' },
  { key: 'sheltersOpened',       icon: ShieldCheck, label: 'Refuges activés',        color: '#10B981' },
  { key: 'falsePositivesAvoided', icon: XCircle,    label: 'Fausses alarmes évitées', color: '#8B5CF6' },
  { key: 'offlineResilience',    icon: Radio,      label: 'Résilience LoRa',         color: '#F59E0B' },
  { key: 'capReportsGenerated',  icon: FileText,   label: 'Rapports CAP',            color: '#00F0FF' },
];

const CHAIN = ['Détection', 'Validation', 'Prédiction', 'Alerte', 'Réponse', 'Rapport'];
const CHAIN_ICONS = ['📡', '✅', '🎯', '🚨', '🚧', '📋'];

function JurySummaryPanel({ jurySummary, onRestart, onClose }) {
  if (!jurySummary) return null;

  return (
    <div className="modal-backdrop" style={{ zIndex: 9500 }}>
      <div className="animate-fade-in" style={{
        maxWidth: 620, width: '100%', borderRadius: 16,
        background: 'linear-gradient(180deg, var(--wg-surface) 0%, var(--wg-bg-deep) 100%)',
        border: '1px solid rgba(0,240,255,0.15)',
        boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,240,255,0.08)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 14px', textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(0,240,255,0.06), transparent)',
          borderBottom: '1px solid rgba(0,240,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
            <Trophy size={24} color="#F59E0B" />
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#E2E8F0', letterSpacing: '-0.02em' }}>
              Mission Accomplie
            </h2>
          </div>

          {/* Complete chain visualization */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, margin: '10px 0 6px' }}>
            {CHAIN.map((stage, i) => (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{
                  padding: '2px 6px', borderRadius: 4,
                  background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.2)',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}>
                  <span style={{ fontSize: 9 }}>{CHAIN_ICONS[i]}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 800, color: '#00F0FF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stage}</span>
                </div>
                {i < CHAIN.length - 1 && <span style={{ fontSize: 8, color: '#00F0FF' }}>→</span>}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#00F0FF', fontWeight: 700, marginTop: 4 }}>
            WadiGuard v4 — Système Autonome d'Alerte aux Crues
          </p>
          <p style={{ fontSize: 9, color: 'var(--wg-muted)', marginTop: 2 }}>
            ABH Loukkos · DGH · Protection Civile · Tanger-Tétouan-Al Hoceïma
          </p>
        </div>

        {/* Metrics grid */}
        <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {METRICS.map(m => {
            const Icon = m.icon;
            const val = jurySummary[m.key];
            if (val === undefined) return null;
            return (
              <div key={m.key} style={{
                padding: '10px 6px', borderRadius: 8, textAlign: 'center',
                background: m.highlight ? `${m.color}08` : 'var(--wg-bg-deep)',
                border: `1px solid ${m.highlight ? `${m.color}20` : 'var(--wg-border)'}`,
                transition: 'all 0.3s ease',
              }}>
                <Icon size={13} color={m.color} style={{ marginBottom: 3 }} />
                <p className="mono-precision" style={{
                  fontSize: 18, fontWeight: 900, color: m.color, lineHeight: 1.2,
                  textShadow: m.highlight ? `0 0 8px ${m.color}30` : 'none',
                }}>
                  {val}
                </p>
                <p style={{ fontSize: 7, color: 'var(--wg-muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Key differentiator callout */}
        <div style={{ margin: '0 18px 12px', padding: '8px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#22C55E', letterSpacing: '0.03em' }}>
            <Zap size={10} style={{ verticalAlign: '-1px', marginRight: 4 }} />
            Alerte validée multi-capteurs · Routes fermées automatiquement · Rapport CAP généré
          </p>
          <p style={{ fontSize: 8.5, color: 'var(--wg-muted)', marginTop: 2 }}>
            WadiGuard ne se limite pas à détecter. Il protège avant que les personnes n'atteignent la zone dangereuse.
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 18px 14px', display: 'flex', gap: 8, borderTop: '1px solid var(--wg-border)' }}>
          <button onClick={onRestart} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
            <RotateCcw size={12} /> Relancer la démo
          </button>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
            Retour au dashboard
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 8, color: '#4A5568', paddingBottom: 10 }}>
          Intégrations simulées · API institutionnelles soumises à convention
        </p>
      </div>
    </div>
  );
}

export default React.memo(JurySummaryPanel);
