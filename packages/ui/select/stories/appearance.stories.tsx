import React from 'react'
import Select from '../src'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性、无UI三种
 */
export const Appearance = () => {
  const [value, setValue] = React.useState<React.ReactText>('shouji')
  const [data] = React.useState([
    { title: '手机', id: 'shouji' },
    { title: '电脑', id: 'diannao' },
    { title: '电视', id: 'dianshi' },
    { title: '洗衣机', id: 'xiyiji' },
    { title: '冰箱', id: 'bingxiang' },
    { title: '空调', id: 'kongtiao' },
    { title: '汽车', id: 'qiche' },
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
