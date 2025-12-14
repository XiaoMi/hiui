import React from 'react'
import Form from '../src'
import Input from '@hi-ui/input'

/**
 * @title 自定义渲染表单控件
 */
export const Render = () => {
  const FormItem = Form.Item

  return (
    <>
      <h1>Render</h1>
      <div className="form-render__wrap" style={{ width: 400 }}>
        <Form
          initialValues={{ testInput: 'testInput', testInput2: 'testInput2' }}
          labelPlacement="top"
        >
          <FormItem field="testInput" valueType="string" label="用户名">
            <Input />
          </FormItem>
          <FormItem
            field="testInput2"
            valueType="string"
            label="密码"
            render={(props) => {
              return (
                <div style={{ width: '100%' }}>
                  <Input {...props} />
                  <span style={{ fontSize: 12, color: '#60636b' }}>
                    我是示例提示，请注意大小写哦
                  </span>
                </div>
              )
            }}
          />
        </Form>
      </div>
    </>
  )
}
