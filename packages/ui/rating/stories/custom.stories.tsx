import React from 'react'
import Rating from '../src'

const smile1Png =
  'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-1%402x.png'

const smile2Png =
  'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-2%402x.png'

const smile3Png =
  'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-3%402x.png'

const smile4Png =
  'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-4%402x.png'

const smile5Png =
  'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-5%402x.png'

/**
 * @title 自定义渲染
 * @desc 使用 renderCharacter()=>ReactNode 自定义渲染
 */
export const Custom = () => {
  return (
    <>
      <h1>Custom</h1>
      <div className="rating-custom__wrap">
        <Rating
          defaultValue={1}
          characterRender={(value) => {
            const Emojis = [smile1Png, smile2Png, smile3Png, smile4Png, smile5Png]

            return <img src={Emojis[Math.ceil(value) - 1]} style={{ width: 24, height: 24 }} />
          }}
        ></Rating>
      </div>
    </>
  )
}
