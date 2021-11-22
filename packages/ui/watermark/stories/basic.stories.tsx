import React from 'react'
import Watermark from '../src/'

export const Basic = () => {
  return (
    <>
      <h1>Basic123</h1>
      <div className="watermark-basic__wrap" style={{ height: 402, width: 1421 }}>
        <Watermark
          content={['HIUI', '做中台，就用 HIUI']}
          logo="https://xiaomi.github.io/hiui/static/img/logo.png?241e0618fe55d933c280e38954edea05"
        ></Watermark>
      </div>
    </>
  )
}
