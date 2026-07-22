import { useMemo, useState } from 'react'
import { Button, Descriptions, Loading, PageHeader } from '@hi-ui/hiui'
import type { DescriptionsItemProps } from '@hi-ui/descriptions'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import {
  ProDetailPageProvider,
  useProDetailPageContext,
} from '@hiui-design/typical-page-shells/pro-detail-page'
import { ProDetailDrawer, ProDetailDrawerBody } from '@hiui-design/typical-page-shells/pro-detail-drawer'
import { getDrawerUserDetail } from './typical-pages.mock'
import { useTranslation } from '../../translation'

const placeholderStyle = {
  minHeight: 'calc(100vh - 60px)',
  padding: 20,
  background: '#fff',
  borderRadius: '12px 12px 0 0',
  boxSizing: 'border-box' as const,
} as const

function DrawerDetailInner() {
  const { locale, t, formatDate } = useTranslation()
  const [visible, setVisible] = useState(true)
  const { detailData, isDetailDataLoading } = useProDetailPageContext()

  const descriptionData = useMemo<DescriptionsItemProps[]>(
    () => [
      { label: t('用户姓名'), value: detailData?.userName ? t(detailData.userName) : '—' },
      { label: t('米聊号'), value: detailData?.miTalkId ?? '—' },
      { label: t('用户电话'), value: detailData?.phone ?? '—' },
      { label: t('邮箱'), value: detailData?.email ?? '—' },
      { label: t('用户角色'), value: detailData?.roleTitle ? t(detailData.roleTitle) : '—' },
      { label: t('岗位名称'), value: detailData?.positionTitle ? t(detailData.positionTitle) : '—' },
      { label: t('所属机构'), value: detailData?.organizationTitle ? t(detailData.organizationTitle) : '—' },
      { label: t('入职日期'), value: detailData?.entryDate ? formatDate(detailData.entryDate, dateOptions) : '—' },
      { label: t('用户状态'), value: detailData?.userStatusTitle ? t(detailData.userStatusTitle) : '—' },
      { label: t('备注信息'), value: detailData?.remark ? t(detailData.remark) : '—', colSpan: 2 },
    ],
    [detailData, formatDate, t]
  )

  return (
    <>
      <TypicalPageHeaderPortal>
        <PageHeader
          title={t('抽屉详情')}
          extra={
            <Button type="primary" onClick={() => setVisible(true)}>
              {t('打开抽屉')}
            </Button>
          }
        />
      </TypicalPageHeaderPortal>

      <div style={placeholderStyle}>
        <Button type="primary" onClick={() => setVisible(true)}>
          {t('打开抽屉详情')}
        </Button>
      </div>

      <ProDetailDrawer
        key={locale}
        title={t('用户详情')}
        visible={visible}
        width={600}
        closeable
        unmountOnClose={false}
        onClose={() => setVisible(false)}
      >
        <ProDetailDrawerBody>
          <Loading visible={isDetailDataLoading}>
            <Descriptions
              placement="vertical"
              labelPlacement="left"
              column={2}
              columnGap={16}
              data={descriptionData}
            />
          </Loading>
        </ProDetailDrawerBody>
      </ProDetailDrawer>
    </>
  )
}

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
} as const

export function DrawerDetailPage() {
  const { locale, t } = useTranslation()
  const request = useMemo(
    () => async () => {
      const response = await getDrawerUserDetail()

      return {
        ...response,
        organizationTitle: t(response.organizationTitle),
        positionTitle: t(response.positionTitle),
        remark: t(response.remark),
        roleTitle: t(response.roleTitle),
        userName: t(response.userName),
        userStatusTitle: t(response.userStatusTitle),
      }
    },
    [t]
  )

  return (
    <ProDetailPageProvider key={locale} request={request}>
      <DrawerDetailInner />
    </ProDetailPageProvider>
  )
}
