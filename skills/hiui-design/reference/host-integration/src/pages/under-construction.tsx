import { Button, EmptyState, PageHeader, Space } from '@hi-ui/hiui'
import { PlusOutlined } from '@hi-ui/icons'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import underConstructionMainUrl from '../assets/under-construction-main.svg'
import underConstructionLine1Url from '../assets/under-construction-line-1.svg'
import underConstructionLine2Url from '../assets/under-construction-line-2.svg'
import underConstructionLine3Url from '../assets/under-construction-line-3.svg'

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

const mainIndicatorStyle = {
  position: 'absolute',
  left: 13.13,
  top: 26.46,
  width: 73.75,
  height: 63.75,
  display: 'block',
}

const line1Style = {
  position: 'absolute',
  left: 87.67,
  top: 19.17,
  width: 7.98,
  height: 3.35,
  display: 'block',
  transform: 'scaleX(-1) rotate(-12.65deg) skewX(0.99deg)',
  transformOrigin: 'center',
}

const line2Style = {
  position: 'absolute',
  left: 82.67,
  top: 10.83,
  width: 6.71,
  height: 7.28,
  display: 'block',
  transform: 'scaleX(-1) rotate(-12.65deg) skewX(0.99deg)',
  transformOrigin: 'center',
}

const line3Style = {
  position: 'absolute',
  left: 75.17,
  top: 11.67,
  width: 2.17,
  height: 5.69,
  display: 'block',
  transform: 'scaleX(-1) rotate(-12.65deg) skewX(0.99deg)',
  transformOrigin: 'center',
}

function UnderConstructionIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img src={underConstructionMainUrl} alt="" aria-hidden="true" style={mainIndicatorStyle} />
      <img src={underConstructionLine1Url} alt="" aria-hidden="true" style={line1Style} />
      <img src={underConstructionLine2Url} alt="" aria-hidden="true" style={line2Style} />
      <img src={underConstructionLine3Url} alt="" aria-hidden="true" style={line3Style} />
    </div>
  )
}

export function UnderConstructionPage() {
  return (
    <div style={pageStyle}>
      <TypicalPageHeaderPortal>
        <PageHeader
          title="页面建设中"
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
            indicator={<UnderConstructionIndicator />}
            title={<span style={titleStyle}>页面建设中</span>}
            size="md"
          >
            <div style={descStyle}>
              抱歉，当前页面建设中，详情请 <span style={linkStyle}>联系管理员</span>
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
