const visualizationRegionOptions = [
  { id: 'nationwide', title: '全国' },
  { id: 'east', title: '华东' },
  { id: 'south', title: '华南' },
  { id: 'north', title: '华北' },
]

const visualizationSourceTypeOptions = [
  { id: '巡检', title: '移动巡检' },
  { id: '驻场', title: '驻场工单' },
  { id: '告警', title: '设备告警' },
  { id: '派单', title: '人工派单' },
]

const insightRows = [
  {
    id: 'insight-001',
    regionId: 'east',
    regionTitle: '华东',
    sourceType: '巡检',
    sourceTypeTitle: '移动巡检',
    trendLabel: '任务量持续走高',
    trendValue: '+12.3%',
    completionRate: '97.6%',
    anomalyCount: 8,
    topRiskPoint: '苏州园区空调批次告警',
    updatedAt: '2026-04-28 10:20',
  },
  {
    id: 'insight-002',
    regionId: 'south',
    regionTitle: '华南',
    sourceType: '驻场',
    sourceTypeTitle: '驻场工单',
    trendLabel: '响应时长改善明显',
    trendValue: '-9.1%',
    completionRate: '95.2%',
    anomalyCount: 5,
    topRiskPoint: '深圳福田 UPS 电池波动',
    updatedAt: '2026-04-28 11:00',
  },
  {
    id: 'insight-003',
    regionId: 'north',
    regionTitle: '华北',
    sourceType: '告警',
    sourceTypeTitle: '设备告警',
    trendLabel: '高风险设备集中暴露',
    trendValue: '+6 台',
    completionRate: '93.8%',
    anomalyCount: 11,
    topRiskPoint: '北京核心机房温控告警',
    updatedAt: '2026-04-28 09:42',
  },
  {
    id: 'insight-004',
    regionId: 'nationwide',
    regionTitle: '全国',
    sourceType: '派单',
    sourceTypeTitle: '人工派单',
    trendLabel: '长尾工单持续收敛',
    trendValue: '-14.6%',
    completionRate: '96.1%',
    anomalyCount: 4,
    topRiskPoint: '临期备件补货延迟',
    updatedAt: '2026-04-27 18:35',
  },
]

function collectFilterValues(filters) {
  const values = {}

  for (const item of Array.isArray(filters) ? filters : []) {
    if (!item || typeof item !== 'object') continue

    const key =
      typeof item.id === 'string'
        ? item.id
        : typeof item.name === 'string'
          ? item.name
          : typeof item.key === 'string'
            ? item.key
            : ''

    if (!key) continue
    values[key] = item.value
  }

  return values
}

function includesText(value, keyword) {
  if (!keyword) return true
  return String(value ?? '').toLowerCase().includes(keyword.toLowerCase())
}

function normalizeDateKey(value) {
  if (value == null || value === '') return null

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'string') {
    const matchedDate = value.match(/\d{4}-\d{2}-\d{2}/)
    if (matchedDate) return matchedDate[0]

    const parsedTimestamp = Date.parse(value)
    if (Number.isNaN(parsedTimestamp)) return null
    return new Date(parsedTimestamp).toISOString().slice(0, 10)
  }

  if (typeof value === 'object') {
    if (typeof value.format === 'function') {
      return normalizeDateKey(value.format('YYYY-MM-DD'))
    }

    if (typeof value.toDate === 'function') {
      return normalizeDateKey(value.toDate())
    }

    if ('$d' in value) {
      return normalizeDateKey(value.$d)
    }
  }

  return null
}

function getTimeRangeBounds(value) {
  if (Array.isArray(value)) {
    return {
      startDate: normalizeDateKey(value[0]),
      endDate: normalizeDateKey(value[1]),
    }
  }

  if (typeof value === 'string' && value.includes('至')) {
    const [start, end] = value.split('至')
    return {
      startDate: normalizeDateKey(start?.trim()),
      endDate: normalizeDateKey(end?.trim()),
    }
  }

  const normalizedDate = normalizeDateKey(value)
  return {
    startDate: normalizedDate,
    endDate: normalizedDate,
  }
}

function isWithinDateRange(dateKey, startDate, endDate) {
  if (startDate && dateKey < startDate) return false
  if (endDate && dateKey > endDate) return false
  return true
}

function queryVisualizationInsightRows(params = {}) {
  const values = collectFilterValues(params.filters)
  const keyword = values.keyword != null ? String(values.keyword) : ''
  const regionId = values.regionId != null ? String(values.regionId) : ''
  const sourceType = values.sourceType != null ? String(values.sourceType) : ''
  const { startDate, endDate } = getTimeRangeBounds(values.timeRange)

  return insightRows.filter((row) => {
    const matchedRegion = !regionId || row.regionId === regionId
    const matchedSource = !sourceType || row.sourceType === sourceType
    const matchedTimeRange = isWithinDateRange(
      normalizeDateKey(row.updatedAt) ?? '',
      startDate,
      endDate
    )
    const keywordMatched =
      !keyword ||
      includesText(row.regionTitle, keyword) ||
      includesText(row.topRiskPoint, keyword) ||
      includesText(row.trendLabel, keyword)

    return matchedRegion && matchedSource && matchedTimeRange && keywordMatched
  })
}

export {
  queryVisualizationInsightRows,
  visualizationRegionOptions,
  visualizationSourceTypeOptions,
}
