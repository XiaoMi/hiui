import React, { useState } from 'react'
import { Button } from '@hi-ui/button'
import Watermark from '../src/'

export const Basic = () => {
  const [bool, setBool] = useState(false)
  return (
    <>
      <h1>Basic123</h1>
      <Button onClick={() => setBool((prev) => !prev)}>toggleVisible</Button>
      <div className="watermark-basic__wrap" style={{ height: 990, width: 990 }}>
        {/* <div className="watermark-basic__wrap"> */}
        {bool ? (
          <Watermark
            // content={['watermarkwatermarkwatermarkwatermarkwatermark', '2', '3', '4']}
            content={['HIUI', '做中台，就用 HIUI']}
            // logo="https://xiaomi.github.io/hiui/static/img/logo.png?241e0618fe55d933c280e38954edea05"
            zIndex={99999999}
            // density="high"
            container={document.body}
          >
            <h1>Basic123</h1>
            <h1>Basic123</h1>
            <h1>Basic123</h1>
            <h1>Basic123</h1>
            <h1>Basic123</h1>
            <h1>Basic123</h1>
            <h1>Basic123</h1>
            <h1>Basic123</h1>
            <h1>Basic123</h1>
          </Watermark>
        ) : null}
      </div>
    </>
  )
}
