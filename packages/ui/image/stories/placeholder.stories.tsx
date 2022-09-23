import React from 'react'
import Image from '../src'

/**
 * @title 渐进加载
 * @desc 当加载大图片时，设置 placeholder 为一个低质量图片，渐进加载
 */
export const Placeholder = () => {
  return (
    <>
      <h1>Placeholder</h1>
      <div className="image-basic__wrap">
        <Image
          src="http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png"
          width={200}
          placeholder={
            <Image
              width={200}
              style={{ filter: 'blur(5px)' }}
              src="http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png"
            />
          }
        />
      </div>
    </>
  )
}
