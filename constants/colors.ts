/**
 * AutoNxt Fleet Portal — Premium 3D Industrial-Tech Color Palette
 *
 * Primary:       Bold Red      #D73220  — CTAs, logo containers, critical alerts
 * Accent/Blue:   Electric Blue #0B78B3  — secondary interactive, links, trust icons
 * Headings:      Technical Navy #0F172A — H1-H4, maximum authority & readability
 * Body:          Body Slate    #475569  — secondary text, descriptive labels
 * Background:    Pure White    #FFFFFF  — base surface + 3D brick texture overlay
 * Card Elevated: Ivory Tint   #F9ECE5  — premium surface wash (5-10% opacity use)
 * Form Surface:  Soft Gray    #F2F3F8  — inputs, nested containers, depth
 */

const palette = {
  // ── Base ─────────────────────────────────────────────────────────────────
  text:               '#120E10',          // Deep warm black
  background:         '#F5F6F8',          // Light gray off-white background
  foreground:         '#120E10',          // Deep warm black

  card:               '#FFFFFF',          // Pure White card surface
  cardForeground:     '#120E10',

  // ── Primary — Burgundy / Wine Red ─────────────────────────────────────────
  primary:            '#7E152F',          // Deep Burgundy accent
  primaryForeground:  '#FFFFFF',

  // ── Secondary — Gold / Ochre ──────────────────────────────────────────────
  secondary:          '#E2A93E',          // Gold accent
  secondaryForeground:'#FFFFFF',

  // ── Muted surfaces ───────────────────────────────────────────────────────
  muted:              '#F1F5F9',          // Slate 100
  mutedForeground:    '#64748B',          // Slate 500

  // ── Accent (Burgundy) ────────────────────────────────────────────────────
  accent:             '#7E152F',
  accentForeground:   '#FFFFFF',

  // ── Destructive — Burgundy ───────────────────────────────────────────────
  destructive:        '#7E152F',
  destructiveForeground: '#FFFFFF',

  // ── Borders & Inputs ─────────────────────────────────────────────────────
  border:             '#E5E7EB',          // Slate 200 - soft border outline
  input:              '#F1F5F9',          // Slate 100 - inputs

  // ── Extended surface tokens ───────────────────────────────────────────────
  surface:            '#FFFFFF',
  surfaceAlt:         '#F1F5F9',          // Slate 100
  surfaceElevated:    '#FFFFFF',
  elevatedCard:       '#FDF2F4',          // Soft burgundy tint
  chip:               '#FDF2F4',          // Soft burgundy tint
  track:              '#E5E7EB',
  hairline:           '#E5E7EB',

  // ── Semantic — Burgundy ──────────────────────────────────────────────────
  red:                '#7E152F',
  redSoft:            '#FDF2F4',          // Soft burgundy wash
  redBorder:          '#FDA4AF',          // Rose 300

  // ── Semantic — Blue / Sky Blue ───────────────────────────────────────────
  blue:               '#3B82F6',
  blueSoft:           '#DBEAFE',          // Blue 100
  blueBorder:         '#93C5FD',          // Blue 300

  // ── Semantic — Black ─────────────────────────────────────────────────────
  black:              '#120E10',

  // ── Semantic — Success — Emerald ─────────────────────────────────────────
  success:            '#10B981',
  successSoft:        '#D1FAE5',
  successBorder:      '#6EE7B7',

  // ── Semantic — Warning — Amber / Gold ────────────────────────────────────
  warning:            '#E2A93E',
  warningSoft:        '#FEF3C7',
  warningBorder:      '#FCD34D',

  // ── Semantic — Info ──────────────────────────────────────────────────────
  info:               '#7E152F',
  infoSoft:           '#FDF2F4',
  infoBorder:         '#FDA4AF',

  // ── Gradient stops ───────────────────────────────────────────────────────
  gradientStart:      '#7E152F',          // Burgundy start
  gradientEnd:        '#A82C48',          // Lighter wine red end
  gradientAccent:     '#E2A93E',          // Gold accent

  // ── Body text ────────────────────────────────────────────────────────────
  bodyText:           '#475569',          // Slate 600

  // ── Shadows ──────────────────────────────────────────────────────────────
  // Large-blur, low-opacity shadows for "airy" 3D feel
  shadow:             '#120E10',
  shadowStrong:       '#120E10',

  // ── Tint ─────────────────────────────────────────────────────────────────
  tint:               '#7E152F',          // Burgundy tint
};

const colors = {
  light: palette,
  radius: 8,               // 8px — clean institutional feel
};

export default colors;
