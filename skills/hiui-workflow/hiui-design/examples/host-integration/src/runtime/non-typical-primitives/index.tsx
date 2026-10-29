import React, { type ReactNode } from 'react'
import { SearchInput } from '@hi-ui/query-filter'
import { Button, PageHeader, Table, Tabs, Tag } from 'hiui5'
import styles from './index.module.scss'

export type NonTypicalAction = {
  key?: string
  label: string
  kind?: string
  onClick?: () => void
}

export type NonTypicalFact = {
  label: string
  value: string
}

export type NonTypicalFilterOption = {
  key: string
  label: string
  count?: string
}

export type NonTypicalCarrierPolicy = {
  controlComplexity?: string
  controlTarget?: string
  preferredCarrier?: string
}

export type NonTypicalStatusTab = {
  key: string
  label: string
  count?: string
}

export type NonTypicalTablePolicy = {
  preferredCarrier?: string
  cellWrap?: 'nowrap' | 'wrap'
  overflowX?: 'auto' | 'scroll' | 'hidden'
  statusCarrier?: string
  actionCarrier?: string
}

export type NonTypicalTableColumn = {
  key: string
  label: string
  kind?: 'text' | 'status' | 'actions'
}

export type NonTypicalTableRow = {
  key: string
  cells?: Record<string, string>
  actions?: NonTypicalAction[]
}

export type NonTypicalSectionData = {
  title: string
  summary?: string
  fields?: NonTypicalFact[]
  bulletPoints?: string[]
}

export type NonTypicalSelectionItem = {
  key: string
  label: string
  title?: string
  summary?: string
  badge?: string
  metrics?: NonTypicalFact[]
  detailGroups?: NonTypicalSectionData[]
  summaryFacts?: NonTypicalFact[]
  snapshotFacts?: NonTypicalFact[]
  detailHeader?: {
    title?: string
    statusLabel?: string
    facts?: NonTypicalFact[]
    metrics?: NonTypicalFact[]
    actionLabel?: string
  }
  statusTabs?: NonTypicalStatusTab[]
  statusTabsPolicy?: NonTypicalCarrierPolicy
  detailTable?: {
    columns?: NonTypicalTableColumn[]
    rowsByStatus?: Record<string, NonTypicalTableRow[]>
    tablePolicy?: NonTypicalTablePolicy
  }
}

type NonTypicalPageFrameProps = {
  title: string
  hasBack?: boolean
  headerActions?: NonTypicalAction[]
  onBack?: () => void
  children?: ReactNode
}

type WhiteBodyWorkspaceProps = {
  children?: ReactNode
}

type SelectionPaneProps = {
  title?: string
  summary?: string
  searchPlaceholder?: string
  searchCarrier?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: NonTypicalFilterOption[]
  filterCarrier?: string
  filterPolicy?: NonTypicalCarrierPolicy
  activeFilterKey?: string
  onFilterChange?: (key: string) => void
  items?: NonTypicalSelectionItem[]
  activeKey?: string
  onChange?: (key: string) => void
  emptyText?: string
}

type SnapshotPaneProps = {
  title: string
  summary?: string
  facts?: NonTypicalFact[]
  footer?: ReactNode
}

type SectionGroupProps = {
  title: string
  summary?: string
  fields?: NonTypicalFact[]
  bulletPoints?: string[]
  footer?: ReactNode
  children?: ReactNode
}

type DetailHeaderPaneProps = {
  title: string
  status?: string
  facts?: NonTypicalFact[]
  metrics?: NonTypicalFact[]
  actionLabel?: string
}

type StatusTabStripProps = {
  tabs?: NonTypicalStatusTab[]
  policy?: NonTypicalCarrierPolicy
  activeKey?: string
  onChange?: (key: string) => void
}

type DataTableProps = {
  columns?: NonTypicalTableColumn[]
  rows?: NonTypicalTableRow[]
  policy?: NonTypicalTablePolicy
  emptyText?: string
}

type ActionStripProps = {
  actions?: NonTypicalAction[]
}

function handleDefaultBack() {
  if (typeof window !== 'undefined' && window.history.length > 0) {
    window.history.back()
  }
}

function renderHeaderActions(actions: NonTypicalAction[]) {
  if (!Array.isArray(actions) || actions.length === 0) return null

  return (
    <div className={styles.headerActions}>
      {actions.map((action) => (
        <Button
          appearance={action.kind === 'primary' ? undefined : 'line'}
          key={action.key || action.label}
          onClick={action.onClick}
          type={action.kind === 'primary' ? 'primary' : 'default'}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

function renderFacts(facts: NonTypicalFact[]) {
  if (!Array.isArray(facts) || facts.length === 0) {
    return <div className={styles.emptyState}>暂无内容</div>
  }

  return (
    <dl className={styles.factList}>
      {facts.map((fact, index) => (
        <div className={styles.factItem} key={`${fact.label || 'fact'}-${index}`}>
          <dt>{fact.label || '--'}</dt>
          <dd>{fact.value || '--'}</dd>
        </div>
      ))}
    </dl>
  )
}

function renderMetricGrid(facts: NonTypicalFact[]) {
  if (!Array.isArray(facts) || facts.length === 0) return null

  return (
    <div className={styles.metricGrid}>
      {facts.map((fact, index) => (
        <div className={styles.metricCard} key={`${fact.label || 'metric'}-${index}`}>
          <span className={styles.metricLabel}>{fact.label || '--'}</span>
          <strong className={styles.metricValue}>{fact.value || '--'}</strong>
        </div>
      ))}
    </div>
  )
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function resolveStatusTagType(statusText: string) {
  if (/完成|通过|成功/u.test(statusText)) return 'success'
  if (/失败|驳回|异常/u.test(statusText)) return 'danger'
  if (/待|处理中|审核/u.test(statusText)) return 'warning'
  return 'primary'
}

function resolveFilterCarrier(filterCarrier: string, filterPolicy?: NonTypicalCarrierPolicy) {
  const preferredCarrier = normalizeText(filterPolicy?.preferredCarrier) || normalizeText(filterCarrier)

  if (preferredCarrier === 'tabs') return 'tabs'

  // selection-detail-sync currently carries flat filter options rather than a
  // structured query-filter field schema, so non-tab filters fall back to Tag.
  return 'tag'
}

function resolveTableColumnWidth(column: NonTypicalTableColumn) {
  if (column.kind === 'actions') return 180
  if (column.kind === 'status') return 140
  if (/单号/u.test(column.label)) return 180
  if (/机构/u.test(column.label)) return 220
  if (/属性|名称/u.test(column.label)) return 220
  if (/金额/u.test(column.label)) return 140
  if (/数量/u.test(column.label)) return 120
  return 160
}

function renderCountLabel(label: string, count?: string) {
  return (
    <span className={styles.filterLabel}>
      <span>{label}</span>
      {count ? <span className={styles.filterCountText}>{count}</span> : null}
    </span>
  )
}

export function NonTypicalPageFrame({
  title,
  hasBack = false,
  headerActions = [],
  onBack,
  children,
}: NonTypicalPageFrameProps) {
  return (
    <div className={styles.pageFrame}>
      <PageHeader
        extra={renderHeaderActions(headerActions)}
        onBack={hasBack ? onBack || handleDefaultBack : undefined}
        title={title}
      />
      {children}
    </div>
  )
}

export function WhiteBodyWorkspace({ children }: WhiteBodyWorkspaceProps) {
  return <div className={styles.whiteBodyWorkspace}>{children}</div>
}

export function SelectionPane({
  title = '选择区',
  summary = '',
  searchPlaceholder = '',
  searchCarrier = 'search',
  searchValue = '',
  onSearchChange,
  filters = [],
  filterCarrier = 'tag',
  filterPolicy,
  activeFilterKey = '',
  onFilterChange,
  items = [],
  activeKey = '',
  onChange,
  emptyText = '暂无可选内容',
}: SelectionPaneProps) {
  const resolvedFilterCarrier = resolveFilterCarrier(filterCarrier, filterPolicy)
  const resolvedSearchCarrier = normalizeText(searchCarrier) || 'search'

  return (
    <section className={styles.regionSurface}>
      <div className={styles.regionHeader}>
        <h3>{title}</h3>
        {summary ? <p>{summary}</p> : null}
      </div>

      {searchPlaceholder && resolvedSearchCarrier === 'search' ? (
        <div className={styles.searchBox}>
          <SearchInput
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            style={{ maxWidth: '100%', minWidth: 0, width: '100%' }}
            value={searchValue}
            onChange={(_event, nextValue) => onSearchChange?.(String(nextValue ?? ''))}
          />
        </div>
      ) : null}

      {filters.length > 0 ? (
        resolvedFilterCarrier === 'tabs' ? (
          <div className={styles.filterTabs}>
            <Tabs
              activeId={activeFilterKey || '__all__'}
              onChange={(tabId) => onFilterChange?.(tabId === '__all__' ? '' : String(tabId))}
              showDivider={false}
              type="button"
            >
              <Tabs.Pane tabId="__all__" tabTitle={renderCountLabel('全部', '')} />
              {filters.map((filter) => (
                <Tabs.Pane
                  key={filter.key}
                  tabId={filter.key}
                  tabTitle={renderCountLabel(filter.label, filter.count)}
                />
              ))}
            </Tabs>
          </div>
        ) : (
          <div className={styles.filterBar}>
            {filters.map((filter) => {
              const selected = filter.key === activeFilterKey

              return (
                <Tag
                  appearance={selected ? 'filled' : 'line'}
                  className={styles.filterTag}
                  key={filter.key}
                  onClick={() => onFilterChange?.(selected ? '' : filter.key)}
                  shape="square"
                  size="md"
                  type={selected ? 'primary' : 'default'}
                >
                  {renderCountLabel(filter.label, filter.count)}
                </Tag>
              )
            })}
          </div>
        )
      ) : null}

      <div className={styles.selectionList}>
        {items.length === 0 ? <div className={styles.emptyState}>{emptyText}</div> : null}
        {items.map((item) => {
          const selected = item.key === activeKey

          return (
            <button
              className={selected ? styles.selectionItemActive : styles.selectionItem}
              key={item.key}
              onClick={() => onChange?.(item.key)}
              type="button"
            >
              <div className={styles.selectionItemHeader}>
                <div className={styles.selectionTitleBlock}>
                  <span className={styles.selectionItemTitle}>{item.label}</span>
                  {item.title ? <span className={styles.selectionItemSubtitle}>{item.title}</span> : null}
                </div>
                {item.badge ? <span className={styles.inlineBadge}>{item.badge}</span> : null}
              </div>
              {item.summary ? <p className={styles.selectionItemSummary}>{item.summary}</p> : null}
              {renderMetricGrid(item.metrics || [])}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function StageRail({
  title = '流程阶段',
  summary = '',
  items = [],
  activeKey = '',
  onChange,
}: SelectionPaneProps) {
  return (
    <section className={styles.regionSurface}>
      <div className={styles.regionHeader}>
        <h3>{title}</h3>
        {summary ? <p>{summary}</p> : null}
      </div>
      <ol className={styles.stageList}>
        {items.map((item, index) => {
          const selected = item.key === activeKey

          return (
            <li className={styles.stageItem} key={item.key}>
              <button
                className={selected ? styles.stageTriggerActive : styles.stageTrigger}
                onClick={() => onChange?.(item.key)}
                type="button"
              >
                <span className={styles.stageIndex}>{index + 1}</span>
                <span className={styles.stageBody}>
                  <span className={styles.stageTitleRow}>
                    <span className={styles.stageTitle}>{item.label}</span>
                    {item.badge ? <span className={styles.inlineBadge}>{item.badge}</span> : null}
                  </span>
                  {item.summary ? <span className={styles.stageSummary}>{item.summary}</span> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export function SnapshotPane({
  title,
  summary = '',
  facts = [],
  footer = null,
}: SnapshotPaneProps) {
  return (
    <section className={styles.regionSurface}>
      <div className={styles.regionHeader}>
        <h3>{title}</h3>
        {summary ? <p>{summary}</p> : null}
      </div>
      {renderFacts(facts)}
      {footer ? <div className={styles.regionFooter}>{footer}</div> : null}
    </section>
  )
}

export function SectionGroup({
  title,
  summary = '',
  fields = [],
  bulletPoints = [],
  footer = null,
  children = null,
}: SectionGroupProps) {
  return (
    <section className={styles.regionSurface}>
      <div className={styles.regionHeader}>
        <h3>{title}</h3>
        {summary ? <p>{summary}</p> : null}
      </div>
      {fields.length > 0 ? renderFacts(fields) : null}
      {bulletPoints.length > 0 ? (
        <ul className={styles.bulletList}>
          {bulletPoints.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null}
      {children}
      {footer ? <div className={styles.regionFooter}>{footer}</div> : null}
    </section>
  )
}

export function DetailHeaderPane({
  title,
  status = '',
  facts = [],
  metrics = [],
  actionLabel = '',
}: DetailHeaderPaneProps) {
  return (
    <section className={styles.detailHeaderPane}>
      <div className={styles.detailHeaderTop}>
        <div className={styles.detailHeaderTitleBlock}>
          <div className={styles.detailHeaderTitleRow}>
            <h3>{title || '--'}</h3>
            {status ? (
              <Tag
                appearance="filled"
                className={styles.statusBadge}
                shape="round"
                size="md"
                type={resolveStatusTagType(status)}
              >
                {status}
              </Tag>
            ) : null}
          </div>
        </div>
        {actionLabel ? (
          <Button appearance="link" type="primary">
            {actionLabel}
          </Button>
        ) : null}
      </div>

      {facts.length > 0 ? (
        <dl className={styles.detailMetaList}>
          {facts.map((fact, index) => (
            <div className={styles.detailMetaItem} key={`${fact.label || 'meta'}-${index}`}>
              <dt>{fact.label || '--'}</dt>
              <dd>{fact.value || '--'}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {renderMetricGrid(metrics)}
    </section>
  )
}

export function StatusTabStrip({
  tabs = [],
  policy,
  activeKey = '',
  onChange,
}: StatusTabStripProps) {
  if (!Array.isArray(tabs) || tabs.length === 0) return null
  const preferredCarrier = normalizeText(policy?.preferredCarrier) || 'tabs'

  if (preferredCarrier !== 'tabs') return null

  return (
    <section className={styles.statusTabStrip}>
      <Tabs
        activeId={activeKey || tabs[0]?.key || ''}
        onChange={(tabId) => onChange?.(String(tabId))}
        showDivider={false}
        type="line"
      >
        {tabs.map((tab) => (
          <Tabs.Pane
            key={tab.key}
            tabId={tab.key}
            tabTitle={renderCountLabel(tab.label, tab.count)}
          />
        ))}
      </Tabs>
    </section>
  )
}

export function DataTable({
  columns = [],
  rows = [],
  policy,
  emptyText = '暂无明细数据',
}: DataTableProps) {
  if (!Array.isArray(columns) || columns.length === 0) {
    return <div className={styles.emptyState}>{emptyText}</div>
  }
  const resolvedPolicy: NonTypicalTablePolicy = {
    preferredCarrier: 'table',
    cellWrap: 'nowrap',
    overflowX: 'auto',
    statusCarrier: 'tag',
    actionCarrier: 'button-link',
    ...policy,
  }
  const bodyCellClassName =
    resolvedPolicy.cellWrap === 'nowrap' ? styles.tableBodyCellNowrap : styles.tableBodyCellWrap
  const tableData = (Array.isArray(rows) ? rows : []).map((row) => ({
    key: row.key,
    __actions: row.actions || [],
    ...(row.cells || {}),
  }))
  const resolvedColumns = columns.map((column) => ({
    title: column.label,
    dataKey: column.key,
    width: resolveTableColumnWidth(column),
    render: (value: unknown, row: Record<string, unknown>) => {
      if (column.kind === 'actions') {
        const actions = Array.isArray(row.__actions) ? (row.__actions as NonTypicalAction[]) : []
        return (
          <div className={styles.actionCell}>
            {actions.map((action) => (
              <Button
                appearance="link"
                key={action.key || action.label}
                onClick={action.onClick}
                type={action.kind === 'primary' ? 'primary' : 'default'}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )
      }

      const cellText = normalizeText(value) || '--'

      if (column.kind === 'status' && resolvedPolicy.statusCarrier === 'tag') {
        return (
          <Tag appearance="filled" shape="round" size="sm" type={resolveStatusTagType(cellText)}>
            {cellText}
          </Tag>
        )
      }

      return <span className={styles.tableCellText}>{cellText}</span>
    },
  }))
  const tableMinWidth = resolvedColumns.reduce((sum, column) => sum + Number(column.width || 0), 0)

  return (
    <div className={styles.tableSurface} style={{ overflowX: resolvedPolicy.overflowX || 'auto' }}>
      <div className={styles.tableInner} style={{ minWidth: `${Math.max(tableMinWidth, 960)}px` }}>
        <Table
          classNames={{
            bodyCell: bodyCellClassName,
            headerCell: styles.tableHeaderCell,
            root: styles.dataTableRoot,
            wrapper: styles.dataTableWrapper,
          }}
          columns={resolvedColumns}
          data={tableData}
          emptyContent={<div className={styles.tableEmpty}>{emptyText}</div>}
          fieldKey="key"
          setting={false}
          showColMenu={false}
          sticky={false}
        />
      </div>
    </div>
  )
}

export function ActionStrip({ actions = [] }: ActionStripProps) {
  if (!Array.isArray(actions) || actions.length === 0) return null

  return (
    <div className={styles.actionStrip}>
      {actions.map((action) => (
        <Button
          appearance={action.kind === 'primary' ? undefined : 'line'}
          key={action.key || action.label}
          onClick={action.onClick}
          type={action.kind === 'primary' ? 'primary' : 'default'}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}
