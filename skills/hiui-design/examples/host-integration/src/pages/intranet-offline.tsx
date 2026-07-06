import type { CSSProperties } from 'react'
import { Button, EmptyState, PageHeader, Space } from '@hi-ui/hiui'
import { PlusOutlined } from '@hi-ui/icons'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import intranetOfflineBaseUrl from '../assets/intranet-offline-base.svg'
import intranetOfflineGlobeUrl from '../assets/intranet-offline-globe.svg'
import intranetOfflineBadgeUrl from '../assets/intranet-offline-badge.svg'
import intranetOfflineBadgeSlashUrl from '../assets/intranet-offline-badge-slash.svg'
import { useTranslation } from '../../translation'

const pageStyle = {
  flex: '1 1 0%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  background: '#F5F8FC',
} satisfies CSSProperties

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
} satisfies CSSProperties

const contentStyle = {
  width: 400,
  textAlign: 'center',
} satisfies CSSProperties

const titleStyle = {
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 500,
  color: '#1A1D26',
} satisfies CSSProperties

const descStyle = {
  fontSize: 14,
  lineHeight: '22px',
  color: '#60636B',
} satisfies CSSProperties

const linkStyle = {
  color: '#2660FF',
} satisfies CSSProperties

const headerActionsStyle = {
  gap: 12,
} satisfies CSSProperties

const actionsStyle = {
  marginTop: 12,
  justifyContent: 'center',
} satisfies CSSProperties

const indicatorWrapStyle = {
  position: 'relative',
  width: 100,
  height: 100,
} satisfies CSSProperties

const baseStyle = {
  position: 'absolute',
  left: 13.13,
  top: 13.33,
  width: 73.528,
  height: 75.22,
  display: 'block',
} satisfies CSSProperties

const globeStyle = {
  position: 'absolute',
  left: 29.35,
  top: 42.66,
  width: 34.625,
  height: 30.882,
  display: 'block',
} satisfies CSSProperties

const badgeStyle = {
  position: 'absolute',
  left: 56.46,
  top: 59.99,
  width: 30.417,
  height: 30.223,
  display: 'block',
} satisfies CSSProperties

const badgeSlashAssetStyle = {
  position: 'absolute',
  left: 63.89,
  top: 67.22,
  width: 15.67,
  height: 15.56,
  display: 'block',
} satisfies CSSProperties

const badgeSlashWrapStyle = {
  position: 'absolute',
  left: 63.33,
  top: 66.67,
  width: 16.5,
  height: 16.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} satisfies CSSProperties

const badgeSlashLineStyle = {
  width: 1.67,
  height: 21.67,
  borderRadius: 5,
  background: '#DBDDE0',
  border: '1px solid #FFFFFF',
  boxSizing: 'border-box',
  transform: 'rotate(135deg)',
  transformOrigin: 'center',
} satisfies CSSProperties

function IntranetOfflineIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img src={intranetOfflineBaseUrl} alt="" aria-hidden="true" style={baseStyle} />
      <img src={intranetOfflineGlobeUrl} alt="" aria-hidden="true" style={globeStyle} />
      <img src={intranetOfflineBadgeUrl} alt="" aria-hidden="true" style={badgeStyle} />
      <img
        src={intranetOfflineBadgeSlashUrl}
        alt=""
        aria-hidden="true"
        style={badgeSlashAssetStyle}
      />
      <div aria-hidden="true" style={badgeSlashWrapStyle}>
        <div style={badgeSlashLineStyle} />
      </div>
    </div>
  )
}

export function IntranetOfflinePage() {
  const { t } = useTranslation()

  return (
    <div style={pageStyle}>
      <TypicalPageHeaderPortal>
        <PageHeader
          title={t('未连接内网')}
          extra={
            <Space style={headerActionsStyle}>
              <Button type="default" size="md" appearance="line">
                {t('次要操作')}
              </Button>
              <Button type="default" size="md" appearance="line">
                {t('次要操作')}
              </Button>
              <Button type="primary" size="md" icon={<PlusOutlined />}>
                {t('主操作')}
              </Button>
            </Space>
          }
        />
      </TypicalPageHeaderPortal>

      <div style={panelStyle}>
        <div style={contentStyle}>
          <EmptyState
            indicator={<IntranetOfflineIndicator />}
            title={<span style={titleStyle}>{t('未连接内网')}</span>}
            size="md"
          >
            <div style={descStyle}>
              {t('抱歉，网络连接中断，请稍后再试！，或')} <span style={linkStyle}>{t('联系管理员')}</span>
            </div>
            <Space style={actionsStyle}>
              <Button type="default" appearance="line">
                {t('次要操作')}
              </Button>
              <Button type="primary">{t('刷新页面')}</Button>
            </Space>
          </EmptyState>
        </div>
      </div>
    </div>
  )
}
