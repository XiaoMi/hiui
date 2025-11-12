import React from 'react'
import { FilterOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import Space from '@hi-ui/space'
import CheckSelect from '../src'

/**
 * @title 自定义触发器
 */
export const CustomRender = () => {
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
          overlay={{
            placement: 'right-start',
          }}
        />
        <h2>展示选中内容</h2>
        <CheckSelect
          style={{ width: 'auto' }}
          optionWidth={200}
          placeholder="请选择"
          searchable
          clearable
          data={data}
          defaultValue={['2']}
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
