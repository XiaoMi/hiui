import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { PageHeader } from '@hi-ui/hiui'
import { hiuiChartTokens } from '../../charts/hiui-chart-theme'
import { HostPageHeaderPortal } from '../layout/page-header-portal'

const sharedStyles = {
  cardGrid: {
    display: 'grid',
    gap: 12,
    inlineSize: '100%',
    minInlineSize: 0,
  } as CSSProperties,
  chartCard: {
    backgroundColor: hiuiChartTokens.surface,
    border: `1px solid ${hiuiChartTokens.border}`,
    borderRadius: 8,
    boxSizing: 'border-box',
    display: 'grid',
    gap: 12,
    inlineSize: '100%',
    minInlineSize: 0,
    paddingBlock: 16,
    paddingInline: 16,
  } as CSSProperties,
  chartHeader: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    minInlineSize: 0,
  } as CSSProperties,
  chartTitle: {
    color: hiuiChartTokens.text,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
  } as CSSProperties,
  chartDescription: {
    color: hiuiChartTokens.textTertiary,
    fontSize: 12,
    lineHeight: '20px',
  } as CSSProperties,
  controlStrip: {
    alignItems: 'center',
    backgroundColor: hiuiChartTokens.surfaceSubtle,
    border: `1px solid ${hiuiChartTokens.border}`,
    borderRadius: 12,
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: 12,
    inlineSize: '100%',
    minInlineSize: 0,
    rowGap: 8,
    paddingBlock: 8,
    paddingInline: 16,
  } as CSSProperties,
  controlStripLeading: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    minInlineSize: 0,
  } as CSSProperties,
  controlStripTrailing: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
    marginInlineStart: 'auto',
    minInlineSize: 0,
  } as CSSProperties,
  headerTitle: {
    fontSize: 18,
    fontWeight: 600,
  } as CSSProperties,
  metricCard: {
    border: `1px solid ${hiuiChartTokens.border}`,
    borderRadius: 8,
    boxSizing: 'border-box',
    display: 'grid',
    gap: 8,
    inlineSize: '100%',
    minInlineSize: 0,
    paddingBlock: 16,
    paddingInline: 16,
  } as CSSProperties,
  metricLabel: {
    color: hiuiChartTokens.textMeta,
    fontSize: 12,
    lineHeight: '20px',
  } as CSSProperties,
  metricValue: {
    color: hiuiChartTokens.text,
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '32px',
  } as CSSProperties,
  sectionBlock: {
    display: 'grid',
    gap: 12,
    inlineSize: '100%',
    minInlineSize: 0,
  } as CSSProperties,
  sectionDescription: {
    color: hiuiChartTokens.textTertiary,
    fontSize: 12,
    lineHeight: '20px',
  } as CSSProperties,
  sectionHeader: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    minInlineSize: 0,
  } as CSSProperties,
  sectionTitle: {
    color: hiuiChartTokens.text,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
  } as CSSProperties,
  surfaceCard: {
    border: `1px solid ${hiuiChartTokens.border}`,
    borderRadius: 8,
    boxSizing: 'border-box',
    display: 'grid',
    gap: 12,
    inlineSize: '100%',
    minInlineSize: 0,
    paddingBlock: 16,
    paddingInline: 16,
  } as CSSProperties,
  tablePagination: {
    alignItems: 'center',
    borderBlockStart: `1px solid ${hiuiChartTokens.border}`,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    minInlineSize: 0,
    paddingBlockStart: 16,
  } as CSSProperties,
  tableShell: {
    display: 'grid',
    gap: 0,
    inlineSize: '100%',
    minInlineSize: 0,
  } as CSSProperties,
  tableViewport: {
    inlineSize: '100%',
    maxInlineSize: '100%',
    minInlineSize: 0,
    overflowX: 'auto',
    overflowY: 'visible',
  } as CSSProperties,
  whiteBody: {
    backgroundColor: hiuiChartTokens.surface,
    border: `1px solid ${hiuiChartTokens.border}`,
    borderRadius: 16,
    boxSizing: 'border-box',
    display: 'grid',
    gap: 16,
    inlineSize: '100%',
    minInlineSize: 0,
    paddingBlock: 16,
    paddingInline: 16,
  } as CSSProperties,
}

type SharedDivProps = HTMLAttributes<HTMLDivElement>

export function ManagedPageHeader({
  extra,
  onBack,
  title,
}: {
  extra?: ReactNode
  onBack?: () => void
  title: ReactNode
}) {
  return (
    <HostPageHeaderPortal>
      <PageHeader
        extra={extra}
        onBack={onBack}
        style={{ margin: 0, paddingBlock: 0, paddingBottom: 0, paddingTop: 0 }}
        title={<span style={sharedStyles.headerTitle}>{title}</span>}
      >
      </PageHeader>
    </HostPageHeaderPortal>
  )
}

export function ManagedWhiteBodyWorkspace({
  children,
  style,
  ...rest
}: SharedDivProps) {
  return (
    <div
      data-hiui5-region="white-body"
      style={{ ...sharedStyles.whiteBody, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

export function SectionBlock({
  children,
  description,
  headerExtra,
  region,
  style,
  title,
}: {
  children: ReactNode
  description?: ReactNode
  headerExtra?: ReactNode
  region?: string
  style?: CSSProperties
  title: ReactNode
}) {
  return (
    <section data-hiui5-region={region} style={{ ...sharedStyles.sectionBlock, ...style }}>
      <div style={sharedStyles.sectionHeader}>
        <div>
          <div style={sharedStyles.sectionTitle}>{title}</div>
          {description ? <div style={sharedStyles.sectionDescription}>{description}</div> : null}
        </div>
        {headerExtra}
      </div>
      {children}
    </section>
  )
}

export function DashboardControlStrip({
  leading,
  trailing,
}: {
  leading: ReactNode
  trailing?: ReactNode
}) {
  return (
    <section data-hiui5-region="query-filter" style={sharedStyles.controlStrip}>
      <div style={sharedStyles.controlStripLeading}>{leading}</div>
      {trailing ? <div style={sharedStyles.controlStripTrailing}>{trailing}</div> : null}
    </section>
  )
}

export function ManagedCardGrid({
  children,
  minItemWidth,
  style,
}: {
  children: ReactNode
  minItemWidth: number
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        ...sharedStyles.cardGrid,
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minItemWidth}px), 1fr))`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function ManagedMetricCard({
  label,
  meta,
  value,
}: {
  label: ReactNode
  meta?: ReactNode
  value: ReactNode
}) {
  return (
    <div data-hiui5-stat-presentation="cards" style={sharedStyles.metricCard}>
      <div style={sharedStyles.metricLabel}>{label}</div>
      <div style={sharedStyles.metricValue}>{value}</div>
      {meta ? <div style={sharedStyles.sectionDescription}>{meta}</div> : null}
    </div>
  )
}

export function ManagedSurfaceCard({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  return <article style={{ ...sharedStyles.surfaceCard, ...style }}>{children}</article>
}

export function ManagedChartCard({
  body,
  description,
  title,
}: {
  body: ReactNode
  description?: ReactNode
  title: ReactNode
}) {
  return (
    <section data-hiui5-chart-card="adaptive" style={sharedStyles.chartCard}>
      <div style={sharedStyles.chartHeader}>
        <div>
          <div style={sharedStyles.chartTitle}>{title}</div>
          {description ? <div style={sharedStyles.chartDescription}>{description}</div> : null}
        </div>
      </div>
      <div
        data-hiui5-chart-body="adaptive"
        style={{
          blockSize: 264,
          boxSizing: 'border-box',
          inlineSize: '100%',
          maxInlineSize: '100%',
          minBlockSize: 264,
          minInlineSize: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            blockSize: '100%',
            boxSizing: 'border-box',
            inlineSize: '100%',
            maxInlineSize: '100%',
            minInlineSize: 0,
            overflow: 'hidden',
          }}
        >
          {body}
        </div>
      </div>
    </section>
  )
}

export function JoinedTableSection({
  description,
  pagination,
  table,
  title,
}: {
  description?: ReactNode
  pagination: ReactNode
  table: ReactNode
  title: ReactNode
}) {
  return (
    <section data-hiui5-region="table" data-hiui5-table-shell="joined" style={sharedStyles.sectionBlock}>
      <div style={sharedStyles.sectionHeader}>
        <div>
          <div style={sharedStyles.sectionTitle}>{title}</div>
          {description ? <div style={sharedStyles.sectionDescription}>{description}</div> : null}
        </div>
      </div>
      <div style={sharedStyles.tableShell}>
        <div style={sharedStyles.tableViewport}>{table}</div>
        <div data-hiui5-region="pagination" style={sharedStyles.tablePagination}>
          {pagination}
        </div>
      </div>
    </section>
  )
}
