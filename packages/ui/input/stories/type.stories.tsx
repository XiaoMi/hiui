import React from 'react'
import Input from '../src'

export const Type = () => {
  return (
    <>
      <h1>Type for Input</h1>
      <div className="input-type__wrap">
        <Input type="number" placeholder="please input number"></Input>
      </div>
    </>
  )
}
