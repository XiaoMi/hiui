export type SelectOption = {
  id: string
  title: string
}

export type DepartmentOption = SelectOption & {
  depth: number
  parentId?: string
  supported: boolean
}

export type StaffingBaseline = {
  departmentId: string
  sequenceId: string
  budgetHC: number
  employedCount: number
  startOfYearCount: number
}

export type WaitDemandRow = {
  id: string
  departmentId: string
  departmentTitle: string
  sequenceId: string
  sequenceTitle: string
  jobLevel: string
  positionTitle: string
  demandCount: number
  waitDemandCount: number
  screeningCount: number
  interviewingCount: number
  offerApprovalCount: number
  offerConfirmCount: number
  recruitmentDays: number
  resumePassed: number
  firstInvited: number
  interviewPass: number
  offerApproved: number
  offerAccepted: number
  joined: number
}

export type InFlightStatusKey =
  | 'pre_entry'
  | 'transfer_in'
  | 'transfer_out'
  | 'pre_leave'

export type InFlightRow = {
  id: string
  name: string
  departmentId: string
  departmentTitle: string
  sequenceId: string
  sequenceTitle: string
  jobLevel: string
  statusKey: InFlightStatusKey
  statusTitle: string
  effectiveDate: string
  highOffer: '是' | '否' | '-'
  transferReason: '活水' | '非活水' | '-'
}

export type OverviewFilters = {
  departmentId?: string
  jobLevel?: string
}

export type DetailFilters = OverviewFilters & {
  sequenceId?: string
}

type ConversionStageRate = {
  label: string
  rate: number
}

type ConversionInsight = {
  highest: string
  lowest: string
}

type OverviewMetric = {
  key: 'waiting' | 'inflight' | 'full_rate'
  title: string
  value: string
  subLabel: string
  subValue: string
  highlight?: 'danger'
}

export type OverviewRow = {
  entityId: string
  entityTitle: string
  entityType: 'department' | 'sequence'
  fullRate: number
  highLevelCount: number
  inflightCount: number
  statusKey: 'overstaffed' | 'slow' | 'healthy'
  statusLabel: string
  waitCount: number
}

export type OverviewData = {
  allowDepartmentTab: boolean
  conversionInsight: ConversionInsight
  defaultState: boolean
  emptyState: boolean
  funnelData: Array<{ stage: string; value: number }>
  fullRate: number
  fullRateCompare: number
  fullRateColor: string
  metrics: OverviewMetric[]
  progressRows: OverviewRow[]
  selectedDepartment: DepartmentOption
  selectedJobLevel: string
  stageRates: ConversionStageRate[]
  totalBudget: number
}

const yearProgress = 121 / 365

export const departmentOptions: DepartmentOption[] = [
  { id: 'group', title: '集团', depth: 0, supported: true },
  { id: 'smart-hardware', title: '智能硬件事业部', depth: 1, parentId: 'group', supported: true },
  { id: 'consumer-internet', title: '消费互联网事业部', depth: 1, parentId: 'group', supported: true },
  { id: 'platform-rd', title: '平台研发中心', depth: 2, parentId: 'smart-hardware', supported: true },
  { id: 'mi-home', title: '米家零售中心', depth: 2, parentId: 'smart-hardware', supported: true },
  { id: 'ecommerce-ops', title: '商业运营中心', depth: 2, parentId: 'consumer-internet', supported: true },
  { id: 'campus-talent', title: '校园招聘中心', depth: 2, parentId: 'consumer-internet', supported: true },
  {
    id: 'edge-ai-lab',
    title: '边缘智能实验室（四级，演示缺省态）',
    depth: 3,
    parentId: 'platform-rd',
    supported: false,
  },
]

export const jobLevelOptions: SelectOption[] = [
  { id: 'all', title: '全部职级' },
  { id: '12-', title: '12级-' },
  { id: '13', title: '13级' },
  { id: '14', title: '14级' },
  { id: '15', title: '15级' },
  { id: '16', title: '16级' },
  { id: '17', title: '17级' },
  { id: '18', title: '18级' },
  { id: '19', title: '19级' },
  { id: '20+', title: '20级+' },
  { id: 'none', title: '无职级' },
]

export const sequenceOptions: SelectOption[] = [
  { id: 'all', title: '全部序列' },
  { id: 'engineering', title: '技术序列' },
  { id: 'product', title: '产品序列' },
  { id: 'operations', title: '运营序列' },
  { id: 'sales', title: '销售序列' },
  { id: 'design', title: '设计序列' },
]

const sequenceTitleMap = Object.fromEntries(sequenceOptions.map((item) => [item.id, item.title]))
const departmentMap = Object.fromEntries(departmentOptions.map((item) => [item.id, item]))

export const staffingBaselines: StaffingBaseline[] = [
  { departmentId: 'platform-rd', sequenceId: 'engineering', budgetHC: 88, employedCount: 94, startOfYearCount: 82 },
  { departmentId: 'platform-rd', sequenceId: 'product', budgetHC: 24, employedCount: 20, startOfYearCount: 18 },
  { departmentId: 'mi-home', sequenceId: 'operations', budgetHC: 26, employedCount: 22, startOfYearCount: 18 },
  { departmentId: 'mi-home', sequenceId: 'sales', budgetHC: 48, employedCount: 43, startOfYearCount: 39 },
  { departmentId: 'ecommerce-ops', sequenceId: 'operations', budgetHC: 36, employedCount: 29, startOfYearCount: 24 },
  { departmentId: 'ecommerce-ops', sequenceId: 'sales', budgetHC: 42, employedCount: 38, startOfYearCount: 33 },
  { departmentId: 'campus-talent', sequenceId: 'operations', budgetHC: 18, employedCount: 13, startOfYearCount: 10 },
  { departmentId: 'campus-talent', sequenceId: 'design', budgetHC: 14, employedCount: 11, startOfYearCount: 9 },
]

export const waitDemandRows: WaitDemandRow[] = [
  {
    id: 'wait-001',
    positionTitle: '大模型平台研发工程师',
    jobLevel: '19',
    sequenceId: 'engineering',
    sequenceTitle: '技术序列',
    departmentId: 'platform-rd',
    departmentTitle: '平台研发中心',
    demandCount: 8,
    waitDemandCount: 5,
    screeningCount: 26,
    interviewingCount: 18,
    offerApprovalCount: 6,
    offerConfirmCount: 3,
    recruitmentDays: 34,
    resumePassed: 42,
    firstInvited: 26,
    interviewPass: 12,
    offerApproved: 6,
    offerAccepted: 3,
    joined: 2,
  },
  {
    id: 'wait-002',
    positionTitle: '组织效能产品经理',
    jobLevel: '17',
    sequenceId: 'product',
    sequenceTitle: '产品序列',
    departmentId: 'platform-rd',
    departmentTitle: '平台研发中心',
    demandCount: 4,
    waitDemandCount: 3,
    screeningCount: 14,
    interviewingCount: 8,
    offerApprovalCount: 2,
    offerConfirmCount: 1,
    recruitmentDays: 27,
    resumePassed: 21,
    firstInvited: 14,
    interviewPass: 6,
    offerApproved: 2,
    offerAccepted: 1,
    joined: 1,
  },
  {
    id: 'wait-003',
    positionTitle: '门店招聘运营',
    jobLevel: '15',
    sequenceId: 'operations',
    sequenceTitle: '运营序列',
    departmentId: 'mi-home',
    departmentTitle: '米家零售中心',
    demandCount: 10,
    waitDemandCount: 4,
    screeningCount: 24,
    interviewingCount: 13,
    offerApprovalCount: 5,
    offerConfirmCount: 4,
    recruitmentDays: 22,
    resumePassed: 36,
    firstInvited: 24,
    interviewPass: 11,
    offerApproved: 5,
    offerAccepted: 4,
    joined: 3,
  },
  {
    id: 'wait-004',
    positionTitle: '区域门店销售经理',
    jobLevel: '16',
    sequenceId: 'sales',
    sequenceTitle: '销售序列',
    departmentId: 'mi-home',
    departmentTitle: '米家零售中心',
    demandCount: 12,
    waitDemandCount: 5,
    screeningCount: 18,
    interviewingCount: 11,
    offerApprovalCount: 6,
    offerConfirmCount: 5,
    recruitmentDays: 29,
    resumePassed: 28,
    firstInvited: 18,
    interviewPass: 9,
    offerApproved: 6,
    offerAccepted: 5,
    joined: 4,
  },
  {
    id: 'wait-005',
    positionTitle: '商业增长运营',
    jobLevel: '14',
    sequenceId: 'operations',
    sequenceTitle: '运营序列',
    departmentId: 'ecommerce-ops',
    departmentTitle: '商业运营中心',
    demandCount: 7,
    waitDemandCount: 3,
    screeningCount: 20,
    interviewingCount: 12,
    offerApprovalCount: 6,
    offerConfirmCount: 5,
    recruitmentDays: 20,
    resumePassed: 29,
    firstInvited: 20,
    interviewPass: 11,
    offerApproved: 6,
    offerAccepted: 5,
    joined: 4,
  },
  {
    id: 'wait-006',
    positionTitle: '渠道销售 BP',
    jobLevel: '16',
    sequenceId: 'sales',
    sequenceTitle: '销售序列',
    departmentId: 'ecommerce-ops',
    departmentTitle: '商业运营中心',
    demandCount: 9,
    waitDemandCount: 4,
    screeningCount: 22,
    interviewingCount: 15,
    offerApprovalCount: 7,
    offerConfirmCount: 6,
    recruitmentDays: 24,
    resumePassed: 31,
    firstInvited: 22,
    interviewPass: 14,
    offerApproved: 7,
    offerAccepted: 6,
    joined: 5,
  },
  {
    id: 'wait-007',
    positionTitle: '校园招聘项目经理',
    jobLevel: '18',
    sequenceId: 'operations',
    sequenceTitle: '运营序列',
    departmentId: 'campus-talent',
    departmentTitle: '校园招聘中心',
    demandCount: 5,
    waitDemandCount: 2,
    screeningCount: 11,
    interviewingCount: 7,
    offerApprovalCount: 3,
    offerConfirmCount: 2,
    recruitmentDays: 18,
    resumePassed: 16,
    firstInvited: 11,
    interviewPass: 5,
    offerApproved: 3,
    offerAccepted: 2,
    joined: 1,
  },
  {
    id: 'wait-008',
    positionTitle: '招聘视觉设计师',
    jobLevel: '14',
    sequenceId: 'design',
    sequenceTitle: '设计序列',
    departmentId: 'campus-talent',
    departmentTitle: '校园招聘中心',
    demandCount: 3,
    waitDemandCount: 2,
    screeningCount: 8,
    interviewingCount: 4,
    offerApprovalCount: 2,
    offerConfirmCount: 1,
    recruitmentDays: 16,
    resumePassed: 12,
    firstInvited: 8,
    interviewPass: 3,
    offerApproved: 2,
    offerAccepted: 1,
    joined: 0,
  },
]

export const inflightRows: InFlightRow[] = [
  {
    id: 'flight-001',
    name: '苏晗',
    departmentId: 'platform-rd',
    departmentTitle: '平台研发中心',
    sequenceId: 'engineering',
    sequenceTitle: '技术序列',
    jobLevel: '19',
    statusKey: 'pre_entry',
    statusTitle: '预入职',
    effectiveDate: '2026-05-14',
    highOffer: '是',
    transferReason: '-',
  },
  {
    id: 'flight-002',
    name: '陈序',
    departmentId: 'platform-rd',
    departmentTitle: '平台研发中心',
    sequenceId: 'product',
    sequenceTitle: '产品序列',
    jobLevel: '17',
    statusKey: 'pre_entry',
    statusTitle: '预入职',
    effectiveDate: '2026-05-18',
    highOffer: '否',
    transferReason: '-',
  },
  {
    id: 'flight-003',
    name: '王栩',
    departmentId: 'mi-home',
    departmentTitle: '米家零售中心',
    sequenceId: 'operations',
    sequenceTitle: '运营序列',
    jobLevel: '15',
    statusKey: 'transfer_in',
    statusTitle: '预转入',
    effectiveDate: '2026-05-08',
    highOffer: '-',
    transferReason: '活水',
  },
  {
    id: 'flight-004',
    name: '卢舟',
    departmentId: 'mi-home',
    departmentTitle: '米家零售中心',
    sequenceId: 'sales',
    sequenceTitle: '销售序列',
    jobLevel: '16',
    statusKey: 'pre_entry',
    statusTitle: '预入职',
    effectiveDate: '2026-05-11',
    highOffer: '否',
    transferReason: '-',
  },
  {
    id: 'flight-005',
    name: '沈星',
    departmentId: 'ecommerce-ops',
    departmentTitle: '商业运营中心',
    sequenceId: 'operations',
    sequenceTitle: '运营序列',
    jobLevel: '14',
    statusKey: 'transfer_out',
    statusTitle: '预转出',
    effectiveDate: '2026-05-06',
    highOffer: '-',
    transferReason: '非活水',
  },
  {
    id: 'flight-006',
    name: '李冉',
    departmentId: 'ecommerce-ops',
    departmentTitle: '商业运营中心',
    sequenceId: 'sales',
    sequenceTitle: '销售序列',
    jobLevel: '16',
    statusKey: 'pre_leave',
    statusTitle: '预离职',
    effectiveDate: '2026-05-21',
    highOffer: '否',
    transferReason: '-',
  },
  {
    id: 'flight-007',
    name: '周澈',
    departmentId: 'campus-talent',
    departmentTitle: '校园招聘中心',
    sequenceId: 'operations',
    sequenceTitle: '运营序列',
    jobLevel: '18',
    statusKey: 'pre_entry',
    statusTitle: '预入职',
    effectiveDate: '2026-05-10',
    highOffer: '否',
    transferReason: '-',
  },
  {
    id: 'flight-008',
    name: '何芃',
    departmentId: 'campus-talent',
    departmentTitle: '校园招聘中心',
    sequenceId: 'design',
    sequenceTitle: '设计序列',
    jobLevel: '14',
    statusKey: 'transfer_in',
    statusTitle: '预转入',
    effectiveDate: '2026-05-16',
    highOffer: '-',
    transferReason: '活水',
  },
]

export function getDepartmentOption(id?: string | null) {
  return departmentMap[id ?? 'group'] ?? departmentMap.group
}

export function getSequenceTitle(id?: string | null) {
  return sequenceTitleMap[id ?? 'all'] ?? sequenceTitleMap.all
}

export function getJobLevelTitle(id?: string | null) {
  return jobLevelOptions.find((item) => item.id === (id ?? 'all'))?.title ?? '全部职级'
}

export function isHighLevel(jobLevel: string) {
  return jobLevel === '19' || jobLevel === '20+'
}

function getChildren(parentId: string) {
  return departmentOptions.filter((item) => item.parentId === parentId)
}

function getDescendantIds(parentId: string) {
  const result = new Set<string>([parentId])

  const walk = (currentId: string) => {
    getChildren(currentId).forEach((child) => {
      result.add(child.id)
      walk(child.id)
    })
  }

  walk(parentId)
  return result
}

function matchesDepartmentScope(targetId: string, selectedDepartmentId: string) {
  return getDescendantIds(selectedDepartmentId).has(targetId)
}

function matchesJobLevel(targetLevel: string, selectedJobLevel: string) {
  if (!selectedJobLevel || selectedJobLevel === 'all') return true
  return targetLevel === selectedJobLevel
}

function sumBy<T>(list: T[], getter: (item: T) => number) {
  return list.reduce((total, item) => total + getter(item), 0)
}

function stageRate(numerator: number, denominator: number) {
  if (!denominator) return 0
  return numerator / denominator
}

function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`
}

function formatSignedPercent(value: number, digits = 1) {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(digits)}pt`
}

function getParentComparisonDepartment(selectedDepartmentId: string) {
  const selectedDepartment = getDepartmentOption(selectedDepartmentId)

  if (!selectedDepartment.parentId) return getDepartmentOption('group')
  return getDepartmentOption(selectedDepartment.parentId)
}

function getScopedBaselines(filters: OverviewFilters) {
  const departmentId = filters.departmentId ?? 'group'
  return staffingBaselines.filter((item) => matchesDepartmentScope(item.departmentId, departmentId))
}

function getScopedWaitRows(filters: OverviewFilters) {
  const departmentId = filters.departmentId ?? 'group'
  const jobLevel = filters.jobLevel ?? 'all'

  return waitDemandRows.filter(
    (item) =>
      matchesDepartmentScope(item.departmentId, departmentId) &&
      matchesJobLevel(item.jobLevel, jobLevel)
  )
}

function getScopedInFlightRows(filters: OverviewFilters) {
  const departmentId = filters.departmentId ?? 'group'
  const jobLevel = filters.jobLevel ?? 'all'

  return inflightRows.filter(
    (item) =>
      matchesDepartmentScope(item.departmentId, departmentId) &&
      matchesJobLevel(item.jobLevel, jobLevel)
  )
}

function getAggregateValues(filters: OverviewFilters) {
  const baselines = getScopedBaselines(filters)
  const waiting = getScopedWaitRows(filters)
  const inflight = getScopedInFlightRows(filters)

  const totalBudget = sumBy(baselines, (item) => item.budgetHC)
  const employedCount = sumBy(baselines, (item) => item.employedCount)
  const startOfYearCount = sumBy(baselines, (item) => item.startOfYearCount)
  const positiveInFlight = inflight.filter(
    (item) => item.statusKey === 'pre_entry' || item.statusKey === 'transfer_in'
  ).length
  const negativeInFlight = inflight.filter(
    (item) => item.statusKey === 'transfer_out' || item.statusKey === 'pre_leave'
  ).length
  const inflightCount = positiveInFlight - negativeInFlight
  const waitingCount = totalBudget - employedCount - inflightCount
  const highLevelWaiting = sumBy(
    waiting.filter((item) => isHighLevel(item.jobLevel)),
    (item) => item.waitDemandCount
  )
  const highLevelInFlight = inflight.filter(
    (item) =>
      isHighLevel(item.jobLevel) &&
      (item.statusKey === 'pre_entry' || item.statusKey === 'transfer_in')
  ).length
  const fullRate = totalBudget ? (employedCount / totalBudget) * 100 : 0
  const fullRateCompareBase = getParentComparisonDepartment(filters.departmentId ?? 'group')
  const comparison = (() => {
    if ((filters.departmentId ?? 'group') === 'group') {
      return 98.2
    }

    const parentValues = getAggregateValues({
      departmentId: fullRateCompareBase.id,
      jobLevel: filters.jobLevel,
    })

    return parentValues.fullRate
  })()

  return {
    comparison,
    employedCount,
    fullRate,
    highLevelInFlight,
    highLevelWaiting,
    inflight,
    inflightCount,
    startOfYearCount,
    totalBudget,
    waiting,
    waitingCount,
  }
}

function buildProgressRows(filters: OverviewFilters, dimension: 'department' | 'sequence') {
  const selectedDepartment = getDepartmentOption(filters.departmentId)
  const scopedWaitRows = getScopedWaitRows(filters)
  const scopedInFlightRows = getScopedInFlightRows(filters)
  const baselineRows = getScopedBaselines(filters)

  const buckets =
    dimension === 'department'
      ? selectedDepartment.depth >= 2
        ? []
        : getChildren(selectedDepartment.id).filter((item) => item.supported)
      : sequenceOptions.filter((item) => item.id !== 'all')

  const rows = buckets
    .map((bucket) => {
      const rowKey = bucket.id
      const bucketDepartmentIds =
        dimension === 'department' ? getDescendantIds(rowKey) : null
      const baselineForBucket = baselineRows.filter((item) =>
        dimension === 'department'
          ? bucketDepartmentIds?.has(item.departmentId)
          : item.sequenceId === rowKey
      )
      const waitForBucket = scopedWaitRows.filter((item) =>
        dimension === 'department'
          ? bucketDepartmentIds?.has(item.departmentId)
          : item.sequenceId === rowKey
      )
      const inflightForBucket = scopedInFlightRows.filter((item) =>
        dimension === 'department'
          ? bucketDepartmentIds?.has(item.departmentId)
          : item.sequenceId === rowKey
      )

      const totalBudget = sumBy(baselineForBucket, (item) => item.budgetHC)
      const employedCount = sumBy(baselineForBucket, (item) => item.employedCount)
      const startOfYearCount = sumBy(baselineForBucket, (item) => item.startOfYearCount)
      const positiveInFlight = inflightForBucket.filter(
        (item) => item.statusKey === 'pre_entry' || item.statusKey === 'transfer_in'
      ).length
      const negativeInFlight = inflightForBucket.filter(
        (item) => item.statusKey === 'transfer_out' || item.statusKey === 'pre_leave'
      ).length
      const inflightCount = positiveInFlight - negativeInFlight
      const waitCount = totalBudget - employedCount - inflightCount
      const fullRate = totalBudget ? (employedCount / totalBudget) * 100 : 0
      const highLevelCount =
        sumBy(
          waitForBucket.filter((item) => isHighLevel(item.jobLevel)),
          (item) => item.waitDemandCount
        ) +
        inflightForBucket.filter(
          (item) =>
            isHighLevel(item.jobLevel) &&
            (item.statusKey === 'pre_entry' || item.statusKey === 'transfer_in')
        ).length
      const targetGapBase = Math.max(totalBudget - startOfYearCount, 1)
      const slowScore = waitCount / targetGapBase
      const statusKey =
        waitCount < 0 ? 'overstaffed' : slowScore > 1 - yearProgress ? 'slow' : 'healthy'

      return {
        entityId: rowKey,
        entityTitle: bucket.title,
        entityType: dimension,
        fullRate,
        highLevelCount,
        inflightCount,
        statusKey,
        statusLabel:
          statusKey === 'overstaffed'
            ? '超编'
            : statusKey === 'slow'
              ? '缓慢'
              : '正常',
        waitCount,
      } satisfies OverviewRow
    })
    .filter((item) => item.entityId && (item.waitCount !== 0 || item.inflightCount !== 0))

  const statusWeight = {
    overstaffed: 3,
    healthy: 2,
    slow: 1,
  }

  return rows.sort((left, right) => {
    if (statusWeight[left.statusKey] !== statusWeight[right.statusKey]) {
      return statusWeight[right.statusKey] - statusWeight[left.statusKey]
    }

    return left.entityTitle.localeCompare(right.entityTitle, 'zh-Hans-CN')
  })
}

function buildStageRates(filters: OverviewFilters) {
  const scopedWaitRows = getScopedWaitRows(filters)
  const resumePassed = sumBy(scopedWaitRows, (item) => item.resumePassed)
  const firstInvited = sumBy(scopedWaitRows, (item) => item.firstInvited)
  const interviewPass = sumBy(scopedWaitRows, (item) => item.interviewPass)
  const offerApproved = sumBy(scopedWaitRows, (item) => item.offerApproved)
  const offerAccepted = sumBy(scopedWaitRows, (item) => item.offerAccepted)
  const joined = sumBy(scopedWaitRows, (item) => item.joined)

  return [
    { label: '简历筛选通过→一面邀请', rate: stageRate(firstInvited, resumePassed) },
    { label: '一面邀请→面试通过', rate: stageRate(interviewPass, firstInvited) },
    { label: '面试通过→offer审批通过', rate: stageRate(offerApproved, interviewPass) },
    { label: 'offer审批通过→offer接受', rate: stageRate(offerAccepted, offerApproved) },
    { label: 'offer接受→入职', rate: stageRate(joined, offerAccepted) },
  ]
}

function buildConversionInsight(filters: OverviewFilters): ConversionInsight {
  const selectedDepartment = getDepartmentOption(filters.departmentId)
  const stageRates = buildStageRates(filters)
  const lowest = [...stageRates].sort((left, right) => left.rate - right.rate)[0]
  const highest = [...stageRates].sort((left, right) => right.rate - left.rate)[0]

  const comparisonBase =
    selectedDepartment.id === 'group'
      ? buildStageRates({ departmentId: 'group', jobLevel: 'all' })
      : buildStageRates({
          departmentId: getParentComparisonDepartment(selectedDepartment.id).id,
          jobLevel: filters.jobLevel,
        })

  const findComparison = (label: string) => comparisonBase.find((item) => item.label === label)?.rate ?? 0

  const scopedWaitRows = getScopedWaitRows(filters)
  const rowByDepartment = departmentOptions
    .filter((item) => item.depth === 2 && matchesDepartmentScope(item.id, selectedDepartment.id))
    .map((item) => {
      const rows = scopedWaitRows.filter((row) => row.departmentId === item.id)
      const resumePassed = sumBy(rows, (row) => row.resumePassed)
      const firstInvited = sumBy(rows, (row) => row.firstInvited)
      return {
        rate: stageRate(firstInvited, resumePassed),
        title: item.title,
      }
    })
    .filter((item) => item.rate > 0)
    .sort((left, right) => left.rate - right.rate)

  const rowByJobLevel = jobLevelOptions
    .filter((item) => item.id !== 'all')
    .map((item) => {
      const rows = scopedWaitRows.filter((row) => row.jobLevel === item.id)
      const resumePassed = sumBy(rows, (row) => row.resumePassed)
      const firstInvited = sumBy(rows, (row) => row.firstInvited)
      return {
        rate: stageRate(firstInvited, resumePassed),
        title: item.title,
      }
    })
    .filter((item) => item.rate > 0)
    .sort((left, right) => left.rate - right.rate)

  const departmentClause =
    selectedDepartment.depth >= 2 || rowByDepartment.length === 0
      ? ''
      : `，其中${rowByDepartment[0].title}最低(${formatPercent(rowByDepartment[0].rate * 100)})`

  const levelClause =
    rowByJobLevel.length === 0
      ? ''
      : `、${rowByJobLevel[0].title}最低(${formatPercent(rowByJobLevel[0].rate * 100)})`

  return {
    highest: `${highest.label}转化率(${formatPercent(highest.rate * 100)})最高，较上级${formatSignedPercent(
      (highest.rate - findComparison(highest.label)) * 100
    )}`,
    lowest: `${lowest.label}转化率(${formatPercent(lowest.rate * 100)})最低，较上级${formatSignedPercent(
      (lowest.rate - findComparison(lowest.label)) * 100
    )}${departmentClause}${levelClause}`,
  }
}

function buildFunnelData(filters: OverviewFilters) {
  const scopedWaitRows = getScopedWaitRows(filters)

  return [
    { stage: '简历筛选通过 / 一面邀请', value: sumBy(scopedWaitRows, (item) => item.resumePassed) },
    { stage: '一面通过', value: sumBy(scopedWaitRows, (item) => item.firstInvited) },
    { stage: '面试通过', value: sumBy(scopedWaitRows, (item) => item.interviewPass) },
    { stage: 'offer审批通过', value: sumBy(scopedWaitRows, (item) => item.offerApproved) },
    { stage: 'offer接受', value: sumBy(scopedWaitRows, (item) => item.offerAccepted) },
    { stage: '入职', value: sumBy(scopedWaitRows, (item) => item.joined) },
  ]
}

export function getOverviewData(
  filters: OverviewFilters,
  dimension: 'department' | 'sequence'
): OverviewData {
  const selectedDepartment = getDepartmentOption(filters.departmentId)

  if (!selectedDepartment.supported) {
    return {
      allowDepartmentTab: false,
      conversionInsight: { highest: '', lowest: '' },
      defaultState: true,
      emptyState: false,
      funnelData: [],
      fullRate: 0,
      fullRateColor: '#2660FF',
      fullRateCompare: 0,
      metrics: [],
      progressRows: [],
      selectedDepartment,
      selectedJobLevel: filters.jobLevel ?? 'all',
      stageRates: [],
      totalBudget: 0,
    }
  }

  const aggregate = getAggregateValues(filters)
  const progressRows = buildProgressRows(filters, dimension)
  const stageRates = buildStageRates(filters)
  const conversionInsight = buildConversionInsight(filters)
  const metrics: OverviewMetric[] = [
    {
      key: 'waiting',
      title: '待招人数',
      value: String(aggregate.waitingCount),
      subLabel: '高招',
      subValue: String(aggregate.highLevelWaiting),
      highlight: aggregate.waitingCount < 0 ? 'danger' : undefined,
    },
    {
      key: 'inflight',
      title: '在途人数',
      value: String(aggregate.inflightCount),
      subLabel: '高招',
      subValue: String(aggregate.highLevelInFlight),
    },
    {
      key: 'full_rate',
      title: '预算满编率',
      value: formatPercent(aggregate.fullRate, 2),
      subLabel: '较上级',
      subValue: formatPercent(aggregate.comparison, 2),
      highlight: aggregate.fullRate > 100 ? 'danger' : undefined,
    },
  ]

  return {
    allowDepartmentTab: selectedDepartment.depth < 2,
    conversionInsight,
    defaultState: false,
    emptyState: progressRows.length === 0,
    funnelData: buildFunnelData(filters),
    fullRate: aggregate.fullRate,
    fullRateColor: aggregate.fullRate > 100 ? '#FA4646' : '#2660FF',
    fullRateCompare: aggregate.comparison,
    metrics,
    progressRows,
    selectedDepartment,
    selectedJobLevel: filters.jobLevel ?? 'all',
    stageRates,
    totalBudget: aggregate.totalBudget,
  }
}

export function getAvailableDepartmentOptions(baseDepartmentId?: string | null) {
  const selectedDepartment = getDepartmentOption(baseDepartmentId)
  const descendantIds = getDescendantIds(selectedDepartment.id)

  return [
    { id: selectedDepartment.id, title: selectedDepartment.title },
    ...departmentOptions
      .filter(
        (item) =>
          item.id !== selectedDepartment.id &&
          item.supported &&
          descendantIds.has(item.id)
      )
      .map((item) => ({ id: item.id, title: item.title })),
  ]
}

export function getWaitDetailRows(filters: DetailFilters, scopeType?: string | null, scopeId?: string | null) {
  const departmentId = filters.departmentId ?? 'group'
  const sequenceId = filters.sequenceId ?? 'all'
  const jobLevel = filters.jobLevel ?? 'all'

  return waitDemandRows
    .filter((item) => matchesDepartmentScope(item.departmentId, departmentId))
    .filter((item) => sequenceId === 'all' || item.sequenceId === sequenceId)
    .filter((item) => matchesJobLevel(item.jobLevel, jobLevel))
    .filter((item) => {
      if (!scopeType || !scopeId) return true
      return scopeType === 'department' ? item.departmentId === scopeId : item.sequenceId === scopeId
    })
}

export function getWaitDetailSummary(
  filters: DetailFilters,
  scopeType?: string | null,
  scopeId?: string | null
) {
  const rows = getWaitDetailRows(filters, scopeType, scopeId)

  return {
    openDemandCount: sumBy(rows, (item) => item.demandCount - item.joined),
    totalWaiting: sumBy(rows, (item) => item.waitDemandCount),
  }
}

export function getInFlightRows(
  filters: DetailFilters,
  statusKey: InFlightStatusKey | 'all',
  scopeType?: string | null,
  scopeId?: string | null
) {
  const departmentId = filters.departmentId ?? 'group'
  const sequenceId = filters.sequenceId ?? 'all'
  const jobLevel = filters.jobLevel ?? 'all'

  return inflightRows
    .filter((item) => matchesDepartmentScope(item.departmentId, departmentId))
    .filter((item) => sequenceId === 'all' || item.sequenceId === sequenceId)
    .filter((item) => matchesJobLevel(item.jobLevel, jobLevel))
    .filter((item) => statusKey === 'all' || item.statusKey === statusKey)
    .filter((item) => {
      if (!scopeType || !scopeId) return true
      return scopeType === 'department' ? item.departmentId === scopeId : item.sequenceId === scopeId
    })
    .sort((left, right) => {
      const levelDiff = getJobLevelRank(right.jobLevel) - getJobLevelRank(left.jobLevel)
      if (levelDiff !== 0) return levelDiff
      return left.effectiveDate.localeCompare(right.effectiveDate)
    })
}

export function getJobLevelRank(jobLevel: string) {
  if (jobLevel === '20+') return 20.5
  if (jobLevel === '12-') return 12
  if (jobLevel === 'none') return 0
  return Number(jobLevel)
}

export function getStatusType(statusKey: OverviewRow['statusKey']) {
  if (statusKey === 'overstaffed') return 'danger'
  if (statusKey === 'slow') return 'warning'
  return 'success'
}

export function getInFlightTagType(statusKey: InFlightStatusKey) {
  if (statusKey === 'transfer_out' || statusKey === 'pre_leave') return 'danger'
  return 'primary'
}

export function buildDetailInitialFilters(search: URLSearchParams) {
  const departmentId = search.get('departmentId') ?? 'group'
  const scopeType = search.get('scopeType')
  const scopeId = search.get('scopeId')

  return {
    departmentId: scopeType === 'department' && scopeId ? scopeId : departmentId,
    jobLevel: search.get('jobLevel') ?? 'all',
    sequenceId: scopeType === 'sequence' && scopeId ? scopeId : 'all',
  }
}

export function buildOverviewInitialFilters(search: URLSearchParams) {
  return {
    departmentId: search.get('departmentId') ?? 'group',
    jobLevel: search.get('jobLevel') ?? 'all',
  }
}
