import type { FeedbackStatusDescription, FeedbackStatusVariantId } from './types'
import { Button, EmptyState, PageHeader, Space } from '@hi-ui/hiui'
import { PlusOutlined } from '@hi-ui/icons'
import { resolveFeedbackStatusVariant } from './variants'
import styles from './index.module.scss'
import { useTranslation } from './page-localization'

const rootStyle = {
  background: '#F5F8FC',
}

const panelStyle = {
  flex: '1 1 0%',
  minHeight: 0,
  border: '1px solid #EDEFF2',
  borderRadius: 12,
  background: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const contentStyle = {
  width: 400,
  textAlign: 'center' as const,
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

const headerActionsStyle = {
  gap: 12,
}

const actionGroupStyle = {
  marginTop: 12,
  justifyContent: 'center',
}

function renderHeaderActions(translate: (key: string) => string) {
  return (
    <Space style={headerActionsStyle}>
      <Button type="default" appearance="line">
        {translate('次要操作')}
      </Button>
      <Button type="default" appearance="line">
        {translate('次要操作')}
      </Button>
      <Button type="primary" icon={<PlusOutlined />}>
        {translate('主操作')}
      </Button>
    </Space>
  )
}

type FeedbackStatusPageProps = {
  variantId?: FeedbackStatusVariantId
}

export function FeedbackStatusPage({ variantId = 'empty-state' }: FeedbackStatusPageProps) {
  const { t } = useTranslation()
  const variant = resolveFeedbackStatusVariant(variantId)

  function renderDescription(description: FeedbackStatusDescription) {
    return (
      <div style={descStyle}>
        {t(description.leadingText)}
        {description.accentText ? <span style={{ color: '#2660FF' }}>{t(description.accentText)}</span> : null}
        {description.trailingText ? t(description.trailingText) : null}
      </div>
    )
  }

  return (
    <div className={styles.pageRoot} style={rootStyle}>
      <PageHeader title={t(variant.title)} extra={renderHeaderActions(t)} />

      <div className={styles.whiteBody}>
        <div style={panelStyle}>
          <div style={contentStyle}>
            <EmptyState
              indicator={variant.indicator}
              title={<span style={titleStyle}>{t(variant.title)}</span>}
              size="md"
            >
              {renderDescription(variant.description)}
              <Space style={actionGroupStyle}>
                <Button type="default" appearance="line">
                  {t('次要操作')}
                </Button>
                <Button type="primary">{t(variant.primaryActionLabel)}</Button>
              </Space>
            </EmptyState>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackStatusPage
