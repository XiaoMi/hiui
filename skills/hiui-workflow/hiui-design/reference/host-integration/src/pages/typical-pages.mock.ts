import type { TreeDataItem } from '@hi-ui/tree'
import type { GetDataSourceParamsType } from '@hi-ui/schema-core'
import { toValues } from '@hiui-design/typical-page-shells/pro-list-page/hooks/use-fetch-list'

type SelectOption = {
  id: string
  title: string
}

type PagedResponse<T> = {
  list: T[]
  total: number
  current: number
  pageSize: number
}

function includesText(value: string | undefined, keyword: string) {
  if (!keyword) return true
  return (value ?? '').toLowerCase().includes(keyword.toLowerCase())
}

function buildPagedResponse<T>(list: T[], params: GetDataSourceParamsType): PagedResponse<T> {
  const current = params.pagination?.current ?? 1
  const pageSize = params.pagination?.pageSize ?? 20
  const start = (current - 1) * pageSize

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    current,
    pageSize,
  }
}

function countTreeNodes<T extends { children?: T[] }>(list: T[]): number {
  return list.reduce((count, item) => count + 1 + countTreeNodes(item.children ?? []), 0)
}

type TableStatOverviewItem = {
  title: string
  value: number
}

export type TableStatRow = {
  id: string
  engineerName: string
  timeRange: string
  createCount: number
  signCount: number
  completeCount: number
  rejectCount: number
  cancelCount: number
  cancelBeforeSignCount: number
  cancelAfterSignCount: number
  cancelRebuildCount: number
}

const tableStatOverview: TableStatOverviewItem[] = [
  { title: '建单量', value: 1248 },
  { title: '签收量', value: 1096 },
  { title: '业务完成量', value: 972 },
  { title: '不予受理量', value: 41 },
  { title: '取消量', value: 133 },
]

const tableStatRows: TableStatRow[] = [
  {
    id: 'e-001',
    engineerName: '张晨',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 138,
    signCount: 126,
    completeCount: 117,
    rejectCount: 3,
    cancelCount: 12,
    cancelBeforeSignCount: 5,
    cancelAfterSignCount: 4,
    cancelRebuildCount: 3,
  },
  {
    id: 'e-002',
    engineerName: '李岩',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 122,
    signCount: 118,
    completeCount: 103,
    rejectCount: 5,
    cancelCount: 11,
    cancelBeforeSignCount: 4,
    cancelAfterSignCount: 3,
    cancelRebuildCount: 4,
  },
  {
    id: 'e-003',
    engineerName: '王硕',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 114,
    signCount: 102,
    completeCount: 91,
    rejectCount: 2,
    cancelCount: 10,
    cancelBeforeSignCount: 3,
    cancelAfterSignCount: 4,
    cancelRebuildCount: 3,
  },
]

export const engineerOptions: SelectOption[] = [
  { id: 'e-001', title: '张晨' },
  { id: 'e-002', title: '李岩' },
  { id: 'e-003', title: '王硕' },
]

export async function getTableStatOverview() {
  return { list: tableStatOverview }
}

export function queryTableStatRows(params: GetDataSourceParamsType) {
  const { engineerId, keyword } = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])

  return tableStatRows.filter((row) => {
    const engineerMatched = !engineerId || row.id === engineerId
    const keywordMatched = !keyword || includesText(row.engineerName, String(keyword))
    return engineerMatched && keywordMatched
  })
}

export async function getTableStatList(params: GetDataSourceParamsType) {
  return buildPagedResponse(queryTableStatRows(params), params)
}

export type BasicUserRow = {
  id: string
  userName: string
  miTalkId: string
  phone: string
  email: string
  roleId: string
  roleTitle: string
  positionId: string
  positionTitle: string
  organizationId: string
  organizationTitle: string
  userStatus: string
  userStatusTitle: string
  updatedAt: string
}

export const basicUserRoleOptions: SelectOption[] = [
  { id: 'field', title: '一线工程师' },
  { id: 'lead', title: '组长' },
  { id: 'qc', title: '质检' },
]

export const basicUserPositionOptions: SelectOption[] = [
  { id: 'door', title: '上门工程师' },
  { id: 'station', title: '驻场工程师' },
  { id: 'dispatcher', title: '调度专员' },
]

export const basicUserOrganizationOptions: SelectOption[] = [
  { id: 'bj', title: '北京服务中心' },
  { id: 'sh', title: '上海服务中心' },
  { id: 'gz', title: '广州服务中心' },
]

export const basicUserStatusOptions: SelectOption[] = [
  { id: 'enabled', title: '在岗' },
  { id: 'paused', title: '停岗' },
  { id: 'training', title: '培训中' },
]

const basicUserSeedRows: BasicUserRow[] = [
  {
    id: 'user-001',
    userName: '张晨',
    miTalkId: 'zc_service',
    phone: '13800000001',
    email: 'zhangchen@example.com',
    roleId: 'field',
    roleTitle: '一线工程师',
    positionId: 'door',
    positionTitle: '上门工程师',
    organizationId: 'bj',
    organizationTitle: '北京服务中心',
    userStatus: 'enabled',
    userStatusTitle: '在岗',
    updatedAt: '2026-04-18 09:30',
  },
  {
    id: 'user-002',
    userName: '李岩',
    miTalkId: 'liyan_ops',
    phone: '13800000002',
    email: 'liyan@example.com',
    roleId: 'lead',
    roleTitle: '组长',
    positionId: 'station',
    positionTitle: '驻场工程师',
    organizationId: 'sh',
    organizationTitle: '上海服务中心',
    userStatus: 'enabled',
    userStatusTitle: '在岗',
    updatedAt: '2026-04-17 17:20',
  },
  {
    id: 'user-003',
    userName: '王硕',
    miTalkId: 'wangshuo_qc',
    phone: '13800000003',
    email: 'wangshuo@example.com',
    roleId: 'qc',
    roleTitle: '质检',
    positionId: 'dispatcher',
    positionTitle: '调度专员',
    organizationId: 'gz',
    organizationTitle: '广州服务中心',
    userStatus: 'training',
    userStatusTitle: '培训中',
    updatedAt: '2026-04-16 11:45',
  },
  {
    id: 'user-004',
    userName: '赵冉',
    miTalkId: 'zhaoran_field',
    phone: '13800000004',
    email: 'zhaoran@example.com',
    roleId: 'field',
    roleTitle: '一线工程师',
    positionId: 'door',
    positionTitle: '上门工程师',
    organizationId: 'sh',
    organizationTitle: '上海服务中心',
    userStatus: 'paused',
    userStatusTitle: '停岗',
    updatedAt: '2026-04-15 14:10',
  },
  {
    id: 'user-005',
    userName: '陈柯',
    miTalkId: 'chenke_station',
    phone: '13800000005',
    email: 'chenke@example.com',
    roleId: 'field',
    roleTitle: '一线工程师',
    positionId: 'station',
    positionTitle: '驻场工程师',
    organizationId: 'bj',
    organizationTitle: '北京服务中心',
    userStatus: 'enabled',
    userStatusTitle: '在岗',
    updatedAt: '2026-04-14 18:05',
  },
]

const basicUserRows: BasicUserRow[] = Array.from({ length: 100 }, (_, index) => {
  const source = basicUserSeedRows[index % basicUserSeedRows.length]
  const sequence = index + 1
  const sequenceText = String(sequence).padStart(3, '0')

  return {
    ...source,
    id: `user-${sequenceText}`,
    miTalkId: `${source.miTalkId}_${sequenceText}`,
    phone: `139${String(sequence).padStart(8, '0')}`,
    email: `user${sequenceText}@example.com`,
    updatedAt: `2026-04-${String(18 - (index % 10)).padStart(2, '0')} ${String(
      9 + (index % 9)
    ).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
  }
})

export function queryBasicTableRows(params: GetDataSourceParamsType) {
  const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
  const keyword = values.keyword != null ? String(values.keyword) : ''

  return basicUserRows.filter((row) => {
    const keywordMatched =
      !keyword ||
      includesText(row.userName, keyword) ||
      includesText(row.miTalkId, keyword) ||
      includesText(row.phone, keyword)

    return (
      keywordMatched &&
      (!values.roleId || row.roleId === values.roleId) &&
        (!values.organizationId || row.organizationId === values.organizationId) &&
        (!values.userStatus || row.userStatus === values.userStatus)
    )
  })
}

export async function getBasicTableList(params: GetDataSourceParamsType) {
  return buildPagedResponse(queryBasicTableRows(params), params)
}

export type OrgTreeTableRow = {
  id: string
  departmentName: string
  deptStatus: 'enabled' | 'disabled'
  departmentDuty: string
  managerId: string
  managerName: string
  memberCount: number
  organizationId: string
  organizationTitle: string
  departmentDesc: string
  children?: OrgTreeTableRow[]
}

export const managerOptions: SelectOption[] = [
  { id: 'm-001', title: '张晨' },
  { id: 'm-002', title: '李岩' },
  { id: 'm-003', title: '王硕' },
]

const orgTreeTableRows: OrgTreeTableRow[] = [
  {
    id: 'dept-001',
    departmentName: '华北服务中心',
    deptStatus: 'enabled',
    departmentDuty: '负责北京、天津、河北区域服务履约',
    managerId: 'm-001',
    managerName: '张晨',
    memberCount: 36,
    organizationId: 'bj',
    organizationTitle: '北京服务中心',
    departmentDesc: '统一负责华北区域现场服务排班、工程师管理和质量闭环',
    children: [
      {
        id: 'dept-001-1',
        departmentName: '北京上门组',
        deptStatus: 'enabled',
        departmentDuty: '承接北京市区上门维修工单',
        managerId: 'm-001',
        managerName: '张晨',
        memberCount: 14,
        organizationId: 'bj',
        organizationTitle: '北京服务中心',
        departmentDesc: '覆盖海淀、朝阳、丰台等重点城区',
      },
      {
        id: 'dept-001-2',
        departmentName: '华北质检组',
        deptStatus: 'disabled',
        departmentDuty: '负责服务录音、照片与回访抽检',
        managerId: 'm-003',
        managerName: '王硕',
        memberCount: 6,
        organizationId: 'bj',
        organizationTitle: '北京服务中心',
        departmentDesc: '当前并入全国质检专项项目，常态编制暂停',
      },
    ],
  },
  {
    id: 'dept-002',
    departmentName: '华东服务中心',
    deptStatus: 'enabled',
    departmentDuty: '负责华东区域驻场与门店支持',
    managerId: 'm-002',
    managerName: '李岩',
    memberCount: 28,
    organizationId: 'sh',
    organizationTitle: '上海服务中心',
    departmentDesc: '聚焦门店驻场和高峰期支援调度',
    children: [
      {
        id: 'dept-002-1',
        departmentName: '上海驻场组',
        deptStatus: 'enabled',
        departmentDuty: '驻场服务、门店客诉兜底',
        managerId: 'm-002',
        managerName: '李岩',
        memberCount: 12,
        organizationId: 'sh',
        organizationTitle: '上海服务中心',
        departmentDesc: '重点覆盖旗舰店和高客流门店',
      },
    ],
  },
]

function filterOrgTreeRows(list: OrgTreeTableRow[], values: Record<string, unknown>) {
  const keyword = values.keyword != null ? String(values.keyword) : ''

  return list.flatMap((item) => {
    const children = item.children ? filterOrgTreeRows(item.children, values) : []
    const selfMatched =
      (!values.managerId || item.managerId === values.managerId) &&
      (!values.organizationId || item.organizationId === values.organizationId) &&
      (!keyword ||
        includesText(item.departmentName, keyword) ||
        includesText(item.departmentDuty, keyword) ||
        includesText(item.departmentDesc, keyword))

    if (selfMatched) return [{ ...item, children }]
    if (children.length > 0) return [{ ...item, children }]
    return []
  })
}

export function queryOrgTreeTableRows(params: GetDataSourceParamsType) {
  const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
  return filterOrgTreeRows(orgTreeTableRows, values)
}

export async function getOrgTreeTableList(params: GetDataSourceParamsType) {
  const list = queryOrgTreeTableRows(params)
  return {
    list,
    total: countTreeNodes(list),
    current: params.pagination?.current ?? 1,
    pageSize: params.pagination?.pageSize ?? 20,
  }
}

export const itemAttrOptions: SelectOption[] = [
  { id: '成品', title: '成品' },
  { id: '备件', title: '备件' },
  { id: '耗材', title: '耗材' },
]

export const conditionOptions: SelectOption[] = [
  { id: '全新', title: '全新' },
  { id: '良品', title: '良品' },
  { id: '残次', title: '残次' },
]

export const materialCategoryTree: TreeDataItem[] = [
  {
    id: 'root-device',
    title: '整机',
    children: [
      { id: 'phone', title: '手机' },
      { id: 'pad', title: '平板' },
    ],
  },
  {
    id: 'root-part',
    title: '配件',
    children: [
      { id: 'screen', title: '屏幕' },
      { id: 'battery', title: '电池' },
      { id: 'charger', title: '充电器' },
    ],
  },
]

export const materialDefaultExpandedIds = ['root-device', 'root-part']

export type InventoryRow = {
  id: string
  categoryId: string
  index: number
  name: string
  code: string
  unit: string
  serialManaged: '是' | '否'
  itemAttr: string
  conditionGrade: string
  amount: string
}

const inventoryRows: InventoryRow[] = [
  {
    id: 'item-001',
    categoryId: 'phone',
    index: 1,
    name: 'Xiaomi 16 Pro 展示机',
    code: 'PHONE-001',
    unit: '台',
    serialManaged: '是',
    itemAttr: '成品',
    conditionGrade: '全新',
    amount: '4,999',
  },
  {
    id: 'item-002',
    categoryId: 'pad',
    index: 2,
    name: 'Xiaomi Pad 8',
    code: 'PAD-008',
    unit: '台',
    serialManaged: '是',
    itemAttr: '成品',
    conditionGrade: '良品',
    amount: '2,699',
  },
  {
    id: 'item-003',
    categoryId: 'screen',
    index: 3,
    name: '旗舰机型显示屏',
    code: 'PART-SCR-16',
    unit: '片',
    serialManaged: '否',
    itemAttr: '备件',
    conditionGrade: '全新',
    amount: '899',
  },
  {
    id: 'item-004',
    categoryId: 'battery',
    index: 4,
    name: '高压电池模组',
    code: 'PART-BAT-03',
    unit: '块',
    serialManaged: '否',
    itemAttr: '备件',
    conditionGrade: '良品',
    amount: '299',
  },
  {
    id: 'item-005',
    categoryId: 'charger',
    index: 5,
    name: '67W 快充头',
    code: 'ACC-CHG-67',
    unit: '个',
    serialManaged: '否',
    itemAttr: '耗材',
    conditionGrade: '残次',
    amount: '129',
  },
]

function collectCategoryIds(nodes: TreeDataItem[], targetId: string): string[] | null {
  for (const node of nodes) {
    const nodeId = node.id == null ? '' : String(node.id)
    if (nodeId === targetId) {
      return [nodeId, ...collectNestedCategoryIds(node.children ?? [])]
    }

    const childMatches = collectCategoryIds(node.children ?? [], targetId)
    if (childMatches) return childMatches
  }

  return null
}

function collectNestedCategoryIds(nodes: TreeDataItem[]): string[] {
  return nodes.flatMap((node) => {
    const nodeId = node.id == null ? [] : [String(node.id)]
    return [...nodeId, ...collectNestedCategoryIds(node.children ?? [])]
  })
}

export function createInventoryRowQuery(getCategoryId: () => string | null) {
  return function queryInventoryRows(params: GetDataSourceParamsType) {
    const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
    const keyword = values.keyword != null ? String(values.keyword) : ''
    const categoryId = getCategoryId()
    const categoryIds =
      categoryId == null ? null : new Set(collectCategoryIds(materialCategoryTree, categoryId) ?? [categoryId])

    return inventoryRows.filter((item) => {
      const keywordMatched =
        !keyword || includesText(item.name, keyword) || includesText(item.code, keyword)

      return (
        keywordMatched &&
        (!categoryIds || categoryIds.has(item.categoryId)) &&
        (!values.itemAttr || item.itemAttr === values.itemAttr) &&
        (!values.conditionGrade || item.conditionGrade === values.conditionGrade)
      )
    })
  }
}

export function createInventoryListRequest(getCategoryId: () => string | null) {
  const queryInventoryRows = createInventoryRowQuery(getCategoryId)

  return async function getInventoryList(params: GetDataSourceParamsType) {
    return buildPagedResponse(queryInventoryRows(params), params)
  }
}

export type DrawerUserDetailData = {
  userName: string
  miTalkId: string
  phone: string
  email: string
  roleTitle: string
  positionTitle: string
  organizationTitle: string
  entryDate: string
  userStatusTitle: string
  remark: string
}

const drawerUserDetail: DrawerUserDetailData = {
  userName: '张晨',
  miTalkId: 'zc_service',
  phone: '13800000001',
  email: 'zhangchen@example.com',
  roleTitle: '一线工程师',
  positionTitle: '上门工程师',
  organizationTitle: '北京服务中心',
  entryDate: '2024-06-18',
  userStatusTitle: '在岗',
  remark: '负责重点城区履约，近三个月服务完成率保持在 95% 以上。',
}

export async function getDrawerUserDetail() {
  return drawerUserDetail
}

export const ticketStatusOptions: SelectOption[] = [
  { id: 'pending', title: '待受理' },
  { id: 'processing', title: '处理中' },
  { id: 'completed', title: '已完成' },
]

export const ticketTypeOptions: SelectOption[] = [
  { id: 'repair', title: '维修工单' },
  { id: 'install', title: '安装工单' },
  { id: 'consult', title: '咨询工单' },
]

export const serviceMethodOptions: SelectOption[] = [
  { id: 'door', title: '上门服务' },
  { id: 'station', title: '到店服务' },
  { id: 'remote', title: '远程协助' },
]

export const purchaseChannelOptions: SelectOption[] = [
  { id: 'mi-mall', title: '小米商城' },
  { id: 'jd', title: '京东' },
  { id: 'offline', title: '线下门店' },
]

export const userTagOptions: SelectOption[] = [
  { id: 'vip', title: '多次来访' },
  { id: 'member', title: '会员用户' },
  { id: 'new', title: '新用户' },
]

export const serviceOrgOptions: SelectOption[] = [
  { id: 'bj-door', title: '北京上门中心' },
  { id: 'sh-store', title: '上海门店中心' },
  { id: 'gz-remote', title: '广州远程中心' },
]

export const serviceEngineerOptions: SelectOption[] = [
  { id: 'eng-001', title: '张晨' },
  { id: 'eng-002', title: '李岩' },
  { id: 'eng-003', title: '王硕' },
]

const workOrderEditDetail = {
  ticketNo: 'WO20260418001',
  status: 'processing',
  ticketType: 'repair',
  serviceMethod: 'door',
  relatedProduct: 'Xiaomi 16 Pro',
  purchaseChannel: 'mi-mall',
  warrantyStart: '2025-08-01',
  warrantyEnd: '2027-08-01',
  visitReason: '整机无法正常开机',
  userName: '赵冉',
  userTags: ['vip', 'member'],
  userPhone: '13900000088',
  serviceOrg: 'bj-door',
  serviceEngineer: 'eng-001',
  acceptedAt: '2026-04-17 15:20:00',
  description: '此处展示示例描述信息，可能会比较长，超出是内容换行展示',
}

export async function getWorkOrderEditDetail() {
  return workOrderEditDetail
}

export async function submitExampleWorkOrder(formData: Record<string, unknown>) {
  return {
    status: 'success',
    action: 'submit',
    formData,
  }
}

export async function stashExampleWorkOrder(formData: Record<string, unknown>) {
  return {
    status: 'success',
    action: 'stash',
    formData,
  }
}

export async function getWorkOrderDetail() {
  return {
    basicInfo: {
      ticketNo: 'WO20260418001',
      status: '处理中',
      ticketType: '维修工单',
      serviceMethod: '上门服务',
      relatedProduct: 'Xiaomi 16 Pro',
      purchaseChannel: '小米商城',
      visitReason: '整机无法正常开机',
    },
    warrantyInfo: [
      {
        type: '退货',
        remainingDays: 2,
        startAt: '2026-04-16',
        endAt: '2026-04-22',
      },
      {
        type: '换货',
        remainingDays: 9,
        startAt: '2026-04-16',
        endAt: '2026-04-30',
      },
      {
        type: '维修',
        remainingDays: 469,
        startAt: '2025-08-01',
        endAt: '2027-08-01',
      },
    ],
    customerInfo: {
      userName: '赵冉',
      userTags: '多次来访 / 会员用户',
      userPhone: '13900000088',
    },
    serviceInfo: {
      serviceOrg: '北京上门中心',
      serviceEngineer: '张晨',
      acceptedAt: '2026-04-17 15:20:00',
      description: '此处展示示例描述信息，可能会比较长，超出是内容换行展示',
    },
    serviceRecords: [
      {
        id: 'record-001',
        serviceTime: '2026-04-17 15:20:00',
        serviceAction: '受理工单',
        status: '已完成',
        detailDescription: '客服已完成工单受理，并同步用户诉求与设备信息。',
      },
      {
        id: 'record-002',
        serviceTime: '2026-04-18 09:30:00',
        serviceAction: '上门检测',
        status: '处理中',
        detailDescription: '工程师已预约上门检测，待同步备件库存后继续处理。',
      },
    ],
  }
}
