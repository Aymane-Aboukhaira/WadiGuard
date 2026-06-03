# UI and Components

## 1. Strict CSS and Layout Constraints
WadiGuard is styled as a military-grade NOC interface, demanding absolute visual stability and clarity.
*   **.layout-lock Utility:** Implemented to enforce rigid flex-shrink constraints alongside explicit `min-width` definitions, `text-overflow: ellipsis`, and `white-space: nowrap`. This ensures that unpredictable telemetry (e.g., latency jumping from 9ms to 150ms) never shifts or resizes container layouts.
*   **Monospace Typography:** A strict requirement for all data streams (`.mono-precision`). Tabular numeric fonts guarantee that rapid ticks in numbers do not cause visual jitter on the horizontal axis.
*   **Charcoal Theme (`#050608` / `#090B0F`):** Provides a deep, matte background necessary to contrast heavily with cyber-teal (`#00F0FF`) accents and stark status indicators (Neon Green, Warning Orange, Critical Red) while eliminating UI glare.

## 2. Core Components

### MapView.jsx
Integrates `react-leaflet` directly with the native CartoDB Dark Matter vector tile provider, completely bypassing inefficient CSS `invert()` filter hacks. The map features dynamic, custom HTML markers (`L.divIcon`) that physically pulse under high-risk conditions. Clicking specific areas dynamically adjusts coordinates, leveraging `map.flyTo` for smooth tactical refocusing.

### RegionalPanel.jsx
Houses the macro-level region selectors and granular asset details. Contains high-fidelity SVG gauges (Circular NIVEAU D'EAU, Linear PLUVIOMÉTRIE, and Risk Score meters). These elements consume live Context data and generate continuous sparkline paths via `useMemo` hooks, translating pure numerical data into instant visual feedback.

### ImpactModel.jsx
Handles the complex data visualization for the selected asset's consequences. It utilizes heavily customized, memoized Recharts (`BarChart` and `Line` hybrids) to render an impact comparison across the top 6 critical assets. Data binding locks tightly to the global telemetry state to display exact exposed populations and blocked routes.

### CommandCenter.jsx & IncidentPanel.jsx
*   **CommandCenter.jsx:** Provides the execution interface for the Simulation Loop (Play, Pause, Reset, Speed adjustments) and scenario loading.
*   **IncidentPanel.jsx:** Serves as the static operational protocol readout. It ties the current simulation phase to specific, pre-determined action playbooks and tracks real-time system logs.
