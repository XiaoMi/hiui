import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { BoxOutlined, CopyOutlined, LinkOutlined, ShoppingOutlined } from '@hi-ui/icons'
import { SearchInput } from '@hi-ui/query-filter'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import { proTreeSplitPageStyles } from '@hiui-design/typical-page-shells/pro-tree-split-page'
import { Button, Card, CheckSelect, Checkbox, EmptyState, Form, Input, Message, PageHeader, Radio, Select, Tag, Textarea } from '@hi-ui/hiui'
import type {
  TimelineEntryKey,
  WorkbenchAssistFilterKey,
  WorkbenchListFilterKey,
  WorkbenchPlanKey,
  WorkbenchProcessType,
  WorkbenchStatusTone,
  WorkOrderRecord,
} from './after-sales-workbench.mock'
import {
  processTypeOptions,
  servicePlanOptions,
  workbenchAssistFilters,
  workbenchListFilters,
  workOrders,
} from './after-sales-workbench.mock'
import styles from './after-sales-workbench.module.scss'

function resolveTagType(statusTone: WorkbenchStatusTone) {
  switch (statusTone) {
    case 'primary':
    case 'skyblue':
    case 'warning':
    case 'success':
    case 'danger':
    case 'rosered':
      return statusTone
    default:
      return 'default'
  }
}

function matchesFilter(order: WorkOrderRecord, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return true

  return [
    order.title,
    order.workOrderNo,
    order.customer.name,
    order.customer.mobile,
    order.topSummary.currentStage,
  ].some((value) => value.toLowerCase().includes(normalizedKeyword))
}

function openDemoMessage(message: string) {
  Message.open({ title: message })
}

const GRID_GAP = 4
const DESKTOP_BREAKPOINT = 1100
const COMPACT_BREAKPOINT = 1360
const RESIZE_STEP = 12
const MIN_COLUMN_WIDTHS = {
  left: 180,
  middle: 320,
  right: 320,
} as const

const treatmentMethodOptions = [
  { id: 'light-repair', title: '断电小修' },
  { id: 'replace-part', title: '更换相关配件' },
  { id: 'return-repair', title: '返厂维修' },
]

type ResizeHandleKey = 'first' | 'second'
type SearchFilterKey = WorkbenchListFilterKey | WorkbenchAssistFilterKey
type StageBadgeVariant = 'primary' | 'outline' | 'secondary' | 'warning'

type ColumnWidths = {
  left: number
  middle: number
  right: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function resolveStageBadgeVariant(badge: string, index: number): StageBadgeVariant {
  if (badge.includes('催')) return 'warning'
  if (badge.includes('#')) return 'outline'
  if (index === 0) return 'primary'
  return 'secondary'
}

function getDefaultColumnWidths(containerWidth: number): ColumnWidths {
  const availableWidth = Math.max(containerWidth - GRID_GAP * 2, 0)
  const baseLeftWidth = containerWidth <= COMPACT_BREAKPOINT ? 220 : 248
  const maxLeftWidth = Math.max(
    MIN_COLUMN_WIDTHS.left,
    availableWidth - MIN_COLUMN_WIDTHS.middle - MIN_COLUMN_WIDTHS.right
  )
  const left = clamp(baseLeftWidth, MIN_COLUMN_WIDTHS.left, maxLeftWidth)
  const remainingWidth = Math.max(availableWidth - left, MIN_COLUMN_WIDTHS.middle + MIN_COLUMN_WIDTHS.right)
  const middle = Math.max(MIN_COLUMN_WIDTHS.middle, Math.floor(remainingWidth / 2))
  const right = remainingWidth - middle

  return { left, middle, right }
}

function fitColumnWidthsToContainer(widths: ColumnWidths, containerWidth: number): ColumnWidths {
  const availableWidth = Math.max(containerWidth - GRID_GAP * 2, 0)
  const maxLeftWidth = Math.max(
    MIN_COLUMN_WIDTHS.left,
    availableWidth - MIN_COLUMN_WIDTHS.middle - MIN_COLUMN_WIDTHS.right
  )
  const left = clamp(widths.left, MIN_COLUMN_WIDTHS.left, maxLeftWidth)
  const remainingWidth = Math.max(availableWidth - left, MIN_COLUMN_WIDTHS.middle + MIN_COLUMN_WIDTHS.right)
  const maxMiddleWidth = Math.max(MIN_COLUMN_WIDTHS.middle, remainingWidth - MIN_COLUMN_WIDTHS.right)
  const middle = clamp(widths.middle, MIN_COLUMN_WIDTHS.middle, maxMiddleWidth)
  const right = remainingWidth - middle

  return { left, middle, right }
}

function resizeColumns(widths: ColumnWidths, handle: ResizeHandleKey, deltaX: number) {
  if (handle === 'first') {
    const pairWidth = widths.left + widths.middle
    const nextLeft = clamp(widths.left + deltaX, MIN_COLUMN_WIDTHS.left, pairWidth - MIN_COLUMN_WIDTHS.middle)

    return {
      left: nextLeft,
      middle: pairWidth - nextLeft,
      right: widths.right,
    }
  }

  const pairWidth = widths.middle + widths.right
  const nextMiddle = clamp(
    widths.middle + deltaX,
    MIN_COLUMN_WIDTHS.middle,
    pairWidth - MIN_COLUMN_WIDTHS.right
  )

  return {
    left: widths.left,
    middle: nextMiddle,
    right: pairWidth - nextMiddle,
  }
}

function TimelineRow({
  active,
  expanded,
  entry,
  onToggle,
}: {
  active: boolean
  expanded: boolean
  entry: WorkOrderRecord['timeline'][number]
  onToggle: () => void
}) {
  return (
    <div className={styles.timelineRow}>
      <div className={styles.timelineAxis}>
        <span className={`${styles.timelineDot} ${active ? styles.timelineDotActive : ''}`} />
        {!active ? <span className={styles.timelineLine} /> : null}
      </div>
      <button className={styles.timelineCard} type="button" onClick={onToggle}>
        <div className={styles.timelineHeader}>
          <span className={styles.timelineTitle}>{entry.title}</span>
          <span className={styles.timelineMeta}>
            {entry.operator} 操作时间:{entry.time}
          </span>
        </div>
        {expanded ? <div className={styles.timelineExpanded}>{entry.summary}</div> : null}
      </button>
    </div>
  )
}

function WorkOrderListCard({
  onSelect,
  order,
  selected,
}: {
  onSelect: () => void
  order: WorkOrderRecord
  selected: boolean
}) {
  return (
    <button
      className={styles.orderCardButton}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <Card
        className={`${styles.orderCard} ${selected ? styles.orderCardSelected : ''}`}
        bordered
        hoverable
        size="sm"
        showHeaderDivider={false}
        title={<span className={styles.orderTitle}>{order.title}</span>}
        extra={
          <Tag type={resolveTagType(order.statusTone)} appearance="filled" shape="round" size="sm">
            {order.statusLabel}
          </Tag>
        }
        styles={{
          header: { padding: '12px 12px 8px' },
          body: { padding: '0 12px 12px' },
        }}
      >
        <div className={styles.orderMeta}>{order.listBadges.join(' · ')}</div>
        <div className={styles.orderMeta}>{order.listTimestamp}</div>
      </Card>
    </button>
  )
}

function getTreatmentMethodValue(order: WorkOrderRecord | null) {
  if (!order) return ''

  const field = order.detailSections
    .flatMap((section) => section.fields)
    .find((item) => item.label === '处理方法')

  const matchedOption = treatmentMethodOptions.find((option) => option.title === field?.value)

  return matchedOption?.id ?? ''
}

export function AfterSalesWorkbenchPage() {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<{
    handle: ResizeHandleKey
    startX: number
    widths: ColumnWidths
  } | null>(null)
  const [keyword, setKeyword] = useState('')
  const [activeSearchFilter, setActiveSearchFilter] = useState<SearchFilterKey>('processing')
  const [selectedOrderId, setSelectedOrderId] = useState(workOrders[0]?.id ?? '')
  const [processType, setProcessType] = useState<WorkbenchProcessType>('repair')
  const [servicePlan, setServicePlan] = useState<WorkbenchPlanKey>('battery')
  const [faultTagIds, setFaultTagIds] = useState<string[]>([])
  const [fsn, setFsn] = useState('')
  const [note, setNote] = useState('')
  const [treatmentMethod, setTreatmentMethod] = useState('')
  const [expandedTimeline, setExpandedTimeline] = useState<TimelineEntryKey | null>('receive')
  const [gridWidth, setGridWidth] = useState(0)
  const [columnWidths, setColumnWidths] = useState<ColumnWidths | null>(null)
  const [activeResizeHandle, setActiveResizeHandle] = useState<ResizeHandleKey | null>(null)

  const filteredOrders = useMemo(
    () =>
      workOrders.filter(
        (order) =>
          (order.listFilterKey === activeSearchFilter || order.assistFilterKey === activeSearchFilter) &&
          matchesFilter(order, keyword)
      ),
    [activeSearchFilter, keyword]
  )

  useEffect(() => {
    if (filteredOrders.some((order) => order.id === selectedOrderId)) return
    setSelectedOrderId(filteredOrders[0]?.id ?? '')
  }, [filteredOrders, selectedOrderId])

  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => order.id === selectedOrderId) ?? filteredOrders[0] ?? null,
    [filteredOrders, selectedOrderId]
  )

  const faultTagOptions = useMemo(
    () =>
      Array.from(
        new Map(
          workOrders
            .flatMap((order) => order.diagnosis.faultTags)
            .map((tag) => [tag.id, { id: tag.id, title: tag.label }])
        ).values()
      ),
    []
  )

  useEffect(() => {
    if (!selectedOrder) return

    setProcessType(selectedOrder.processType)
    setServicePlan(selectedOrder.servicePlan)
    setFaultTagIds(selectedOrder.diagnosis.faultTags.map((tag) => tag.id))
    setFsn(selectedOrder.fsn)
    setNote(selectedOrder.note)
    setTreatmentMethod(getTreatmentMethodValue(selectedOrder))
    setExpandedTimeline(selectedOrder.timeline.at(-1)?.id ?? null)
  }, [selectedOrder])

  useEffect(() => {
    const node = gridRef.current
    if (!node) return

    const syncGridWidth = (nextWidth: number) => {
      setGridWidth(nextWidth)

      if (nextWidth <= DESKTOP_BREAKPOINT) return

      setColumnWidths((current) =>
        fitColumnWidthsToContainer(current ?? getDefaultColumnWidths(nextWidth), nextWidth)
      )
    }

    syncGridWidth(node.getBoundingClientRect().width)

    const observer = new ResizeObserver(([entry]) => {
      syncGridWidth(entry.contentRect.width)
    })

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!activeResizeHandle) return

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      if (!dragState || gridWidth <= DESKTOP_BREAKPOINT) return

      const nextWidths = resizeColumns(dragState.widths, dragState.handle, event.clientX - dragState.startX)
      setColumnWidths(fitColumnWidthsToContainer(nextWidths, gridWidth))
    }

    const stopResize = () => {
      dragStateRef.current = null
      setActiveResizeHandle(null)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopResize)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopResize)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [activeResizeHandle, gridWidth])

  const desktopColumnWidths = gridWidth > DESKTOP_BREAKPOINT ? columnWidths : null
  const isDesktopLayout = desktopColumnWidths !== null
  const gridTemplateColumns = desktopColumnWidths
    ? `${desktopColumnWidths.left}px ${desktopColumnWidths.middle}px ${desktopColumnWidths.right}px`
    : undefined
  const firstHandleOffset = desktopColumnWidths ? desktopColumnWidths.left + GRID_GAP / 2 : 0
  const secondHandleOffset = desktopColumnWidths
    ? desktopColumnWidths.left + GRID_GAP + desktopColumnWidths.middle + GRID_GAP / 2
    : 0

  const adjustColumnWidths = (handle: ResizeHandleKey, deltaX: number) => {
    if (!columnWidths || gridWidth <= DESKTOP_BREAKPOINT) return

    const nextWidths = resizeColumns(columnWidths, handle, deltaX)
    setColumnWidths(fitColumnWidthsToContainer(nextWidths, gridWidth))
  }

  const startResize =
    (handle: ResizeHandleKey) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!columnWidths || gridWidth <= DESKTOP_BREAKPOINT) return

      event.preventDefault()
      dragStateRef.current = {
        handle,
        startX: event.clientX,
        widths: columnWidths,
      }
      setActiveResizeHandle(handle)
    }

  const handleResizeKeyDown =
    (handle: ResizeHandleKey) => (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      event.preventDefault()
      adjustColumnWidths(handle, event.key === 'ArrowLeft' ? -RESIZE_STEP : RESIZE_STEP)
    }

  return (
    <div className={`pro-tree-split-page ${proTreeSplitPageStyles.pageRoot} ${styles.pageRoot}`}>
      <TypicalPageHeaderPortal>
        <PageHeader
          className={proTreeSplitPageStyles.pageHeader}
          title="工单详情"
          extra={
            <div className={styles.pageActions}>
              {(selectedOrder?.links ?? []).map((action) => (
                <Button
                  key={action.id}
                  type="primary"
                  appearance="link"
                  onClick={() => openDemoMessage(`${action.label}（示例）`)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          }
        />
      </TypicalPageHeaderPortal>

      <div className={proTreeSplitPageStyles.whiteBody}>
        <div
          ref={gridRef}
          className={`${styles.workspaceGrid} ${activeResizeHandle ? styles.workspaceGridResizing : ''}`}
          style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
        >
          <aside className={styles.leftPanel}>
            <div className={styles.leftToolbar}>
              <div className={styles.searchInput}>
                <SearchInput
                  style={{ width: '100%' }}
                  placeholder="搜索单号 / 商品 / 用户"
                  value={keyword}
                  onChange={(_event, nextValue) => setKeyword(nextValue)}
                />
              </div>

              <div className={styles.searchFilterTags} role="radiogroup" aria-label="工单筛选">
                {workbenchListFilters.map((filter) => {
                  const active = filter.key === activeSearchFilter

                  return (
                    <Tag
                      key={filter.key}
                      className={styles.filterTag}
                      type={active ? 'primary' : 'default'}
                      appearance={active ? 'filled' : 'line'}
                      size="md"
                      shape="square"
                      onClick={() => setActiveSearchFilter(filter.key)}
                      role="radio"
                      aria-checked={active}
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return
                        event.preventDefault()
                        setActiveSearchFilter(filter.key)
                      }}
                    >
                      {filter.label}
                      <span className={styles.filterCount}>{filter.count}</span>
                    </Tag>
                  )
                })}

                {workbenchAssistFilters.map((filter) => {
                  const active = filter.key === activeSearchFilter

                  return (
                    <Tag
                      key={filter.key}
                      className={styles.filterTag}
                      type={active ? 'primary' : 'default'}
                      appearance={active ? 'filled' : 'line'}
                      size="md"
                      shape="square"
                      onClick={() => setActiveSearchFilter(filter.key)}
                      role="radio"
                      aria-checked={active}
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return
                        event.preventDefault()
                        setActiveSearchFilter(filter.key)
                      }}
                    >
                      {filter.label}
                    </Tag>
                  )
                })}
              </div>
            </div>

            <div className={styles.orderList}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  return (
                    <WorkOrderListCard
                      key={order.id}
                      order={order}
                      selected={order.id === selectedOrder?.id}
                      onSelect={() => setSelectedOrderId(order.id)}
                    />
                  )
                })
              ) : (
                <div className={styles.emptyState}>
                  <EmptyState title="暂无匹配工单" />
                </div>
              )}
            </div>
          </aside>

          <section className={styles.middlePanel}>
            {selectedOrder ? (
              <div className={styles.columnScroll}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryBadges}>
                    {selectedOrder.stageBadges.length >= 2 ? (
                      <div className={styles.stageBadgeGroup}>
                        {selectedOrder.stageBadges.slice(0, 2).map((badge, index) => {
                          const variant = resolveStageBadgeVariant(badge, index)

                          return (
                            <span
                              key={`${badge}-${index}`}
                              className={`${styles.stageBadge} ${styles[`stageBadge${variant.charAt(0).toUpperCase()}${variant.slice(1)}`]} ${index === 0 ? styles.stageBadgeGroupStart : styles.stageBadgeGroupEnd}`}
                            >
                              {badge}
                              {variant === 'outline' ? <CopyOutlined className={styles.stageBadgeIcon} /> : null}
                            </span>
                          )
                        })}
                      </div>
                    ) : null}

                    {selectedOrder.stageBadges.slice(2).map((badge, index) => {
                      const variant = resolveStageBadgeVariant(badge, index + 2)

                      return (
                        <span
                          key={`${badge}-${index + 2}`}
                          className={`${styles.stageBadge} ${styles[`stageBadge${variant.charAt(0).toUpperCase()}${variant.slice(1)}`]}`}
                        >
                          {badge}
                        </span>
                      )
                    })}
                  </div>

                  <div className={`${styles.summaryGrid} ${styles.workOrderInfoGrid}`}>
                    <div className={styles.summaryBlock}>
                      <span className={styles.summaryLabel}>申请入口</span>
                      <span className={styles.summaryValue}>{selectedOrder.topSummary.applyEntry}</span>
                    </div>
                    <div className={styles.summaryBlock}>
                      <span className={styles.summaryLabel}>关联工单</span>
                      <span className={styles.summaryLink}>{selectedOrder.relatedTicketNo}(旧补卡)</span>
                    </div>
                  </div>

                  <div className={styles.customerCard}>
                    <div className={styles.customerHeader}>
                      <div>
                        <div className={styles.customerName}>{selectedOrder.customer.name}</div>
                        <div className={styles.customerHint}>{selectedOrder.topSummary.description}</div>
                      </div>
                      <Button
                        type="primary"
                        appearance="link"
                        size="sm"
                        onClick={() => openDemoMessage('展示编辑信息（示例）')}
                      >
                        展示 编辑
                      </Button>
                    </div>

                    <div className={`${styles.infoGrid} ${styles.customerInfoGrid}`}>
                      <div>
                        <div className={styles.infoLabel}>客户电话</div>
                        <div className={styles.infoValue}>{selectedOrder.customer.mobile}</div>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>客户地址</div>
                        <div className={styles.infoValue}>{selectedOrder.customer.address}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.subSection}>
                    <div className={styles.sectionHeader}>
                      <span>取件信息</span>
                      <Button
                        type="primary"
                        appearance="link"
                        size="sm"
                        onClick={() => openDemoMessage('编辑取件信息（示例）')}
                      >
                        编辑
                      </Button>
                    </div>
                    <div className={styles.infoGrid}>
                      <div>
                        <div className={styles.infoLabel}>取件联系人</div>
                        <div className={styles.infoValue}>{selectedOrder.receipt.contact}</div>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>取件联系电话</div>
                        <div className={styles.infoValue}>{selectedOrder.receipt.mobile}</div>
                      </div>
                      <div className={styles.infoSpanTwo}>
                        <div className={styles.infoLabel}>取件联系地址</div>
                        <div className={styles.infoValue}>{selectedOrder.receipt.address}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.productCard}>
                    <div className={styles.productThumb}>15S</div>
                    <div className={styles.productInfo}>
                      <div className={styles.productTitleRow}>
                        <span className={styles.productTitle}>{selectedOrder.product.title}</span>
                        <span className={styles.productPrice}>{selectedOrder.product.priceLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.shortcutRow}>
                    {selectedOrder.shortcuts.map((shortcut) => (
                      <div key={shortcut.id} className={styles.shortcutItem}>
                        <Button
                          type="default"
                          appearance="line"
                          size="md"
                          onClick={() => openDemoMessage(`${shortcut.label}（示例）`)}
                        >
                          {shortcut.label}
                        </Button>
                      </div>
                    ))}
                  </div>

                  {selectedOrder.detailSections.map((section) => (
                    <div key={section.id} className={styles.subSection}>
                      <div className={styles.sectionHeader}>
                        <span>{section.title}</span>
                      </div>
                      <div className={styles.detailGrid}>
                        {section.fields.map((field) => (
                          <div key={`${section.id}-${field.label}`} className={styles.detailItem}>
                            <span className={styles.detailLabel}>{field.label}</span>
                            <span className={styles.detailValue}>{field.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <EmptyState title="请选择左侧工单" />
              </div>
            )}
          </section>

          <section className={styles.rightPanel}>
            {selectedOrder ? (
              <div className={styles.columnScroll}>
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>检测处理</div>
                  <div className={styles.radioRow}>
                    {processTypeOptions.map((option) => (
                      <Radio
                        key={option.key}
                        checked={processType === option.key}
                        onChange={() => setProcessType(option.key)}
                      >
                        {option.label}
                      </Radio>
                    ))}
                  </div>
                </div>

                <div className={styles.panelCard}>
                  <div className={styles.deviceRow}>
                    <div className={styles.deviceThumb}>15S</div>
                    <div className={styles.deviceInfo}>
                      <div className={styles.deviceTitle}>{selectedOrder.product.title}</div>
                      <div className={styles.deviceMetaRow}>
                        <div className={styles.deviceMeta}>IMEI {selectedOrder.imei}</div>
                        <div className={styles.deviceMeta}>SN {selectedOrder.sn}</div>
                      </div>
                    </div>
                  </div>

                  <Form labelPlacement="top" showColon={false}>
                    <Form.Item label="故障分类" required>
                      <CheckSelect
                        data={faultTagOptions}
                        value={faultTagIds}
                        placeholder="请选择故障分类"
                        onChange={(value) => setFaultTagIds(value.map((item) => String(item)))}
                      />
                    </Form.Item>

                    <Form.Item label="工程师故障描述" required>
                      <Textarea
                        rows={4}
                        readOnly
                        value={selectedOrder.diagnosis.responsibilityText}
                        onChange={() => {}}
                      />
                    </Form.Item>

                    <Form.Item label="故障图片" required>
                      <div className={styles.uploadField}>
                        <div className={styles.uploadRow}>
                          <button className={styles.uploadSlot} type="button">
                            +
                          </button>
                        </div>
                        <div className={styles.uploadExtras}>
                          <div className={styles.helperText}>{selectedOrder.diagnosis.imageHint}</div>
                          <div className={styles.previewRow}>
                            {selectedOrder.diagnosis.media.map((item) => (
                              <div
                                key={item.id}
                                className={styles.previewThumb}
                                style={{ background: item.color }}
                              >
                                {item.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Form.Item>

                    <Form.Item label="包装信息">
                      <div className={styles.checkGrid}>
                        {selectedOrder.diagnosis.packageItems.map((item) => (
                          <Checkbox key={item.id} checked={item.checked} readOnly>
                            {item.label}
                          </Checkbox>
                        ))}
                      </div>
                    </Form.Item>

                    <Form.Item label="服务方案">
                      <div className={styles.servicePlanGrid}>
                        {servicePlanOptions.map((option) => (
                          <button
                            key={option.key}
                            className={`${styles.planButton} ${servicePlan === option.key ? styles.planButtonActive : ''}`}
                            type="button"
                            onClick={() => setServicePlan(option.key)}
                          >
                            <span className={styles.planTitle}>{option.label}</span>
                            <span className={styles.planDesc}>{option.description}</span>
                          </button>
                        ))}
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={styles.actionLabelItem}
                      label={
                        <div className={styles.fieldHeaderRow}>
                          <span className={styles.fieldHeaderText}>更换物料</span>
                          <div className={styles.materialActionButtons}>
                            <Button
                              type="primary"
                              size="md"
                              appearance="line"
                              icon={<BoxOutlined />}
                              onClick={() => openDemoMessage('选择物料（示例）')}
                            >
                              选择物料
                            </Button>
                            <Button
                              type="primary"
                              size="md"
                              appearance="line"
                              icon={<ShoppingOutlined />}
                              onClick={() => openDemoMessage('选择商品（示例）')}
                            >
                              选择商品
                            </Button>
                          </div>
                        </div>
                      }
                    />

                    <Form.Item label="FSN校验" required>
                      <Input
                        placeholder="请输入"
                        value={fsn}
                        onChange={(event) => setFsn(event.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      className={styles.actionLabelItem}
                      label={
                        <div className={styles.fieldHeaderRow}>
                          <span className={styles.fieldHeaderLabelGroup}>
                            <span className={styles.fieldHeaderText}>处理方法</span>
                            <span className={styles.fieldRequiredMark}>*</span>
                          </span>
                          <Button
                            className={styles.autoActionButton}
                            type="default"
                            appearance="link"
                            size="sm"
                            icon={<LinkOutlined />}
                            onClick={() => openDemoMessage('自动获取（示例）')}
                          >
                            自动获取
                          </Button>
                        </div>
                      }
                    >
                      <Select
                        data={treatmentMethodOptions}
                        placeholder="请选择"
                        clearable={false}
                        value={treatmentMethod || undefined}
                        onChange={(selectedId) => setTreatmentMethod(String(selectedId))}
                      />
                    </Form.Item>

                    <Form.Item
                      className={styles.actionLabelItem}
                      label={
                        <div className={styles.fieldHeaderRow}>
                          <span className={styles.fieldHeaderText}>关联特批</span>
                          <div className={styles.singleActionWrap}>
                            <Button
                              type="primary"
                              appearance="line"
                              size="md"
                              icon={<BoxOutlined />}
                              onClick={() => openDemoMessage('关联特批（示例）')}
                            >
                              关联特批
                            </Button>
                          </div>
                        </div>
                      }
                    />

                    <Form.Item label="现场检测视频" required>
                      <div className={styles.uploadRow}>
                        <button className={styles.uploadSlot} type="button">
                          +
                        </button>
                        <span className={styles.helperTextInline}>
                          请选择录制的检测视频文件上传至工单中保存
                        </span>
                      </div>
                    </Form.Item>

                    <Form.Item label="现场维修视频" required>
                      <div className={styles.uploadRow}>
                        <button className={styles.uploadSlot} type="button">
                          +
                        </button>
                        <span className={styles.helperTextInline}>
                          请选择录制的检测视频文件上传至工单中保存
                        </span>
                      </div>
                    </Form.Item>

                    <Form.Item label="受理备注" required>
                      <Textarea
                        rows={4}
                        showCount
                        maxLength={300}
                        placeholder="请输入"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                      />
                    </Form.Item>
                  </Form>

                  <div className={styles.footerActions}>
                    <div className={styles.footerActionItem}>
                      <Button type="default" appearance="line" onClick={() => openDemoMessage('取消（示例）')}>
                        取消
                      </Button>
                    </div>
                    <div className={styles.footerActionItem}>
                      <Button type="default" appearance="line" onClick={() => openDemoMessage('暂存（示例）')}>
                        暂存
                      </Button>
                    </div>
                    <div className={styles.footerActionItem}>
                      <Button type="primary" onClick={() => openDemoMessage('提交（示例）')}>
                        提交
                      </Button>
                    </div>
                  </div>
                </div>

                <div className={styles.timelineList}>
                  {selectedOrder.timeline.map((entry, index) => (
                    <TimelineRow
                      key={entry.id}
                      active={index === selectedOrder.timeline.length - 1}
                      expanded={expandedTimeline === entry.id}
                      entry={entry}
                      onToggle={() =>
                        setExpandedTimeline((current) => (current === entry.id ? null : entry.id))
                      }
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <EmptyState title="暂无右侧处理内容" />
              </div>
            )}
          </section>

          {isDesktopLayout ? (
            <>
              <button
                className={`${styles.resizeHandle} ${activeResizeHandle === 'first' ? styles.resizeHandleActive : ''}`}
                type="button"
                aria-label="调整左侧与中间列宽"
                style={{ left: `${firstHandleOffset}px` }}
                onPointerDown={startResize('first')}
                onKeyDown={handleResizeKeyDown('first')}
              >
                <span className={styles.resizeHandleGrip} />
              </button>
              <button
                className={`${styles.resizeHandle} ${activeResizeHandle === 'second' ? styles.resizeHandleActive : ''}`}
                type="button"
                aria-label="调整中间与右侧列宽"
                style={{ left: `${secondHandleOffset}px` }}
                onPointerDown={startResize('second')}
                onKeyDown={handleResizeKeyDown('second')}
              >
                <span className={styles.resizeHandleGrip} />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default AfterSalesWorkbenchPage
