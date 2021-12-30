import React from 'react'
import Input from '../src'

export const Clearable = () => {
  return (
    <>
      <h1>Clearable for Input</h1>
      <div className="input-clearable__wrap">
        <Input
          clearable
          placeholder="内容输入后只在 hover 时可清除"
          onChange={(e) => console.log('change', e.target.value)}
        ></Input>
        <br />
        <br />
        <Input clearable clearableTrigger="always" placeholder="内容输入后就可清除"></Input>
      </div>
    </>
  )
}
