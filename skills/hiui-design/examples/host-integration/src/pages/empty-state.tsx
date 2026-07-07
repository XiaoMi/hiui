import { Button, EmptyState, PageHeader, Space } from '@hi-ui/hiui'
import { PlusOutlined } from '@hi-ui/icons'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import { useTranslation } from '../../translation'

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

export function EmptyStatePage() {
  const { t } = useTranslation()

  return (
    <div data-hiui5-shell-carrier="FeedbackStatePanel" style={pageStyle}>
      <TypicalPageHeaderPortal>
        <PageHeader
          title={t('暂无数据')}
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
          <EmptyState title={<span style={titleStyle}>{t('暂无数据')}</span>} size="md">
            <div style={descStyle}>
              {t('请先进行数据的添加和新建，或者')} <span style={linkStyle}>{t('查看说明文档')}</span>
            </div>
            <Space style={actionsStyle}>
              <Button type="default" appearance="line">
                {t('次要操作')}
              </Button>
              <Button type="primary">{t('立即创建')}</Button>
            </Space>
          </EmptyState>
        </div>
      </div>
    </div>
  )
}
