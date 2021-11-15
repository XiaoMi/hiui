import React from 'react'
import Radio from '../src'

export const Disabled = () => {
  return (
    <>
      <h1>disabled</h1>
      <div className="radio-disabled__wrap">
        <Radio disabled checked>
          cisabled Checked Radio
        </Radio>
        <Radio disabled>Disabled No-Checked Radio</Radio>
      </div>
    </>
  )
}
