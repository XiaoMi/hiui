import React, { useState } from 'react'
import Preview from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  const [show, setShow] = useState(false)
  return (
    <>
      <h1>Basic</h1>
      <div className="preview-basic__wrap">
        <Button
          onClick={() => {
            setShow(true)
          }}
        >
          按钮
        </Button>
        <Preview
          visible={show}
          onClose={() => {
            setShow(false)
          }}
        />
      </div>
    </>
  )
}
