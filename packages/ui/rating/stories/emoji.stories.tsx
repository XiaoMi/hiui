import React from 'react'
import Rating from '../src'

/**
 * @title 使用表情
 * @desc 运用图标直观表达评级结果的优劣
 */
export const Emoji = () => {
  return (
    <>
      <h1>Emoji</h1>
      <div className="rating-emoji__wrap">
        <p>使用表情后将不可自定义数量，不可定义半星</p>
        <Rating defaultValue={5} useEmoji halfPlacement="horizontal"></Rating>
      </div>
    </>
  )
}
