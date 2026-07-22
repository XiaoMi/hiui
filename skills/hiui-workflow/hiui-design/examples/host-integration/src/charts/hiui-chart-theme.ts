export const hiuiChartTokens = {
  primary: '#2660FF',
  primaryAlt: '#3C7BFF',
  primaryHover: '#4D82FF',
  primaryAltSoft: '#5E83FF',
  primaryMedium: '#618BFF',
  primaryAltMuted: '#7FA7FF',
  primaryLight: '#8DABFF',
  primarySubtle: '#B9CBFF',
  primaryPressed: '#1843D2',
  primaryWash: '#EDF2FF',
  primaryWashStrong: '#E5ECFF',
  accent: '#746BFF',
  accentSoft: '#9B95FF',
  accentMuted: '#A7A2FF',
  success: '#24B237',
  successAlt: '#63BE5D',
  successLight: '#58C667',
  successSoft: '#8DDA93',
  successWash: '#BDEBBE',
  successPressed: '#0F5E31',
  successDarker: '#17753A',
  successStrong: '#1E8E42',
  successDeep: '#167A3E',
  warning: '#FFBD0A',
  warningLight: '#FFD34D',
  danger: '#FA4646',
  info: '#03C1AC',
  infoAlt: '#15B3A6',
  infoSoft: '#74D2C8',
  infoDeep: '#028D84',
  text: '#1A1D26',
  textSecondary: '#4E5969',
  textTertiary: '#60636B',
  textMeta: '#91959E',
  border: '#E5E6EB',
  surface: '#FFFFFF',
  surfaceSubtle: '#F2F3F5',
}

export const hiuiCategoricalPalette = [
  hiuiChartTokens.primary,
  hiuiChartTokens.info,
  hiuiChartTokens.accent,
  hiuiChartTokens.warning,
  hiuiChartTokens.success,
  hiuiChartTokens.primaryHover,
]

export const hiuiDistinctCategoricalPalette = [
  ...hiuiCategoricalPalette,
  hiuiChartTokens.infoDeep,
  hiuiChartTokens.accentSoft,
  hiuiChartTokens.successDeep,
  hiuiChartTokens.textMeta,
]

export const hiuiSequentialBluePalette = [
  hiuiChartTokens.primaryWashStrong,
  hiuiChartTokens.primarySubtle,
  hiuiChartTokens.primaryLight,
  hiuiChartTokens.primaryMedium,
  hiuiChartTokens.primary,
  hiuiChartTokens.primaryPressed,
]

export const hiuiSequentialGreenPalette = [
  hiuiChartTokens.successPressed,
  hiuiChartTokens.successDarker,
  hiuiChartTokens.successStrong,
  hiuiChartTokens.success,
  hiuiChartTokens.successLight,
  hiuiChartTokens.successSoft,
  hiuiChartTokens.successWash,
]

export const hiuiCartesianAxis = {
  x: {
    line: true,
    lineLineWidth: 1,
    lineStroke: hiuiChartTokens.border,
    lineStrokeOpacity: 1,
    labelAutoHide: true,
    labelAutoRotate: false,
    tick: false,
  },
  y: {
    grid: true,
    gridLineDash: [0, 0],
    gridLineWidth: 1,
    gridStroke: hiuiChartTokens.border,
    gridStrokeOpacity: 0.9,
  },
} as const

export const hiuiBandPadding = {
  paddingInner: 0.5,
  paddingOuter: 0.5,
} as const

export const hiuiColumnGapPadding = 2 / 3

export const hiuiColumnBandPadding = {
  paddingInner: hiuiColumnGapPadding,
  paddingOuter: hiuiColumnGapPadding,
} as const

export const hiuiBarMaxWidth = 8

export const hiuiRadarAxis = {
  x: {
    line: true,
    lineLineWidth: 1,
    lineStroke: hiuiChartTokens.border,
    lineStrokeOpacity: 1,
    tick: false,
  },
  y: {
    line: true,
    lineLineWidth: 1,
    lineStroke: hiuiChartTokens.border,
    lineStrokeOpacity: 0.9,
    grid: true,
    gridLineDash: [0, 0],
    gridLineWidth: 1,
    gridStroke: hiuiChartTokens.border,
    gridStrokeOpacity: 0.9,
    tick: false,
  },
} as const

const hiuiColorFallbackPalette = [
  hiuiChartTokens.primaryAlt,
  hiuiChartTokens.infoAlt,
  hiuiChartTokens.primaryAltSoft,
  hiuiChartTokens.successAlt,
  hiuiChartTokens.warningLight,
  hiuiChartTokens.primaryAltMuted,
  hiuiChartTokens.infoSoft,
  hiuiChartTokens.accentMuted,
]

const semanticColorMap = {
  baseline: hiuiChartTokens.textMeta,
  info: hiuiChartTokens.info,
  main: hiuiChartTokens.primary,
  negative: hiuiChartTokens.danger,
  positive: hiuiChartTokens.success,
  warning: hiuiChartTokens.warning,
}

export function resolveHiuiSeriesColor(key: string) {
  return semanticColorMap[key as keyof typeof semanticColorMap] ?? hiuiChartTokens.primary
}

function dedupeColors(range: string[]) {
  return range.filter((color, index) => range.indexOf(color) === index)
}

function dedupeStrings(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) === index)
}

function normalizeHiuiColorDomain(domain: Array<string | number | null | undefined>) {
  return dedupeStrings(
    domain
      .map((value) => String(value ?? '').trim())
      .filter(Boolean)
  )
}

function buildHiuiCategoricalRange(domain: string[], range: string[]) {
  const palette = dedupeColors([
    ...range,
    ...hiuiColorFallbackPalette,
    ...hiuiDistinctCategoricalPalette,
    ...hiuiCategoricalPalette,
  ])

  if (domain.length <= palette.length) {
    return palette.slice(0, Math.max(domain.length, 1))
  }

  return domain.map((_, index) => palette[index % palette.length])
}

export function pickHiuiUniqueColors(
  count: number,
  palette = hiuiDistinctCategoricalPalette
) {
  return dedupeColors([...palette, ...hiuiColorFallbackPalette]).slice(0, Math.max(count, 1))
}

export function createHiuiColorScale(
  range = hiuiCategoricalPalette,
  extraScale: Record<string, unknown> = {}
) {
  const colorScale = (extraScale.color as Record<string, unknown> | undefined) ?? {}

  return {
    ...extraScale,
    color: {
      ...colorScale,
      range: dedupeColors(range),
    },
  }
}

export function createHiuiCategoricalDomainScale(
  domain: Array<string | number | null | undefined>,
  range = hiuiCategoricalPalette,
  extraScale: Record<string, unknown> = {}
) {
  const normalizedDomain = normalizeHiuiColorDomain(domain)
  const colorScale = (extraScale.color as Record<string, unknown> | undefined) ?? {}

  return createHiuiColorScale(buildHiuiCategoricalRange(normalizedDomain, range), {
    ...extraScale,
    color: {
      ...colorScale,
      domain: normalizedDomain,
    },
  })
}

export function createHiuiBandColorScale(
  range = hiuiCategoricalPalette,
  axis: 'x' | 'y' = 'x'
) {
  return createHiuiColorScale(range, {
    [axis]: hiuiBandPadding,
  })
}

function mergeHiuiBandScale(
  baseScale: Record<string, unknown>,
  axis: 'x' | 'y',
  bandPadding: typeof hiuiBandPadding
) {
  const axisScale = (baseScale[axis] as Record<string, unknown> | undefined) ?? {}

  return {
    ...baseScale,
    [axis]: {
      ...axisScale,
      ...bandPadding,
    },
  }
}

export function createHiuiColumnLikeScale(axis: 'x' | 'y' = 'x') {
  return {
    [axis]: hiuiColumnBandPadding,
  }
}

export function createHiuiColumnLikeColorScale(
  range = hiuiCategoricalPalette,
  axis: 'x' | 'y' = 'x'
) {
  return createHiuiColorScale(range, createHiuiColumnLikeScale(axis))
}

export function withHiuiColumnLikeChart(
  config: Record<string, unknown>,
  axis: 'x' | 'y' = 'x'
) {
  const baseScale = (config.scale as Record<string, unknown> | undefined) ?? {}

  return withHiuiResponsiveChart({
    ...config,
    scale: mergeHiuiBandScale(baseScale, axis, hiuiColumnBandPadding),
  })
}

export function createHiuiBarLikeScale(axis: 'x' | 'y' = 'x') {
  return {
    [axis]: hiuiBandPadding,
  }
}

export function createHiuiBarLikeColorScale(
  range = hiuiCategoricalPalette,
  axis: 'x' | 'y' = 'x'
) {
  return createHiuiColorScale(range, createHiuiBarLikeScale(axis))
}

export function withHiuiBarLikeChart(
  config: Record<string, unknown>,
  axis: 'x' | 'y' = 'x'
) {
  const baseScale = (config.scale as Record<string, unknown> | undefined) ?? {}

  return withHiuiResponsiveChart({
    ...config,
    scale: mergeHiuiBandScale(baseScale, axis, hiuiBandPadding),
  })
}

export function createHiuiSingleSeriesScale() {
  return createHiuiColorScale([resolveHiuiSeriesColor('main')])
}

export function withHiuiResponsiveChart(config: Record<string, unknown>) {
  return {
    autoFit: true,
    theme: hiuiChartTheme,
    ...config,
  }
}

export function withHiuiMiniChart(config: Record<string, unknown>) {
  return withHiuiResponsiveChart({
    axis: false,
    inset: 0,
    legend: false,
    margin: 0,
    padding: 0,
    tooltip: false,
    ...config,
  })
}

export const hiuiChartTheme = {
  type: 'classic',
  axis: {
    gridStroke: hiuiChartTokens.border,
    labelFill: hiuiChartTokens.textTertiary,
    lineStroke: hiuiChartTokens.border,
    tickStroke: hiuiChartTokens.border,
    titleFill: hiuiChartTokens.textSecondary,
  },
  legend: {
    itemLabelFill: hiuiChartTokens.textSecondary,
  },
  tooltip: {
    containerFill: hiuiChartTokens.surface,
    containerStroke: hiuiChartTokens.border,
    labelFill: hiuiChartTokens.textSecondary,
    titleFill: hiuiChartTokens.text,
    valueFill: hiuiChartTokens.text,
  },
}
