import React, { useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import TimePicker from '../src'
import { Selector, SelectorItem } from '../src/Selector'
import { Panel } from '../src/Panel'
import { Input } from '../src/Input'
import { PopContent } from '../src/PopContent'
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
  const [inputValue, setInputValue] = useState(['', ''])
  const [panelValue, setPanelValue] = useState('')
  const [popContentValue, setPopContentValue] = useState(['', ''])

  return (
    <>
      <h1>Basic</h1>
      <div className="time-picker-basic__wrap">
        <TimePicker
          placeholder={['请输入', '请输入']}
          type="range"
          onChange={(e) => console.error('range time picker', e)}
        />
        <TimePicker
          placeholder={['请输入', '请输入']}
          type="single"
          onChange={(e) => console.error('single time picker', e)}
        />
        <Selector
          prefix={getPrefixCls('time-picker')}
          data={Data}
          itemHeight={32}
          value={value}
          onChange={(e) => setValue(e.id)}
          fullDisplayItemNumber={7}
        />
        <Panel
          itemHeight={32}
          fullDisplayItemNumber={7}
          hourStep={3}
          secondStep={1}
          minuteStep={1}
          disabledHours={() => []}
          disabledMinutes={() => []}
          disabledSeconds={() => []}
          prefix={getPrefixCls('time-picker')}
          format="HH:mm:ss"
          value={panelValue}
          panel="single"
          onChange={(e) => {
            console.log('panel', e)
            setPanelValue(e)
          }}
        />
        <PopContent
          itemHeight={32}
          fullDisplayItemNumber={7}
          hourStep={3}
          secondStep={1}
          minuteStep={1}
          disabledHours={() => []}
          disabledMinutes={() => []}
          disabledSeconds={() => []}
          prefix={getPrefixCls('time-picker')}
          format="HH:mm"
          value={popContentValue}
          type="range"
          onChange={(e) => {
            console.log('pop-content', e)
            setPopContentValue(e)
          }}
        />
        <Input
          type="range"
          placeholders={[]}
          prefix={getPrefixCls('time-picker')}
          format="HH"
          hourStep={1}
          secondStep={1}
          minuteStep={1}
          border
          disabledHours={() => []}
          disabledMinutes={() => []}
          disabledSeconds={() => []}
          value={inputValue}
          onChange={(e) => {
            console.log('input', e)
            setInputValue(e)
          }}
        />
      </div>
    </>
  )
}
