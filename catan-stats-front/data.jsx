// Shared mock data for all variations.
const PLAYERS = [
  { id: 'a', name: 'Alba',    color: '#d97757' },
  { id: 'm', name: 'Marc',    color: '#3b82a4' },
  { id: 'l', name: 'Lucia',   color: '#7a8c47' },
  { id: 'p', name: 'Pau',     color: '#b08642' },
  { id: 'n', name: 'Nora',    color: '#8b5a8c' },
];

const GROUPS = [
  { id: 'g1', name: 'Peña del jueves',     desc: 'Sesión semanal en casa de Marc', members: 5, matches: 47, last: 'hace 3 días' },
  { id: 'g2', name: 'Catán de la facu',    desc: 'Compañeros de universidad',       members: 4, matches: 22, last: 'hace 2 semanas' },
  { id: 'g3', name: 'Familia Navidad',     desc: 'Solo en festivos',                members: 6, matches: 8,  last: 'hace 4 meses' },
];

const RECENT_MATCHES = [
  { id: 'm1', date: '24 abr',  expansion: 'Navegantes', winner: 'Alba',  points: 13, players: 4, duration: '1h 42m' },
  { id: 'm2', date: '17 abr',  expansion: 'Base',       winner: 'Marc',  points: 10, players: 4, duration: '1h 15m' },
  { id: 'm3', date: '10 abr',  expansion: 'Base',       winner: 'Alba',  points: 10, players: 5, duration: '1h 58m' },
  { id: 'm4', date: '03 abr',  expansion: 'Navegantes', winner: 'Lucia', points: 13, players: 4, duration: '2h 04m' },
  { id: 'm5', date: '27 mar',  expansion: 'Base',       winner: 'Alba',  points: 10, players: 3, duration: '0h 58m' },
  { id: 'm6', date: '20 mar',  expansion: 'Base',       winner: 'Pau',   points: 11, players: 4, duration: '1h 22m' },
];

const PLAYER_STATS = [
  { id: 'a', name: 'Alba',  played: 47, won: 19, winrate: 40, avg: 8.4, streak: 3 },
  { id: 'm', name: 'Marc',  played: 47, won: 12, winrate: 26, avg: 7.9, streak: 0 },
  { id: 'l', name: 'Lucia', played: 41, won: 9,  winrate: 22, avg: 7.6, streak: 0 },
  { id: 'p', name: 'Pau',   played: 38, won: 5,  winrate: 13, avg: 6.8, streak: 0 },
  { id: 'n', name: 'Nora',  played: 22, won: 2,  winrate: 9,  avg: 6.1, streak: 0 },
];

// Detailed match — for match detail screen
const MATCH_DETAIL = {
  id: 'm1',
  date: '24 abr 2026',
  time: '21:14',
  expansion: 'Navegantes',
  duration: '1h 42m',
  winner: 'Alba',
  notes: 'Partida cerradísima. Alba se la lleva con la ruta más larga al final.',
  scores: [
    { name: 'Alba',  score: 13, longestRoad: true,  largestArmy: false, isWinner: true },
    { name: 'Marc',  score: 11, longestRoad: false, largestArmy: true,  isWinner: false },
    { name: 'Lucia', score: 9,  longestRoad: false, largestArmy: false, isWinner: false },
    { name: 'Pau',   score: 7,  longestRoad: false, largestArmy: false, isWinner: false },
  ],
};

// 12-month spark for charts
const MATCHES_PER_MONTH = [3, 5, 4, 6, 4, 7, 5, 8, 6, 4, 5, 7];

// Win timeline for player profile (last 10 results, W/L)
const PROFILE_TIMELINE = ['W','L','L','W','W','W','L','W','L','W'];

Object.assign(window, {
  PLAYERS, GROUPS, RECENT_MATCHES, PLAYER_STATS, MATCH_DETAIL,
  MATCHES_PER_MONTH, PROFILE_TIMELINE,
});
