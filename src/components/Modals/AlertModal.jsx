import { LEVELS } from '../../data/assets';
import { levelColor, levelSoft } from '../../utils';
import { AlertTriangle, Users, Route, Radio } from 'lucide-react';
import { formatNum } from '../../utils';

export default function AlertModal({ level, scenario, consequences, onAcknowledge }) {
  const meta  = LEVELS[level];
  const color = levelColor(level);
  const soft  = levelSoft(level);

  const actions = level === 'black' ? [
    '⚫ Activer commandement régional interministériel',
    '🚁 Déployer hélicoptères secours FAR',
    '📡 Diffusion nationale — Radio Maroc + 2M',
    '🏛️ Notifier Ministère Intérieur + Protection Civile',
    '🆘 Évacuation obligatoire zones identifiées',
  ] : level === 'red' ? [
    '🔴 Activer sirènes — zones urbaines concernées',
    '📱 Cell Broadcast — populations exposées',
    '🚧 Fermer routes identifiées',
    '🚑 Mobiliser équipes secours régionales',
    '📋 Générer rapport d\'incident officiel',
  ] : [
    '🟠 Pré-positionner équipes d\'intervention',
    '📱 Pré-alerter communes concernées',
    '🔍 Surveillance renforcée des capteurs',
  ];

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999 }}>
      <div className="modal-content modal-alert-content" style={{ borderColor: color, borderWidth: 2 }}>
        {/* Header */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px 14px 0 0', padding: '20px 24px', background: soft, borderBottom: `1px solid ${color}30` }}>
          <div className="scan-line" style={{ background: `linear-gradient(transparent, ${color}15, transparent)` }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <div style={{ position: 'relative', width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: 14, background: `${color}22`, border: `2px solid ${color}60`, flexShrink: 0 }}>
              <AlertTriangle size={26} color={color} />
              <span className="ring-expand" style={{ borderColor: color, color }} />
            </div>
            <div>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#8BA3BE' }}>Alerte automatique WadiGuard v4</p>
              <h2 style={{ fontSize: 22, fontWeight: 900, color, marginTop: 2 }}>NIVEAU {meta.label} DÉCLENCHÉ</h2>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#E8F4FD', marginTop: 3 }}>{meta.description}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Scenario info */}
          <div style={{ borderRadius: 12, padding: 16, marginBottom: 14, background: 'rgba(6,14,26,0.85)', border: '1px solid #1A2F4A' }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8BA3BE', marginBottom: 8 }}>Scénario en cours</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#E8F4FD' }}>{scenario.icon} {scenario.name}</p>
            <p style={{ fontSize: 12, color: '#8BA3BE', marginTop: 4 }}>{scenario.subtitle}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {[
                { icon: Users,  label: 'Population exposée', value: formatNum(consequences.population), color },
                { icon: Route,  label: 'Routes bloquées',    value: `${consequences.roads}`,            color: '#F59E0B' },
                { icon: Radio,  label: 'Équipes déployées',  value: `${consequences.teams}`,            color: '#4A9FE0' },
              ].map(({ icon: Icon, label, value, color: c }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, borderRadius: 8, padding: '6px 12px', background: 'var(--wg-subtle)', border: '1px solid var(--wg-border)' }}>
                  <Icon size={12} color={c} />
                  <span style={{ fontSize: 10, color: '#8BA3BE' }}>{label} :</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ borderRadius: 12, padding: 16, marginBottom: 16, background: soft, border: `1px solid ${color}30` }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8BA3BE', marginBottom: 10 }}>Actions requises immédiatement</p>
            {actions.map((a, i) => (
              <p key={i} style={{ fontSize: 13, color: 'var(--wg-text)', padding: '4px 0', borderBottom: i < actions.length - 1 ? '1px solid var(--wg-border)' : 'none' }}>{a}</p>
            ))}
          </div>

          {/* Acknowledge button */}
          <button onClick={onAcknowledge}
            style={{ width: '100%', padding: '13px 24px', borderRadius: 10, fontSize: 14, fontWeight: 800, color: '#fff', background: color, border: 'none', cursor: 'pointer', boxShadow: `0 0 30px ${color}50`, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            ✓ Accusé de réception — Commandant de service
          </button>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#8BA3BE', marginTop: 8 }}>
            Cet accusé sera horodaté et archivé dans le journal opérationnel
          </p>
        </div>
      </div>
    </div>
  );
}
