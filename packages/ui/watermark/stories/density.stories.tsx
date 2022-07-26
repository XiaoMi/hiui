import React from 'react'
import Watermark from '../src'

/**
 * @title 自定义疏密度
 * @desc 通过 density 设置水印的疏密度
 */
export const Density = () => {
  return (
    <>
      <h1>Density</h1>
      <div
        className="watermark-density__wrap"
        style={{ height: 402, minWidth: 660, position: 'relative', zIndex: 0 }}
      >
        <Watermark density="low" content={['HiUI', '做中台，就用 HiUI']}></Watermark>
      </div>
    </>
  )
}
