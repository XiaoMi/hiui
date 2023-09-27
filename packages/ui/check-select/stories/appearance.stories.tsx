import React from 'react'
import CheckSelect from '../src'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性、无UI三种
 */
export const Appearance = () => {
  const [value, setValue] = React.useState<React.ReactText[]>(['2'])
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: false },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: false },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>Appearance</h1>
      <div className="tree-select-appearance__wrap">
        <div>
          <h4>filled</h4>
          <CheckSelect
            style={{ width: 240 }}
            data={data}
            value={value}
            clearable
            appearance="filled"
            onChange={(value, targetItem) => {
              console.log('CheckSelect onChange: ', value, targetItem)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h4>outline</h4>
          <CheckSelect
            style={{ width: 240 }}
            data={data}
            value={value}
            clearable
            appearance="line"
            onChange={(value, targetItem) => {
              console.log('CheckSelect onChange: ', value, targetItem)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h4>unset</h4>
          <CheckSelect
            data={data}
            value={value}
            clearable
            appearance="unset"
            optionWidth={260}
            onChange={(value, targetItem) => {
              console.log('CheckSelect onChange: ', value, targetItem)
              setValue(value)
            }}
          />
        </div>
      </div>
    </>
  )
}
