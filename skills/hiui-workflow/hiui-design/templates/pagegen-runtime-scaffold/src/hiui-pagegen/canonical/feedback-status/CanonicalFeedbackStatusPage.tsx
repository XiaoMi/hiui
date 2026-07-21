import React from 'react'
import { Button, EmptyState, PageHeader, Space } from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalFeedbackStatusPage.module.scss'

export type FeedbackAction = {
  label: string
  message?: string
  navigateTo?: string
}

export type FeedbackStatusSchema = {
  pageType: 'feedback-status'
  variant?:
    | 'empty-state'
    | 'load-fail'
    | 'network-error'
    | 'no-permission'
    | 'page-not-found'
    | 'intranet-offline'
    | 'under-construction'
  title: string
  panelTitle: string
  panelDescription: string
  docLinkText?: string
  primaryAction?: FeedbackAction
  secondaryActions?: FeedbackAction[]
  panelSecondaryAction?: FeedbackAction
}

function joinClassNames(...tokens: Array<string | undefined | null | false>) {
  return tokens.filter(Boolean).join(' ')
}

export function CanonicalFeedbackStatusPage({
  schema,
  className,
}: {
  schema: FeedbackStatusSchema
  className?: string
}) {
  const hostAdapter = useHostAdapter()

  const handleAction = (action?: FeedbackAction) => {
    if (!action) {
      return
    }

    if (action.navigateTo) {
      hostAdapter.navigate(action.navigateTo)
      return
    }

    hostAdapter.message.success(action.message || `${action.label}（示例）`)
  }

  const headerExtra = (
    <Space className={styles.headerActions}>
      {(schema.secondaryActions || []).map((action) => (
        <Button
          key={action.label}
          type="default"
          appearance="line"
          onClick={() => handleAction(action)}
        >
          {action.label}
        </Button>
      ))}
      {schema.primaryAction ? (
        <Button type="primary" onClick={() => handleAction(schema.primaryAction)}>
          {schema.primaryAction.label}
        </Button>
      ) : null}
    </Space>
  )

  return (
    <div
      className={joinClassNames(styles.pageRoot, className)}
      data-hiui-pagegen-template="feedback-status"
      data-hiui5-page-type="feedback-status"
      data-hiui5-shell="hiui-pagegen-feedback-status-v1"
    >
      <div className={styles.headerRegion} data-hiui5-region="header">
        <PageHeader
          className={styles.pageHeader}
          title={schema.title}
          extra={headerExtra}
          backIcon={false}
        />
      </div>

      <div className={styles.whiteBody} data-hiui5-region="white-body">
        <div className={styles.feedbackPanel} data-hiui5-region="feedback-panel">
          <div className={styles.panelContent} data-hiui5-region="panel-content">
            <EmptyState title={<span className={styles.panelTitle}>{schema.panelTitle}</span>} size="md">
              <div className={styles.panelDescription}>
                {schema.panelDescription}
                {schema.docLinkText ? (
                  <>
                    <span className={styles.descriptionSeparator}>，</span>
                    <span className={styles.docLink}>{schema.docLinkText}</span>
                  </>
                ) : null}
              </div>

              {schema.panelSecondaryAction || schema.primaryAction ? (
                <Space className={styles.panelActions}>
                  {schema.panelSecondaryAction ? (
                    <Button
                      type="default"
                      appearance="line"
                      onClick={() => handleAction(schema.panelSecondaryAction)}
                    >
                      {schema.panelSecondaryAction.label}
                    </Button>
                  ) : null}
                  {schema.primaryAction ? (
                    <Button type="primary" onClick={() => handleAction(schema.primaryAction)}>
                      {schema.primaryAction.label}
                    </Button>
                  ) : null}
                </Space>
              ) : null}
            </EmptyState>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CanonicalFeedbackStatusPage
