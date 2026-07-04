import type { CSSProperties } from 'react'
import { Button, EmptyState, PageHeader, Space } from '@hi-ui/hiui'
import { PlusOutlined } from '@hi-ui/icons'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import noPermissionMainUrl from '../assets/no-permission-main.svg'
import noPermissionBadgeUrl from '../assets/no-permission-badge.svg'
import { useTranslation } from '../../translation'

const pageStyle: CSSProperties = {
  flex: '1 1 0%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  background: '#F5F8FC',
}

const panelStyle: CSSProperties = {
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

const contentStyle: CSSProperties = {
  width: 400,
  textAlign: 'center',
}

const titleStyle: CSSProperties = {
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 500,
  color: '#1A1D26',
}

const descStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: '22px',
  color: '#60636B',
}

const linkStyle: CSSProperties = {
  color: '#2660FF',
}

const headerActionsStyle: CSSProperties = {
  gap: 12,
}

const actionsStyle: CSSProperties = {
  marginTop: 12,
  justifyContent: 'center',
}

const indicatorWrapStyle: CSSProperties = {
  position: 'relative',
  width: 100,
  height: 100,
}

const mainIndicatorStyle: CSSProperties = {
  position: 'absolute',
  left: 13.07,
  top: 13.13,
  width: 75.804,
  height: 80.1834,
  display: 'block',
}

const badgeIndicatorStyle: CSSProperties = {
  position: 'absolute',
  left: 61.25,
  top: 64.58,
  width: 20.833,
  height: 20.834,
  display: 'block',
}

function NoPermissionIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img src={noPermissionMainUrl} alt="" aria-hidden="true" style={mainIndicatorStyle} />
      <img src={noPermissionBadgeUrl} alt="" aria-hidden="true" style={badgeIndicatorStyle} />
    </div>
  )
}

export function NoPermissionPage() {
  const { t } = useTranslation()

  return (
    <div style={pageStyle}>
      <TypicalPageHeaderPortal>
        <PageHeader
          title={t('暂无权限')}
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
            indicator={<NoPermissionIndicator />}
            title={<span style={titleStyle}>{t('暂无权限')}</span>}
            size="md"
          >
            <div style={descStyle}>
              {t('抱歉，您没有当前模块的访问权限，请')} <span style={linkStyle}>{t('联系管理员')}</span>
            </div>
            <Space style={actionsStyle}>
              <Button type="default" appearance="line">
                {t('次要操作')}
              </Button>
              <Button type="primary">{t('立即申请')}</Button>
            </Space>
          </EmptyState>
        </div>
      </div>
    </div>
  )
}
