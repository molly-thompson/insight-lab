export const chartPalette = {
  surface: 0x020617,
  surfaceSoft: 0x0f172a,
  grid: 0x334155,
  text: 0xe2e8f0,
  muted: 0x94a3b8,
  line: 0x67e8f9,
  fill: 0x38bdf8,
  ring: 0x0ea5e9,
  accentA: 0x22d3ee,
  accentB: 0x60a5fa,
  accentC: 0x818cf8,
  accentD: 0x14b8a6,
  accentE: 0x7dd3fc,
};

export function getTraitAccent(trait, index = 0) {
  const palette = [
    chartPalette.accentA,
    chartPalette.accentB,
    chartPalette.accentC,
    chartPalette.accentD,
    chartPalette.accentE,
  ];
  let hash = index;
  for (let i = 0; i < String(trait).length; i++) {
    hash = (hash * 31 + String(trait).charCodeAt(i)) % 997;
  }
  return palette[hash % palette.length];
}

export function hexToRgbParts(hexValue) {
  const value = Number(hexValue) || 0;
  return {
    red: (value >> 16) & 255,
    green: (value >> 8) & 255,
    blue: value & 255,
  };
}

export function rgbaString(hexValue, alpha) {
  const { red, green, blue } = hexToRgbParts(hexValue);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
