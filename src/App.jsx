import { useEffect, useState } from 'react';
import { SimulationProvider, useSimulationContext } from './context/SimulationContext';
import { Menu } from 'lucide-react';

import TopBar        from './components/TopBar';
import BottomStatus  from './components/BottomStatus';
import RegionalPanel from './components/RegionalPanel';
import MapView       from './components/MapView';
import CommandCenter from './components/CommandCenter';
import ImpactModel   from './components/ImpactModel';
import IncidentPanel from './components/IncidentPanel';
import JurySummaryPanel from './components/JurySummaryPanel';

import AlertModal  from './components/Modals/AlertModal';
import ReportModal from './components/Modals/ReportModal';
import AssetModal  from './components/Modals/AssetModal';

import AnalyseView  from './views/AnalyseView';
import RapportsView from './views/RapportsView';
import InfrastructureView from './views/InfrastructureView';

function AppContent() {
  const {
    tab, setTab,
    province, setProvince,
    selectedAssetId, setSelectedAssetId,
    scenarioKey, changeScenario,
    running, simTime, speed, setSpeed,
    assets, selectedAsset, phase, scenario,
    consequences, timelineData, logs,
    reportModal, setReportModal,
    alertModal, setAlertModal,
    togglePause, resetScenario,
    // New demo mode props
    demoMode, startJuryDemo, advanceDemoStep,
    showJurySummary, setShowJurySummary,
    decisionStage, activeChannels, cyberState,
    storyStep,
  } = useSimulationContext();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wadiguard-theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('wadiguard-theme', theme);
  }, [theme]);

  const [layers, setLayers] = useState({ dams: true, rivers: true, roads: true, impacts: true });
  const [assetModal, setAssetModal] = useState(null);

  /* Drawer state */
  const [leftOpen, setLeftOpen] = useState(window.innerWidth > 1024);
  const [rightOpen, setRightOpen] = useState(window.innerWidth > 1024);

  /* Clock */
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const alertCount  = assets.filter(a => a.status === 'red' || a.status === 'black').length;
  const onlineCount = assets.filter(a => a.online).length;

  const visibleAssets = assets.filter(a => province === 'Tous' || a.province === province);

  /* Props bundles */
  const simProps = {
    scenarioKey, scenario, running, simTime, speed, setSpeed,
    resetScenario, togglePause, changeScenario, phase,
    // New jury demo props
    demoMode, startJuryDemo, advanceDemoStep, storyStep, decisionStage,
  };

  const mapProps = {
    assets, selectedAsset, setSelectedAssetId, layers, setLayers, scenario, phase, theme
  };

  /* Jury summary data — extract from last event if available */
  const jurySummary = phase.jurySummary || null;

  /* Close jury summary */
  const closeJurySummary = () => {
    setShowJurySummary(false);
  };

  return (
    <div className={`layout-root app-level-${phase.level} theme-${theme}`}>
      <TopBar
        clock={clock}
        level={phase.level}
        tab={tab}
        setTab={setTab}
        alertCount={alertCount}
        onlineCount={onlineCount}
        totalCount={assets.length}
        demoMode={demoMode}
        simTime={simTime}
        decisionStage={decisionStage}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="main-area">
        {/* ── Dashboard ── */}
        {tab === 'dashboard' && (
          <div className="dashboard-layout">
            
            {/* Left Drawer */}
            <div className={`panel-drawer left ${leftOpen ? 'open' : 'closed'}`}>
              <div className="panel-drawer-content" style={{ width: 310 }}>
                <RegionalPanel
                  province={province}
                  setProvince={setProvince}
                  assets={visibleAssets}
                  selectedAsset={selectedAsset}
                  setSelectedAssetId={setSelectedAssetId}
                  onOpenAsset={(a) => setAssetModal(a)}
                  timelineData={timelineData}
                />
              </div>
            </div>

            {/* Center Area */}
            <div className="dashboard-center">
              {!leftOpen && (
                <button className="drawer-toggle left" onClick={() => setLeftOpen(true)} title="Ouvrir panneau régional">
                  <Menu size={16} />
                </button>
              )}
              {leftOpen && (
                <button className="drawer-toggle left" onClick={() => setLeftOpen(false)} title="Fermer panneau" style={{ left: -10, top: 12, opacity: 0.5 }}>
                  <Menu size={14} />
                </button>
              )}
              
              {!rightOpen && (
                <button className="drawer-toggle right" onClick={() => setRightOpen(true)} title="Ouvrir panneau de décision">
                  <Menu size={16} />
                </button>
              )}
              {rightOpen && (
                <button className="drawer-toggle right" onClick={() => setRightOpen(false)} title="Fermer panneau" style={{ right: -10, top: 12, opacity: 0.5 }}>
                  <Menu size={14} />
                </button>
              )}

              <CommandCenter {...simProps} />
              <MapView {...mapProps} />
              <ImpactModel
                consequences={consequences}
                selectedAsset={selectedAsset}
                phase={phase}
                timelineData={timelineData}
                liveAssets={assets}
                decisionStage={decisionStage}
                activeChannels={activeChannels}
              />
            </div>

            {/* Right Drawer */}
            <div className={`panel-drawer right ${rightOpen ? 'open' : 'closed'}`}>
              <div className="panel-drawer-content" style={{ width: 340 }}>
                <IncidentPanel
                  level={phase.level}
                  phase={phase}
                  scenario={scenario}
                  consequences={consequences}
                  selectedAsset={selectedAsset}
                  logs={logs}
                  onGenerateReport={() => setReportModal(true)}
                  decisionStage={decisionStage}
                  activeChannels={activeChannels}
                  cyberState={cyberState}
                  liveAssets={assets}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Full map ── */}
        {tab === 'map' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8, height: '100%' }}>
            <CommandCenter {...simProps} />
            <div style={{ flex: 1, minHeight: 0 }}>
              <MapView {...mapProps} fullscreen />
            </div>
          </div>
        )}

        {/* ── Analyse ── */}
        {tab === 'analyse' && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <AnalyseView liveAssets={assets} phase={phase} timelineData={timelineData} />
          </div>
        )}

        {/* ── Infrastructure ── */}
        {tab === 'infrastructure' && (
          <div style={{ height: '100%', overflowY: 'auto', background: 'var(--wg-bg-deep)' }}>
            <InfrastructureView phase={phase} cyberState={cyberState} />
          </div>
        )}

        {/* ── Rapports ── */}
        {tab === 'rapports' && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <RapportsView
              logs={logs}
              liveAssets={assets}
              phase={phase}
              scenario={scenario}
              consequences={consequences}
              onOpenReport={() => setReportModal(true)}
            />
          </div>
        )}
      </div>

      <BottomStatus
        assets={assets}
        consequences={consequences}
        phase={phase}
        simTime={simTime}
        running={running}
      />

      {/* ── Modals ── */}
      {alertModal && (
        <AlertModal
          level={alertModal.level}
          scenario={alertModal.scenario}
          consequences={alertModal.consequences}
          onAcknowledge={() => setAlertModal(null)}
        />
      )}
      {reportModal && (
        <ReportModal
          scenario={scenario}
          phase={phase}
          consequences={consequences}
          liveAssets={assets}
          logs={logs}
          onClose={() => setReportModal(false)}
        />
      )}
      {assetModal && (
        <AssetModal
          asset={assetModal}
          onClose={() => setAssetModal(null)}
        />
      )}

      {/* ── Jury Summary Overlay ── */}
      {showJurySummary && (
        <JurySummaryPanel
          jurySummary={jurySummary}
          onRestart={startJuryDemo}
          onClose={closeJurySummary}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}
