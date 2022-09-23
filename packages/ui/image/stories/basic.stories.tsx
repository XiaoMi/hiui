import React from 'react'
import Image from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="image-basic__wrap">
        <Image src="http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png" width={200} />
      </div>
    </>
  )
}
