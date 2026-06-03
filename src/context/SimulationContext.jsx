import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ASSETS } from '../data/assets';
import { SCENARIOS, DEFAULT_CHANNELS, DEFAULT_CYBER_STATE } from '../data/scenarios';
import { clamp, currentPhase, statusFromWater, riskScore, timeStamp } from '../utils';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const [scenarioKey, setScenarioKey] = useState('rifStorm');
  const [simTime, setSimTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedAssetId, setSelectedAssetId] = useState('river-martil');
  const [province, setProvince] = useState('Tous');
  const [tab, setTab] = useState('dashboard');
  const [reportModal, setReportModal] = useState(false);
  const [alertModal, setAlertModal] = useState(null);

  // ═══ NEW: Demo mode state ═══
  const [demoMode, setDemoMode] = useState('nominal'); // 'nominal' | 'live' | 'jury'
  const [showJurySummary, setShowJurySummary] = useState(false);

  // Load baseline assets
  const [assets, setAssets] = useState(() => {
    return ASSETS.map((asset, index) => ({
      ...asset,
      affected: false,
      water: asset.baseWater,
      rain: asset.baseRain,
      riskScore: riskScore(asset.baseWater, asset.baseRain, 1),
      status: statusFromWater(asset.baseWater),
      online: true,
      battery: clamp(94 - index * 2 + (asset.type === 'road' ? 4 : 0), 67, 98),
      latency: 115 + index * 9,
      etaMinutes: null,
      lastSync: `${(index % 18) + 3}s`,
    }));
  });

  // Timeline history for the selected asset (for Recharts)
  const [timelineData, setTimelineData] = useState([]);

  // Log management state
  const [logs, setLogs] = useState([
    { at: timeStamp(), level: 'green', category: 'event', text: 'WadiGuard v4 Regional OS — 13 actifs hydrauliques initialisés' },
    { at: timeStamp(), level: 'green', category: 'event', text: 'ABH Loukkos · DGH · Protection Civile · Communes — canaux opérationnels' },
  ]);

  const scenario = useMemo(() => SCENARIOS[scenarioKey], [scenarioKey]);
  const phase = useMemo(() => currentPhase(scenario, simTime), [scenario, simTime]);

  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // ═══ NEW: Derived decision/channel/cyber state from current phase ═══
  const decisionStage = useMemo(() => {
    return phase.decisionStage || 'detection';
  }, [phase]);

  const activeChannels = useMemo(() => {
    return phase.activeChannels || DEFAULT_CHANNELS;
  }, [phase]);

  const cyberState = useMemo(() => {
    return phase.cyberState || DEFAULT_CYBER_STATE;
  }, [phase]);

  const roadClosures = useMemo(() => {
    return phase.roadClosures || [];
  }, [phase]);

  const ledMessages = useMemo(() => {
    return phase.ledMessages || [];
  }, [phase]);

  const predictedImpact = useMemo(() => {
    return phase.predictedImpact || { min30: '—', min60: '—', min90: '—' };
  }, [phase]);

  const storyStep = useMemo(() => {
    return phase.storyStep || '';
  }, [phase]);

  // Derived consequences model
  const consequences = useMemo(() => {
    const affectedAssets = assets.filter(a => a.affected && a.status !== 'green');
    const basePop = affectedAssets.reduce((s, a) => s + a.population, 0);
    const factor = phase.level === 'black' ? 0.72 : phase.level === 'red' ? 0.44 : phase.level === 'orange' ? 0.19 : 0;
    const population = Math.max(phase.pop ?? 0, Math.round(basePop * factor));
    return {
      population,
      roads: phase.roads ?? 0,
      teams: phase.teams ?? 0,
      shelters: phase.shelters ?? 0,
      sms: phase.level === 'green' ? 0 : Math.round(population * 1.48),
      eta: phase.level === 'black' ? '10–20 min' : phase.level === 'red' ? '18–35 min' : phase.level === 'orange' ? '35–70 min' : 'Stable',
    };
  }, [assets, phase]);

  // Helper to initialize timeline history for an asset
  const initTimelineHistory = useCallback((asset, currentSimTime) => {
    const history = Array.from({ length: 14 }, (_, i) => {
      const t = Math.max(0, currentSimTime - (13 - i) * 3);
      const ph = currentPhase(scenario, t);
      const isAff = scenario.affected.includes(asset.id);
      const wave = Math.sin((t + i) / 5) * 1.5;
      const water = clamp(asset.baseWater + (isAff ? ph.bump : 0) + wave);
      const rain = clamp(asset.baseRain + (isAff ? Math.max(0, ph.rain - 15) : 0) + Math.max(0, wave * 0.4), 0, 100);
      return {
        t: `${Math.round(t)}s`,
        risk: riskScore(water, rain, 1.1),
        water: Math.round(water),
        rain: Math.round(rain),
      };
    });
    setTimelineData(history);
  }, [scenario]);

  // Rebuild timeline history when the selected asset changes or scenario resets
  useEffect(() => {
    initTimelineHistory(selectedAsset, simTime);
  }, [selectedAssetId, scenarioKey]);

  // Simulation controls
  const togglePause = useCallback(() => {
    setRunning(r => {
      if (!r) {
        // Starting simulation — set mode to live or jury
        setDemoMode(prev => prev === 'jury' ? 'jury' : 'live');
      }
      return !r;
    });
  }, []);

  const resetScenario = useCallback(() => {
    setSimTime(0);
    setRunning(false);
    setDemoMode('nominal');
    setShowJurySummary(false);
    setLogs([
      { at: timeStamp(), level: 'green', category: 'event', text: 'Simulation réinitialisée — surveillance nominale' },
      { at: timeStamp(), level: 'green', category: 'event', text: 'Tous les scénarios prêts pour démonstration' },
    ]);
    setAssets(prev => prev.map((asset, index) => ({
      ...asset,
      affected: false,
      water: asset.baseWater,
      rain: asset.baseRain,
      riskScore: riskScore(asset.baseWater, asset.baseRain, 1),
      status: statusFromWater(asset.baseWater),
      online: true,
      battery: clamp(94 - index * 2 + (asset.type === 'road' ? 4 : 0), 67, 98),
      latency: 115 + index * 9,
      etaMinutes: null,
      lastSync: `${(index % 18) + 3}s`,
    })));
    setAlertModal(null);
  }, []);

  const changeScenario = useCallback((key) => {
    setScenarioKey(key);
    setSimTime(0);
    setRunning(false);
    setDemoMode('nominal');
    setShowJurySummary(false);
    const nextScenario = SCENARIOS[key];
    setLogs([
      { at: timeStamp(), level: 'green', category: 'event', text: `Scénario chargé : ${nextScenario.name}` }
    ]);
    setAlertModal(null);
    // Auto focus first affected asset
    const focusId = nextScenario.affected[0];
    if (focusId) setSelectedAssetId(focusId);
  }, []);

  // ═══ NEW: Jury Demo Mode launcher ═══
  const startJuryDemo = useCallback(() => {
    setScenarioKey('juryDemo');
    setSimTime(0);
    setDemoMode('jury');
    setShowJurySummary(false);
    const nextScenario = SCENARIOS['juryDemo'];
    setLogs([
      { at: timeStamp(), level: 'green', category: 'event', text: '🎯 DÉMO JURY LANCÉE — Crue Éclair 90 secondes' },
      { at: timeStamp(), level: 'green', category: 'event', text: 'Chaîne complète : Détection → Validation → Prédiction → Alerte → Réponse → Rapport' },
    ]);
    setAlertModal(null);
    // Reset assets
    setAssets(prev => prev.map((asset, index) => ({
      ...asset,
      affected: false,
      water: asset.baseWater,
      rain: asset.baseRain,
      riskScore: riskScore(asset.baseWater, asset.baseRain, 1),
      status: statusFromWater(asset.baseWater),
      online: true,
      battery: clamp(94 - index * 2 + (asset.type === 'road' ? 4 : 0), 67, 98),
      latency: 115 + index * 9,
      etaMinutes: null,
      lastSync: `${(index % 18) + 3}s`,
    })));
    // Focus on Martil
    setSelectedAssetId(nextScenario.affected[0]);
    // Auto-start after a brief delay
    setTimeout(() => setRunning(true), 300);
  }, []);

  // ═══ NEW: Manual step advance for jury demo ═══
  const advanceDemoStep = useCallback(() => {
    if (demoMode !== 'jury') return;
    const demoScenario = SCENARIOS['juryDemo'];
    // Find next event after current simTime
    const nextEvent = demoScenario.events.find(e => e.t > simTime);
    if (nextEvent) {
      setSimTime(nextEvent.t);
    } else {
      // We're past the last event — end demo
      setSimTime(demoScenario.maxTime);
      setRunning(false);
      setShowJurySummary(true);
    }
  }, [demoMode, simTime]);

  // Tick telemetry update loop
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSimTime(t => {
        const nextTime = t + 1;
        if (nextTime >= scenario.maxTime) {
          setRunning(false);
          // If jury demo, show summary at end
          if (demoMode === 'jury') {
            setShowJurySummary(true);
          }
          return scenario.maxTime;
        }
        return nextTime;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [running, speed, scenario, demoMode]);

  // Sync state changes on simTime updates
  useEffect(() => {
    if (simTime === 0) return;

    const currentPhaseData = currentPhase(scenario, simTime);

    // Update dynamic telemetry
    setAssets(prev => prev.map((asset, index) => {
      const affected = scenario.affected.includes(asset.id);
      const wave = Math.sin((simTime + index * 7) / 7) * 2.5;

      // Telemetry random fluctuations (water ±1.5%, rainfall ±3mm/h)
      const noiseWater = (Math.random() - 0.5) * 1.5;
      const noiseRain = (Math.random() - 0.5) * 3;

      const targetWater = asset.baseWater + (affected ? currentPhaseData.bump : 0) + wave + noiseWater;
      const water = clamp(targetWater, 0, 100);

      const targetRain = asset.baseRain + (affected ? Math.max(0, currentPhaseData.rain - 15) : 0) + Math.max(0, wave * 0.4) + noiseRain;
      const rain = clamp(targetRain, 0, 130);

      const flow = Math.round(asset.flow * (1 + (affected ? currentPhaseData.bump / 60 : 0)));
      const flowRatio = asset.flow > 0 ? flow / asset.flow : 1;
      const risk = riskScore(water, rain, flowRatio);

      const status = affected ? currentPhaseData.level : statusFromWater(water);
      const etaMinutes = affected && currentPhaseData.level !== 'green'
        ? Math.max(3, Math.round(45 - currentPhaseData.bump * 0.45))
        : null;

      // Slow battery discharge
      const battery = clamp(asset.battery - 0.08 - (index % 2) * 0.02, 5, 100);

      return {
        ...asset,
        affected,
        water: Math.round(water),
        rain: Math.round(rain),
        flow,
        riskScore: risk,
        status,
        battery: Math.round(battery),
        latency: affected && currentPhaseData.level !== 'green' ? 280 + index * 14 : 115 + index * 9,
        etaMinutes,
      };
    }));

    // Trigger phase logs if they match active intervals
    if (currentPhaseData.log && simTime % 10 === 0) {
      setLogs(prev => [
        { at: timeStamp(), level: currentPhaseData.level, category: 'action', text: currentPhaseData.log },
        ...prev
      ]);
    }

  }, [simTime, scenario]);

  // Handle timeline history scroll sync
  useEffect(() => {
    if (simTime === 0) return;
    setTimelineData(prev => {
      const next = [
        ...prev,
        {
          t: `${Math.round(simTime)}s`,
          risk: selectedAsset.riskScore,
          water: selectedAsset.water,
          rain: selectedAsset.rain,
        }
      ];
      if (next.length > 14) next.shift();
      return next;
    });
  }, [simTime, selectedAssetId]);

  // Triggers alert modal on red/black escalation
  useEffect(() => {
    if (phase.level === 'red' || phase.level === 'black') {
      // In jury demo, don't show alert modal — it interrupts the flow
      if (demoMode !== 'jury') {
        setAlertModal({ level: phase.level, scenario, consequences });
      }
    }
  }, [phase.level]);

  return (
    <SimulationContext.Provider value={{
      scenarioKey,
      scenario,
      running,
      simTime,
      speed,
      setSpeed,
      assets,
      selectedAssetId,
      setSelectedAssetId,
      selectedAsset,
      province,
      setProvince,
      tab,
      setTab,
      phase,
      consequences,
      timelineData,
      logs,
      setLogs,
      reportModal,
      setReportModal,
      alertModal,
      setAlertModal,
      togglePause,
      resetScenario,
      changeScenario,
      // ═══ NEW: Demo mode and enriched phase data ═══
      demoMode,
      setDemoMode,
      startJuryDemo,
      showJurySummary,
      setShowJurySummary,
      decisionStage,
      activeChannels,
      cyberState,
      roadClosures,
      ledMessages,
      predictedImpact,
      storyStep,
      advanceDemoStep,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationContext() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
}
