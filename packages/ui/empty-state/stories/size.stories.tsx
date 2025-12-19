import React from 'react'
import EmptyState from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="empty-state-size__wrap" style={{ display: 'flex', alignItems: 'center' }}>
        <EmptyState size={'sm'} />
        <EmptyState title="暂无数据" size={'md'} />
        <EmptyState title="暂无数据" size={'lg'} />
      </div>
    </>
  )
}
