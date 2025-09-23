import React from 'react'
import Select from '../src'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性、无UI三种
 */
export const Appearance = () => {
  const [value, setValue] = React.useState<React.ReactText>('3')
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
          <h2>filled</h2>
          <Select
            style={{ width: 240 }}
            data={data}
            value={value}
            clearable
            appearance="filled"
            onChange={(value, targetItem) => {
              console.log('Select onChange: ', value, targetItem)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h2>outline</h2>
          <Select
            style={{ width: 240 }}
            data={data}
            value={value}
            clearable
            appearance="line"
            onChange={(value, targetItem) => {
              console.log('Select onChange: ', value, targetItem)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h2>unset</h2>
          <Select
            data={data}
            value={value}
            clearable
            appearance="unset"
            optionWidth={260}
            onChange={(value, targetItem) => {
              console.log('Select onChange: ', value, targetItem)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h2>borderless</h2>
          <Select
            style={{ width: 240 }}
            data={data}
            value={value}
            clearable
            appearance="borderless"
            optionWidth={260}
            onChange={(value, targetItem) => {
              console.log('Select onChange: ', value, targetItem)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h2>contained</h2>
          <Select
            data={data}
            value={value}
            clearable
            appearance="contained"
            label="服务类型"
            optionWidth={260}
            onChange={(value, targetItem) => {
              console.log('Select onChange: ', value, targetItem)
              setValue(value)
            }}
          />
        </div>
      </div>
    </>
  )
}
