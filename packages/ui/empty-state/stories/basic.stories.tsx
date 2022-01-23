import React from 'react'
import EmptyState from '../src'
import { Button } from '@hi-ui/button'
// @ts-ignore
import CustomIcon from './custom.svg'

export const Basic = () => {
  return (
    <>
      <h1>EmptyState</h1>
      <div className="empty-state-basic__wrap">
        <h2>Size</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EmptyState size={'sm'} />
          <EmptyState title="暂无数据" size={'md'} />
          <EmptyState title="暂无数据" size={'lg'} />
        </div>
        <h2>Combination</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EmptyState />
          <EmptyState title="暂无数据" />
          <EmptyState title="当前页面暂无数据">
            <Button type={'primary'}>&nbsp;&nbsp;刷新&nbsp;&nbsp;</Button>
          </EmptyState>
        </div>
        <h2>Custom</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EmptyState title="服务异常" indicator={CustomIcon} />
        </div>
      </div>
    </>
  )
}
