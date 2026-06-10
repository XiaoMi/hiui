import { useMemo } from 'react'
import { Button, PageHeader } from '@hi-ui/hiui'
import type { DescriptionsProps } from '@hi-ui/hiui'
import { D, G } from '@hi-ui/schema-core'
import { GroupMapProvider, SchemaGroup } from '@hi-ui/schema-group'
import { SchemaDescriptionsBridge } from '@hi-ui/schema-group/descriptions'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import {
  ProDetailPage,
  ProDetailPageProvider,
} from '@hiui-design/typical-page-shells/pro-detail-page'
import { useNavigate } from 'react-router-dom'
import { getWorkOrderDetail } from './typical-pages.mock'
import styles from './full-page-detail.module.scss'
import { useTranslation } from '../../translation'

const detailGroupMap = {
  descriptions: SchemaDescriptionsBridge,
}

function FullPageDetailInner() {
  const navigate = useNavigate()
  const { locale, t } = useTranslation()
  const descriptionsProps = useMemo<DescriptionsProps>(
    () => ({
      placement: 'vertical',
      column: 3,
      labelPlacement: 'left',
      labelWidth: null,
    }),
    []
  )

  const groups = useMemo(
    () => [
      G(t('基础信息'), 'basicInfo')
        .Descriptions({
          fields: [
            D(t('工单号'), 'ticketNo').val,
            D(t('工单状态'), 'status').val,
            D(t('工单类型'), 'ticketType').val,
            D(t('服务方式'), 'serviceMethod').val,
            D(t('关联商品'), 'relatedProduct').val,
            D(t('购买渠道'), 'purchaseChannel').val,
            D(t('三包开始时间'), 'warrantyStart').val,
            D(t('三包截止时间'), 'warrantyEnd').val,
            D(t('来访原因'), 'visitReason').val,
          ],
          props: { descriptionsProps },
        })
        .CardProps({ size: 'lg' })
        .val,
      G(t('客户信息'), 'customerInfo')
        .Descriptions({
          fields: [
            D(t('用户姓名'), 'userName').val,
            D(t('用户标签'), 'userTags').val,
            D(t('用户电话'), 'userPhone').val,
          ],
          props: { descriptionsProps },
        })
        .CardProps({ size: 'lg' })
        .val,
      G(t('服务信息'), 'serviceInfo')
        .Descriptions({
          fields: [
            D(t('服务机构'), 'serviceOrg').val,
            D(t('服务工程师'), 'serviceEngineer').val,
            D(t('受理时间'), 'acceptedAt').val,
            D(t('问题描述'), 'description').MWP({ colSpan: 3 }).val,
          ],
          props: { descriptionsProps },
        })
        .CardProps({ size: 'lg' })
        .val,
    ],
    [descriptionsProps, t]
  )

  return (
    <ProDetailPage key={locale}>
      <TypicalPageHeaderPortal>
        <PageHeader
          title={t('全页详情')}
          onBack={() => navigate(-1)}
          extra={
            <Button type="default" appearance="line" onClick={() => void 0}>
              {t('查看流程')}
            </Button>
          }
        />
      </TypicalPageHeaderPortal>

      <div className={styles.detailBody}>
        <GroupMapProvider groups={detailGroupMap}>
          <SchemaGroup groups={groups} borderedGroups={false} />
        </GroupMapProvider>
      </div>
    </ProDetailPage>
  )
}

export function FullPageDetailPage() {
  const { locale, t, formatDate } = useTranslation()
  const request = useMemo(
    () => async () => {
      const response = await getWorkOrderDetail()

      return {
        basicInfo: {
          ...response.basicInfo,
          purchaseChannel: t(response.basicInfo.purchaseChannel),
          relatedProduct: t(response.basicInfo.relatedProduct),
          status: t(response.basicInfo.status),
          ticketNo: response.basicInfo.ticketNo,
          ticketType: t(response.basicInfo.ticketType),
          serviceMethod: t(response.basicInfo.serviceMethod),
          visitReason: t(response.basicInfo.visitReason),
          warrantyStart: formatDate(response.basicInfo.warrantyStart, dateOptions),
          warrantyEnd: formatDate(response.basicInfo.warrantyEnd, dateOptions),
        },
        customerInfo: {
          ...response.customerInfo,
          userName: t(response.customerInfo.userName),
          userTags: response.customerInfo.userTags
            .split(' / ')
            .map((item) => t(item))
            .join(' / '),
        },
        serviceInfo: {
          ...response.serviceInfo,
          serviceOrg: t(response.serviceInfo.serviceOrg),
          serviceEngineer: t(response.serviceInfo.serviceEngineer),
          description: t(response.serviceInfo.description),
          acceptedAt: formatDate(response.serviceInfo.acceptedAt, dateTimeOptions),
        },
      }
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
