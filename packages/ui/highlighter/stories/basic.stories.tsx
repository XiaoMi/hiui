import React from 'react'
import Highlighter from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="highlighter-basic__wrap">
        <Highlighter keyword="高亮">我想要高亮的文案是：高亮</Highlighter>
      </div>
    </>
  )
}
