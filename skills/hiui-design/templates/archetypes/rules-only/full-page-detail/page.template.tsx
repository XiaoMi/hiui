/* generated from hiui-design strict archetype template */
/* template asset: __HIUI_TEMPLATE_PATH__ */

import { Button, Descriptions, PageHeader } from '@hi-ui/hiui'
import { HostPageHeaderPortal } from '__HOST_PAGE_HEADER_PORTAL_IMPORT__'
import { ProDetailPage } from '@hiui-design/typical-page-shells/pro-detail-page'

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

        <section data-hiui5-region="detail-body" style={{ padding: 20 }}>
          <Descriptions
            placement="vertical"
            column={3}
            cellStyles={{ textAlign: 'start' }}
          >
            <Descriptions.Item label="TODO_FIELD_LABEL">TODO_FIELD_VALUE</Descriptions.Item>
          </Descriptions>
        </section>
      </ProDetailPage>
    </div>
  )
}
