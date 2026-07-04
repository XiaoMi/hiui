import type { CSSProperties } from 'react'
import { Button, EmptyState, PageHeader, Space } from '@hi-ui/hiui'
import { PlusOutlined } from '@hi-ui/icons'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import loadFailIndicatorUrl from '../assets/load-fail-indicator.svg'
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
  width: 100,
  height: 100,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
}

function LoadFailIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img
        src={loadFailIndicatorUrl}
        alt=""
        aria-hidden="true"
        style={{ width: 73.75, height: 77.47, display: 'block' }}
      />
    </div>
  )
}

export function LoadFailPage() {
  const { t } = useTranslation()

  return (
    <div style={pageStyle}>
      <TypicalPageHeaderPortal>
        <PageHeader
          title={t('加载失败')}
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
            indicator={<LoadFailIndicator />}
            title={<span style={titleStyle}>{t('加载失败')}</span>}
            size="md"
          >
            <div style={descStyle}>
              {t('请先进行数据的添加和新建，或者')} <span style={linkStyle}>{t('联系管理员')}</span>
            </div>
            <Space style={actionsStyle}>
              <Button type="default" appearance="line">
                {t('次要操作')}
              </Button>
              <Button type="primary">{t('立即重试')}</Button>
            </Space>
          </EmptyState>
        </div>
      </div>
    </div>
  )
}
