/* generated from hiui-design strict archetype template */
/* template asset: __HIUI_TEMPLATE_PATH__ */

import { Button, PageHeader, Space } from '@hi-ui/hiui'
import { HostPageHeaderPortal } from '__HOST_PAGE_HEADER_PORTAL_IMPORT__'
import {
  CancelButton,
  Form,
  ProEditPage,
  ProEditPageProvider,
  SubmitButton,
  StashButton,
  proEditPageShellStyles,
} from '@hiui-design/typical-page-shells/pro-edit-page'

export default function __COMPONENT_NAME__() {
  return (
    <ProEditPageProvider detailRequest={async () => ({})}>
      <div
__HIUI_PAGE_ROOT_ATTR_LINES_NO_MAIN_SCROLL__
        style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}
      >
        {/* source contract markers */}
__HIUI_SOURCE_CONTRACT_MARKERS__
        <ProEditPage
          groups={[]}
          data-hiui5-region="white-body"
__HIUI_WHITE_BODY_ATTR_LINES__
          style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}
        >
          <HostPageHeaderPortal data-hiui5-region="header">
            <PageHeader
              title={<span style={{ fontSize: 18, fontWeight: 600 }}>TODO_PAGE_TITLE</span>}
              onBack={() => void 0}
              extra={
                <span data-hiui5-region="header-actions">
                  <Button type="default" appearance="line">
                    TODO_HEADER_ACTION
                  </Button>
                </span>
              }
            />
          </HostPageHeaderPortal>

          <div
            className={proEditPageShellStyles.formScrollBody}
            data-hiui5-region="form-body"
            data-hiui5-owner-main-scroll="true"
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              minHeight: 0,
              overflow: 'auto',
            }}
          >
            <Form
              initialValues={{}}
              formProps={{ labelPlacement: 'top' }}
              borderedGroups={false}
              gridProps={{ columnCount: 3, gutter: 40 }}
            />
          </div>

          <div
            className={proEditPageShellStyles.inlineEditFooter}
            data-hiui5-region="footer"
            style={{ display: 'flex', flexShrink: 0, justifyContent: 'flex-end' }}
          >
            <div data-hiui5-region="footer-actions">
              <Space>
                <CancelButton />
                <StashButton />
                <SubmitButton>TODO_SUBMIT</SubmitButton>
              </Space>
            </div>
          </div>
        </ProEditPage>
      </div>
    </ProEditPageProvider>
  )
}
