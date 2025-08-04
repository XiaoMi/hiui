import React from 'react'
import { MiniProgress } from '../src'
import { CloseCircleFilled, CheckCircleFilled } from '@hi-ui/icons'

/**
 * @title 迷你用法
 */
export const Mini = () => {
  return (
    <>
      <h1>迷你用法</h1>
      <div className="progress-circle__wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
        <MiniProgress percent={75} />

        <MiniProgress type="success" percent={100} />

        <MiniProgress
          percent={20}
          icon={<CloseCircleFilled style={{ fontSize: 16, color: '#fa4646' }} />}
        />

        <MiniProgress
          percent={100}
          icon={<CheckCircleFilled style={{ fontSize: 16, color: '#24b237' }} />}
        />
      </div>
    </>
  )
}
