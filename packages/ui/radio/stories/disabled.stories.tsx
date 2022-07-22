import React from 'react'
import Radio from '../src'

/**
 * @title 禁用状态
 */
export const Disabled = () => {
  return (
    <>
      <h1>disabled</h1>
      <div
        className="radio-disabled__wrap"
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <Radio disabled checked>
          disabled Checked Radio
        </Radio>
        <Radio disabled>Disabled No-Checked Radio</Radio>
      </div>
    </>
  )
}
