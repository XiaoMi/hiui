import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { Button, Card, Tag } from 'hiui5'
import { StatOverviewGrid } from '../../components/hiui-design-runtime/pro-stat-page'
import styles from './index.module.scss'

export type MetricCardProps = {
  active?: boolean
  className?: string
  note?: string
  onClick?: () => void
  stateHint?: string
  title: string
  titleTooltip?: string
  value: string | number
  visual?: ReactNode
}

export type MetricOverviewItem = {
  note?: string
  stateHint?: string
  title: string
  titleTooltip?: string
  value: string | number
  visual?: ReactNode
}

export type MetricOverviewGridProps = {
  cardGap?: number
  getKey?: (item: MetricOverviewItem, index: number) => string
  minCardWidth?: number
  request: () => Promise<{ list: MetricOverviewItem[] }>
}

export type ChartCardProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
  contentStyle?: CSSProperties
  headerExtra?: ReactNode
  subtitle?: string
  title: string
}

export type SectionHeaderProps = {
  className?: string
  extra?: ReactNode
  summary?: string
  title: string
}

export type EntityCardFact = {
  label: string
  value: string
}

export type EntityCardAction = {
  label: string
  onClick?: () => void
  tone?: 'primary' | 'default'
}

export type EntityActionCardProps = {
  actions?: EntityCardAction[]
  className?: string
  description?: string
  facts?: EntityCardFact[]
  highlight?: string
  primaryTag?: string
  tags?: string[]
  title: string
}

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

function handleCardActivation(event: KeyboardEvent<HTMLDivElement>, onActivate?: () => void) {
  if (!onActivate) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onActivate()
}

function formatMetricCardValue(value: string | number) {
  return typeof value === 'number' ? value.toLocaleString('zh-CN') : value
}

export function MetricCard({
  active = false,
  className,
  note,
  onClick,
  stateHint,
  title,
  titleTooltip,
  value,
  visual,
}: MetricCardProps) {
  const cardClassName = joinClassNames(
    styles.metricCard,
    active ? styles.metricCardActive : '',
    onClick ? styles.metricCardInteractive : '',
    className
  )

  return (
    <div
      className={cardClassName}
      onClick={onClick}
      onKeyDown={(event) => handleCardActivation(event, onClick)}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.metricHeader}>
        <div className={styles.metricTitle} title={titleTooltip || title}>
          {title}
        </div>
        {stateHint ? <span className={styles.metricStateHint}>{stateHint}</span> : null}
      </div>
      <div className={styles.metricValueRow}>
        <span className={styles.metricValue}>{formatMetricCardValue(value)}</span>
        {note ? <span className={styles.metricNote}>{note}</span> : null}
      </div>
      {visual ? <div className={styles.metricVisual}>{visual}</div> : null}
    </div>
  )
}

export function MetricOverviewGrid({
  cardGap,
  getKey,
  minCardWidth,
  request,
}: MetricOverviewGridProps) {
  return (
    <StatOverviewGrid
      cardGap={cardGap}
      getKey={getKey}
      minCardWidth={minCardWidth}
      renderCard={(item) => (
        <MetricCard
          note={item.note}
          stateHint={item.stateHint}
          title={item.title}
          titleTooltip={item.titleTooltip || item.title}
          value={item.value}
          visual={item.visual}
        />
      )}
      request={request}
    />
  )
}

export function ChartCard({
  children,
  className,
  contentClassName,
  headerExtra,
  subtitle,
  title,
}: ChartCardProps) {
  return (
    <Card
      bordered
      className={joinClassNames(styles.chartCard, className)}
      extra={headerExtra}
      classNames={{ body: joinClassNames(styles.chartCardBody, contentClassName) }}
      size="lg"
      role="article"
      subtitle={subtitle}
      title={title}
    >
      <div className={styles.chartContent}>
        {children}
      </div>
    </Card>
  )
}

export function SectionHeader({
  className,
  extra,
  summary,
  title,
}: SectionHeaderProps) {
  return (
    <div className={joinClassNames(styles.sectionHeader, className)}>
      <div className={styles.sectionHeaderTitleBlock}>
        <h3 className={styles.sectionHeaderTitle}>{title}</h3>
        {summary ? <p className={styles.sectionHeaderSummary}>{summary}</p> : null}
      </div>
      {extra ? <div className={styles.sectionHeaderExtra}>{extra}</div> : null}
    </div>
  )
}

export function EntityActionCard({
  actions = [],
  className,
  description,
  facts = [],
  highlight,
  primaryTag,
  tags = [],
  title,
}: EntityActionCardProps) {
  return (
    <Card
      bordered
      className={joinClassNames(styles.entityCard, className)}
      classNames={{ body: styles.entityCardBody }}
      hoverable
      role="article"
    >
      <div className={styles.entityCardHeader}>
        <div className={styles.entityTitleBlock}>
          <h4 className={styles.entityTitle}>{title}</h4>
          {highlight ? <p className={styles.entityHighlight}>{highlight}</p> : null}
        </div>
        {tags.length > 0 || primaryTag ? (
          <div className={styles.entityTagGroup}>
            {tags.map((tag) => (
              <Tag appearance="line" key={tag} shape="round" size="sm" type="default">
                {tag}
              </Tag>
            ))}
            {primaryTag ? (
              <Tag appearance="filled" shape="round" size="sm" type="primary">
                {primaryTag}
              </Tag>
            ) : null}
          </div>
        ) : null}
      </div>

      {description ? <p className={styles.entityDescription}>{description}</p> : null}

      {facts.length > 0 ? (
        <dl className={styles.entityFactList}>
          {facts.map((fact, index) => (
            <div className={styles.entityFactItem} key={`${fact.label || 'fact'}-${index}`}>
              <dt className={styles.entityFactLabel}>{fact.label}</dt>
              <dd className={styles.entityFactValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {actions.length > 0 ? (
        <div className={styles.entityCardActions}>
          {actions.map((action, index) => (
            <Button
              appearance={action.tone === 'primary' ? undefined : 'line'}
              key={`${action.label || 'action'}-${index}`}
              onClick={action.onClick}
              type={action.tone === 'primary' ? 'primary' : 'default'}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </Card>
  )
}
