import React from 'react'
import Watermark from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="watermark-basic__wrap" style={{ height: 402, width: '100vw' }}>
        <Watermark
          content={['HIUI', '做中台，就用 HIUI']}
          logo="https://xiaomi.github.io/hiui/static/img/logo.png?241e0618fe55d933c280e38954edea05"
        ></Watermark>
      </div>
    </>
  )
}
