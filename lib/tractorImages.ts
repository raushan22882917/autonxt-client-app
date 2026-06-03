import type { ImageSourcePropType } from 'react-native';

const X45H2B = require('@/assets/tractors/X45H2B.png');
const X45H2R = require('@/assets/tractors/X45H2R.png');
const X45H4B = require('@/assets/tractors/X45H4B.png');
const X45H4R = require('@/assets/tractors/X45H4R.png');
const X60H2B = require('@/assets/tractors/X60H2B.png');
const X60H2R = require('@/assets/tractors/X60H2R.png');
const X60H4B = require('@/assets/tractors/X60H4B.png');
const X60H4R = require('@/assets/tractors/X60H4R.png');
const X20H2B = require('@/assets/tractors/X20H2B.png');
const X25H4B = require('@/assets/tractors/X25H4B.png');
const X25H4R = require('@/assets/tractors/X25H4R.png');
const X35H2B = require('@/assets/tractors/X35H2B.png');

export const defaultTractorImage = require('@/assets/images/tractor.png');

const AUTONXT_IMG = (path: string) =>
  `https://www.autonxt.in/_next/image?url=${encodeURIComponent(path)}&w=3840&q=75`;

const IMPLEMENT_TYPE_IMAGE_RULES: { test: RegExp; src: string }[] = [
  { test: /\bdouble\s*pin\b/i, src: AUTONXT_IMG('/product/double_pin.jpg') },
  { test: /\bgeneral\b/i, src: '' },
  { test: /\bhaulage\b/i, src: AUTONXT_IMG('/product/haulage.jpg') },
  { test: /\b(?:grabber|graber)\s*14\b/i, src: AUTONXT_IMG('/product/14_feet_graber_bucket.jpg') },
  { test: /\bloader\s*14\b/i, src: AUTONXT_IMG('/product/14_feet_loader_bucket.jpg') },
  { test: /\bloader\s*16\b/i, src: AUTONXT_IMG('/product/16_feet_loader_bucket.jpg') },
  { test: /\bloader\s*17\b/i, src: AUTONXT_IMG('/product/17_feet_loader_bucket.jpg') },
  { test: /\bindustry\b/i, src: '' },
  { test: /\b(?:grabber|graber)\s*18\b/i, src: AUTONXT_IMG('/product/18_feet_graber_bucket.jpg') },
  { test: /\bloader\s*18\b/i, src: AUTONXT_IMG('/product/18_feet_loader_bucket.jpg') },
  {
    test: /\bcatcher\s*18\b|\b18\s*(?:feet|ft)?\s*catcher\b/i,
    src: AUTONXT_IMG('/product/18_feet_catcher.jpg'),
  },
  {
    test: /18\s*(?:feet|ft|')\s*catcher\b|catcher.*\b18\s*(?:feet|ft)/i,
    src: AUTONXT_IMG('/product/18_feet_catcher.jpg'),
  },
  {
    test: /18\s*(?:feet|ft|')\s*(?:graber|grabber)\s*bucket\b/i,
    src: AUTONXT_IMG('/product/18_feet_graber_bucket.jpg'),
  },
  {
    test: /18\s*(?:feet|ft|')\s*loader(?:\s*bucket)?\b/i,
    src: AUTONXT_IMG('/product/18_feet_loader_bucket.jpg'),
  },
];

const imageMapping: Record<string, number> = {
  X45H2B,
  X45H2R,
  X45H4B,
  X45H4R,
  X60H2B,
  X60H2R,
  X60H4B,
  X60H4R,
  X20H2B,
  X25H4B,
  X25H4R,
  X35H2B,
};

const modelAlias: Record<string, string> = {
  X45C2: 'X45H2',
  X45C4: 'X45H4',
};

export function getImplementTypeImageUrl(label: string): string | undefined {
  const t = label.trim();
  if (!t) return undefined;
  for (const rule of IMPLEMENT_TYPE_IMAGE_RULES) {
    if (rule.test.test(t)) return rule.src || undefined;
  }
  return undefined;
}

export function getImplementFeetLabel(label: string): string | null {
  const t = label.trim();
  if (!t || t === 'Not specified') return null;

  const explicit = t.match(/\b(\d+)\s*(?:feet|ft|')\b/i);
  if (explicit) return `${explicit[1]} ft`;

  const afterType = t.match(/\b(?:loader|grabber|graber|catcher)\s*(\d+)\b/i);
  if (afterType) return `${afterType[1]} ft`;

  const leading = t.match(/^(\d+)\s*(?:feet|ft)?\s*(?:loader|grabber|graber|catcher)\b/i);
  if (leading) return `${leading[1]} ft`;

  return null;
}

export function getTractorImageByModelKey(key: string): number | undefined {
  const k = key.trim().toUpperCase();
  return imageMapping[k];
}

export function getTractorImageAsset(
  model?: string | null,
  color?: string | null
): number | undefined {
  if (!model || !color) return undefined;

  const normalizedModel = modelAlias[model.toUpperCase()] || model.toUpperCase();
  const redColors = ['RED', 'BLAZING_RED', 'BLAZING_RED_CANOPY'];
  const colorKey = redColors.includes(color.toUpperCase()) ? 'R' : 'B';
  const key = `${normalizedModel}${colorKey}`;

  return imageMapping[key];
}

export type TractorImageFields = {
  model?: string | null;
  color?: string | null;
  currentImplement?: string | null;
};

/** Resolve model+color asset, implement type URL, or model-key asset for list/detail rows. */
export function getTractorListRowImageSource(tractor: TractorImageFields): ImageSourcePropType | null {
  const primary = getTractorImageAsset(tractor.model, tractor.color);
  if (primary) return primary;

  const impl = tractor.currentImplement?.trim();
  if (impl) {
    const fromImplementType = getImplementTypeImageUrl(impl);
    if (fromImplementType) return { uri: fromImplementType };
    const fromImplement = getTractorImageByModelKey(impl);
    if (fromImplement) return fromImplement;
  }

  if (tractor.model) {
    const fromModel = getTractorImageByModelKey(tractor.model);
    if (fromModel) return fromModel;
  }

  return null;
}
