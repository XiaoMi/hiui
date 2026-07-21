import { useMemo } from 'react'
import { Button, Message, Space, Tag } from '@hi-ui/hiui'
import { DownloadOutlined, PlusOutlined } from '@hi-ui/icons'
import { extendDsl, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells'
import {
  ProListPageProvider,
  queryFilterPickerOverlay,
} from '@hiui-design/typical-page-shells/pro-list-page'
import {
  TablePageFrame,
  proTablePageStyles,
  renderTableTextEllipsis,
} from '@hiui-design/typical-page-shells/pro-table-page'
import {
  basicUserOrganizationOptions,
  basicUserRoleOptions,
  basicUserStatusOptions,
  queryBasicTableRows,
} from './typical-pages.mock'
import { createManagedQuerySelectField } from '@/typical-page-reuse/query-filter/managed-query-filter-fields'
import {
  filterListByKeyword,
  getKeywordValue,
  getParamsWithoutKeyword,
  paginateList,
} from './request-utils'
import { useTranslation } from '../../translation'

const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis() {
    return this.renderCell((cellValue) => renderTableTextEllipsis(cellValue))
  },
})

const userStatusTagTypeMap = {
  enabled: 'success',
  paused: 'danger',
  training: 'warning',
} as const

function BasicTableInner() {
  const { locale, t } = useTranslation()

  const queryFields = useMemo(
    () => [
      createManagedQuerySelectField({
        field: 'roleId',
        label: t('角色'),
        data: basicUserRoleOptions.map((option) => ({ ...option, title: t(option.title) })),
        overlay: queryFilterPickerOverlay,
      }),
      createManagedQuerySelectField({
        field: 'organizationId',
        label: t('所属机构'),
        data: basicUserOrganizationOptions.map((option) => ({ ...option, title: t(option.title) })),
        overlay: queryFilterPickerOverlay,
      }),
      createManagedQuerySelectField({
        field: 'userStatus',
        label: t('用户状态'),
        data: basicUserStatusOptions.map((option) => ({ ...option, title: t(option.title) })),
        overlay: queryFilterPickerOverlay,
      }),
    ],
    [t]
  )

  const tableFields = useMemo(
    () => [
      T(t('用户姓名'), 'userName').W(120).renderEllipsis().val,
      T(t('米聊号'), 'miTalkId').W(140).renderEllipsis().val,
      T(t('用户电话'), 'phone').W(140).renderEllipsis().val,
      T(t('邮箱'), 'email').W(220).renderEllipsis().val,
      T(t('用户角色'), 'roleTitle')
        .W(120)
        .renderCell((cellValue) => renderTableTextEllipsis(t(String(cellValue ?? ''))))
        .val,
      T(t('岗位名称'), 'positionTitle')
        .W(120)
        .renderCell((cellValue) => renderTableTextEllipsis(t(String(cellValue ?? ''))))
        .val,
      T(t('所属机构'), 'organizationTitle')
        .W(160)
        .renderCell((cellValue) => renderTableTextEllipsis(t(String(cellValue ?? ''))))
        .val,
      T(t('用户状态'), 'userStatusTitle')
        .W(100)
        .renderCell((cellValue, ctx) => {
          const row = ctx.rawData as { userStatus: keyof typeof userStatusTagTypeMap }

          return (
            <Tag appearance="filled" type={userStatusTagTypeMap[row.userStatus]}>
              {String(cellValue ?? '')}
            </Tag>
          )
        })
        .val,
      T(t('最近更新'), 'updatedAt').W(160).renderEllipsis().val,
      T(t('操作'), '_actions')
        .W(160)
        .Control({ fixed: 'right' })
        .renderCell((_, ctx) => {
          const row = ctx.rawData as { userName: string }

          return (
            <Space size={8}>
              <Button
                type="primary"
                appearance="link"
                onClick={() => Message.open({ title: `${t('查看')} ${row.userName}` })}
              >
                {t('查看')}
              </Button>
              <Button
                type="primary"
                appearance="link"
                onClick={() => Message.open({ title: `${t('编辑')} ${row.userName}` })}
              >
                {t('编辑')}
              </Button>
            </Space>
          )
        })
        .val,
    ],
    [t]
  )

  return (
    <TablePageFrame
      key={locale}
      title={t('基础表格')}
      queryFields={queryFields}
      tableFields={tableFields}
      searchPlaceholder={t('用户名称 / 米聊 / 电话')}
      extra={
        <Space className={proTablePageStyles.headerExtra}>
          <Button
            type="default"
            appearance="line"
            icon={<DownloadOutlined />}
            onClick={() => Message.open({ type: 'success', title: t('导出任务已创建（示例）') })}
          >
            {t('导出')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => Message.open({ title: t('新增用户（示例）') })}
          >
            {t('新增用户')}
          </Button>
        </Space>
      }
    />
  )
}

export function BasicTablePage() {
  const { locale, t } = useTranslation()
  const request = useMemo(
    () => async (params: Parameters<typeof queryBasicTableRows>[0]) => {
      const keyword = getKeywordValue(params)
      const nextParams = getParamsWithoutKeyword(params)
      const translatedList = queryBasicTableRows(nextParams).map((row) => ({
        ...row,
        organizationTitle: t(row.organizationTitle),
        positionTitle: t(row.positionTitle),
        roleTitle: t(row.roleTitle),
        userName: t(row.userName),
        userStatusTitle: t(row.userStatusTitle),
      }))
      const filteredList = filterListByKeyword(translatedList, keyword, [
        (row) => row.userName,
        (row) => row.miTalkId,
        (row) => row.phone,
      ])

      return paginateList(filteredList, nextParams)
    },
    [t]
  )

  return (
    <ProListPageProvider key={locale} request={request}>
      <TypicalPageFieldMapProvider key={locale}>
        <BasicTableInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}
