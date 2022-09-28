import React from 'react'
import Image from '../src'

/**
 * @title 图片预览
 * @desc 点击预览图片，支持设置 Preview 组件所有参数
 */
export const Preview = () => {
  return (
    <>
      <h1>Preview</h1>
      <div className="image-basic__wrap">
        <Image
          src="http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png"
          width={200}
          preview={{ title: '小米' }}
        />
      </div>
    </>
  )
}
