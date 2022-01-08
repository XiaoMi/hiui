import React from 'react'
import Radio from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="radio-basic__wrap">
        <Radio onChange={console.log}>Radio</Radio>
      </div>
    </>
  )
}
