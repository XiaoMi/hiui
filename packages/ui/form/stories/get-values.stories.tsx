/* eslint-disable node/no-callback-literal */
import React from 'react'
import Form, { FormHelpers } from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import message from '@hi-ui/message'

const FormItem = Form.Item

export const GetValues = () => {
  const formRef = React.useRef<FormHelpers>(null)

  return (
    <>
      <h1>获取表单值</h1>
      <div className="form-get-values__wrap" style={{ width: 400 }}>
        <Form
          initialValues={{
            phone: '',
            name: '',
          }}
          labelPlacement="left"
          labelWidth={80}
          innerRef={formRef}
        >
          <FormItem
            label="手机号"
            field="phone"
            valueType="string"
            rules={[
              {
                trigger: 'onChange',
                validator: (rule, value, callback) => {
                  const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
                  if (!value) {
                    callback('请输入手机号')
                  } else if (!telReg.test(value)) {
                    callback('请输入正确的手机号')
                  } else {
                    callback()
                  }
                },
              },
            ]}
          >
            <Input placeholder="请输入手机号" style={{ width: 200 }} />
          </FormItem>
          <FormItem required={true} label="姓名" field="name" valueType="string">
            <Input placeholder="请输入" style={{ width: 200 }} />
          </FormItem>
          <FormItem valueType={null} field={null}>
            <Button
              type="primary"
              onClick={() => {
                const values = formRef.current.getFieldsValue()
                console.log('获取表单值, 但是不触发校验方法', values)
                message.open({
                  title: JSON.stringify(values),
                })
              }}
            >
              获取表单值
            </Button>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
