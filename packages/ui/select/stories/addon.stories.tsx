import React from 'react'
import Select from '../src'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons'

/**
 * @title 前后内置元素
 * @desc 将选择框与内置的其他元素组合使用
 */
export const Addon = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: false },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: false },
    {
      title: '生活周边超长文案展示超长文案展示',
      id: '5',
    },
    { title: '办公', id: '6' },
    { title: '生活周边7', id: '7' },
    { title: '办公8', id: '8' },
  ])

  return (
    <>
      <h1>Addon</h1>
      <div className="select-addon__wrap">
        <Select
          style={{ width: 240 }}
          // clearable={false}
          data={data}
          prefix={<AppStoreOutlined style={{ color: '#333' }} />}
          suffix={<InfoCircleOutlined style={{ color: '#333' }} />}
        />
      </div>
    </>
  )
}
