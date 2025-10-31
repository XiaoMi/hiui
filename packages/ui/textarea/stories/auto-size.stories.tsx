import React from 'react'
import TextArea from '../src'

/**
 * @title 自动适应高度
 */
export const AutoSize = () => {
  const [value, setValue] = React.useState('')
  const [r, sr] = React.useState(2)

  return (
    <>
      <h1>AutoSize</h1>
      <div className="textarea-auto-size__wrap" style={{ width: 50 }}>
        <button onClick={() => sr(3)}>update</button>
        <br />
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          // placeholder="请输入"
          minRows={2}
          appearance="line"
        />
        <br />
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          // placeholder="请输入"
          maxRows={3}
          appearance="line"
        />
      </div>
    </>
  )
}
