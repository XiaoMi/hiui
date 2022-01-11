import React from 'react'
import Rating from '../src'
// @ts-ignore
import smile1Png from './assets/logo-1@2x.png'
// @ts-ignore
import smile2Png from './assets/logo-2@2x.png'
// @ts-ignore
import smile3Png from './assets/logo-3@2x.png'
// @ts-ignore
import smile4Png from './assets/logo-4@2x.png'
// @ts-ignore
import smile5Png from './assets/logo-5@2x.png'

export const Custom = () => {
  return (
    <>
      <h1>Custom</h1>
      <div className="rating-custom__wrap">
        <Rating
          defaultValue={1}
          characterRender={(value, index) => {
            const Emojis = [smile1Png, smile2Png, smile3Png, smile4Png, smile5Png]

            return <img src={Emojis[Math.ceil(value) - 1]} style={{ width: 24, height: 24 }} />
          }}
        ></Rating>
      </div>
    </>
  )
}
