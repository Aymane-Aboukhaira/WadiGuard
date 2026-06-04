import { LEVELS } from '../data/assets';
import { levelColor, levelSoft } from '../utils';
import { ShieldCheck, Wifi, Bell, Radio, Sun, Moon, Target } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'map',       label: 'Carte Tactique' },
  { id: 'analyse',   label: 'Analyse & Risques' },
  { id: 'rapports',  label: 'Rapports' },
];

/* Mission chain micro-pipeline shown in jury mode */
const CHAIN = ['DET', 'VAL', 'PRE', 'ALT', 'RSP', 'RPT'];
const CHAIN_FULL = ['Détection', 'Validation', 'Prédiction', 'Alerte', 'Réponse', 'Rapport'];
const CHAIN_MAP = { detection: 0, validation: 1, prediction: 2, alert: 3, response: 4, report: 5 };

export default function TopBar({ clock, level, tab, setTab, alertCount, onlineCount, totalCount, demoMode, simTime, decisionStage, theme, setTheme }) {
  const meta    = LEVELS[level];
  const color   = levelColor(level);
  const isAlert = level === 'red' || level === 'black';
  const stageIdx = CHAIN_MAP[decisionStage] ?? 0;

  const pad  = n => String(n).padStart(2, '0');
  const hms  = `${pad(clock.getHours())}:${pad(clock.getMinutes())}:${pad(clock.getSeconds())}`;
  const date = `${pad(clock.getDate())}/${pad(clock.getMonth()+1)}/${clock.getFullYear()}`;

  return (
    <header className="topbar">
      <div className="scan-line" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 16px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            position: 'relative', width: 34, height: 34, display: 'grid', placeItems: 'center',
            borderRadius: 8, background: levelSoft(level), border: `1px solid ${color}40`,
          }}>
            <ShieldCheck size={16} color={color} />
            {isAlert && <span className="ring-expand" style={{ borderColor: color, color }} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--wg-text)', letterSpacing: '-0.3px' }}>WadiGuard</span>
              <span style={{
                borderRadius: 4, border: '1px solid rgba(74,159,224,0.3)',
                background: 'rgba(74,159,224,0.08)', color: '#4A9FE0',
                padding: '0px 5px', fontSize: 9, fontWeight: 700,
              }}>v4</span>
            </div>
            <p style={{ fontSize: 10, color: 'var(--wg-muted)', lineHeight: 1.2, marginTop: 1 }}>
              Tanger · Tétouan · Al Hoceïma
            </p>
          </div>
        </div>

        {/* Mode badge + Mini chain (jury mode) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            borderRadius: 4, padding: '2px 7px', fontSize: 8.5, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: demoMode === 'jury' ? 'rgba(0,240,255,0.08)' : demoMode === 'live' ? 'rgba(245,158,11,0.06)' : 'rgba(34,197,94,0.05)',
            border: `1px solid ${demoMode === 'jury' ? 'rgba(0,240,255,0.3)' : demoMode === 'live' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.15)'}`,
            color: demoMode === 'jury' ? 'var(--wg-cyan)' : demoMode === 'live' ? 'var(--wg-orange)' : 'var(--wg-green)',
          }}>
            {demoMode === 'jury' ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Target size={10} /> DÉMO JURY
              </span>
            ) : demoMode === 'live' ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Radio size={10} /> SIMULATION
              </span>
            ) : (
              '● NOMINAL'
            )}
          </span>

          {/* Mini mission chain in jury mode */}
          {demoMode === 'jury' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {CHAIN.map((c, i) => {
                const done = i <= stageIdx;
                const active = i === stageIdx;
                return (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <div title={CHAIN_FULL[i]} style={{
                      padding: '1px 4px', borderRadius: 3,
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.05em',
                      background: active ? `${color}20` : done ? 'rgba(0,240,255,0.06)' : 'transparent',
                      border: `1px solid ${active ? color : done ? 'rgba(0,240,255,0.2)' : 'var(--wg-border)'}`,
                      color: active ? color : done ? 'var(--wg-cyan)' : 'var(--wg-muted)',
                      transition: 'all 0.3s ease',
                    }}>{c}</div>
                    {i < CHAIN.length - 1 && (
                      <span style={{ fontSize: 7, color: done ? 'var(--wg-cyan)' : 'var(--wg-border)', margin: '0 1px' }}>›</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {/* Alert level pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            borderRadius: 8, border: `1px solid ${color}50`,
            background: levelSoft(level), padding: '5px 12px',
          }}>
            <div style={{ position: 'relative', width: 7, height: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
              {isAlert && <span className="ring-expand" style={{ borderColor: color, color }} />}
            </div>
            <div>
              <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--wg-muted)', lineHeight: 1.2 }}>Niveau</p>
              <p style={{ fontSize: 12, fontWeight: 800, color, lineHeight: 1.2 }}>{meta.label}</p>
            </div>
          </div>

          {/* Sensors + Alerts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10.5, color: 'var(--wg-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Wifi size={11} color="var(--wg-green)" /> <span style={{ fontSize: 11 }}>{onlineCount}/{totalCount}</span>
            </span>
            {alertCount > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Bell size={11} color="var(--wg-orange)" />
                <span style={{ color: 'var(--wg-orange)', fontWeight: 700 }}>{alertCount}</span>
              </span>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            style={{
              background: 'transparent',
              border: '1px solid var(--wg-border)',
              borderRadius: 6,
              width: 26,
              height: 26,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: 'var(--wg-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* Clock */}
          <div style={{ textAlign: 'right', minWidth: 60 }}>
            {demoMode === 'jury' && (
              <p className="mono-precision" style={{ fontSize: 14, fontWeight: 800, color: 'var(--wg-cyan)', lineHeight: 1.1 }}>
                T+{String(Math.round(simTime || 0)).padStart(2, '0')}s
              </p>
            )}
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: demoMode === 'jury' ? 10 : 15, fontWeight: 700, color: 'var(--wg-text)', lineHeight: 1.2 }}>{hms}</p>
            <p style={{ fontSize: 9, color: 'var(--wg-muted)' }}>{date}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
