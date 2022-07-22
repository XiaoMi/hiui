import React from 'react'
import Input from '../src'
import Button from '@hi-ui/button'

/**
 * @title 手动聚焦
 * @desc 通过 ref 获取 input 引用手动调用 focus 方法
 */
export const Focus = () => {
  const inputRef = React.useRef<any>(null)

  return (
    <>
      <h1>Focus for Input</h1>
      <div className="input-focus__wrap">
        <Button
          onClick={() => {
            inputRef.current?.focus()
          }}
        >
          手动聚焦
        </Button>
        <Input style={{ marginTop: 10 }} ref={inputRef} placeholder="请输入"></Input>
      </div>
    </>
  )
}
