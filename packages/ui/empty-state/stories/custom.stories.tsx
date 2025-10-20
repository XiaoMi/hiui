import React from 'react'
import EmptyState, {
  EMPTY_STATE_IMAGE_NO_RESULT,
  EMPTY_STATE_IMAGE_SERVICE_ERROR,
  EMPTY_STATE_IMAGE_NO_ACCESS,
  EMPTY_STATE_IMAGE_404,
  EMPTY_STATE_IMAGE_NO_OPEN,
  EMPTY_STATE_IMAGE_NO_NETWORK,
  EMPTY_STATE_IMAGE_NO_LAN,
} from '../src'

/**
 * @title 自定义
 */
export const Custom = () => {
  return (
    <>
      <h1>Custom</h1>
      <div className="empty-state-custom__wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
          <EmptyState title="暂无搜索结果" indicator={EMPTY_STATE_IMAGE_NO_RESULT} />
          <EmptyState title="暂无权限" indicator={EMPTY_STATE_IMAGE_NO_ACCESS} />
          <EmptyState title="加载失败" indicator={EMPTY_STATE_IMAGE_SERVICE_ERROR} />
          <EmptyState title="页面不存在" indicator={EMPTY_STATE_IMAGE_404} />
          <EmptyState title="功能建设中" indicator={EMPTY_STATE_IMAGE_NO_OPEN} />
          <EmptyState title="网络连接失败" indicator={EMPTY_STATE_IMAGE_NO_NETWORK} />
          <EmptyState title="未连接内网" indicator={EMPTY_STATE_IMAGE_NO_LAN} />
        </div>
      </div>
    </>
  )
}
