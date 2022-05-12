import React from 'react'
import { TextArea } from '../src'

/**
 * @title 展示输入字数
 */
export const ShowCount = () => {
  const [value, setValue] = React.useState('')
  return (
    <>
      <h1>ShowCount</h1>
      <div className="textarea-show-count__wrap">
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          appearance="line"
          showCount
          maxLength={80}
        />
      </div>
    </>
  )
}
