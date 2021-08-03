import React from 'react'
import Input from '../src'
import Button from '@hi-ui/button'

export const Focus = () => {
  const inputRef = React.useRef(null)

  return (
    <>
      <h1>Focus for Input</h1>
      <div className="input-focus__wrap">
        <Input autoFocus placeholder="请输入"></Input>
        <br />
        <Button
          onClick={() => {
            inputRef.current?.focus()
          }}
        >
          手动聚焦
        </Button>
        <Input style={{ marginTop: 8 }} ref={inputRef} placeholder="请输入"></Input>
      </div>
    </>
  )
}
