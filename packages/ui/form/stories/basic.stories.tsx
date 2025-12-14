import React from 'react'
import Form from '../src'
import Input from '@hi-ui/input'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const FormItem = Form.Item

  return (
    <>
      <h1>Basic</h1>
      <div className="form-basic__wrap">
        <Form initialValues={{ testInput: 1, testInput2: 'testInput2' }} labelWidth={80}>
          <FormItem field="testInput" valueType="number" label="用户名">
            <Input />
          </FormItem>
          <FormItem field="testInput2" valueType="string" label="密码">
            <Input />
          </FormItem>
        </Form>
      </div>
    </>
  )
}
