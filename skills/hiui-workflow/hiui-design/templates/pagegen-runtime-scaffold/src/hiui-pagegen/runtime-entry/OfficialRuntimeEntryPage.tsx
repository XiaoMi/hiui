import React from 'react'
import { Button } from '@hi-ui/hiui'
import type { HostAdapter } from '../host/types'
import {
  buildOfficialRuntimePageUrl,
  encodeOfficialRuntimePayload,
  resolveOfficialRuntimeOrigin,
  resolveOfficialRuntimePageId,
} from './official-runtime-config'
import styles from './OfficialRuntimeEntryPage.module.scss'

type OfficialRuntimeEntryPageProps = {
  className?: string
  hostAdapter: HostAdapter
  pageType: string
  runtimePageId: string
  title: string
  schema: Record<string, unknown>
}

export function OfficialRuntimeEntryPage({
  className,
  hostAdapter,
  pageType,
  runtimePageId,
  title,
  schema,
}: OfficialRuntimeEntryPageProps) {
  const runtimeOrigin = resolveOfficialRuntimeOrigin()
  const resolvedRuntimePageId = resolveOfficialRuntimePageId(pageType, runtimePageId, schema)
  const runtimeUrl = buildOfficialRuntimePageUrl(resolvedRuntimePageId, runtimeOrigin, {
    schemaPayload: encodeOfficialRuntimePayload({
      pageType,
      schema,
      runtimePageId: resolvedRuntimePageId,
    }),
  })

  const handleOpenRuntime = React.useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    const openedWindow = window.open(runtimeUrl, '_blank', 'noopener,noreferrer')
    if (!openedWindow) {
      hostAdapter.message.warning('官方 runtime 页面被浏览器拦截，请允许弹窗后重试')
    }
  }, [hostAdapter.message, runtimeUrl])

  return (
    <div className={`${styles.entryRoot} ${className || ''}`.trim()}>
      <div className={styles.entryCard}>
        <div className={styles.eyebrow}>official runtime entry</div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>
          该页面不再直接承载本地主树 canonical 典型页，而是作为宿主入口壳，
          统一跳转到隔离 runtime 中的官方典型页渲染链路。
        </p>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>pageType</div>
            <div className={styles.metaValue}>{pageType}</div>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>officialRuntimePageId</div>
            <div className={styles.metaValue}>{resolvedRuntimePageId}</div>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>runtimeOrigin</div>
            <div className={styles.metaValue}>{runtimeOrigin}</div>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>schema.pageType</div>
            <div className={styles.metaValue}>{String(schema.pageType || pageType)}</div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="primary" onClick={handleOpenRuntime}>
            打开官方 runtime 页面
          </Button>
          <Button
            type="default"
            appearance="line"
            onClick={() => hostAdapter.message.success(`官方 runtime 地址：${runtimeUrl}`)}
          >
            显示运行时地址
          </Button>
        </div>

        <div className={styles.tips}>
          <div className={styles.tipsTitle}>当前链路定位</div>
          <div className={styles.tipsBody}>
            这是新生成流程下的宿主入口页。业务 schema 仍保留在当前项目中，但官方典型页渲染由独立 runtime 负责，
            当前项目只承担路由、跳转和接入职责。
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfficialRuntimeEntryPage
