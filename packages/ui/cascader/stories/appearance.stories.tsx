import React from 'react'
import Cascader from '../src'

/**
 * @title 展现形式
 * @desc 设置展现形式
 */
export const Appearance = () => {
  const [data] = React.useState([
    {
      id: '手机',
      title: '手机t',
      children: [
        {
          id: '小米',
          title: '小米t',
          children: [
            {
              id: '小米3',
              title: '小米3t',
            },
            {
              id: '小米4',
              title: '小米4t',
            },
          ],
        },
        {
          id: '红米',
          title: '红米t',
          children: [
            {
              id: '红米3',
              title: '红米3t',
            },
            {
              id: '红米4',
              title: '红米4t',
            },
          ],
        },
      ],
    },
    {
      id: '电视',
      title: '电视t',
      children: [
        {
          id: '小米电视4A',
          title: '小米电视4At',
        },
        {
          id: '小米电视4C',
          title: '小米电视4Ct',
        },
      ],
    },
  ])

  return (
    <>
      <h1>Appearance</h1>
      <div className="cascader-appearance__wrap">
        <h2>Filled</h2>
        <Cascader
          style={{ width: 240 }}
          clearable
          appearance="filled"
          placeholder="请选择品类"
          defaultValue={['手机', '红米', '红米4']}
          data={data}
          onChange={(...args) => {
            console.log('onChange', ...args)
          }}
        ></Cascader>
        <h2>Line</h2>
        <Cascader
          style={{ width: 240 }}
          clearable
          appearance="line"
          placeholder="请选择品类"
          defaultValue={['手机', '红米', '红米4']}
          data={data}
          onChange={(...args) => {
            console.log('onChange', ...args)
          }}
        ></Cascader>
        <h2>Unset</h2>
        <Cascader
          style={{ width: 240 }}
          clearable
          appearance="unset"
          placeholder="请选择品类"
          defaultValue={['手机', '红米', '红米4']}
          data={data}
          onChange={(...args) => {
            console.log('onChange', ...args)
          }}
        ></Cascader>
        <h2>Borderless</h2>
        <Cascader
          style={{ width: 240 }}
          clearable
          appearance="borderless"
          placeholder="请选择品类"
          defaultValue={['手机', '红米', '红米4']}
          data={data}
          onChange={(...args) => {
            console.log('onChange', ...args)
          }}
        ></Cascader>
        <h2>Contained</h2>
        <Cascader
          style={{ width: 'auto' }}
          clearable
          appearance="contained"
          label="选择品类"
          defaultValue={['手机', '红米', '红米4']}
          data={data}
          onChange={(...args) => {
            console.log('onChange', ...args)
          }}
        ></Cascader>
      </div>
    </>
  )
}
