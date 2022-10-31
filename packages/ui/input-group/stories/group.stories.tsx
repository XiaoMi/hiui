import React from 'react'
import Input from '@hi-ui/input'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import Cascader from '@hi-ui/cascader'
import DatePicker from '@hi-ui/date-picker'
import Button from '@hi-ui/button'

import InputGroup from '../src'

/**
 * @title 不同组合形式
 * @desc 根据不同场景组合不同类型的表单控件
 */
export const Group = () => {
  return (
    <>
      <h1>Group</h1>
      <div
        className="input-group-group__wrap"
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* Input + button */}
        <InputGroup>
          <Input placeholder="请输入" />
          <Button type="primary">检索</Button>
        </InputGroup>

        <InputGroup>
          <Select
            style={{ width: '36%' }}
            data={[
              { id: 1, title: 'Option 1' },
              { id: 2, title: 'Option 2' },
            ]}
          />
          <Input placeholder="请输入" />
        </InputGroup>

        <InputGroup>
          <Input placeholder="请输入" />
          <Input placeholder="请输入" />
        </InputGroup>

        <InputGroup>
          <Select
            style={{ width: '36%' }}
            data={[
              { id: 1, title: 'Option 1' },
              { id: 2, title: 'Option 2' },
            ]}
          />
          <Input placeholder="请输入" />
          <Button type="primary">确定</Button>
        </InputGroup>

        <InputGroup>
          <CheckSelect
            style={{ width: '36%' }}
            data={[
              { id: 1, title: 'Option 1' },
              { id: 2, title: 'Option 2' },
            ]}
          />
          <CheckSelect
            style={{ width: '36%' }}
            data={[
              { id: 1, title: 'Option 1' },
              { id: 2, title: 'Option 2' },
            ]}
          />
          <Input placeholder="请输入" />
        </InputGroup>

        <InputGroup>
          <Cascader
            style={{ width: '36%' }}
            data={[
              { id: 1, title: 'Option 1' },
              { id: 2, title: 'Option 2' },
            ]}
          />
          <DatePicker placeholder="请输入" />
        </InputGroup>

        <InputGroup>
          <Select
            style={{ width: '36%' }}
            data={[
              { id: 1, title: 'Option 1' },
              { id: 2, title: 'Option 2' },
            ]}
          />
          <Cascader
            style={{ width: '36%' }}
            data={[
              {
                id: '1',
                title: 'Option 1',
                children: [
                  { id: '1-1', title: 'Option 1-1' },
                  { id: '1-2', title: 'Option 1-2' },
                ],
              },
              {
                id: 2,
                title: 'Option 2',
                children: [
                  { id: '2-1', title: 'Option 1-1' },
                  { id: '2-2', title: 'Option 1-2' },
                ],
              },
            ]}
          />
          <Input placeholder="请输入" />
        </InputGroup>

        <InputGroup>
          <Select
            style={{ width: '36%' }}
            data={[
              { id: 1, title: 'Option 1' },
              { id: 2, title: 'Option 2' },
            ]}
          />
          <DatePicker type="daterange" />
        </InputGroup>

        <InputGroup>
          <DatePicker type="daterange" placeholder={['开始时间', '结束时间']} />
          <Input style={{ width: '36%' }} placeholder="请输入" />
        </InputGroup>
      </div>
    </>
  )
}
