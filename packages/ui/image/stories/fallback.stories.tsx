import React from 'react'
import Image from '../src'

/**
 * @title 容错处理
 * @desc 设置 fallback，当图片加载失败时，显示占位图
 */
export const Fallback = () => {
  return (
    <>
      <h1>Fallback</h1>
      <div className="image-basic__wrap">
        <Image
          src="http://error.mifile.cn/f/i/hiui/docs/card/pic_1.png"
          width={200}
          fallback="http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png"
        />
      </div>
    </>
  )
}
