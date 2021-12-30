import React from 'react'
import { TextArea } from '../src'

export const Textarea = () => {
  const [value, setValue] = React.useState('')
  return (
    <>
      <h1>TextArea for Input</h1>
      <div className="input-textarea__wrap">
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          rows={3}
          appearance="outline"
        />
        <br />
        <br />
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          rows={3}
          appearance="filled"
        />
        <br />
        <br />
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          rows={3}
          appearance="unset"
        />
      </div>
    </>
  )
}
