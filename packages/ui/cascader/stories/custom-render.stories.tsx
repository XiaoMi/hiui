import React from 'react'
import Cascader from '../src'
import Input from '@hi-ui/input'

/**
 * @title 自定义触发器
 */
export const CustomRender = () => {
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
      <h1>CustomRender</h1>
      <div className="cascader-custom-render__wrap">
        <Cascader
          style={{ width: 240 }}
          clearable
          placeholder="请选择品类"
          data={data}
          customRender={(data) => {
            return <Input value={!data ? '' : data.title + ''} placeholder="请选择" />
          }}
        ></Cascader>
      </div>
    </>
  )
}
