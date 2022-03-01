import React from 'react'
import Form from '../src'
import Input from '@hi-ui/input'
import { CloseOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'

const FormItem = Form.Item
const FormList = Form.List

export const List = () => {
  return (
    <>
      <h1>List</h1>
      <div className="form-list__wrap">
        <Form
          initialValues={{ testInput: 'testInput', testInput2: 'testInput2' }}
          labelWidth={110}
          rules={{
            testInput: [
              {
                // name: 'max',
                // strategy: 10,
                max: 10,
                message: 'max is 10',
              },
            ],
            testInput2: [
              {
                // name: 'required',
                // strategy: true,
                required: true,
                message: 'testInput2 is required',
              },
            ],
          }}
        >
          <FormItem field="testInput" valueType="string" label="用户名">
            <Input />
          </FormItem>

          <FormItem field="testInput2" valueType="string" label="密码">
            <Input />
          </FormItem>

          <FormList name="testList">
            {(fields, { add, remove, insertBefore, swap, move }) => {
              return (
                <div>
                  {fields.map((field, index) => {
                    return (
                      <div key={index}>
                        <FormItem
                          field={['testList', index, 'username']}
                          valueType="string"
                          label={`材料名称${index}`}
                        >
                          <Input />
                        </FormItem>

                        <FormItem
                          field={['testList', index, 'password']}
                          valueType="string"
                          label={`材料颜色${index}`}
                        >
                          <Input />
                        </FormItem>

                        <div>
                          <Button icon={<CloseOutlined />} onClick={() => remove(index)}></Button>

                          <Button
                            onClick={() => insertBefore(index, { username: '', password: '' })}
                          >
                            insertBefore
                          </Button>

                          <Button onClick={() => move(index, 0)}>moveTo [0]</Button>
                        </div>
                      </div>
                    )
                  })}
                  <Button onClick={() => add({ username: '', password: '' })}>Add Field</Button>
                </div>
              )
            }}
          </FormList>
        </Form>
      </div>
    </>
  )
}
