import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Descriptions,
  DescriptionsItem,
  Drawer,
  Loading,
  PageHeader,
} from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalDrawerDetailPage.module.scss'

export type DetailField = {
  label: string
  value: string
}

export type DetailSection = {
  title: string
  fields: DetailField[]
}

export type FooterAction = {
  key: string
  label: string
  kind?: 'primary' | 'secondary'
  message?: string
}

export type DrawerDetailSchema = {
  pageType: 'drawer-detail'
  title: string
  drawerTitle: string
  sections: DetailSection[]
  footerActions?: FooterAction[]
}

type ProDetailPageContextValue = {
  detailData: DetailSection[]
  isDetailDataLoading: boolean
}

type ProDetailPageProviderProps = {
  request: () => Promise<DetailSection[]>
  children?: React.ReactNode
}

type ProDetailDrawerProps = {
  title: string
  visible: boolean
  width?: number
  closeable?: boolean
  unmountOnClose?: boolean
  onClose: () => void
  className?: string
  children?: React.ReactNode
}

const ProDetailPageContext = React.createContext<ProDetailPageContextValue>({
  detailData: [],
  isDetailDataLoading: false,
})

function joinClassNames(...classNames: Array<string | undefined | false | null>) {
  return classNames.filter(Boolean).join(' ')
}

function TypicalPageHeaderPortal({ children }: { children?: React.ReactNode }) {
  return <div className={styles.headerPortal}>{children}</div>
}

function ProDetailDrawer({
  title,
  visible,
  width = 600,
  closeable,
  unmountOnClose,
  onClose,
  className,
  children,
}: ProDetailDrawerProps) {
  return (
    <Drawer
      title={title}
      visible={visible}
      width={width}
      onClose={onClose}
      className={joinClassNames(styles.proDetailDrawer, className)}
      closeIcon={closeable === false ? null : undefined}
      destroyOnClose={unmountOnClose}
    >
      {children}
    </Drawer>
  )
}

function ProDetailDrawerBody({ children }: { children?: React.ReactNode }) {
  return <div className={styles.proDetailDrawerBody}>{children}</div>
}

function ProDetailPageProvider({ request, children }: ProDetailPageProviderProps) {
  const [detailData, setDetailData] = useState<DetailSection[]>([])
  const [isDetailDataLoading, setIsDetailDataLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadDetail() {
      setIsDetailDataLoading(true)
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
    <ProDetailPageContext.Provider value={contextValue}>
      {children}
    </ProDetailPageContext.Provider>
  )
}

function useProDetailPageContext() {
  return useContext(ProDetailPageContext)
}

function DrawerDetailInner({ schema }: { schema: DrawerDetailSchema }) {
  const hostAdapter = useHostAdapter()
  const [visible, setVisible] = useState(true)
  const { detailData, isDetailDataLoading } = useProDetailPageContext()

  const handleOpen = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
    hostAdapter.message.warning('已关闭抽屉详情（示例）')
  }

  return (
    <>
      <TypicalPageHeaderPortal>
        <PageHeader
          title={schema.title}
          backIcon={false}
          extra={
            <Button type="primary" onClick={handleOpen}>
              打开抽屉
            </Button>
          }
        />
      </TypicalPageHeaderPortal>

      <div className={styles.placeholderStage}>
        <Button type="primary" onClick={handleOpen}>
          打开抽屉详情
        </Button>
      </div>

      <ProDetailDrawer
        title={schema.drawerTitle}
        visible={visible}
        width={600}
        closeable
        unmountOnClose={false}
        onClose={handleClose}
      >
        <ProDetailDrawerBody>
          <Loading visible={isDetailDataLoading}>
            <div className={styles.sectionStack}>
              {detailData.map((section) => (
                <section key={section.title} className={styles.detailSection}>
                  <div className={styles.sectionTitle}>{section.title}</div>
                  <Descriptions
                    placement="vertical"
                    labelPlacement="left"
                    column={2}
                    columnGap={16}
                  >
                    {section.fields.map((field) => (
                      <DescriptionsItem key={`${section.title}-${field.label}`} label={field.label}>
                        {field.value || '—'}
                      </DescriptionsItem>
                    ))}
                  </Descriptions>
                </section>
              ))}
            </div>
          </Loading>
        </ProDetailDrawerBody>
      </ProDetailDrawer>
    </>
  )
}

export function CanonicalDrawerDetailPage({
  schema,
  className,
}: {
  schema: DrawerDetailSchema
  className?: string
}) {
  const request = useMemo(
    () => async () => schema.sections,
    [schema]
  )

  return (
    <div
      className={joinClassNames(styles.pageRoot, className)}
      data-hiui-pagegen-template="drawer-detail"
      data-hiui5-page-type="drawer-detail"
      data-hiui5-shell="hiui-pagegen-drawer-detail-v1"
    >
      <ProDetailPageProvider request={request}>
        <DrawerDetailInner schema={schema} />
      </ProDetailPageProvider>
    </div>
  )
}

export default CanonicalDrawerDetailPage
