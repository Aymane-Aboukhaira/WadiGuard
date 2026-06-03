export const RIVERS = {
  loukkos: [
    [35.02, -5.67], [35.08, -5.75], [35.11, -5.78],
    [35.14, -5.89], [35.16, -5.98], [35.18, -6.05],
    [35.18, -6.13], [35.19, -6.22],
  ],
  martil: [
    [35.37, -5.47], [35.43, -5.42], [35.48, -5.4],
    [35.53, -5.36], [35.57, -5.35], [35.62, -5.27],
  ],
  mghogha: [
    [35.67, -5.72], [35.70, -5.76], [35.71, -5.78],
    [35.73, -5.8],  [35.75, -5.82], [35.77, -5.84],
    [35.78, -5.85],
  ],
  laou: [
    [35.17, -5.27], [35.24, -5.28], [35.30, -5.22],
    [35.33, -5.18], [35.39, -5.13], [35.44, -5.1],
    [35.52, -5.08],
  ],
  nekor: [
    [35.0,  -3.93], [35.06, -3.90], [35.1, -3.88],
    [35.14, -3.87], [35.17, -3.86], [35.21, -3.87],
    [35.24, -3.91],
  ],
  smir: [
    [35.67, -5.42], [35.69, -5.40], [35.71, -5.37],
    [35.72, -5.34], [35.74, -5.31],
  ],
};

export const IMPACT_ZONES = {
  tanger: [
    [35.748, -5.82], [35.771, -5.83], [35.781, -5.84],
    [35.786, -5.88], [35.773, -5.90], [35.753, -5.89],
    [35.735, -5.855],
  ],
  tetouan: [
    [35.535, -5.29], [35.55, -5.36], [35.575, -5.36],
    [35.6, -5.34], [35.625, -5.28], [35.605, -5.23],
    [35.585, -5.23], [35.555, -5.25],
  ],
  loukkos: [
    [35.08, -6.05], [35.12, -6.10], [35.16, -6.14],
    [35.22, -6.12], [35.24, -6.22], [35.20, -6.28],
    [35.14, -6.25], [35.08, -6.20], [35.06, -6.13],
  ],
  alHoceima: [
    [35.10, -3.84], [35.14, -3.91], [35.18, -3.94],
    [35.21, -3.94], [35.25, -3.88], [35.23, -3.82],
    [35.19, -3.80],
  ],
  laou: [
    [35.38, -5.08], [35.42, -5.13], [35.47, -5.13],
    [35.52, -5.11], [35.56, -5.05], [35.53, -5.00],
    [35.47, -5.0],  [35.40, -5.04],
  ],
  smir: [
    [35.68, -5.42], [35.71, -5.40], [35.74, -5.35],
    [35.75, -5.30], [35.73, -5.27], [35.70, -5.30],
    [35.67, -5.36],
  ],
};

export const POPULATION_ZONES = [
  {
    name: 'Tanger Centre',
    coords: [[35.764, -5.843], [35.778, -5.832], [35.785, -5.853], [35.770, -5.865], [35.756, -5.857]],
    population: 95000,
    density: 'haute',
  },
  {
    name: 'Tétouan Médina',
    coords: [[35.568, -5.372], [35.580, -5.359], [35.591, -5.363], [35.583, -5.378], [35.570, -5.382]],
    population: 48000,
    density: 'haute',
  },
  {
    name: 'Larache Ville',
    coords: [[35.186, -6.155], [35.201, -6.138], [35.208, -6.147], [35.196, -6.165], [35.183, -6.162]],
    population: 36000,
    density: 'moyenne',
  },
  {
    name: 'Al Hoceïma Centre',
    coords: [[35.234, -3.937], [35.246, -3.926], [35.252, -3.931], [35.243, -3.946], [35.231, -3.949]],
    population: 42000,
    density: 'moyenne',
  },
];

export const WEATHER_STATIONS = [
  { id: 'WS-TNG', name: 'Tanger Aéroport', coord: [35.726, -5.917], temp: 18, humidity: 78, wind: 24 },
  { id: 'WS-TTN', name: 'Tétouan', coord: [35.572, -5.333], temp: 17, humidity: 82, wind: 18 },
  { id: 'WS-CHF', name: 'Chefchaouen', coord: [35.169, -5.268], temp: 14, humidity: 88, wind: 12 },
  { id: 'WS-LAR', name: 'Larache', coord: [35.197, -6.156], temp: 16, humidity: 75, wind: 22 },
  { id: 'WS-ALH', name: 'Al Hoceïma', coord: [35.242, -3.930], temp: 20, humidity: 65, wind: 28 },
];

export const CRITICAL_INFRA = [
  { id: 'ci-hosp-ttn', name: 'Hôpital Mohammed VI', type: 'hospital', coord: [35.575, -5.345], province: 'Tétouan' },
  { id: 'ci-hosp-tng', name: 'Hôpital Mohammed V', type: 'hospital', coord: [35.765, -5.815], province: 'Tanger-Assilah' },
  { id: 'ci-hosp-lar', name: 'Hôpital Lalla Meryem', type: 'hospital', coord: [35.195, -6.148], province: 'Larache' },
  { id: 'ci-school-mrt', name: 'École Martil', type: 'school', coord: [35.615, -5.275], province: 'Tétouan' },
  { id: 'ci-school-tng', name: 'Lycée Ibn Batouta', type: 'school', coord: [35.758, -5.838], province: 'Tanger-Assilah' },
  { id: 'ci-school-ttn', name: 'Université Abdelmalek', type: 'school', coord: [35.562, -5.358], province: 'Tétouan' },
  { id: 'ci-bridge-rn13', name: 'Pont RN13 Martil', type: 'bridge', coord: [35.595, -5.295], province: 'Tétouan' },
  { id: 'ci-bridge-rn1', name: 'Pont RN1 Mghogha', type: 'bridge', coord: [35.748, -5.84], province: 'Tanger-Assilah' },
  { id: 'ci-bridge-rn16', name: 'Pont RN16 Nekor', type: 'bridge', coord: [35.19, -3.87], province: 'Al Hoceïma' },
  { id: 'ci-bridge-ksar', name: 'Pont RN1 Ksar', type: 'bridge', coord: [35.10, -5.90], province: 'Larache' },
];

export const EVACUATION_ROUTES = [
  {
    id: 'evac-tetouan',
    name: 'Évacuation Tétouan → Refuges',
    coords: [[35.575, -5.345], [35.565, -5.36], [35.555, -5.38], [35.54, -5.40]],
    province: 'Tétouan',
  },
  {
    id: 'evac-martil',
    name: 'Évacuation Martil → Tétouan',
    coords: [[35.615, -5.275], [35.60, -5.295], [35.585, -5.32], [35.575, -5.345]],
    province: 'Tétouan',
  },
  {
    id: 'evac-tanger',
    name: 'Évacuation Tanger Basse → Refuges',
    coords: [[35.755, -5.835], [35.745, -5.82], [35.735, -5.81], [35.72, -5.80]],
    province: 'Tanger-Assilah',
  },
  {
    id: 'evac-larache',
    name: 'Évacuation Larache → Hauteurs',
    coords: [[35.195, -6.148], [35.205, -6.135], [35.215, -6.12], [35.225, -6.11]],
    province: 'Larache',
  },
];

