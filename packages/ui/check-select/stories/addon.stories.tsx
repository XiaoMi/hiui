import React from 'react'
import CheckSelect from '../src'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons'

/**
 * @title 前后内置元素
 * @desc 将选择框与内置的其他元素组合使用
 */
export const Addon = () => {
  const [data] = React.useState([
    { title: '手机', id: '2' },
    { title: '小米2', id: '2-1' },
    { title: '小米3', id: '2-2' },
    { title: '小米4', id: '2-3' },
    { title: '小米5', id: '2-4' },
    { title: '电脑', id: '3' },
    { title: '笔记本', id: '4' },
    {
      title: '生活周边超长文案展示超长文案展示超长文案展示超长文案展示超长文案展示',
      id: '5',
    },
    { title: '其它', id: '6' },
  ])

  return (
    <>
      <h1>Addon</h1>
      <div className="check-select-addon__wrap">
        <CheckSelect
          style={{ width: 240 }}
          placeholder="请选择"
          searchable
          // clearable={false}
          data={data}
          tagInputProps={{ wrap: true }}
          prefix={<AppStoreOutlined />}
          suffix={<InfoCircleOutlined style={{ marginRight: 8 }} />}
        />
      </div>
    </>
  )
}
