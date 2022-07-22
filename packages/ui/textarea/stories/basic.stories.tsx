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
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          appearance="line"
        />
        <br />
        <br />
        <TextArea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="请输入"
          maxRows={3}
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
