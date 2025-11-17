import React from 'react'
import CheckSelect from '../src'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons'

/**
 * @title 前后内置元素
 * @desc 将选择框与内置的其他元素组合使用
 */
export const Addon = () => {
  const [data] = React.useState([
    { title: '手机', id: '1' },
    { title: '电脑', id: '2' },
    { title: '电视', id: '3' },
    { title: '平板', id: '4' },
    { title: '冰箱', id: '5' },
    { title: '洗衣机', id: '6' },
    { title: '空调', id: '7' },
    { title: '其它', id: '8' },
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
