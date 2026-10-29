import { useMemo } from 'react'
import { Button, PageHeader } from '@hi-ui/hiui'
import type { DescriptionsProps } from '@hi-ui/hiui'
import { D, G } from '@hi-ui/schema-core'
import { GroupMapProvider, SchemaGroup } from '@hi-ui/schema-group'
import { SchemaDescriptionsBridge } from '@hi-ui/schema-group/descriptions'
import { SchemaTableBridge } from '@hi-ui/schema-group/table'
import {
  ProDetailPage,
  ProDetailPageProvider,
  useProDetailPageContext,
} from '../components/hiui-design-runtime/pro-detail-page'
import { getWorkOrderDetail } from './typical-pages.mock'
import styles from './full-page-detail.module.scss'
import { useTranslation } from './page-localization'

const detailGroupMap = {
  descriptions: SchemaDescriptionsBridge,
  table: SchemaTableBridge,
}

type DetailFieldConfig = {
  label: string
  key: string
  colSpan?: 1 | 2 | 3
}

type DetailDateFieldConfig = {
  label: string
  key: string
}

type DetailTableColumnConfig = {
  label: string
  key: string
  width?: number
}

type DetailDescriptionSectionConfig = {
  kind: 'description-group'
  title: string
  dataKey: string
  fields: DetailFieldConfig[]
}

type DetailSummaryCardsSectionConfig = {
  kind: 'summary-cards'
  title: string
  dataKey: string
  cardTitleKey: string
  metricValueKey: string
  metricUnitText?: string
  metaText?: string
  dateFields?: DetailDateFieldConfig[]
}

type DetailDataTableSectionConfig = {
  kind: 'data-table'
  title: string
  dataKey: string
  columns: DetailTableColumnConfig[]
}

type DetailSectionConfig =
  | DetailDescriptionSectionConfig
  | DetailSummaryCardsSectionConfig
  | DetailDataTableSectionConfig

const detailSectionConfigs: DetailSectionConfig[] = [
  // hiui5-pagegen:detail-sections:start
  {
    kind: 'description-group',
    title: '基础信息',
    dataKey: 'basicInfo',
    fields: [
      { label: '工单号', key: 'ticketNo' },
      { label: '工单状态', key: 'status' },
      { label: '工单类型', key: 'ticketType' },
      { label: '服务方式', key: 'serviceMethod' },
      { label: '关联商品', key: 'relatedProduct' },
      { label: '购买渠道', key: 'purchaseChannel' },
      { label: '来访原因', key: 'visitReason' },
    ],
  },
  {
    kind: 'summary-cards',
    title: '三包信息',
    dataKey: 'warrantyInfo',
    cardTitleKey: 'type',
    metricValueKey: 'remainingDays',
    metricUnitText: '天',
    metaText: '剩余天数',
    dateFields: [
      { label: '开始时间', key: 'startAt' },
      { label: '截止时间', key: 'endAt' },
    ],
  },
  {
    kind: 'description-group',
    title: '客户信息',
    dataKey: 'customerInfo',
    fields: [
      { label: '用户姓名', key: 'userName' },
      { label: '用户标签', key: 'userTags' },
      { label: '用户电话', key: 'userPhone' },
    ],
  },
  {
    kind: 'description-group',
    title: '服务信息',
    dataKey: 'serviceInfo',
    fields: [
      { label: '服务机构', key: 'serviceOrg' },
      { label: '服务工程师', key: 'serviceEngineer' },
      { label: '受理时间', key: 'acceptedAt' },
      { label: '问题描述', key: 'description', colSpan: 3 },
    ],
  },
  {
    kind: 'data-table',
    title: '服务记录',
    dataKey: 'serviceRecords',
    columns: [
      { label: '服务时间', key: 'serviceTime', width: 180 },
      { label: '服务动作', key: 'serviceAction', width: 160 },
      { label: '状态', key: 'status', width: 120 },
      { label: '详情描述', key: 'detailDescription', width: 360 },
    ],
  },
  // hiui5-pagegen:detail-sections:end
]

function renderSectionValue(record: Record<string, unknown>, key: string) {
  const value = record?.[key]
  return value === null || value === undefined || value === '' ? '--' : value
}

function buildDescriptionField(field: DetailFieldConfig, translate: (key: string) => string) {
  const schemaField = D(translate(field.label), field.key)
  if (field.colSpan) {
    return schemaField.MWP({ colSpan: field.colSpan }).val
  }

  return schemaField.val
}

function buildTableField(column: DetailTableColumnConfig, translate: (key: string) => string) {
  const schemaField =
    typeof column.width === 'number'
      ? D(translate(column.label), column.key).W(column.width)
      : D(translate(column.label), column.key)

  return schemaField.val
}

function createSummaryCardsRenderer(
  section: DetailSummaryCardsSectionConfig,
  translate: (key: string) => string,
  formatNumber: (value: number) => string
) {
  return function SummaryCardsSection() {
    const { detailData } = useProDetailPageContext()
    const summaryCards = (detailData?.[section.dataKey] ?? []) as Array<Record<string, unknown>>

    return (
      <div className={styles.warrantyGrid}>
        {summaryCards.map((item, index) => (
          <article
            className={styles.warrantyCard}
            key={String(renderSectionValue(item, section.cardTitleKey) ?? index)}
          >
            <div className={styles.warrantyType}>{translate(String(renderSectionValue(item, section.cardTitleKey)))}</div>
            <div className={styles.warrantyRemaining}>
              <span className={styles.warrantyRemainingValue}>
                {(() => {
                  const metricValue = item?.[section.metricValueKey]
                  return typeof metricValue === 'number' ? formatNumber(metricValue) : renderSectionValue(item, section.metricValueKey)
                })()}
              </span>
              {section.metricUnitText ? (
                <span className={styles.warrantyRemainingUnit}>{translate(section.metricUnitText)}</span>
              ) : null}
            </div>
            {section.metaText ? <div className={styles.warrantyMeta}>{translate(section.metaText)}</div> : null}
            {section.dateFields?.length ? (
              <dl className={styles.warrantyDates}>
                {section.dateFields.map((field) => (
                  <div key={`${section.dataKey}-${field.key}`}>
                    <dt>{translate(field.label)}</dt>
                    <dd>{renderSectionValue(item, field.key)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </article>
        ))}
      </div>
    )
  }
}

function buildDetailGroup(
  section: DetailSectionConfig,
  descriptionsProps: DescriptionsProps,
  translate: (key: string) => string,
  formatNumber: (value: number) => string
) {
  if (section.kind === 'description-group') {
    return G(translate(section.title), section.dataKey)
      .Descriptions({
        fields: section.fields.map((field) => buildDescriptionField(field, translate)),
        props: { descriptionsProps },
      })
      .CardProps({ size: 'lg' })
      .val
  }

  if (section.kind === 'summary-cards') {
    return G(translate(section.title), section.dataKey)
      .Custom({
        render: createSummaryCardsRenderer(section, translate, formatNumber),
      })
      .CardProps({ size: 'lg' })
      .val
  }

  return G(translate(section.title), section.dataKey)
    .Table({
      fields: section.columns.map((column) => buildTableField(column, translate)),
      props: {
        className: styles.serviceRecordTable,
        tableProps: {
          bordered: false,
          striped: false,
        },
      },
    })
    .CardProps({ size: 'lg' })
    .val
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function looksLikeDateValue(value: string) {
  return /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/.test(value)
}

function normalizeDetailLeafValue(
  value: unknown,
  translate: (key: string) => string,
  formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string
) {
  if (typeof value !== 'string') return value

  const trimmedValue = value.trim()
  if (!trimmedValue) return value

  if (looksLikeDateValue(trimmedValue)) {
    return formatDate(
      trimmedValue,
      /[ T]\d{2}:\d{2}/.test(trimmedValue) ? dateTimeOptions : dateOptions
    )
  }

  return translate(value)
}

function normalizeDetailPayload(
  value: unknown,
  translate: (key: string) => string,
  formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeDetailPayload(item, translate, formatDate))
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        normalizeDetailPayload(nestedValue, translate, formatDate),
      ])
    )
  }

  return normalizeDetailLeafValue(value, translate, formatDate)
}

function FullPageDetailInner() {
  const { locale, t, formatNumber } = useTranslation()
  const descriptionsProps = useMemo<DescriptionsProps>(
    () => ({
      placement: 'vertical',
      labelPlacement: 'left',
      labelWidth: 120,
      column: 3,
    }),
    []
  )

  const groups = useMemo(
    () =>
      detailSectionConfigs.map((section) =>
        buildDetailGroup(section, descriptionsProps, t, formatNumber)
      ),
    [descriptionsProps, formatNumber, t]
  )

  return (
    <div className={styles.detailPageRoot}>
      <PageHeader
        className={styles.pageHeader}
        title={t('全页详情')}
        onBack={() => {
          if (typeof window === 'undefined') return
          if (window.history.length > 1) {
            window.history.back()
            return
          }
          window.close()
        }}
        extra={
          <Button type="default" appearance="line" onClick={() => void 0}>
            {t('查看流程')}
          </Button>
        }
      />

      <div className={styles.whiteBody}>
        <ProDetailPage key={locale}>
          <div className={styles.detailBody}>
            <GroupMapProvider groups={detailGroupMap}>
              <SchemaGroup groups={groups} borderedGroups={false} />
            </GroupMapProvider>
          </div>
        </ProDetailPage>
      </div>
    </div>
  )
}

export function FullPageDetailPage() {
  const { locale, t, formatDate } = useTranslation()
  const request = useMemo(
    () => async () => {
      const response = await getWorkOrderDetail()

      return normalizeDetailPayload(response, t, formatDate) as Record<string, unknown>
    },
    [formatDate, t]
  )

  return (
    <ProDetailPageProvider key={locale} request={request}>
      <FullPageDetailInner />
    </ProDetailPageProvider>
  )
}

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
} as const

const dateTimeOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
} as const

export default FullPageDetailPage
