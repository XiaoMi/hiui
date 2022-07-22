import React from 'react'
import Watermark from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div
        className="watermark-basic__wrap"
        style={{ height: 402, minWidth: 660, position: 'relative', zIndex: 0 }}
      >
        <Watermark
          content={['HiUI', '做中台，就用 HiUI']}
          logo="https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/logo.png"
        ></Watermark>
      </div>
    </>
  )
}
