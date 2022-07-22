import React from 'react'
import Rating from '../src'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [value, setValue] = React.useState(1)
  return (
    <>
      <h1>Controlled</h1>
      <div className="rating-controlled__wrap">
        <div>当前打分：{value} 分</div>
        <Rating style={{ marginTop: 8 }} value={value} onChange={setValue} />
      </div>
    </>
  )
}
