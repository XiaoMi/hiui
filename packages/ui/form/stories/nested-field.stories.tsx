import React from 'react'
import Form, { FormHelpers } from '../src'
import Input from '@hi-ui/input'

/**
 * @title 字段嵌套
 */
export const NestedField = () => {
  const FormItem = Form.Item
  const FormReset = Form.Reset
  const FormSubmit = Form.Submit

  const formRef = React.useRef<FormHelpers>(null)

  return (
    <>
      <h1>字段嵌套</h1>
      <div className="form-nested-field__wrap" style={{ width: 400 }}>
        <Form
          innerRef={formRef}
          labelWidth="80"
          labelPlacement="left"
          initialValues={{
            login: {
              phone: '',
              password: '',
            },
          }}
        >
          <FormItem
            label="账号"
            field={['login', 'phone']}
            valueType="string"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </FormItem>
          <FormItem
            label="密码"
            valueType="string"
            field={['login', 'password']}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="password" placeholder="请输入" />
          </FormItem>
          <FormItem valueType={undefined} field={undefined}>
            <>
              <FormReset>重置</FormReset>
              <FormSubmit type="primary">提交</FormSubmit>
            </>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
