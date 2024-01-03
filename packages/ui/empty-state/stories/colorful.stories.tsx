import React from 'react'
import EmptyState, {
  EMPTY_STATE_IMAGE_NO_MESSAGE_COLOURFUL,
  EMPTY_STATE_IMAGE_NO_RESULT_COLOURFUL,
  EMPTY_STATE_IMAGE_NO_COLLECTION_COLOURFUL,
  EMPTY_STATE_IMAGE_NO_ACCESS_COLOURFUL,
  EMPTY_STATE_IMAGE_NO_NETWORK_COLOURFUL,
  EMPTY_STATE_IMAGE_NO_OPEN_COLOURFUL,
  EMPTY_STATE_IMAGE_404_COLOURFUL,
  EMPTY_STATE_IMAGE_SERVICE_ERROR_COLOURFUL,
  EMPTY_STATE_IMAGE_PAGE_ERROR_COLOURFUL,
  EMPTY_STATE_IMAGE_SUCCESS_COLOURFUL,
  EMPTY_STATE_IMAGE_ERROR_COLOURFUL,
  EMPTY_STATE_IMAGE_WARNING_COLOURFUL,
  EMPTY_STATE_IMAGE_NO_DATA_COLOURFUL,
  EMPTY_STATE_IMAGE_JUMP_COLOURFUL,
  EMPTY_STATE_IMAGE_CHART_NO_DATA_COLOURFUL,
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
          <EmptyState size="xxl" title="无权限" indicator={EMPTY_STATE_IMAGE_NO_ACCESS_COLOURFUL} />
          <EmptyState
            size="xxl"
            title="无网络"
            indicator={EMPTY_STATE_IMAGE_NO_NETWORK_COLOURFUL}
          />
          <EmptyState size="xxl" title="建设中" indicator={EMPTY_STATE_IMAGE_NO_OPEN_COLOURFUL} />
          <EmptyState size="xxl" title="404" indicator={EMPTY_STATE_IMAGE_404_COLOURFUL} />
          <EmptyState
            size="xxl"
            title="服务器失去链接"
            indicator={EMPTY_STATE_IMAGE_SERVICE_ERROR_COLOURFUL}
          />
          <EmptyState
            size="xxl"
            title="页面出错"
            indicator={EMPTY_STATE_IMAGE_PAGE_ERROR_COLOURFUL}
          />
          <EmptyState size="xxl" title="提交成功" indicator={EMPTY_STATE_IMAGE_SUCCESS_COLOURFUL} />
          <EmptyState size="xxl" title="错误提示" indicator={EMPTY_STATE_IMAGE_ERROR_COLOURFUL} />
          <EmptyState size="xxl" title="警告提示" indicator={EMPTY_STATE_IMAGE_WARNING_COLOURFUL} />
          <EmptyState size="xl" title="跳转" indicator={EMPTY_STATE_IMAGE_JUMP_COLOURFUL} />
          <EmptyState
            size="xl"
            title="无查询结果"
            indicator={EMPTY_STATE_IMAGE_NO_RESULT_COLOURFUL}
          />
          <EmptyState size="xl" title="暂无数据" indicator={EMPTY_STATE_IMAGE_NO_DATA_COLOURFUL} />
          <EmptyState
            size="xl"
            title="暂无收藏"
            indicator={EMPTY_STATE_IMAGE_NO_COLLECTION_COLOURFUL}
          />
          <EmptyState size="xl" title="无消息" indicator={EMPTY_STATE_IMAGE_NO_MESSAGE_COLOURFUL} />
          <EmptyState
            size="xl"
            title="无数据-图表类"
            indicator={EMPTY_STATE_IMAGE_CHART_NO_DATA_COLOURFUL}
          />
        </div>
      </div>
    </>
  )
}
