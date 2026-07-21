/* generated from hiui-design strict archetype template */
/* template asset: __HIUI_TEMPLATE_PATH__ */
/* legacy-host-compatible note: this scaffold keeps standard shell semantics as */
/* a managed start point. Do not read this import pattern as "legacy cannot use */
/* page-component" or as permission to mount the standard runtime ad hoc. */

import { Button, Message, Space } from '@hi-ui/hiui'
import { DownloadOutlined } from '@hi-ui/icons'
import { extendDsl, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells'
import { ProListPageProvider } from '@hiui-design/typical-page-shells/pro-list-page'
import { createManagedQueryTextField } from '@/typical-page-reuse/query-filter/managed-query-filter-fields'
import {
  StatListPageFrame,
  StatOverviewGrid,
  proStatPageStyles,
  renderStatTableTextEllipsis,
} from '@hiui-design/typical-page-shells/pro-stat-page'

const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis() {
    return this.renderCell((cellValue) => renderStatTableTextEllipsis(cellValue))
  },
})

function __COMPONENT_NAME__Content() {
  const queryFields = [
    createManagedQueryTextField({
      field: 'todoFilterText',
      label: 'TODO_FILTER_LABEL',
      placeholder: 'TODO_FILTER_PLACEHOLDER',
    }),
  ]
  const tableFields = [T('TODO_COLUMN_LABEL', 'name').W(180).renderEllipsis().val]
  const statRequest = async () => ({
    list: [
      {
        title: 'TODO_METRIC_LABEL',
        value: '--',
      },
    ],
  })

  return (
    <>
      {/* source contract markers */}
__HIUI_SOURCE_CONTRACT_MARKERS__
      <StatListPageFrame
        title="TODO_PAGE_TITLE"
        queryFields={queryFields}
        tableFields={tableFields}
        searchPlaceholder="TODO_SEARCH_PLACEHOLDER"
        statSection={
          <>
            <div data-hiui5-region="stat-section">
              <StatOverviewGrid request={statRequest} />
            </div>
__HIUI_OPTIONAL_CHART_SECTION__
          </>
        }
        extra={
          <Space className={proStatPageStyles.headerExtra}>
            <Button
              type="default"
              appearance="line"
              icon={<DownloadOutlined />}
              onClick={() => Message.open({ title: 'TODO_EXPORT_ACTION' })}
            >
              TODO_EXPORT
            </Button>
            <Button type="default" onClick={() => Message.open({ title: 'TODO_REFRESH_ACTION' })}>
              TODO_REFRESH
            </Button>
          </Space>
        }
      />
    </>
  )
}

export default function __COMPONENT_NAME__() {
  const request = async () => ({
    current: 1,
    list: [{ name: 'TODO_ROW_VALUE' }],
    pageSize: 10,
    total: 1,
  })

  return (
    <div
__HIUI_PAGE_ROOT_ATTR_LINES_NO_MAIN_SCROLL__
      style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}
    >
      <div
        data-hiui5-region="white-body"
__HIUI_WHITE_BODY_ATTR_LINES__
        data-hiui5-owner-main-scroll="true"
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        <ProListPageProvider request={request}>
          <TypicalPageFieldMapProvider>
            <__COMPONENT_NAME__Content />
          </TypicalPageFieldMapProvider>
        </ProListPageProvider>
      </div>
    </div>
  )
}
