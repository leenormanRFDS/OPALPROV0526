const RARITY_TIERS = {
  Zenith: { label: 'Zenith', color: '#10C896', minGrade: 9, xp: 1000, multi: 5.0 },
  Legendary: { label: 'Legendary', color: '#4EA832', minGrade: 7, xp: 250, multi: 2.5 },
  Epic: { label: 'Epic', color: '#B8621A', minGrade: 5, xp: 100, multi: 1.8 },
  Rare: { label: 'Rare', color: '#9C481A', minGrade: 3, xp: 50, multi: 1.3 },
  Common: { label: 'Common', color: '#5C2015', minGrade: 1, xp: 20, multi: 1.0 }
};

const getRarity = (grade) => {
  if (grade >= 9) return RARITY_TIERS.Zenith;
  if (grade >= 7) return RARITY_TIERS.Legendary;
  if (grade >= 5) return RARITY_TIERS.Epic;
  if (grade >= 3) return RARITY_TIERS.Rare;
  return RARITY_TIERS.Common;
};

const calculateDerived = (s) => {
  const grade = s.mk_grade || 1;
  const rarity = getRarity(grade);
  const nft_value = s.mr_offer ? s.mr_offer * (grade >= 9 ? 1.8 : grade >= 8 ? 1.4 : grade >= 7 ? 1.2 : 1.1) : s.mk_rough_total * 1.1;
  const div_pct_val = s.mr_offer && s.mk_rough_total ? ((s.mk_rough_total / s.mr_offer - 1) * 100) : null;
  const divergence_pct = div_pct_val !== null ? div_pct_val.toFixed(1) + '%' : 'N/A';
  const mr_ppg_implied_safe = s.mr_ppg_implied || 0;
  return { ...s, nft_value, div_pct_val, divergence_pct, mr_ppg_implied_safe, rarity };
};

const AosaLogo = () => (
  <svg viewBox="0 0 300 100" className="h-full">
    <defs>
      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fef582" />
        <stop offset="50%" stopColor="#d7b453" />
        <stop offset="100%" stopColor="#7f6c40" />
      </linearGradient>
    </defs>
    <text x="0" y="45" fontFamily="DM Sans" fontWeight="800" fontSize="48" fill="url(#gold-grad)">AOSA</text>
    <text x="135" y="25" fontFamily="DM Sans" fontWeight="800" fontSize="20" fill="url(#gold-grad)">™</text>
    <rect x="0" y="60" width="160" height="1" fill="#C9A66B" fillOpacity="0.4" />
    <text x="0" y="76" fontFamily="DM Sans" fontWeight="600" fontSize="7" letterSpacing="4" fill="#C9A66B">THE STANDARD</text>
    <g transform="translate(180, 15) scale(0.8)">
      <path d="M0,0 L30,25 L60,0 L45,0 L30,12 L15,0 Z" fill="#C9A66B" />
      <path d="M-5,15 L30,45 L65,15 L50,15 L30,32 L10,15 Z" fill="#7A5C28" fillOpacity="0.75" />
      <path d="M-10,30 L30,65 L70,30 L55,30 L30,52 L5,30 Z" fill="#3A3028" fillOpacity="0.45" />
    </g>
  </svg>
);

const { useState, useEffect, useMemo } = React;
if (typeof Recharts === 'undefined') {
  console.error("Recharts is not defined! Check if the script in index.html is loading correctly.");
  // Provide a fallback or mock if needed to prevent crash, but better to know why it fails
}
const { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, BarChart, Bar, CartesianGrid, ReferenceLine, LabelList } = Recharts || {};

const DEFAULT_STONES = SEEDS.map(calculateDerived);
