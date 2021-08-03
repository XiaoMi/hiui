import React from 'react'
import Input from '../src'

export const Clearable = () => {
  return (
    <>
      <h1>Clearable for Input</h1>
      <div className="input-clearable__wrap">
        <Input clearable placeholder="请输入"></Input>
        <br />
        <Input clearable clearableTrigger="always" placeholder="请输入"></Input>
      </div>
    </>
  )
}
