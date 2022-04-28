import React from 'react'
import EmptyState from '../src'

/**
 * @title 自定义
 */
export const Custom = () => {
  return (
    <>
      <h1>Custom</h1>
      <div className="empty-state-custom__wrap">
        <EmptyState title="暂无收藏" indicator={<span>😎</span>} />
      </div>
    </>
  )
}
