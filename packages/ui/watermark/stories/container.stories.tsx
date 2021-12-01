import React, { useState } from 'react'
import Watermark from '../src'
export const Container = () => {
  const containerRef = useState(null)
  return (
    <>
      <h1>Container</h1>
      <div
        style={{
          height: 402,
          width: '100vw',
          textAlign: 'center',
        }}
        ref={containerRef[1]}
        className="watermark-container__wrap"
      ></div>
      <Watermark
        content={['HIUI', '做中台，就用 HIUI']}
        logo="https://xiaomi.github.io/hiui/static/img/logo.png?241e0618fe55d933c280e38954edea05"
        container={containerRef[0]}
        allowCopy={true}
      >
        Container
      </Watermark>
    </>
  )
}
