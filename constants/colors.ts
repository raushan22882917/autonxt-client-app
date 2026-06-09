/**
 * VoltStrat — Institutional High-Tech Color Palette
 *
 * Primary:   Volt Blue    #1A44F2
 * Secondary: Coral Energy #E63946
 * Canvas:    Off-White    #F8FAFF
 * Text:      Technical Navy #0F172A
 */

const palette = {
  // ── Base ─────────────────────────────────────────────────────────────────
  text:               '#0F172A',
  background:         '#F8FAFF',
  foreground:         '#0F172A',

  card:               '#FFFFFF',
  cardForeground:     '#0F172A',

  // ── Primary — Volt Blue ──────────────────────────────────────────────────
  primary:            '#1A44F2',
  primaryForeground:  '#FFFFFF',

  // ── Secondary — Coral Energy ─────────────────────────────────────────────
  secondary:          '#E63946',
  secondaryForeground:'#FFFFFF',

  // ── Muted surfaces ───────────────────────────────────────────────────────
  muted:              '#F0F4F8',
  mutedForeground:    '#94A3B8',

  // ── Accent (primary tint) ────────────────────────────────────────────────
  accent:             '#3D64F5',
  accentForeground:   '#FFFFFF',

  // ── Destructive — Rose ───────────────────────────────────────────────────
  destructive:        '#F43F5E',
  destructiveForeground: '#FFFFFF',

  // ── Borders & Inputs ─────────────────────────────────────────────────────
  border:             '#E2E8F0',
  input:              '#F0F4F8',

  // ── Extended surface tokens ───────────────────────────────────────────────
  surface:            '#FFFFFF',
  surfaceAlt:         '#F0F4F8',       // Surface High
  surfaceElevated:    '#FFFFFF',
  chip:               '#E8EDFE',       // Primary Muted — for chips/tags
  track:              '#E2E8F0',
  hairline:           '#E2E8F0',

  // ── Semantic — Red / Coral (critical / error) ────────────────────────────
  red:                '#E63946',
  redSoft:            '#FCEBEB',       // Secondary Muted
  redBorder:          '#F9C0C4',

  // ── Semantic — Blue (nav / info) ─────────────────────────────────────────
  blue:               '#1A44F2',
  blueSoft:           '#E8EDFE',       // Primary Muted
  blueBorder:         '#A8BAFB',

  // ── Semantic — Black ─────────────────────────────────────────────────────
  black:              '#0F172A',

  // ── Semantic — Success — Emerald ─────────────────────────────────────────
  success:            '#10B981',
  successSoft:        '#D1FAE5',
  successBorder:      '#6EE7B7',

  // ── Semantic — Warning ───────────────────────────────────────────────────
  warning:            '#F59E0B',
  warningSoft:        '#FEF3C7',
  warningBorder:      '#FCD34D',

  // ── Semantic — Info ──────────────────────────────────────────────────────
  info:               '#0EA5E9',
  infoSoft:           '#E0F2FE',
  infoBorder:         '#7DD3FC',

  // ── Gradient stops ───────────────────────────────────────────────────────
  gradientStart:      '#1A44F2',       // Volt Blue
  gradientEnd:        '#102DBF',       // Primary Shade
  gradientAccent:     '#E63946',       // Coral Energy

  // ── Shadows ──────────────────────────────────────────────────────────────
  shadow:             '#0F172A',
  shadowStrong:       '#0F172A',

  // ── Tint ─────────────────────────────────────────────────────────────────
  tint:               '#1A44F2',
};

const colors = {
  light: palette,
  radius: 8,               // 8px — clean institutional feel
};

export default colors;
