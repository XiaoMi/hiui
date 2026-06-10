import { useMemo } from 'react'
import { Message, PageHeader, Space } from '@hi-ui/hiui'
import { F, GS } from '@hi-ui/schema-core'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import { useNavigate } from 'react-router-dom'
import {
  CancelButton,
  Form,
  ProEditPage,
  ProEditPageProvider,
  StashButton,
  SubmitButton,
  proEditPageShellStyles,
} from '@hiui-design/typical-page-shells/pro-edit-page'
import {
  getWorkOrderEditDetail,
  purchaseChannelOptions,
  serviceEngineerOptions,
  serviceMethodOptions,
  serviceOrgOptions,
  stashExampleWorkOrder,
  submitExampleWorkOrder,
  ticketStatusOptions,
  ticketTypeOptions,
  userTagOptions,
} from './typical-pages.mock'
import { useTranslation } from '../../translation'

const dateProps = {
  format: 'YYYY-MM-DD',
  clearable: true,
} as const

const dateTimeProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
  showTime: true,
  clearable: true,
} as const

function FullPageEditInner() {
  const navigate = useNavigate()
  const { locale, t } = useTranslation()

  const groups = useMemo(
    () => [
      GS(t('基础信息'))
        .Simple()
        .Fields([
          F(t('工单号'), 'ticketNo').Text().Placeholder(t('留空后由系统生成')).val,
          F(t('工单状态'), 'status')
            .Select({ data: ticketStatusOptions.map((option) => ({ ...option, title: t(option.title) })) })
            .Required()
            .val,
          F(t('工单类型'), 'ticketType')
            .Select({ data: ticketTypeOptions.map((option) => ({ ...option, title: t(option.title) })) })
            .Required()
            .val,
          F(t('服务方式'), 'serviceMethod')
            .Select({ data: serviceMethodOptions.map((option) => ({ ...option, title: t(option.title) })) })
            .Required()
            .val,
          F(t('关联商品'), 'relatedProduct').Text().Placeholder(t('商品名称或 SKU')).val,
          F(t('购买渠道'), 'purchaseChannel')
            .Select({ data: purchaseChannelOptions.map((option) => ({ ...option, title: t(option.title) })) })
            .val,
          F(t('三包开始时间'), 'warrantyStart').Date({ ...dateProps }).val,
          F(t('三包截止时间'), 'warrantyEnd').Date({ ...dateProps }).val,
          F(t('来访原因'), 'visitReason').Text().Required().val,
        ])
        .CardProps({ size: 'lg' })
        .val,
      GS(t('客户信息'))
        .Simple()
        .Fields([
          F(t('用户姓名'), 'userName').Text().Required().val,
          F(t('用户标签'), 'userTags')
            .CheckSelect({ data: userTagOptions.map((option) => ({ ...option, title: t(option.title) })) })
            .val,
          F(t('用户电话'), 'userPhone').Text().Required().val,
        ])
        .CardProps({ size: 'lg' })
        .val,
      GS(t('服务信息'))
        .Simple()
        .Fields([
          F(t('服务机构'), 'serviceOrg')
            .Select({ data: serviceOrgOptions.map((option) => ({ ...option, title: t(option.title) })) })
            .val,
          F(t('服务工程师'), 'serviceEngineer')
            .Select({ data: serviceEngineerOptions.map((option) => ({ ...option, title: t(option.title) })) })
            .val,
          F(t('受理时间'), 'acceptedAt').Date({ ...dateTimeProps }).val,
          F(t('问题描述'), 'description').Textarea({ rows: 4 }).Required().MWP({ span: 24 }).val,
        ])
        .CardProps({ size: 'lg' })
        .val,
    ],
    [t]
  )

  return (
    <ProEditPage
      key={locale}
      groups={groups}
      onCancel={() => Message.open({ title: t('已取消编辑（示例）') })}
      onSubmitSuccess={() => Message.open({ type: 'success', title: t('工单已提交（示例）') })}
      onStashSuccess={() => Message.open({ type: 'success', title: t('草稿已保存（示例）') })}
    >
      <TypicalPageHeaderPortal>
        <PageHeader
          title={t('全页编辑')}
          onBack={() => navigate(-1)}
        />
      </TypicalPageHeaderPortal>

      <div className={proEditPageShellStyles.formScrollBody}>
        <Form
          initialValues={{
            status: 'pending',
            ticketType: 'repair',
            serviceMethod: 'door',
            userTags: [],
          }}
          formProps={{ labelPlacement: 'top' }}
          borderedGroups={false}
          gridProps={{
            columnCount: 3,
            gutter: 40,
          }}
        />
      </div>

      <div className={proEditPageShellStyles.inlineEditFooter}>
        <Space>
          <CancelButton />
          <StashButton />
          <SubmitButton>{t('提交')}</SubmitButton>
        </Space>
      </div>
    </ProEditPage>
  )
}

export function FullPageEditPage() {
  const { locale, t } = useTranslation()
  const detailRequest = useMemo(
    () => async () => {
      const response = await getWorkOrderEditDetail()

      return {
        ...response,
        relatedProduct: t(response.relatedProduct),
        userName: t(response.userName),
        visitReason: t(response.visitReason),
        description: t(response.description),
      }
    },
    [t]
  )

  return (
    <ProEditPageProvider
      key={locale}
      detailRequest={detailRequest}
      submitRequest={submitExampleWorkOrder}
      stashRequest={stashExampleWorkOrder}
    >
      <FullPageEditInner />
    </ProEditPageProvider>
  )
}
