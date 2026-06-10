/* generated from hiui-design strict archetype template */
/* template asset: __HIUI_TEMPLATE_PATH__ */

import { Button, Radio, Space } from '@hi-ui/hiui'
import { FixedDashboardPageFrame } from '__FIXED_DASHBOARD_FRAME_IMPORT__'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedCardGrid,
  ManagedChartCard,
  ManagedMetricCard,
  ManagedSurfaceCard,
  SectionBlock,
} from '__DATA_VISUALIZATION_PRIMITIVES_IMPORT__'

export default function __COMPONENT_NAME__() {
  const viewModeOptions = [
    { id: 'day', title: 'day' },
    { id: 'week', title: 'week' },
    { id: 'month', title: 'month' },
  ]

  const headerExtra = (
    <Space>
      <Button appearance="line" type="default">
        TODO_ACTION
      </Button>
    </Space>
  )

  return (
    <>
      {/* source contract markers */}
__HIUI_SOURCE_CONTRACT_MARKERS__
      {/* hiui-design shell-inheritance: shared-shell-carrier */}
      {/* hiui-design shell-carrier: FixedDashboardPageFrame */}
      {/* hiui-design shell-geometry guard: do not add pageRootStyle / whiteBodyStyle or style-bearing shell props here; geometry changes belong in shared shell variants */}
      {/* hiui-design chart-stack: approved-wrapper */}
      <FixedDashboardPageFrame
        extra={headerExtra}
        pageRootProps={__HIUI_PAGE_ROOT_PROPS__}
        title="TODO_PAGE_TITLE"
        whiteBodyProps={__HIUI_WHITE_BODY_PROPS__}
      >
        <SectionBlock
          description="TODO_OVERVIEW_DESCRIPTION"
          region="stat-section"
          title="TODO_OVERVIEW_TITLE"
        >
          <ManagedCardGrid minItemWidth={180}>
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
          </ManagedCardGrid>
        </SectionBlock>

        <DashboardControlStrip
          leading={
            <Radio.Group
              data={viewModeOptions}
              type="button"
              value="day"
            />
          }
          trailing={
            <>
              {/* TODO: when filters exceed 4 fields, keep them in inline dropdown controls instead of button groups */}
            </>
          }
        />

        <SectionBlock
          description="TODO_RISK_SECTION_DESCRIPTION"
          title="TODO_RISK_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={260}>
            <ManagedSurfaceCard>
              <div>TODO_RISK_LINE_NAME</div>
              <div>TODO_RISK_METRICS</div>
              <div>TODO_RISK_ACTIONS</div>
            </ManagedSurfaceCard>
          </ManagedCardGrid>
        </SectionBlock>

        <SectionBlock
          description="TODO_CHART_SECTION_DESCRIPTION"
          region="chart-section"
          title="TODO_CHART_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={320}>
            <ManagedChartCard
              body={<div>{/* TODO: replace with chart content */}</div>}
              description="TODO_CHART_DESCRIPTION"
              title="TODO_CHART_TITLE"
            />
            <ManagedChartCard
              body={<div>{/* TODO: replace with chart content */}</div>}
              description="TODO_CHART_DESCRIPTION"
              title="TODO_CHART_TITLE"
            />
          </ManagedCardGrid>
          <ManagedChartCard
            body={<div>{/* TODO: replace with chart content */}</div>}
            description="TODO_CHART_DESCRIPTION"
            title="TODO_CHART_TITLE"
          />
        </SectionBlock>

        <SectionBlock
          description="TODO_RECORD_SECTION_DESCRIPTION"
          title="TODO_RECORD_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={260}>
            <ManagedSurfaceCard>
              <div>TODO_RECORD_TIME</div>
              <div>TODO_RECORD_ROUTE</div>
              <div>TODO_RECORD_STATUS</div>
            </ManagedSurfaceCard>
          </ManagedCardGrid>
        </SectionBlock>

        <JoinedTableSection
          description="TODO_TABLE_SECTION_DESCRIPTION"
          pagination={<div>{/* TODO: replace with Pagination */}</div>}
          table={<div>{/* TODO: replace with managed Table region content */}</div>}
          title="TODO_TABLE_SECTION_TITLE"
        />
      </FixedDashboardPageFrame>
    </>
  )
}
