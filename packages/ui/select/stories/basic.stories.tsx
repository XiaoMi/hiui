import React from 'react'
import Select, { SelectOption } from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="select-basic__wrap">
        <Select placeholder="请选择">
          <span>title</span>
          <SelectOption value="ABC1">Option-ABC1</SelectOption>
          <SelectOption value="ABC2">Option-ABC2</SelectOption>
          <SelectOption value="ABC3">Option-ABC3</SelectOption>
          <span>title2</span>
          <SelectOption value="ABC4">Option-ABC4</SelectOption>
          <SelectOption value="ABC5">Option-ABC5</SelectOption>
          <SelectOption value="ABC6">Option-ABC6</SelectOption>
        </Select>
      </div>
    </>
  )
}
