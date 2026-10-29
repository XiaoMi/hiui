import React from 'react'
import { useMemo, useRef, useState } from 'react'
import { Button, DatePicker, Input, Message, PageHeader, Select, Space, Table } from '@hi-ui/hiui'
import { F, GS } from '@hi-ui/schema-core'
import {
  CancelButton,
  Form,
  ProEditPage,
  ProEditPageProvider,
  StashButton,
  SubmitButton,
  proEditPageShellStyles,
} from '../components/hiui-design-runtime/pro-edit-page'
import {
  queryFilterDatePickerOverlay,
  queryFilterPickerOverlay,
} from '../components/hiui-design-runtime'
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
import { resolveNextProductSequence } from './full-page-edit.helpers'
import { useTranslation } from './page-localization'
import styles from './full-page-edit.module.scss'

type FullPageEditPageProps = Record<string, unknown> & {
  detailTablePreset?: FullPageEditDetailTablePreset
  onBack?: () => void
}

type ProductDetailRow = {
  id: string
  imeiOrSn: string
  productCode: string
  productName: string
  relatedOrder: string
  warrantyEnd: string
  warrantyStart: string
}

type ProductOrderOption = {
  id: string
  title: string
}

export type FullPageEditDetailTablePreset = {
  initialRows?: ProductDetailRow[]
  orderOptions?: ProductOrderOption[]
  visible?: boolean
}

type ProductEditableField = 'imeiOrSn' | 'relatedOrder' | 'warrantyStart' | 'warrantyEnd'

const dateProps = {
  format: 'YYYY-MM-DD',
  clearable: true,
} as const

const dateTimeProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
  showTime: true,
  clearable: true,
} as const

function createProductDetailDraft(index: number, orderOptions: ProductOrderOption[]): ProductDetailRow {
  return {
    id: `product-${index}`,
    productName: `新增商品 ${index}`,
    productCode: `SKU-${String(20260000 + index).slice(-8)}`,
    imeiOrSn: `SN-${String(68000000 + index).slice(-8)}`,
    relatedOrder: orderOptions[0]?.id || '',
    warrantyStart: '2026-04-18',
    warrantyEnd: '2027-04-17',
  }
}

function openRuntimeMessage(type: 'success' | 'warning' | 'info', title: string) {
  const messageApi = Message as unknown as {
    open?: (options: { type?: 'success' | 'warning' | 'info'; title: string }) => void
  }

  if (typeof messageApi.open === 'function') {
    messageApi.open({ type, title })
    return
  }

  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(title)
    return
  }

  console[type === 'warning' ? 'warn' : 'info'](title)
}

function buildFallbackBackHandler(onBack?: () => void) {
  return () => {
    if (typeof onBack === 'function') {
      onBack()
      return
    }

    if (typeof window === 'undefined') return
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    window.close()
  }
}

function FullPageEditInner({ detailTablePreset, onBack }: FullPageEditPageProps) {
  const { locale, t } = useTranslation()
  const productOrderOptions = useMemo(
    () => detailTablePreset?.orderOptions?.map((option) => ({ ...option })) || [],
    [detailTablePreset]
  )
  const initialProductRows = useMemo(
    () => detailTablePreset?.initialRows?.map((row) => ({ ...row })) || [],
    [detailTablePreset]
  )
  const nextProductSequenceRef = useRef(resolveNextProductSequence(initialProductRows))
  const [productRows, setProductRows] = useState<ProductDetailRow[]>(() => initialProductRows)
  const handleBack = useMemo(() => buildFallbackBackHandler(onBack), [onBack])
  const handleSubmitSuccess = useMemo(
    () => () => {
      openRuntimeMessage('success', t('工单已提交（示例）'))
      if (typeof onBack === 'function') {
        onBack()
      }
    },
    [onBack, t]
  )
  const updateProductRow = (rowId: string, field: ProductEditableField, value: string) => {
    setProductRows((current) =>
      current.map((item) => (item.id === rowId ? { ...item, [field]: value } : item))
    )
  }
  const showProductSection = Boolean(detailTablePreset?.visible) || productRows.length > 0
  const productColumns = useMemo(
    () => [
      {
        title: t('商品名称'),
        dataKey: 'productName',
        width: 180,
      },
      {
        title: t('商品编码'),
        dataKey: 'productCode',
        width: 160,
      },
      {
        title: t('IMEI/SN'),
        dataKey: 'imeiOrSn',
        width: 160,
        render: (value: unknown, row: ProductDetailRow) => (
          <Input
            className={styles.detailTableControl}
            clearable
            placeholder={t('请输入 IMEI/SN')}
            value={typeof value === 'string' ? value : ''}
            onChange={(_evt, nextValue) => updateProductRow(row.id, 'imeiOrSn', nextValue)}
          />
        ),
      },
      {
        title: t('关联订单'),
        dataKey: 'relatedOrder',
        width: 170,
        render: (value: unknown, row: ProductDetailRow) => (
          <Select
            className={styles.detailTableControl}
            clearable
            data={productOrderOptions.map((option) => ({ ...option, title: option.title }))}
            overlay={queryFilterPickerOverlay}
            placeholder={t('请选择关联订单')}
            value={typeof value === 'string' ? value : ''}
            onChange={(selectedId) => updateProductRow(row.id, 'relatedOrder', String(selectedId ?? ''))}
          />
        ),
      },
      {
        title: t('三包开始日期'),
        dataKey: 'warrantyStart',
        width: 150,
        render: (value: unknown, row: ProductDetailRow) => (
          <DatePicker
            className={styles.detailTableControl}
            clearable
            format="YYYY-MM-DD"
            overlay={queryFilterDatePickerOverlay}
            placeholder={t('请选择日期')}
            value={typeof value === 'string' ? value : null}
            onChange={(_date, dateStr) =>
              updateProductRow(row.id, 'warrantyStart', typeof dateStr === 'string' ? dateStr : '')
            }
          />
        ),
      },
      {
        title: t('三包结束日期'),
        dataKey: 'warrantyEnd',
        width: 150,
        render: (value: unknown, row: ProductDetailRow) => (
          <DatePicker
            className={styles.detailTableControl}
            clearable
            format="YYYY-MM-DD"
            overlay={queryFilterDatePickerOverlay}
            placeholder={t('请选择日期')}
            value={typeof value === 'string' ? value : null}
            onChange={(_date, dateStr) =>
              updateProductRow(row.id, 'warrantyEnd', typeof dateStr === 'string' ? dateStr : '')
            }
          />
        ),
      },
      {
        title: t('操作'),
        dataKey: 'operation',
        width: 96,
        fixed: 'right' as const,
        render: (_unusedValue: unknown, row: ProductDetailRow) => (
          <Button
            appearance="link"
            type="primary"
            onClick={() => {
              setProductRows((current) => current.filter((item) => item.id !== row.id))
              openRuntimeMessage('info', t('已删除商品：{name}', { name: row.productName }))
            }}
          >
            {t('删除')}
          </Button>
        ),
      },
    ],
    [t]
  )
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
      ...(showProductSection
        ? [
            (() => {
              const productGroup = GS(t('商品信息'))
                .Custom({
                  render: () => (
                    <div className={styles.detailTableSection}>
                      <Table
                        bordered={false}
                        columns={productColumns}
                        data={productRows}
                        emptyContent={t('暂无商品信息')}
                        fieldKey="id"
                        fixedToColumn={{ right: 'operation' }}
                        setting={false}
                        showColMenu={false}
                        sticky={false}
                      />
                    </div>
                  ),
                })
                .Actions([
                  <Button
                    key="add-product"
                    appearance="link"
                    type="primary"
                    onClick={() => {
                      const nextProductSequence = nextProductSequenceRef.current
                      nextProductSequenceRef.current += 1
                      setProductRows((current) => [
                        ...current,
                        createProductDetailDraft(nextProductSequence, productOrderOptions),
                      ])
                      openRuntimeMessage('success', t('已添加商品'))
                    }}
                  >
                    {t('添加商品')}
                  </Button>,
                ])
                .CardProps({
                  size: 'lg',
                })
                .val

              return productGroup
            })(),
          ]
        : []),
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
    [detailTablePreset?.visible, productColumns, productOrderOptions, productRows, showProductSection, t]
  )

  return (
    <div className={styles.editPageRoot}>
      <PageHeader
        className={styles.pageHeader}
        title={t('全页编辑')}
        onBack={handleBack}
      />

      <div className={styles.whiteBody}>
        <ProEditPage
          key={locale}
          groups={groups}
          onCancel={handleBack}
          onSubmitSuccess={handleSubmitSuccess}
          onStashSuccess={() => openRuntimeMessage('success', t('草稿已保存（示例）'))}
        >
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
      </div>
    </div>
  )
}

export function FullPageEditPage({ detailTablePreset, onBack }: FullPageEditPageProps) {
  const { locale, t } = useTranslation()
  const detailRequest = useMemo(
    () => async () => {
      const response = await getWorkOrderEditDetail()

      return {
        ...response,
        description: t(response.description),
        relatedProduct: t(response.relatedProduct),
        userName: t(response.userName),
        visitReason: t(response.visitReason),
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
      <FullPageEditInner detailTablePreset={detailTablePreset} onBack={onBack} />
    </ProEditPageProvider>
  )
}

export default FullPageEditPage
