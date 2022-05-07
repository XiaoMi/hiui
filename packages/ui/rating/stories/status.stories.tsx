import React from 'react'
import Rating from '../src'

/**
 * @title 不同状态
 * @desc 展示所有备选项，数量不宜超出10个
 */
export const Status = () => {
  return (
    <>
      <h1>不同状态</h1>
      <div className="rating-status__wrap">
        <h2>禁用</h2>
        <Rating disabled defaultValue={3.5} halfPlacement="vertical" onHover={console.log}></Rating>
        <h2>只读</h2>
        <Rating readOnly defaultValue={4} allowHalf={false} halfPlacement="horizontal"></Rating>
        <br />
        <h2>自动聚焦</h2>
        <Rating
          autoFocus
          defaultValue={3.5}
          halfPlacement="vertical"
          onHover={console.log}
        ></Rating>
      </div>
    </>
  )
}
