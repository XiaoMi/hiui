import React from 'react'
import Form, { FormHelpers } from '../src'
import Input from '@hi-ui/input'
import Checkbox from '@hi-ui/checkbox'
import message from '@hi-ui/message'

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
            remember: true,
          }}
          onValuesChange={(changedValues, allValues) => {
            console.log('changedValues:', changedValues, 'allValues:', allValues)
          }}
        >
          <FormItem
            label="账号"
            field={['login', 'phone']}
            valueType="string"
            rules={[
              {
                required: true,
                validator: (rule, value, callback) => {
                  const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
                  if (!value) {
                    callback(new Error('请输入手机号'))
                  } else if (!telReg.test(value)) {
                    callback(new Error('请输入正确的手机号'))
                  } else {
                    callback()
                  }
                },
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
          <FormItem
            field="remember"
            valuePropName="checked"
            valueType="boolean"
            valueChangeFuncPropName="onChange"
            // valueDispatchTransform={(evt) => {
            //   console.log('valueSync', evt)
            //   return evt.target.checked
            // }}
          >
            <Checkbox
            // onChange={() => {
            //   console.log('checkbox remember me')
            // }}
            >
              记住我
            </Checkbox>
          </FormItem>
          <FormItem valueType={null} field={null}>
            <>
              <FormSubmit
                type="primary"
                onClick={() => {
                  const values = formRef.current.getFieldsValue()
                  console.log('获取表单值, 但是不触发校验方法', values)

                  message.open({
                    title: JSON.stringify(values),
                  })
                }}
              >
                提交
              </FormSubmit>
              <FormReset
                onClick={() => {
                  console.log('reset form')
                }}
              >
                重置
              </FormReset>
            </>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
