import React from 'react'
import { FilterOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import Space from '@hi-ui/space'
import CheckSelect from '../src'

/**
 * @title 自定义选中内容渲染
 */
export const CustomRender = () => {
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
      <h1>CustomRender</h1>
      <div className="check-select-custom-render__wrap">
        <h2>只展示图标</h2>
        <CheckSelect
          style={{ width: 'auto' }}
          optionWidth={200}
          placeholder="请选择"
          searchable
          clearable
          data={data}
          onChange={console.log}
          customRender={<FilterOutlined />}
        />
        <h2>展示选中内容</h2>
        <CheckSelect
          style={{ width: 'auto' }}
          optionWidth={200}
          placeholder="请选择"
          searchable
          clearable
          data={data}
          onChange={console.log}
          customRender={(value) => {
            return (
              <Space>
                <Button>点击选择</Button>
                <Space onClick={(e) => e.stopPropagation()}>
                  {value.map((item, index) => (
                    <span key={index}>{item.title}</span>
                  ))}
                </Space>
              </Space>
            )
          }}
        />
      </div>
    </>
  )
}
