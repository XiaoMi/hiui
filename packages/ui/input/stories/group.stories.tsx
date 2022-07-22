import React from 'react'
import Input from '../src'
import { SearchOutlined } from '@hi-ui/icons'
import { Select } from '@hi-ui/select'
import { message } from '@hi-ui/message'
import Button from '@hi-ui/button'

/**
 * @title 组合
 */
export const Group = () => {
  return (
    <>
      <h1>Group for Input</h1>
      <div className="input-Group__wrap">
        <Input
          placeholder="请输入"
          prepend={
            <Select
              clearable={false}
              style={{ width: 80 }}
              data={[
                { title: '+86', id: '86' },
                { title: '+1', id: '1' },
                { title: '+33', id: '33' },
                { title: '+91', id: '91' },
              ]}
              defaultValue="86"
            />
          }
        />
        <br />
        <br />
        <Input
          clearable
          clearableTrigger="always"
          placeholder="请输入"
          append={
            <Button
              appearance="filled"
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                message.open({ type: 'success', title: '查询成功', duration: 2000 })
              }}
            />
          }
        />
      </div>
    </>
  )
}
