import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import {
  Button,
  Card,
  EmptyState,
  Message,
  PageHeader,
  Space,
  Table,
  Tag,
  Tabs,
} from '@hi-ui/hiui'
import { SearchInput } from '@hi-ui/query-filter'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import { renderTableTextEllipsis } from '@hiui-design/typical-page-shells/pro-table-page'
import { proTreeSplitPageStyles } from '@hiui-design/typical-page-shells/pro-tree-split-page'
import styles from './sale-management.module.scss'

type OrderStatusKey =
  | 'pending_hq_review'
  | 'warehouse_processing'
  | 'creating'
  | 'create_failed'
  | 'rejected'
  | 'completed'

type DetailStatusKey =
  | 'all'
  | 'pending_warehouse'
  | 'pending_sampling'
  | 'pending_shipment'
  | 'completed'

type SaleItemRow = {
  id: string
  saleOrderNo: string
  statusKey: Exclude<DetailStatusKey, 'all'>
  statusLabel: string
  organizationInfo: string
  itemInfo: string
  condition: string
  quantity: number
  amount: number
}

type SaleOrder = {
  id: string
  saleOrderNo: string
  saleOrderName: string
  applyNo: string
  applicant: string
  applyTime: string
  applyDepartment: string
  statusKey: OrderStatusKey
  statusLabel: string
  organizationCount: number
  goodsCount: number
  totalAmount: number
  rows: SaleItemRow[]
}

type StatusOption<T extends string> = {
  key: T
  label: string
}

const SPLIT_STORAGE_KEY = 'example-sale-management-left-width'

const listStatusOptions: StatusOption<OrderStatusKey>[] = [
  { key: 'pending_hq_review', label: '待总部审核' },
  { key: 'warehouse_processing', label: '仓库处理中' },
  { key: 'creating', label: '创建中' },
  { key: 'create_failed', label: '创建失败' },
  { key: 'rejected', label: '审核驳回' },
  { key: 'completed', label: '已完成' },
]

const detailStatusOptions: StatusOption<DetailStatusKey>[] = [
  { key: 'all', label: '全部' },
  { key: 'pending_warehouse', label: '待仓库处理' },
  { key: 'pending_sampling', label: '待驻厂抽检' },
  { key: 'pending_shipment', label: '待仓库发货' },
  { key: 'completed', label: '已完成' },
]

const seedSaleOrders: SaleOrder[] = [
  {
    id: 'sale-001',
    saleOrderNo: 'SM202604290001',
    saleOrderName: '4月华东直营门店售卖单',
    applyNo: 'AP202604290021',
    applicant: '李哲',
    applyTime: '2026-04-29 09:25',
    applyDepartment: '华东销售运营部',
    statusKey: 'pending_hq_review',
    statusLabel: '待总部审核',
    organizationCount: 18,
    goodsCount: 126,
    totalAmount: 486320,
    rows: [
      {
        id: 'sale-001-row-1',
        saleOrderNo: 'SM202604290001-01',
        statusKey: 'pending_warehouse',
        statusLabel: '待仓库处理',
        organizationInfo: '上海徐汇旗舰店 / SH-XH-01',
        itemInfo: '智能门锁 D6 Pro / 深空灰',
        condition: '全新',
        quantity: 12,
        amount: 45600,
      },
      {
        id: 'sale-001-row-2',
        saleOrderNo: 'SM202604290001-02',
        statusKey: 'pending_sampling',
        statusLabel: '待驻厂抽检',
        organizationInfo: '苏州工业园店 / SZ-GY-03',
        itemInfo: '智能摄像机 C3 / 夜视版',
        condition: '全新',
        quantity: 20,
        amount: 31800,
      },
      {
        id: 'sale-001-row-3',
        saleOrderNo: 'SM202604290001-03',
        statusKey: 'pending_shipment',
        statusLabel: '待仓库发货',
        organizationInfo: '杭州滨江体验店 / HZ-BJ-05',
        itemInfo: '空气净化器 A9 / 标准套装',
        condition: '全新',
        quantity: 8,
        amount: 22880,
      },
      {
        id: 'sale-001-row-4',
        saleOrderNo: 'SM202604290001-04',
        statusKey: 'completed',
        statusLabel: '已完成',
        organizationInfo: '宁波天一门店 / NB-TY-02',
        itemInfo: '智能台灯 L2 / 珍珠白',
        condition: '全新',
        quantity: 16,
        amount: 9440,
      },
    ],
  },
  {
    id: 'sale-002',
    saleOrderNo: 'SM202604280007',
    saleOrderName: '华北渠道周转售卖单',
    applyNo: 'AP202604280045',
    applicant: '王敏',
    applyTime: '2026-04-28 16:40',
    applyDepartment: '华北渠道发展部',
    statusKey: 'warehouse_processing',
    statusLabel: '仓库处理中',
    organizationCount: 12,
    goodsCount: 94,
    totalAmount: 365780,
    rows: [
      {
        id: 'sale-002-row-1',
        saleOrderNo: 'SM202604280007-01',
        statusKey: 'pending_warehouse',
        statusLabel: '待仓库处理',
        organizationInfo: '北京朝阳门店 / BJ-CY-02',
        itemInfo: '净水器 P8 / 厨下版',
        condition: '全新',
        quantity: 10,
        amount: 56800,
      },
      {
        id: 'sale-002-row-2',
        saleOrderNo: 'SM202604280007-02',
        statusKey: 'pending_shipment',
        statusLabel: '待仓库发货',
        organizationInfo: '天津滨海店 / TJ-BH-01',
        itemInfo: '扫地机器人 S5 / 黑金款',
        condition: '九五新',
        quantity: 15,
        amount: 70500,
      },
      {
        id: 'sale-002-row-3',
        saleOrderNo: 'SM202604280007-03',
        statusKey: 'completed',
        statusLabel: '已完成',
        organizationInfo: '石家庄中心店 / SJZ-ZX-04',
        itemInfo: '宠物净味器 P1 / 青雾绿',
        condition: '全新',
        quantity: 30,
        amount: 25500,
      },
    ],
  },
  {
    id: 'sale-003',
    saleOrderNo: 'SM202604270011',
    saleOrderName: '西南门店新品铺货售卖单',
    applyNo: 'AP202604270019',
    applicant: '周楠',
    applyTime: '2026-04-27 14:12',
    applyDepartment: '西南零售事业部',
    statusKey: 'creating',
    statusLabel: '创建中',
    organizationCount: 9,
    goodsCount: 58,
    totalAmount: 214900,
    rows: [
      {
        id: 'sale-003-row-1',
        saleOrderNo: 'SM202604270011-01',
        statusKey: 'pending_warehouse',
        statusLabel: '待仓库处理',
        organizationInfo: '成都高新店 / CD-GX-06',
        itemInfo: '美容仪 B2 / 光感版',
        condition: '全新',
        quantity: 18,
        amount: 37800,
      },
      {
        id: 'sale-003-row-2',
        saleOrderNo: 'SM202604270011-02',
        statusKey: 'pending_sampling',
        statusLabel: '待驻厂抽检',
        organizationInfo: '重庆观音桥店 / CQ-GYQ-02',
        itemInfo: '便携咖啡机 C1 / 标准版',
        condition: '全新',
        quantity: 12,
        amount: 15960,
      },
    ],
  },
  {
    id: 'sale-004',
    saleOrderNo: 'SM202604260004',
    saleOrderName: '华南售卖补货单',
    applyNo: 'AP202604260033',
    applicant: '陈朗',
    applyTime: '2026-04-26 10:05',
    applyDepartment: '华南销售管理部',
    statusKey: 'create_failed',
    statusLabel: '创建失败',
    organizationCount: 7,
    goodsCount: 36,
    totalAmount: 138640,
    rows: [
      {
        id: 'sale-004-row-1',
        saleOrderNo: 'SM202604260004-01',
        statusKey: 'pending_warehouse',
        statusLabel: '待仓库处理',
        organizationInfo: '深圳万象城店 / SZ-WXC-08',
        itemInfo: '空气炸锅 F2 / 轻享版',
        condition: '全新',
        quantity: 14,
        amount: 11480,
      },
    ],
  },
  {
    id: 'sale-005',
    saleOrderNo: 'SM202604250002',
    saleOrderName: '东北售卖试点单',
    applyNo: 'AP202604250010',
    applicant: '赵婧',
    applyTime: '2026-04-25 11:36',
    applyDepartment: '东北区域运营中心',
    statusKey: 'rejected',
    statusLabel: '审核驳回',
    organizationCount: 5,
    goodsCount: 21,
    totalAmount: 82400,
    rows: [
      {
        id: 'sale-005-row-1',
        saleOrderNo: 'SM202604250002-01',
        statusKey: 'pending_sampling',
        statusLabel: '待驻厂抽检',
        organizationInfo: '沈阳中街店 / SY-ZJ-03',
        itemInfo: '取暖器 H3 / 冬季款',
        condition: '全新',
        quantity: 9,
        amount: 9720,
      },
    ],
  },
  {
    id: 'sale-006',
    saleOrderNo: 'SM202604240009',
    saleOrderName: '总部直播渠道售卖单',
    applyNo: 'AP202604240027',
    applicant: '许航',
    applyTime: '2026-04-24 15:48',
    applyDepartment: '总部直播电商部',
    statusKey: 'completed',
    statusLabel: '已完成',
    organizationCount: 24,
    goodsCount: 168,
    totalAmount: 628900,
    rows: [
      {
        id: 'sale-006-row-1',
        saleOrderNo: 'SM202604240009-01',
        statusKey: 'completed',
        statusLabel: '已完成',
        organizationInfo: '总部直播仓 / HQ-LIVE-01',
        itemInfo: '无线吸尘器 V10 / 套装',
        condition: '全新',
        quantity: 32,
        amount: 108800,
      },
      {
        id: 'sale-006-row-2',
        saleOrderNo: 'SM202604240009-02',
        statusKey: 'completed',
        statusLabel: '已完成',
        organizationInfo: '总部直播仓 / HQ-LIVE-01',
        itemInfo: '即热饮水机 W5 / 冰热版',
        condition: '全新',
        quantity: 26,
        amount: 67600,
      },
    ],
  },
]

function createPendingReviewOrder(sequence: number): SaleOrder {
  const orderNumber = `SM20260429${String(sequence).padStart(4, '0')}`
  const applyNumber = `AP20260429${String(sequence + 20).padStart(4, '0')}`
  const departmentPool = [
    '华东销售运营部',
    '华北渠道发展部',
    '西南零售事业部',
    '华南销售管理部',
    '新零售业务中心',
  ]
  const applicantPool = ['李哲', '王敏', '周楠', '陈朗', '赵婧', '许航', '韩璐', '高宁']
  const itemPool = [
    '智能门锁 D6 Pro / 深空灰',
    '智能摄像机 C3 / 夜视版',
    '空气净化器 A9 / 标准套装',
    '净水器 P8 / 厨下版',
    '扫地机器人 S5 / 黑金款',
  ]
  const storePool = [
    '上海徐汇旗舰店 / SH-XH-01',
    '苏州工业园店 / SZ-GY-03',
    '杭州滨江体验店 / HZ-BJ-05',
    '南京新街口店 / NJ-XJK-07',
    '合肥政务中心店 / HF-ZW-02',
  ]
  const department = departmentPool[(sequence - 2) % departmentPool.length]!
  const applicant = applicantPool[(sequence - 2) % applicantPool.length]!
  const firstItem = itemPool[(sequence - 2) % itemPool.length]!
  const secondItem = itemPool[(sequence - 1) % itemPool.length]!
  const firstStore = storePool[(sequence - 2) % storePool.length]!
  const secondStore = storePool[(sequence - 1) % storePool.length]!
  const organizationCount = 8 + sequence
  const goodsCount = 42 + sequence * 4
  const totalAmount = 126000 + sequence * 12800

  return {
    id: `sale-pending-${String(sequence).padStart(3, '0')}`,
    saleOrderNo: orderNumber,
    saleOrderName: `4月区域售卖申请单 ${String(sequence).padStart(2, '0')}`,
    applyNo: applyNumber,
    applicant,
    applyTime: `2026-04-${String(30 - Math.min(sequence, 20)).padStart(2, '0')} ${String(
      8 + (sequence % 9)
    ).padStart(2, '0')}:${sequence % 2 === 0 ? '15' : '40'}`,
    applyDepartment: department,
    statusKey: 'pending_hq_review',
    statusLabel: '待总部审核',
    organizationCount,
    goodsCount,
    totalAmount,
    rows: [
      {
        id: `sale-pending-${String(sequence).padStart(3, '0')}-row-1`,
        saleOrderNo: `${orderNumber}-01`,
        statusKey: 'pending_warehouse',
        statusLabel: '待仓库处理',
        organizationInfo: firstStore,
        itemInfo: firstItem,
        condition: '全新',
        quantity: 6 + (sequence % 7),
        amount: 14800 + sequence * 1200,
      },
      {
        id: `sale-pending-${String(sequence).padStart(3, '0')}-row-2`,
        saleOrderNo: `${orderNumber}-02`,
        statusKey: sequence % 2 === 0 ? 'pending_sampling' : 'pending_shipment',
        statusLabel: sequence % 2 === 0 ? '待驻厂抽检' : '待仓库发货',
        organizationInfo: secondStore,
        itemInfo: secondItem,
        condition: sequence % 3 === 0 ? '九五新' : '全新',
        quantity: 5 + (sequence % 6),
        amount: 11200 + sequence * 980,
      },
      {
        id: `sale-pending-${String(sequence).padStart(3, '0')}-row-3`,
        saleOrderNo: `${orderNumber}-03`,
        statusKey: 'completed',
        statusLabel: '已完成',
        organizationInfo: firstStore,
        itemInfo: itemPool[sequence % itemPool.length]!,
        condition: '全新',
        quantity: 4 + (sequence % 5),
        amount: 9800 + sequence * 860,
      },
    ],
  }
}

const saleOrders: SaleOrder[] = [
  seedSaleOrders[0]!,
  ...Array.from({ length: 19 }, (_item, index) => createPendingReviewOrder(index + 2)),
  ...seedSaleOrders.slice(1),
]

function readStoredWidth(storageKey: string, initial: number, min: number, max: number) {
  try {
    const rawValue = localStorage.getItem(storageKey)
    const parsedValue = rawValue ? Number(rawValue) : Number.NaN

    return Number.isFinite(parsedValue)
      ? Math.min(max, Math.max(min, parsedValue))
      : initial
  } catch {
    return initial
  }
}

function formatCurrency(value: number) {
  return `¥ ${value.toLocaleString('zh-CN')}`
}

function resolveTagType(statusKey: string) {
  switch (statusKey) {
    case 'pending_hq_review':
    case 'pending_warehouse':
      return 'primary'
    case 'warehouse_processing':
    case 'pending_shipment':
      return 'skyblue'
    case 'pending_sampling':
      return 'warning'
    case 'completed':
      return 'success'
    case 'create_failed':
      return 'danger'
    case 'rejected':
      return 'rosered'
    default:
      return 'default'
  }
}

function filterRowsByStatus(rows: SaleItemRow[], statusKey: DetailStatusKey) {
  if (statusKey === 'all') return rows
  return rows.filter((row) => row.statusKey === statusKey)
}

function openDemoMessage(title: string) {
  Message.open({ title })
}

function TabTitle({ label, count }: { label: string; count: number }) {
  return (
    <span className={styles.tabTitle}>
      <span>{label}</span>
      <span className={styles.tabBadge}>{count}</span>
    </span>
  )
}

function MetricBlock({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className={styles.metricBlock}>
      <span className={styles.metricLabel}>{label}</span>
      <strong className={styles.metricValue}>{value}</strong>
    </div>
  )
}

function SaleOrderCard({
  order,
  selected,
  onSelect,
}: {
  order: SaleOrder
  selected: boolean
  onSelect: () => void
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onSelect()
  }

  return (
    <button
      className={styles.orderCardButton}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <Card
        className={`${styles.orderCard} ${selected ? styles.orderCardSelected : ''}`}
        bordered
        hoverable
        size="sm"
        showHeaderDivider={false}
        title={
          <div className={styles.orderHeading}>
            <div className={styles.orderNo}>{order.saleOrderNo}</div>
            <div className={styles.orderName}>{order.saleOrderName}</div>
          </div>
        }
        extra={
          <Tag
            type={resolveTagType(order.statusKey)}
            appearance="filled"
            shape="round"
            size="sm"
          >
            {order.statusLabel}
          </Tag>
        }
        styles={{
          header: { padding: '16px 16px 10px' },
          body: { padding: '0 16px 16px' },
        }}
      >
        <div className={styles.orderDepartment}>{order.applyDepartment}</div>
        <div className={styles.metricGrid}>
          <MetricBlock label="机构数量统计" value={order.organizationCount} />
          <MetricBlock label="商品数量统计" value={order.goodsCount} />
          <MetricBlock label="物品总价金额" value={formatCurrency(order.totalAmount)} />
        </div>
      </Card>
    </button>
  )
}

export function SaleManagementPage() {
  const [keyword, setKeyword] = useState('')
  const [listStatus, setListStatus] = useState<OrderStatusKey>('pending_hq_review')
  const [selectedOrderId, setSelectedOrderId] = useState<string>(saleOrders[0]?.id ?? '')
  const [detailStatus, setDetailStatus] = useState<DetailStatusKey>('all')
  const [leftWidth, setLeftWidth] = useState(() => readStoredWidth(SPLIT_STORAGE_KEY, 420, 260, 420))
  const [tableMaxHeight, setTableMaxHeight] = useState(320)
  const tableRegionRef = useRef<HTMLDivElement | null>(null)

  const leftStatusCounts = useMemo(
    () =>
      listStatusOptions.reduce<Record<OrderStatusKey, number>>((acc, item) => {
        acc[item.key] = saleOrders.filter((order) => order.statusKey === item.key).length
        return acc
      }, {} as Record<OrderStatusKey, number>),
    []
  )

  const filteredOrders = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return saleOrders.filter((order) => {
      const matchesStatus = order.statusKey === listStatus
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        order.saleOrderNo.toLowerCase().includes(normalizedKeyword) ||
        order.saleOrderName.toLowerCase().includes(normalizedKeyword) ||
        order.applyDepartment.toLowerCase().includes(normalizedKeyword)

      return matchesStatus && matchesKeyword
    })
  }, [keyword, listStatus])

  useEffect(() => {
    if (filteredOrders.length === 0) {
      setSelectedOrderId('')
      return
    }

    if (filteredOrders.some((order) => order.id === selectedOrderId)) return
    setSelectedOrderId(filteredOrders[0]!.id)
  }, [filteredOrders, selectedOrderId])

  useEffect(() => {
    setDetailStatus('all')
  }, [selectedOrderId])

  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => order.id === selectedOrderId) ?? filteredOrders[0] ?? null,
    [filteredOrders, selectedOrderId]
  )

  const detailCounts = useMemo(() => {
    const baseCounts: Record<DetailStatusKey, number> = {
      all: selectedOrder?.rows.length ?? 0,
      pending_warehouse: 0,
      pending_sampling: 0,
      pending_shipment: 0,
      completed: 0,
    }

    selectedOrder?.rows.forEach((row) => {
      baseCounts[row.statusKey] += 1
    })

    return baseCounts
  }, [selectedOrder])

  const visibleRows = useMemo(
    () => filterRowsByStatus(selectedOrder?.rows ?? [], detailStatus),
    [detailStatus, selectedOrder]
  )

  const detailMetaItems = useMemo(
    () =>
      selectedOrder
        ? [
            { label: '售卖申请单号', value: selectedOrder.applyNo },
            { label: '申请人', value: selectedOrder.applicant },
            { label: '申请时间', value: selectedOrder.applyTime },
          ]
        : [],
    [selectedOrder]
  )

  const detailMetricItems = useMemo(
    () =>
      selectedOrder
        ? [
            { label: '机构数量统计', value: String(selectedOrder.organizationCount) },
            { label: '商品数量统计', value: String(selectedOrder.goodsCount) },
            { label: '物品总价金额', value: formatCurrency(selectedOrder.totalAmount) },
          ]
        : [],
    [selectedOrder]
  )

  const tableColumns = useMemo(
    () => [
      {
        title: '售卖单号',
        dataKey: 'saleOrderNo',
        width: 160,
        render: (value) => (
          <span className={styles.primaryCell}>{renderTableTextEllipsis(value)}</span>
        ),
      },
      {
        title: '状态标签',
        dataKey: 'statusLabel',
        width: 126,
        render: (_value, row) => (
          <Tag
            type={resolveTagType(row.statusKey)}
            appearance="filled"
            shape="round"
            size="sm"
          >
            {row.statusLabel}
          </Tag>
        ),
      },
      {
        title: '机构信息',
        dataKey: 'organizationInfo',
        width: 188,
        render: (value) => renderTableTextEllipsis(value),
      },
      {
        title: '物品属性',
        dataKey: 'itemInfo',
        width: 188,
        render: (value) => renderTableTextEllipsis(value),
      },
      {
        title: '品相',
        dataKey: 'condition',
        width: 84,
        render: (value) => renderTableTextEllipsis(value),
      },
      {
        title: '物品数量',
        dataKey: 'quantity',
        width: 92,
      },
      {
        title: '物品金额',
        dataKey: 'amount',
        width: 120,
        render: (value) => formatCurrency(Number(value)),
      },
      {
        title: '操作',
        dataKey: 'actions',
        width: 220,
        render: (_value, row) => (
          <Space size={8}>
            {row.statusKey === 'pending_warehouse' ? (
              <Button
                type="primary"
                appearance="link"
                onClick={() => openDemoMessage(`执行 ${row.saleOrderNo} 抽检（示例）`)}
              >
                抽检
              </Button>
            ) : null}
            <Button
              type="primary"
              appearance="link"
              onClick={() => openDemoMessage(`查看 ${row.saleOrderNo} 标段信息（示例）`)}
            >
              标段信息
            </Button>
            <Button
              type="primary"
              appearance="link"
              onClick={() => openDemoMessage(`查看 ${row.saleOrderNo} 日志（示例）`)}
            >
              日志
            </Button>
          </Space>
        ),
      },
    ],
    []
  )

  const onSplitterMouseDown = useMemo(
    () => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      const startX = event.clientX
      const initialWidth = leftWidth
      let nextWidth = initialWidth

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        nextWidth = Math.min(420, Math.max(260, initialWidth + deltaX))
        setLeftWidth(nextWidth)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)

        try {
          localStorage.setItem(SPLIT_STORAGE_KEY, String(nextWidth))
        } catch {
          // ignore localStorage failure
        }
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [leftWidth]
  )

  useLayoutEffect(() => {
    const region = tableRegionRef.current
    if (!region) return

    const updateTableHeight = () => {
      const nextHeight = Math.max(240, region.clientHeight - 12)
      setTableMaxHeight(nextHeight)
    }

    updateTableHeight()
    const observer = new ResizeObserver(updateTableHeight)
    observer.observe(region)

    return () => observer.disconnect()
  }, [detailStatus, selectedOrder?.id, visibleRows.length])

  return (
    <div className={`pro-tree-split-page ${proTreeSplitPageStyles.pageRoot} ${styles.pageRoot}`}>
      <TypicalPageHeaderPortal>
        <PageHeader className={proTreeSplitPageStyles.pageHeader} title="售卖管理" />
      </TypicalPageHeaderPortal>

      <div className={proTreeSplitPageStyles.whiteBody}>
        <div className={`${proTreeSplitPageStyles.mainSplit} ${styles.mainSplit}`}>
          <aside
            className={`${proTreeSplitPageStyles.leftColumn} ${styles.leftPane}`}
            style={{ flex: `0 0 ${leftWidth}px`, width: leftWidth }}
          >
            <div className={styles.leftSearchPanel}>
              <SearchInput
                className={styles.leftSearchInput}
                style={{ width: '100%', maxWidth: '100%' }}
                placeholder="搜索售卖单号 / 名称 / 申请部门"
                value={keyword}
                onChange={(_event, nextValue) => setKeyword(nextValue)}
              />
            </div>

            <div className={styles.leftStatusPanel}>
              <Space wrap size={8}>
                {listStatusOptions.map((status) => {
                  const active = status.key === listStatus

                  return (
                    <Button
                      key={status.key}
                      type={active ? 'primary' : 'default'}
                      appearance={active ? 'filled' : 'line'}
                      size="sm"
                      shape="square"
                      onClick={() => setListStatus(status.key)}
                    >
                      {status.label} {leftStatusCounts[status.key]}
                    </Button>
                  )
                })}
              </Space>
            </div>

            <div className={styles.leftScroll}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <SaleOrderCard
                    key={order.id}
                    order={order}
                    selected={selectedOrder?.id === order.id}
                    onSelect={() => setSelectedOrderId(order.id)}
                  />
                ))
              ) : (
                <div className={styles.emptyList}>
                  <EmptyState title="暂无匹配的售卖单">
                    <div className={styles.emptyTip}>可以尝试调整搜索词或切换左侧状态。</div>
                  </EmptyState>
                </div>
              )}
            </div>
          </aside>

          <div
            className={proTreeSplitPageStyles.splitter}
            role="separator"
            aria-orientation="vertical"
            aria-label="拖动调节左侧宽度"
            onMouseDown={onSplitterMouseDown}
          />

          <section className={`${proTreeSplitPageStyles.rightColumn} ${styles.rightPane}`}>
            {selectedOrder ? (
              <div className={styles.detailBody}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryHeader}>
                    <div className={styles.summaryInfo}>
                      <div className={styles.summaryTitle}>{selectedOrder.saleOrderName}</div>
                      <div className={styles.summaryMetaRow}>
                        <Tag
                          type={resolveTagType(selectedOrder.statusKey)}
                          appearance="filled"
                          shape="round"
                        >
                          {selectedOrder.statusLabel}
                        </Tag>
                        {detailMetaItems.map((item) => (
                          <span key={item.label} className={styles.summaryMetaItem}>
                            <span className={styles.summaryMetaLabel}>{item.label}</span>
                            <span className={styles.summaryMetaValue}>{item.value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="primary"
                      appearance="link"
                      onClick={() => openDemoMessage(`查看 ${selectedOrder.saleOrderNo} 日志（示例）`)}
                    >
                      查看日志
                    </Button>
                  </div>

                  <div className={styles.summaryMetrics}>
                    {detailMetricItems.map((item) => (
                      <div key={item.label} className={styles.summaryMetric}>
                        <div className={styles.summaryMetricLabel}>{item.label}</div>
                        <div className={styles.summaryMetricValue}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Card
                  className={styles.tableCard}
                  bordered
                  size="sm"
                  showHeaderDivider={false}
                  styles={{
                    root: { flex: '1 1 0%', minHeight: 0 },
                    body: {
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      minHeight: 0,
                    },
                  }}
                >
                  <Tabs
                    className={styles.detailTabs}
                    activeId={detailStatus}
                    type="line"
                    showDivider
                    onChange={(value) => setDetailStatus(String(value) as DetailStatusKey)}
                    styles={{
                      root: { display: 'flex', flexDirection: 'column', flex: '1 1 0%', minHeight: 0 },
                      list: { padding: '0 20px' },
                      content: { flex: '1 1 0%', minHeight: 0 },
                    }}
                  >
                    {detailStatusOptions.map((status) => (
                      <Tabs.Pane
                        key={status.key}
                        tabId={status.key}
                        tabTitle={<TabTitle label={status.label} count={detailCounts[status.key]} />}
                      >
                        <div
                          ref={detailStatus === status.key ? tableRegionRef : undefined}
                          className={styles.tableRegion}
                        >
                          <Table
                            fieldKey="id"
                            bordered={false}
                            resizable
                            sticky
                            stickyTop={0}
                            size="md"
                            striped={false}
                            maxHeight={tableMaxHeight}
                            fixedToColumn={{ right: 'actions' }}
                            data={filterRowsByStatus(selectedOrder.rows, status.key)}
                            columns={tableColumns}
                            styles={{
                              bodyCell: {
                                whiteSpace: 'nowrap',
                              },
                            }}
                            emptyContent={
                              <EmptyState title="当前状态暂无数据">
                                <div className={styles.emptyTip}>切换其他状态标签可查看对应售卖明细。</div>
                              </EmptyState>
                            }
                          />
                        </div>
                      </Tabs.Pane>
                    ))}
                  </Tabs>
                </Card>
              </div>
            ) : (
              <div className={styles.emptyDetail}>
                <EmptyState title="未找到售卖单详情">
                  <div className={styles.emptyTip}>请切换左侧状态或调整搜索条件后重试。</div>
                </EmptyState>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
