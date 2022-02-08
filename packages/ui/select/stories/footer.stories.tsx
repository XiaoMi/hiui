import Input from '@hi-ui/input'
import React from 'react'
import Select from '../src'
import Button from '@hi-ui/button'
import { PlusOutlined } from '@hi-ui/icons'

export const Footer = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>Footer</h1>
      <div className="select-footer__wrap">
        <Select
          clearable={false}
          style={{ width: 200 }}
          data={data}
          renderExtraFooter={() => {
            return (
              <Input
                placeholder="添加选项"
                suffix={<PlusOutlined style={{ cursor: 'pointer' }} />}
              />
            )
          }}
        />
      </div>
    </>
  )
}
