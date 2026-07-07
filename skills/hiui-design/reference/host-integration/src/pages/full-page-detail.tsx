import { useMemo } from 'react'
import { Button, PageHeader } from '@hi-ui/hiui'
import type { DescriptionsProps } from '@hi-ui/hiui'
import { D, G } from '@hi-ui/schema-core'
import { GroupMapProvider, SchemaGroup } from '@hi-ui/schema-group'
import { SchemaDescriptionsBridge } from '@hi-ui/schema-group/descriptions'
import { SchemaTableBridge } from '@hi-ui/schema-group/table'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import {
  ProDetailPage,
  ProDetailPageProvider,
  useProDetailPageContext,
} from '@hiui-design/typical-page-shells/pro-detail-page'
import { useNavigate } from 'react-router-dom'
import { getWorkOrderDetail } from './typical-pages.mock'
import styles from './full-page-detail.module.scss'
import { useTranslation } from '../../translation'

const detailGroupMap = {
  descriptions: SchemaDescriptionsBridge,
  table: SchemaTableBridge,
}

type WarrantyInfoItem = {
  type: string
  remainingDays: number
  startAt: string
  endAt: string
}

function WarrantyInfoCards() {
  const { detailData } = useProDetailPageContext()
  const { t, formatNumber } = useTranslation()
  const warrantyInfo = (detailData?.warrantyInfo ?? []) as WarrantyInfoItem[]

  return (
    <div className={styles.warrantyGrid}>
      {warrantyInfo.map((item) => (
        <article className={styles.warrantyCard} key={item.type}>
          <div className={styles.warrantyType}>{t(item.type)}</div>
          <div className={styles.warrantyRemaining}>
            <span className={styles.warrantyRemainingValue}>{formatNumber(item.remainingDays)}</span>
            <span className={styles.warrantyRemainingUnit}>{t('天')}</span>
          </div>
          <div className={styles.warrantyMeta}>
            <span>{t('剩余天数')}</span>
          </div>
          <dl className={styles.warrantyDates}>
            <div>
              <dt>{t('开始时间')}</dt>
              <dd>{item.startAt}</dd>
            </div>
            <div>
              <dt>{t('截止时间')}</dt>
              <dd>{item.endAt}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

function FullPageDetailInner() {
  const navigate = useNavigate()
  const { locale, t } = useTranslation()
  const descriptionsProps = useMemo<DescriptionsProps>(
    () => ({
      placement: 'vertical',
      column: 3,
      labelPlacement: 'left',
      labelWidth: undefined,
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
            D(t('来访原因'), 'visitReason').val,
          ],
          props: { descriptionsProps },
        })
        .CardProps({ size: 'lg' })
        .val,
      G(t('三包信息'), 'warrantyInfo')
        .Custom({
          render: () => <WarrantyInfoCards />,
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
      G(t('服务记录'), 'serviceRecords')
        .Table({
          fields: [
            D(t('服务时间'), 'serviceTime').W(180).val,
            D(t('服务动作'), 'serviceAction').W(160).val,
            D(t('状态'), 'status').W(120).val,
            D(t('详情描述'), 'detailDescription').W(360).val,
          ],
          props: {
            className: styles.serviceRecordTable,
            tableProps: {
              bordered: false,
              striped: false,
            },
          },
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
        },
        warrantyInfo: response.warrantyInfo.map((item) => ({
          ...item,
          endAt: formatDate(item.endAt, dateOptions),
          startAt: formatDate(item.startAt, dateOptions),
        })),
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
        serviceRecords: response.serviceRecords.map((item) => ({
          ...item,
          detailDescription: t(item.detailDescription),
          serviceAction: t(item.serviceAction),
          serviceTime: formatDate(item.serviceTime, dateTimeOptions),
          status: t(item.status),
        })),
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
