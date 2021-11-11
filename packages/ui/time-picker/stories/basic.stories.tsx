import React, { useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import TimePicker from '../src'
import { Selector, SelectorItem } from '../src/Selector'
// import '../src/styles/index.scss'

const Data = (() => {
  const result: SelectorItem[] = []
  for (let counter = 0; counter < 24; counter++) {
    result.push({
      id: String(counter),
      title: String(counter).padStart(2, '0'),
      disabled: counter % 2 === 0,
    })
  }
  return result
})()

export const Basic = () => {
  const [value, setValue] = useState('12')
  return (
    <>
      <h1>Basic</h1>
      <div className="time-picker-basic__wrap">
        <TimePicker></TimePicker>
        <Selector
          prefix={getPrefixCls('time-picker')}
          data={Data}
          itemHeight={32}
          value={value}
          onChange={(e) => setValue(e.id)}
          fullDisplayItemNumber={7}
        />
      </div>
    </>
  )
}
