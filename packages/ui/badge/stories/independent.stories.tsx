import React from 'react'
import Badge from '../src'

/**
 * @title 独立使用
 */
export const Independent = () => {
  return (
    <>
      <h1>独立使用的</h1>
      <div className="badge-independent__wrap">
        <Badge type="dot" />
        <br />
        <br />
        <Badge content="16" />
      </div>
    </>
  )
}
