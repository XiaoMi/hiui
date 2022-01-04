import React from 'react'
import Badge from '../src'

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
