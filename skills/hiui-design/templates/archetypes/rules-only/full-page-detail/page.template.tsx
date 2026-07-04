/* generated from hiui-design strict archetype template */
/* template asset: __HIUI_TEMPLATE_PATH__ */

import { Button, Descriptions, PageHeader, Table } from '@hi-ui/hiui'
import { HostPageHeaderPortal } from '__HOST_PAGE_HEADER_PORTAL_IMPORT__'
import { ProDetailPage } from '@hiui-design/typical-page-shells/pro-detail-page'

const warrantyItems = [
  {
    type: 'TODO_RETURN_LABEL',
    remainingDays: 2,
    startAt: 'TODO_START_DATE',
    endAt: 'TODO_END_DATE',
  },
  {
    type: 'TODO_EXCHANGE_LABEL',
    remainingDays: 9,
    startAt: 'TODO_START_DATE',
    endAt: 'TODO_END_DATE',
  },
  {
    type: 'TODO_REPAIR_LABEL',
    remainingDays: 469,
    startAt: 'TODO_START_DATE',
    endAt: 'TODO_END_DATE',
  },
]

const serviceRecordColumns = [
  { title: 'TODO_SERVICE_TIME', dataKey: 'serviceTime', width: 180 },
  { title: 'TODO_SERVICE_ACTION', dataKey: 'serviceAction', width: 160 },
  { title: 'TODO_STATUS', dataKey: 'status', width: 120 },
  { title: 'TODO_DETAIL_DESCRIPTION', dataKey: 'detailDescription', width: 360 },
]

const serviceRecordData = [
  {
    id: 'record-001',
    serviceTime: 'TODO_SERVICE_TIME_VALUE',
    serviceAction: 'TODO_SERVICE_ACTION_VALUE',
    status: 'TODO_STATUS_VALUE',
    detailDescription: 'TODO_DETAIL_DESCRIPTION_VALUE',
  },
]

export default function __COMPONENT_NAME__() {
  return (
    <div
__HIUI_PAGE_ROOT_ATTR_LINES__
      style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}
    >
      {/* source contract markers */}
__HIUI_SOURCE_CONTRACT_MARKERS__
      <ProDetailPage
        data-hiui5-region="white-body"
__HIUI_WHITE_BODY_ATTR_LINES__
      >
        <HostPageHeaderPortal data-hiui5-region="header">
          <PageHeader
            title={<span style={{ fontSize: 18, fontWeight: 600 }}>TODO_PAGE_TITLE</span>}
            onBack={() => void 0}
            extra={
              <Button type="default" appearance="line">
                TODO_HEADER_ACTION
              </Button>
            }
          />
        </HostPageHeaderPortal>

        <section
          data-hiui5-region="detail-body"
          style={{ display: 'grid', gap: 16, padding: 20 }}
        >
          <Descriptions
            placement="vertical"
            column={3}
            cellStyles={{ textAlign: 'start' }}
          >
            <Descriptions.Item label="TODO_FIELD_LABEL">TODO_FIELD_VALUE</Descriptions.Item>
            <Descriptions.Item label="TODO_FIELD_LABEL">TODO_FIELD_VALUE</Descriptions.Item>
            <Descriptions.Item label="TODO_FIELD_LABEL">TODO_FIELD_VALUE</Descriptions.Item>
          </Descriptions>

          <section>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, lineHeight: '24px' }}>
              TODO_WARRANTY_SECTION_TITLE
            </h2>
            <div
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                minWidth: 0,
              }}
            >
              {warrantyItems.map((item) => (
                <article
                  key={item.type}
                  style={{
                    boxSizing: 'border-box',
                    minWidth: 0,
                    padding: 16,
                    border: '1px solid #e4e8f0',
                    borderRadius: 8,
                    background: '#fff',
                  }}
                >
                  <div style={{ color: '#1f2733', fontSize: 14, fontWeight: 600, lineHeight: '22px' }}>
                    {item.type}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 4,
                      marginTop: 12,
                      color: '#1f2733',
                    }}
                  >
                    <span style={{ fontSize: 24, fontWeight: 600, lineHeight: '30px' }}>
                      {item.remainingDays}
                    </span>
                    <span style={{ fontSize: 14, lineHeight: '22px' }}>TODO_DAY_UNIT</span>
                  </div>
                  <div style={{ marginTop: 2, color: '#7a8494', fontSize: 14, lineHeight: '22px' }}>
                    TODO_REMAINING_DAYS_LABEL
                  </div>
                  <dl style={{ display: 'grid', gap: 8, margin: '14px 0 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, minWidth: 0 }}>
                      <dt style={{ flex: '0 0 auto', margin: 0, color: '#7a8494', fontSize: 14, lineHeight: '22px' }}>
                        TODO_START_LABEL
                      </dt>
                      <dd style={{ minWidth: 0, margin: 0, color: '#3c4658', fontSize: 14, lineHeight: '22px', textAlign: 'right' }}>
                        {item.startAt}
                      </dd>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, minWidth: 0 }}>
                      <dt style={{ flex: '0 0 auto', margin: 0, color: '#7a8494', fontSize: 14, lineHeight: '22px' }}>
                        TODO_END_LABEL
                      </dt>
                      <dd style={{ minWidth: 0, margin: 0, color: '#3c4658', fontSize: 14, lineHeight: '22px', textAlign: 'right' }}>
                        {item.endAt}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <Descriptions
            placement="vertical"
            column={3}
            cellStyles={{ textAlign: 'start' }}
          >
            <Descriptions.Item label="TODO_CUSTOMER_FIELD_LABEL">TODO_CUSTOMER_FIELD_VALUE</Descriptions.Item>
            <Descriptions.Item label="TODO_CUSTOMER_FIELD_LABEL">TODO_CUSTOMER_FIELD_VALUE</Descriptions.Item>
            <Descriptions.Item label="TODO_CUSTOMER_FIELD_LABEL">TODO_CUSTOMER_FIELD_VALUE</Descriptions.Item>
          </Descriptions>

          <Descriptions
            placement="vertical"
            column={3}
            cellStyles={{ textAlign: 'start' }}
          >
            <Descriptions.Item label="TODO_SERVICE_FIELD_LABEL">TODO_SERVICE_FIELD_VALUE</Descriptions.Item>
            <Descriptions.Item label="TODO_SERVICE_FIELD_LABEL">TODO_SERVICE_FIELD_VALUE</Descriptions.Item>
            <Descriptions.Item label="TODO_SERVICE_FIELD_LABEL">TODO_SERVICE_FIELD_VALUE</Descriptions.Item>
          </Descriptions>

          <section style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, lineHeight: '24px' }}>
              TODO_SERVICE_RECORDS_SECTION_TITLE
            </h2>
            <Table
              bordered={false}
              columns={serviceRecordColumns}
              data={serviceRecordData}
              fieldKey="id"
              striped={false}
            />
          </section>
        </section>
      </ProDetailPage>
    </div>
  )
}
