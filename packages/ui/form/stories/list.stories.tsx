import React from 'react'
import Form, { FormItem, FormList } from '../src'
import Input from '@hi-ui/input'
import { CloseOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'

export const List = () => {
  return (
    <>
      <h1>List</h1>
      <div className="form-list__wrap">
        <Form
          initialValues={{ testInput: 'testInput', testInput2: 'testInput2' }}
          labelWidth={80}
          rules={{
            testInput: [
              {
                // name: 'max',
                // strategy: 10,
                max: 10,
                type: 'string',
                message: 'max is 10',
              },
            ],
            testInput2: [
              {
                // name: 'required',
                // strategy: true,
                required: true,
                type: 'string',
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
            {(fields, { add, remove, insertBefore }) => {
              return (
                <div>
                  {fields.map((field, index) => {
                    return (
                      <div key={index}>
                        <div>
                          <FormItem field={['testList', field.name, 'username']} valueType="string">
                            <Input />
                          </FormItem>
                          <span style={{ paddingTop: '6px' }} onClick={() => remove(field)}>
                            <CloseOutlined
                              style={{ color: '#999', fontSize: 16, cursor: 'pointer' }}
                            />
                          </span>
                          <span style={{ paddingTop: '6px' }} onClick={() => insertBefore(field)}>
                            insertBefore
                          </span>
                        </div>

                        <div>
                          <FormItem field={['testList', field.name, 'password']} valueType="string">
                            <Input />
                          </FormItem>
                          <span style={{ paddingTop: '6px' }} onClick={() => remove(field)}>
                            <CloseOutlined
                              style={{ color: '#999', fontSize: 16, cursor: 'pointer' }}
                            />
                          </span>

                          <span style={{ paddingTop: '6px' }} onClick={() => insertBefore(field)}>
                            insertBefore
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  <Button onClick={() => add()}>Add Field</Button>
                </div>
              )
            }}
          </FormList>
        </Form>
      </div>
    </>
  )
}
