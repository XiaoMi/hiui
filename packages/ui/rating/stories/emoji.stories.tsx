import React from 'react'
import Rating from '../src'

export const Emoji = () => {
  return (
    <>
      <h1>Rating</h1>
      <div className="rating-emoji__wrap">
        <p>使用表情后将不可自定义数量，不可定义半星</p>
        <Rating defaultValue={5} useEmoji halfPlacement="horizontal"></Rating>
      </div>
    </>
  )
}
