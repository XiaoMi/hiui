import { useMemo } from 'react'
import { Button, Message, Space } from '@hi-ui/hiui'
import { DownloadOutlined, PlusOutlined } from '@hi-ui/icons'
import { extendDsl, F, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '../components/hiui-design-runtime'
import {
  ProListPageProvider,
  queryFilterPickerOverlay,
} from '../components/hiui-design-runtime/pro-list-page'
import {
  TablePageFrame,
  proTablePageStyles,
  renderTableTextEllipsis,
  renderTreeTableTextEllipsis,
} from '../components/hiui-design-runtime/pro-table-page'
import {
  basicUserOrganizationOptions,
  countTreeNodes,
  departmentStatusOptions,
  getOrgTreeTableList,
  managerOptions,
  queryOrgTreeTableRows,
  type OrgTreeTableRow,
} from './typical-pages.mock'
import { getKeywordValue, getParamsWithoutKeyword } from './data-visualization/request-utils'
import { useTranslation } from './page-localization'

const T = extendDsl(ReadonlyFieldCreator, {
  renderTreeName(this) {
    return this.renderCell((cellValue) => renderTreeTableTextEllipsis(cellValue))
  },
  renderEllipsis(this) {
    return this.renderCell((cellValue) => renderTableTextEllipsis(cellValue))
  },
})

function TreeTableInner() {
  const { locale, t } = useTranslation()

  const queryFields = useMemo(
    () => [
      F(t('负责人'), 'managerId')
        .Select({
          data: managerOptions.map((option) => ({ ...option, title: t(option.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val,
      F(t('所属机构'), 'organizationId')
        .Select({
          data: basicUserOrganizationOptions.map((option) => ({ ...option, title: t(option.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val,
      F(t('部门状态'), 'deptStatuses')
        .CheckSelect({
          data: departmentStatusOptions.map((option) => ({ ...option, title: t(option.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val,
    ],
    [t]
  )

  const tableFields = useMemo(
    () => [
      T(t('部门'), 'departmentName')
        .W(360)
        .MWP({ className: proTablePageStyles.treeSwitcherCol })
        .Control({ fixed: 'left' })
        .renderTreeName()
        .val,
      T(t('部门状态'), 'deptStatus')
        .W(100)
        .renderCell((cellValue) =>
          renderTableTextEllipsis(t(cellValue === 'enabled' ? '启用' : '停用'))
        )
        .val,
      T(t('部门职责'), 'departmentDuty').W(220).renderEllipsis().val,
      T(t('负责人'), 'managerName').W(110).renderEllipsis().val,
      T(t('成员数量'), 'memberCount').W(96).val,
      T(t('所属机构'), 'organizationTitle').W(160).renderEllipsis().val,
      T(t('部门描述'), 'departmentDesc').W(260).renderEllipsis().val,
      T(t('操作'), '_actions')
        .W(180)
        .Control({ fixed: 'right' })
        .renderCell((_, ctx) => {
          const row = ctx.rawData as { departmentName: string }

          return (
            <Space size={8}>
              <Button
                type="primary"
                appearance="link"
                onClick={() => Message.open({ title: `${t('编辑')} ${row.departmentName}` })}
              >
                {t('编辑')}
              </Button>
              <Button
                type="primary"
                appearance="link"
                onClick={() => Message.open({ title: t('新增子部门到 {name}', { name: row.departmentName }) })}
              >
                {t('子部门')}
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
      title={t('树形表格')}
      queryFields={queryFields}
      tableFields={tableFields}
      searchPlaceholder={t('部门名称 / 职责关键词')}
      tableProps={{ defaultExpandedRowKeys: ['dept-001'] }}
      extra={
        <Space className={proTablePageStyles.headerExtra}>
          <Button
            type="default"
            appearance="line"
            icon={<DownloadOutlined />}
            onClick={() => Message.open({ type: 'success', title: t('组织架构已导出（示例）') })}
          >
            {t('导出')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => Message.open({ title: t('新增一级部门（示例）') })}
          >
            {t('新增部门')}
          </Button>
        </Space>
      }
    />
  )
}

export function TreeTablePage() {
  const { locale, t } = useTranslation()
  const request = useMemo(
    () => async (params: Parameters<typeof getOrgTreeTableList>[0]) => {
      const keyword = getKeywordValue(params)
      const nextParams = getParamsWithoutKeyword(params)

      const translateNode = (row: OrgTreeTableRow): OrgTreeTableRow => ({
        ...row,
        departmentDesc: t(row.departmentDesc),
        departmentDuty: t(row.departmentDuty),
        departmentName: t(row.departmentName),
        deptStatus: row.deptStatus,
        managerName: t(row.managerName),
        organizationTitle: t(row.organizationTitle),
        children: row.children?.map(translateNode),
      })

      const filterTreeByKeyword = (list: OrgTreeTableRow[]): OrgTreeTableRow[] =>
        list.flatMap((row) => {
          const children = filterTreeByKeyword(row.children ?? [])
          const selfMatched =
            keyword === '' ||
            [row.departmentName, row.departmentDuty, row.departmentDesc].some((value) =>
              String(value ?? '')
                .toLowerCase()
                .includes(keyword)
            )

          if (selfMatched) return [{ ...row, children }]
          if (children.length > 0) return [{ ...row, children }]
          return []
        })

      const translatedList = queryOrgTreeTableRows(nextParams).map(translateNode)
      const filteredList = filterTreeByKeyword(translatedList)

      return {
        current: nextParams.pagination?.current ?? 1,
        list: filteredList,
        pageSize: nextParams.pagination?.pageSize ?? 20,
        total: countTreeNodes(filteredList),
      }
    },
    [t]
  )

  return (
    <ProListPageProvider key={locale} request={request}>
      <TypicalPageFieldMapProvider key={locale}>
        <TreeTableInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}

export default TreeTablePage
