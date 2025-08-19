import React from 'react'
import TextArea from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const [value, setValue] = React.useState('')
  return (
    <>
      <h1>Basic</h1>
      <div className="textarea-basic__wrap">
        <h2>line</h2>
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          appearance="line"
        />
        <br />
        <br />
        <h2>filled</h2>
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          maxRows={3}
          appearance="filled"
        />
        <br />
        <br />
        <h2>unset</h2>
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          rows={3}
          appearance="unset"
        />
        <br />
        <br />
        <h2>borderless</h2>
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          appearance="borderless"
        />
      </div>
    </>
  )
}
