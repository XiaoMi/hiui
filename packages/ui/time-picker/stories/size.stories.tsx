import React, { useState } from 'react'
import TimePicker from '../src'

export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="time-picker-appearance__wrap">
        <h2>sm</h2>
        <TimePicker placeholder={['请选择时间']} size={'sm'} />
        <h2>md</h2>
        <TimePicker placeholder={['请选择时间']} size={'md'} />
        <h2>lg</h2>
        <TimePicker placeholder={['请选择时间']} size={'lg'} />
      </div>
    </>
  )
}
