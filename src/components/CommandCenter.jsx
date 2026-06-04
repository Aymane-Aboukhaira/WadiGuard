import React from 'react';
import { SCENARIOS } from '../data/scenarios';
import { LEVELS } from '../data/assets';
import { levelColor } from '../utils';
import { Play, Pause, RotateCcw, Settings, Radio } from 'lucide-react';
import DemoMissionControl from './DemoMissionControl';

function CommandCenter({
  scenarioKey, scenario, running, simTime, speed, setSpeed,
  startScenario, resetScenario, togglePause, changeScenario, phase,
  // New jury demo props
  demoMode, startJuryDemo, advanceDemoStep, storyStep, decisionStage,
}) {
  const color = levelColor(phase.level);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
      {/* ── Jury Demo Button or Active Demo Controls ── */}
      <DemoMissionControl
        demoMode={demoMode}
        simTime={simTime}
        running={running}
        speed={speed}
        setSpeed={setSpeed}
        startJuryDemo={startJuryDemo}
        togglePause={togglePause}
        resetScenario={resetScenario}
        advanceDemoStep={advanceDemoStep}
        decisionStage={decisionStage}
        storyStep={storyStep}
        phase={phase}
      />

      {/* ── Normal Simulation Controls (always visible) ── */}
      <div className="glass" style={{ borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 12 }}>

        {/* Left: Scenario Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <Settings size={12} color="var(--wg-cyan)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--wg-text)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Scénario</span>
          </div>
          <select
            value={scenarioKey}
            onChange={(e) => changeScenario(e.target.value)}
            style={{
              background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)',
              borderRadius: 4, color: 'var(--wg-cyan)', fontSize: 12, fontWeight: 700,
              padding: '3px 7px', outline: 'none', cursor: 'pointer', maxWidth: 170,
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {Object.entries(SCENARIOS).map(([key, sc]) => (
              <option key={key} value={key} style={{ background: 'var(--wg-surface)', color: 'var(--wg-text)' }}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Middle: Play/Pause/Reset/Speed (only when NOT in jury demo mode) */}
        {demoMode !== 'jury' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button onClick={togglePause} title={running ? 'Pause' : 'Démarrer'} style={{
              background: running ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
              border: `1px solid ${running ? 'var(--wg-red)' : 'var(--wg-green)'}`,
              borderRadius: 4, color: running ? 'var(--wg-red)' : 'var(--wg-green)',
              width: 30, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              {running ? <Pause size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" />}
            </button>
            <button onClick={resetScenario} title="Réinitialiser" style={{
              background: 'var(--wg-subtle)', border: '1px solid var(--wg-border)',
              borderRadius: 4, color: 'var(--wg-muted)', width: 30, height: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <RotateCcw size={11} />
            </button>
            <div style={{ display: 'flex', border: '1px solid var(--wg-border)', borderRadius: 4, overflow: 'hidden', height: 26, background: 'var(--wg-bg-deep)' }}>
              {[1, 2, 4].map(s => (
                <button key={s} onClick={() => setSpeed(s)} style={{
                  background: speed === s ? 'var(--wg-blue)' : 'transparent',
                  border: 'none', color: speed === s ? 'var(--wg-text)' : 'var(--wg-muted)',
                  fontSize: 11, fontWeight: 700, padding: '0 8px', cursor: 'pointer', height: '100%',
                }}>
                  x{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right: Timer + Phase */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontSize: 10, color: 'var(--wg-muted)', textTransform: 'uppercase' }}>T:</span>
            <span className="mono-precision layout-lock" style={{ fontSize: 12, fontWeight: 700, color: 'var(--wg-text)', minWidth: 30 }}>
              {String(Math.round(simTime)).padStart(2, '0')}s
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', background: color + '15', border: `1px solid ${color}30`, borderRadius: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
            <span className="mono-precision" style={{ fontSize: 11, fontWeight: 800, color }}>{LEVELS[phase.level]?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CommandCenter);
