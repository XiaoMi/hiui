import React from 'react'
import CheckTreeSelect from '../src'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性、无UI三种
 */
export const Appearance = () => {
  const [value, setValue] = React.useState<React.ReactText[]>(['0-0'])
  const [data] = React.useState([
    {
      title: '手机类',
      id: '0',
      disabled: true,
      children: [
        {
          title: 'Redmi系列',
          id: '0-0',
          children: [
            {
              id: '0-0-1',
              title: 'Redmi K30',
            },
            {
              id: '0-0-2',
              title: 'Redmi K30 Pro',
            },
            {
              id: '0-0-3',
              title: 'Redmi 10X 5G',
            },
            {
              id: '0-0-4',
              title: 'Redmi Note 8',
            },
            {
              id: '0-0-5',
              title: 'Redmi 9',
            },
            {
              id: '0-0-6',
              title: 'Redmi 9A',
            },
          ],
        },
        {
          title: '小米手机',
          id: '0-1',
          children: [
            {
              id: '0-1-1',
              title: '小米10 Pro',
            },
            {
              id: '0-1-2',
              title: '小米10',
            },
            {
              id: '0-1-3',
              title: '小米10 青春版 5G',
            },
            {
              id: '0-1-4',
              title: '小米MIX Alpha',
            },
          ],
        },
      ],
    },
    {
      title: '电视',
      id: '1',
      children: [
        {
          title: '小米电视 大师 65英寸OLED',
          id: '1-0',
        },
        {
          title: 'Redmi 智能电视 MAX 98',
          id: '1-1',
        },
        {
          title: '小米电视4A 60英寸',
          id: '1-2',
        },
      ],
    },
  ])

  return (
    <>
      <h1>Appearance</h1>
      <div className="tree-select-appearance__wrap">
        <div>
          <h2>filled</h2>
          <CheckTreeSelect
            style={{ width: 240 }}
            data={data}
            value={value}
            clearable
            appearance="filled"
            onChange={(value, options) => {
              console.log('CheckTreeSelect onChange: ', value, options)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h2>outline</h2>
          <CheckTreeSelect
            style={{ width: 240 }}
            data={data}
            value={value}
            clearable
            appearance="line"
            onChange={(value, options) => {
              console.log('CheckTreeSelect onChange: ', value, options)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h2>unset</h2>
          <CheckTreeSelect
            data={data}
            value={value}
            clearable
            appearance="unset"
            // 取消下拉框匹配 input 触发器的宽度
            overlay={{ matchWidth: false }}
            onChange={(value, options) => {
              console.log('CheckTreeSelect onChange: ', value, options)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h2>borderless</h2>
          <CheckTreeSelect
            style={{ width: 240 }}
            data={data}
            value={value}
            clearable
            appearance="borderless"
            onChange={(value, options) => {
              console.log('CheckTreeSelect onChange: ', value, options)
              setValue(value)
            }}
          />
        </div>

        <div>
          <h2>contained</h2>
          <CheckTreeSelect
            style={{ width: 'auto' }}
            data={data}
            value={value}
            clearable
            showOnlyShowChecked
            appearance="contained"
            label="选择品类"
            // 取消下拉框匹配 input 触发器的宽度
            overlay={{ matchWidth: false }}
            onChange={(value, options) => {
              console.log('CheckTreeSelect onChange: ', value, options)
              setValue(value)
            }}
          />
        </div>
      </div>
    </>
  )
}
