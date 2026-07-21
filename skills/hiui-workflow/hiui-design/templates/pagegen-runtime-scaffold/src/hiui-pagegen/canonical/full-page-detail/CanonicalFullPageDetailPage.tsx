import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Descriptions, DescriptionsItem, PageHeader, Table } from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalFullPageDetailPage.module.scss'

export type DetailField = {
  label: string
  value: string
}

export type DetailTableColumn = {
  key: string
  label: string
  width?: number
}

export type DetailDescriptionsSection = {
  kind?: 'descriptions'
  title: string
  fields: DetailField[]
}

export type DetailTableSection = {
  kind: 'table'
  title: string
  columns: DetailTableColumn[]
  rows: Array<Record<string, string | number>>
}

export type DetailSection = DetailDescriptionsSection | DetailTableSection

export type PageAction = {
  key: string
  label: string
  kind?: 'primary' | 'secondary'
  message?: string
  navigateTo?: string
}

export type FullPageDetailSchema = {
  pageType: 'full-page-detail'
  title: string
  backTo?: string
  sections: DetailSection[]
  actions?: PageAction[]
}

type ProDetailPageContextValue = {
  detailData: DetailSection[]
  isDetailDataLoading: boolean
}

type ProDetailPageProviderProps = {
  request: () => Promise<DetailSection[]>
  children?: React.ReactNode
}

type GroupMapContextValue = {
  groups: Record<string, unknown>
}

const SchemaDescriptionsBridge = 'SchemaDescriptionsBridge'
const SchemaTableBridge = 'SchemaTableBridge'
const detailGroupMap = {
  descriptions: SchemaDescriptionsBridge,
  table: SchemaTableBridge,
}

const ProDetailPageContext = React.createContext<ProDetailPageContextValue>({
  detailData: [],
  isDetailDataLoading: false,
})

const GroupMapContext = React.createContext<GroupMapContextValue>({
  groups: detailGroupMap,
})

function joinClassNames(...classNames: Array<string | undefined | false | null>) {
  return classNames.filter(Boolean).join(' ')
}

function TypicalPageHeaderPortal({ children }: { children?: React.ReactNode }) {
  return <div className={styles.headerPortal}>{children}</div>
}

function useProDetailPageContext() {
  return useContext(ProDetailPageContext)
}

function ProDetailPageProvider({ request, children }: ProDetailPageProviderProps) {
  const [detailData, setDetailData] = useState<DetailSection[]>([])
  const [isDetailDataLoading, setIsDetailDataLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadDetail() {
      const nextDetailData = await request()
      if (cancelled) {
        return
      }

      setDetailData(nextDetailData)
      setIsDetailDataLoading(false)
    }

    loadDetail()

    return () => {
      cancelled = true
    }
  }, [request])

  const contextValue = useMemo(
    () => ({
      detailData,
      isDetailDataLoading,
    }),
    [detailData, isDetailDataLoading]
  )

  return (
    <ProDetailPageContext.Provider value={contextValue}>{children}</ProDetailPageContext.Provider>
  )
}

function ProDetailPage({ children }: { children?: React.ReactNode }) {
  return <div className={styles.proDetailPage}>{children}</div>
}

function GroupMapProvider({
  groups,
  children,
}: {
  groups: Record<string, unknown>
  children?: React.ReactNode
}) {
  return <GroupMapContext.Provider value={{ groups }}>{children}</GroupMapContext.Provider>
}

function renderDetailSection(section: DetailSection) {
  if (section.kind === 'table') {
    return (
      <section key={section.title} className={styles.detailCard}>
        <div className={styles.sectionTitle}>{section.title}</div>
        <Table
          bordered={false}
          columns={section.columns.map((column) => ({
            title: column.label,
            dataKey: column.key,
            width: column.width || 160,
            render: (value: unknown) => String(value ?? '-'),
          }))}
          data={section.rows}
          rowKey={(_, index) => index}
        />
      </section>
    )
  }

  return (
    <section key={section.title} className={styles.detailCard}>
      <div className={styles.sectionTitle}>{section.title}</div>
      <Descriptions placement="vertical" column={3} labelPlacement="left" labelWidth={undefined}>
        {section.fields.map((field) => (
          <DescriptionsItem key={`${section.title}-${field.label}`} label={field.label}>
            {field.value || '—'}
          </DescriptionsItem>
        ))}
      </Descriptions>
    </section>
  )
}

function SchemaGroup({ groups }: { groups: DetailSection[] }) {
  return (
    <div className={styles.groupStack}>{groups.map((group) => renderDetailSection(group))}</div>
  )
}

export function CanonicalFullPageDetailPage({
  schema,
  className,
}: {
  schema: FullPageDetailSchema
  className?: string
}) {
  const hostAdapter = useHostAdapter()
  const request = useMemo(() => async () => schema.sections, [schema.sections])

  const handleAction = (action: PageAction) => {
    if (action.navigateTo) {
      hostAdapter.navigate(action.navigateTo)
      return
    }

    hostAdapter.message.success(action.message || `${action.label}（示例）`)
  }

  return (
    <div
      className={joinClassNames(styles.pageRoot, className)}
      data-hiui-pagegen-template="full-page-detail"
      data-hiui5-page-type="full-page-detail"
      data-hiui5-shell="hiui-pagegen-full-page-detail-v1"
    >
      <ProDetailPageProvider request={request}>
        <ProDetailPage>
          <TypicalPageHeaderPortal>
            <PageHeader
              title={schema.title}
              backIcon={Boolean(schema.backTo)}
              onBack={
                schema.backTo ? () => hostAdapter.navigate(schema.backTo as string) : undefined
              }
              extra={
                schema.actions?.length ? (
                  <div className={styles.headerActions}>
                    {schema.actions.map((action) => (
                      <Button
                        key={action.key}
                        type={action.kind === 'primary' ? 'primary' : 'secondary'}
                        onClick={() => handleAction(action)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                ) : null
              }
            />
          </TypicalPageHeaderPortal>

          <DetailBody />
        </ProDetailPage>
      </ProDetailPageProvider>
    </div>
  )
}

function DetailBody() {
  const { detailData, isDetailDataLoading } = useProDetailPageContext()

  return (
    <div className={styles.detailBody}>
      <div className={styles.detailSurface}>
        {isDetailDataLoading ? (
          <div className={styles.loadingCard}>详情加载中...</div>
        ) : (
          <GroupMapProvider groups={detailGroupMap}>
            <SchemaGroup groups={detailData} borderedGroups={false} />
          </GroupMapProvider>
        )}
      </div>
    </div>
  )
}

export default CanonicalFullPageDetailPage
