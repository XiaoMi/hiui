import React from 'react'
import EmptyState, {
  EMPTY_STATE_IMAGE_NO_MESSAGE_COLORFUL,
  EMPTY_STATE_IMAGE_NO_RESULT_COLORFUL,
  EMPTY_STATE_IMAGE_NO_COLLECTION_COLORFUL,
  EMPTY_STATE_IMAGE_NO_ACCESS_COLORFUL,
  EMPTY_STATE_IMAGE_NO_NETWORK_COLORFUL,
  EMPTY_STATE_IMAGE_NO_OPEN_COLORFUL,
  EMPTY_STATE_IMAGE_404_COLORFUL,
  EMPTY_STATE_IMAGE_SERVICE_ERROR_COLORFUL,
  EMPTY_STATE_IMAGE_PAGE_ERROR_COLORFUL,
  EMPTY_STATE_IMAGE_SUCCESS_COLORFUL,
  EMPTY_STATE_IMAGE_ERROR_COLORFUL,
  EMPTY_STATE_IMAGE_WARNING_COLORFUL,
  EMPTY_STATE_IMAGE_NO_DATA_COLORFUL,
  EMPTY_STATE_IMAGE_JUMP_COLORFUL,
  EMPTY_STATE_IMAGE_CHART_NO_DATA_COLORFUL,
} from '../src'

/**
 * @title 彩色图标
 */
export const Colorful = () => {
  return (
    <>
      <h1>Colorful</h1>
      <div className="empty-state-colorful__wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: 32 }}>
          <EmptyState size="md" title="无权限" indicator={EMPTY_STATE_IMAGE_NO_ACCESS_COLORFUL} />
          <EmptyState size="md" title="无网络" indicator={EMPTY_STATE_IMAGE_NO_NETWORK_COLORFUL} />
          <EmptyState size="md" title="建设中" indicator={EMPTY_STATE_IMAGE_NO_OPEN_COLORFUL} />
          <EmptyState size="md" title="404" indicator={EMPTY_STATE_IMAGE_404_COLORFUL} />
          <EmptyState
            size="md"
            title="服务器失去链接"
            indicator={EMPTY_STATE_IMAGE_SERVICE_ERROR_COLORFUL}
          />
          <EmptyState
            size="md"
            title="页面出错"
            indicator={EMPTY_STATE_IMAGE_PAGE_ERROR_COLORFUL}
          />
          <EmptyState size="md" title="提交成功" indicator={EMPTY_STATE_IMAGE_SUCCESS_COLORFUL} />
          <EmptyState size="md" title="错误提示" indicator={EMPTY_STATE_IMAGE_ERROR_COLORFUL} />
          <EmptyState size="md" title="警告提示" indicator={EMPTY_STATE_IMAGE_WARNING_COLORFUL} />
          <EmptyState size="md" title="跳转" indicator={EMPTY_STATE_IMAGE_JUMP_COLORFUL} />
          <EmptyState
            size="md"
            title="无查询结果"
            indicator={EMPTY_STATE_IMAGE_NO_RESULT_COLORFUL}
          />
          <EmptyState size="md" title="暂无数据" indicator={EMPTY_STATE_IMAGE_NO_DATA_COLORFUL} />
          <EmptyState
            size="md"
            title="暂无收藏"
            indicator={EMPTY_STATE_IMAGE_NO_COLLECTION_COLORFUL}
          />
          <EmptyState size="md" title="无消息" indicator={EMPTY_STATE_IMAGE_NO_MESSAGE_COLORFUL} />
          <EmptyState
            size="md"
            title="无数据-图表类"
            indicator={EMPTY_STATE_IMAGE_CHART_NO_DATA_COLORFUL}
          />
        </div>
      </div>
    </>
  )
}
