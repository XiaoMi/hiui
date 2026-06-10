import { Button, EmptyState, PageHeader, Space } from '@hi-ui/hiui'
import { PlusOutlined } from '@hi-ui/icons'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import pageNotFoundIndicatorUrl from '../assets/page-not-found-indicator.svg'

const pageStyle = {
  flex: '1 1 0%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  background: '#F5F8FC',
}

const panelStyle = {
  flex: '1 1 0%',
  minHeight: 0,
  margin: 0,
  padding: '20px',
  border: '1px solid #EDEFF2',
  borderRadius: 12,
  background: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const contentStyle = {
  width: 400,
  textAlign: 'center',
}

const titleStyle = {
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 500,
  color: '#1A1D26',
}

const descStyle = {
  fontSize: 14,
  lineHeight: '22px',
  color: '#60636B',
}

const linkStyle = {
  color: '#2660FF',
}

const headerActionsStyle = {
  gap: 12,
}

const actionsStyle = {
  marginTop: 12,
  justifyContent: 'center',
}

const indicatorWrapStyle = {
  position: 'relative',
  width: 100,
  height: 100,
}

const indicatorImageStyle = {
  position: 'absolute',
  top: 12.84,
  left: '50%',
  width: 73.75,
  height: 77.373,
  transform: 'translateX(-50%)',
  display: 'block',
}

function PageNotFoundIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img src={pageNotFoundIndicatorUrl} alt="" aria-hidden="true" style={indicatorImageStyle} />
    </div>
  )
}

export function PageNotFoundPage() {
  return (
    <div style={pageStyle}>
      <TypicalPageHeaderPortal>
        <PageHeader
          title="页面不存在"
          extra={
            <Space style={headerActionsStyle}>
              <Button type="default" size="md" appearance="line">
                次要操作
              </Button>
              <Button type="default" size="md" appearance="line">
                次要操作
              </Button>
              <Button type="primary" size="md" icon={<PlusOutlined />}>
                主操作
              </Button>
            </Space>
          }
        />
      </TypicalPageHeaderPortal>

      <div style={panelStyle}>
        <div style={contentStyle}>
          <EmptyState
            indicator={<PageNotFoundIndicator />}
            title={<span style={titleStyle}>页面不存在</span>}
            size="md"
          >
            <div style={descStyle}>
              请先进行数据的添加和新建，或者 <span style={linkStyle}>联系管理员</span>
            </div>
            <Space style={actionsStyle}>
              <Button type="default" appearance="line">
                次要操作
              </Button>
              <Button type="primary">返回首页</Button>
            </Space>
          </EmptyState>
        </div>
      </div>
    </div>
  )
}
