import Input from '@hi-ui/input'
import React from 'react'
import CheckSelect from '../src'
import { PlusOutlined } from '@hi-ui/icons'

export const Footer = () => {
  const [data, setData] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  const [inputValue, setInputValue] = React.useState('')

  return (
    <>
      <h1>Footer</h1>
      <div className="check-select-footer__wrap">
        <CheckSelect
          clearable={false}
          style={{ width: 200 }}
          data={data}
          renderExtraFooter={() => {
            return (
              <Input
                placeholder="添加选项"
                value={inputValue}
                onChange={(evt) => {
                  setInputValue(evt.target.value)
                }}
                suffix={
                  <PlusOutlined
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setData((prev) => {
                        return [...prev, { id: Math.random() + inputValue, title: inputValue }]
                      })
                      setInputValue('')
                    }}
                  />
                }
              />
            )
          }}
        />
      </div>
    </>
  )
}
