import React, { useMemo } from 'react';
import { SCENARIOS, DECISION_STAGES } from '../data/scenarios';
import { levelColor } from '../utils';
import { Play, Pause, RotateCcw, SkipForward, Target, Zap } from 'lucide-react';

const STAGE_LABELS = ['Détection', 'Validation', 'Prédiction', 'Alerte', 'Réponse', 'Rapport'];
const STAGE_ICONS  = ['📡', '✅', '🎯', '🚨', '🚧', '📋'];

function DemoMissionControl({
  demoMode, simTime, running, speed, setSpeed,
  startJuryDemo, togglePause, resetScenario, advanceDemoStep,
  decisionStage, storyStep, phase,
}) {
  const demoScenario = SCENARIOS['juryDemo'];
  const maxTime = demoScenario?.maxTime || 92;
  const progress = Math.min((simTime / maxTime) * 100, 100);
  const color = levelColor(phase.level);
  const stageIdx = DECISION_STAGES.indexOf(decisionStage);

  // Find current event index
  const currentEventIdx = useMemo(() => {
    if (!demoScenario) return 0;
    let idx = 0;
    for (let i = 0; i < demoScenario.events.length; i++) {
      if (simTime >= demoScenario.events[i].t) idx = i;
    }
    return idx;
  }, [simTime, demoScenario]);

  // If not in jury mode, show the launch button
  if (demoMode !== 'jury') {
    return (
      <button
        onClick={startJuryDemo}
        className="jury-launch-btn"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          width: '100%', padding: '12px 16px', borderRadius: 8,
          background: 'linear-gradient(135deg, rgba(0,240,255,0.08) 0%, rgba(14,116,144,0.15) 100%)',
          border: '1px solid rgba(0,240,255,0.3)',
          color: '#00F0FF', fontSize: 13, fontWeight: 800,
          cursor: 'pointer', transition: 'all 0.2s ease',
          letterSpacing: '0.03em', fontFamily: 'Outfit, sans-serif',
          position: 'relative', overflow: 'hidden',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(14,116,144,0.25))';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(0,240,255,0.15)';
          e.currentTarget.style.borderColor = 'rgba(0,240,255,0.5)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(14,116,144,0.15))';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)';
        }}
      >
        <Target size={16} />
        ▶ Lancer Démo Jury — Crue Éclair 90s
      </button>
    );
  }

  // Jury demo is active — show mission controls
  return (
    <div className="glass" style={{
      borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0,
      borderLeft: `3px solid ${color}`,
      background: 'linear-gradient(135deg, var(--wg-surface) 0%, rgba(6,14,26,0.95) 100%)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={12} color={color} />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Mission en cours
          </span>
          {running && (
            <span style={{
              fontSize: 8, padding: '1px 5px', borderRadius: 3,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', fontWeight: 700, animation: 'blink 1.2s infinite',
            }}>● LIVE</span>
          )}
        </div>
        {/* Mission timer */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontSize: 8, color: 'var(--wg-muted)', textTransform: 'uppercase' }}>T+</span>
          <span className="mono-precision" style={{ fontSize: 18, fontWeight: 900, color: '#E2E8F0', minWidth: 30 }}>
            {String(Math.round(simTime)).padStart(2, '0')}
          </span>
          <span style={{ fontSize: 9, color: 'var(--wg-muted)' }}>/{maxTime}s</span>
        </div>
      </div>

      {/* Decision chain pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
        {STAGE_LABELS.map((label, i) => {
          const done = i <= stageIdx;
          const active = i === stageIdx;
          const stageColor = active ? color : done ? '#00F0FF' : '#2A3544';
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 3,
                padding: '2px 6px', borderRadius: 4,
                background: active ? `${color}15` : done ? 'rgba(0,240,255,0.04)' : 'transparent',
                border: `1px solid ${active ? `${color}50` : done ? 'rgba(0,240,255,0.15)' : '#1E2530'}`,
                transition: 'all 0.4s ease',
              }}>
                <span style={{ fontSize: 9, lineHeight: 1 }}>{STAGE_ICONS[i]}</span>
                <span style={{
                  fontSize: 8, fontWeight: 800, color: stageColor,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>{label}</span>
              </div>
              {i < STAGE_LABELS.length - 1 && (
                <span style={{
                  fontSize: 8, color: done ? '#00F0FF' : '#1E2530',
                  transition: 'color 0.3s ease',
                }}>→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Story step label */}
      {storyStep && (
        <div style={{
          fontSize: 10, fontWeight: 700, color: '#E2E8F0',
          padding: '3px 8px', borderRadius: 4,
          background: `${color}08`, border: `1px solid ${color}15`,
          textAlign: 'center',
        }}>
          {storyStep}
        </div>
      )}

      {/* Progress bar */}
      <div style={{ height: 3, borderRadius: 2, background: '#1E2530', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${progress}%`,
          background: `linear-gradient(90deg, #00F0FF, ${color})`,
          transition: 'width 0.3s ease',
          boxShadow: `0 0 8px ${color}60`,
        }} />
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <button onClick={togglePause} title={running ? 'Pause' : 'Reprendre'} style={{
            width: 26, height: 22, borderRadius: 4, border: `1px solid ${running ? 'var(--wg-red)' : 'var(--wg-green)'}`,
            background: running ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
            color: running ? 'var(--wg-red)' : 'var(--wg-green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            {running ? <Pause size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" />}
          </button>
          <button onClick={advanceDemoStep} title="Étape suivante" style={{
            width: 26, height: 22, borderRadius: 4, border: '1px solid var(--wg-border)',
            background: 'rgba(255,255,255,0.02)', color: 'var(--wg-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <SkipForward size={11} />
          </button>
          <button onClick={resetScenario} title="Réinitialiser" style={{
            width: 26, height: 22, borderRadius: 4, border: '1px solid var(--wg-border)',
            background: 'rgba(255,255,255,0.02)', color: 'var(--wg-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <RotateCcw size={11} />
          </button>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {demoScenario.events.map((ev, i) => (
            <div key={i} style={{
              width: i === currentEventIdx ? 10 : 4,
              height: 4,
              borderRadius: 3,
              background: i <= currentEventIdx ? color : '#1E2530',
              transition: 'all 0.3s ease',
              boxShadow: i === currentEventIdx ? `0 0 4px ${color}` : 'none',
            }} />
          ))}
        </div>

        {/* Speed */}
        <div style={{ display: 'flex', border: '1px solid var(--wg-border)', borderRadius: 4, overflow: 'hidden', height: 20, background: 'var(--wg-bg-deep)' }}>
          {[1, 2, 4].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{
              background: speed === s ? 'var(--wg-blue)' : 'transparent',
              border: 'none', color: speed === s ? '#fff' : 'var(--wg-muted)',
              fontSize: 9, fontWeight: 700, padding: '0 6px', cursor: 'pointer', height: '100%',
            }}>
              x{s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(DemoMissionControl);
