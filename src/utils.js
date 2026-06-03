export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function timeStamp(date = new Date()) {
  return new Intl.DateTimeFormat('fr-MA', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(date);
}

export function dateStamp(date = new Date()) {
  return new Intl.DateTimeFormat('fr-MA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(date);
}

export function currentPhase(scenario, simTime) {
  return scenario.events.reduce(
    (phase, event) => (simTime >= event.t ? event : phase),
    scenario.events[0],
  );
}

export function statusFromWater(water) {
  if (water >= 92) return 'black';
  if (water >= 76) return 'red';
  if (water >= 55) return 'orange';
  return 'green';
}

export function riskScore(water, rain, flowRatio) {
  return clamp(Math.round(water * 0.45 + rain * 0.3 + (flowRatio - 1) * 25));
}

export function levelColor(level) {
  const map = { green: '#22C55E', orange: '#F59E0B', red: '#EF4444', black: '#B91C1C' };
  return map[level] ?? '#22C55E';
}

export function levelSoft(level) {
  const map = {
    green:  'rgba(34,197,94,.13)',
    orange: 'rgba(245,158,11,.16)',
    red:    'rgba(239,68,68,.18)',
    black:  'rgba(185,28,28,.24)',
  };
  return map[level] ?? 'rgba(34,197,94,.13)';
}

export function formatNum(n) {
  return new Intl.NumberFormat('fr-MA').format(n);
}

/** Generate unique report reference */
export function generateRef(prefix = 'WG') {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `${prefix}-${yy}${mm}${dd}-${seq}`;
}
