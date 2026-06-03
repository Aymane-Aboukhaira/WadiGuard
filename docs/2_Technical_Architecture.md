# Technical Architecture

## 1. React Architecture & State Strategy
WadiGuard employs a centralized React architecture utilizing Context API for global state distribution. This guarantees a single source of truth for telemetry, UI synchronization, and cross-component communication. By lifting state to the global context, isolated components (e.g., Map, Gauges, Impact Models) instantly reflect the same underlying operational reality without prop-drilling or localized desynchronization.

## 2. SimulationContext (The Mock Telemetry Engine)
The core of the platform's interactivity resides within `SimulationContext.jsx`. 
*   **The Simulation Loop:** A `setInterval` loop drives the `simTime` forward at an adjustable `speed`. This loop acts as the primary clock for the NOC environment.
*   **On-the-Fly Mutation:** At each tick of `simTime`, the global `assets` array is mapped and mutated. Base metrics (water levels, rainfall) are adjusted by compounding sine wave algorithms (to simulate environmental fluctuations) and randomized noise factors (±1.5% water, ±3mm rain). This yields highly realistic, high-frequency telemetry streams.
*   **Global UI Dictation:** As the state updates, derived metrics (risk scores, latency jumps, battery drain) are instantly calculated and published to the Context, driving the reactive updates across all subscribed tactical UI components.

## 3. Performance Optimization
Handling high-frequency data ticks (up to 4x simulation speed) demands strict architectural guardrails to prevent the browser's main thread from blocking.
*   **Strict Memoization:** Extensive use of `React.memo` and `useMemo` is enforced. Recharts components and custom SVG-based gauges are heavily memoized. The central column and peripheral components do not re-render unnecessarily; they only update when their specific slice of the global telemetry mutates.
*   **Path Data Optimization:** Rather than generating individual DOM nodes (e.g., SVG circles or rects) for every point in a trendline, history data is simplified into pure, memoized `<path d="..." />` string properties. This dramatically reduces DOM manipulation and ensures rendering efficiency during data spikes.
