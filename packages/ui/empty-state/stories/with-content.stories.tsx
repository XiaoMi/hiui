import React from 'react'
import EmptyState from '../src'
import { Button } from '@hi-ui/button'

/**
 * @title 带内容
 */
export const WithContent = () => {
  return (
    <>
      <h1>WithContent</h1>
      <div className="empty-state-with-content__wrap">
        <EmptyState title="当前页面暂无数据">
          <Button type="primary">刷新</Button>
        </EmptyState>
      </div>
    </>
  )
}
