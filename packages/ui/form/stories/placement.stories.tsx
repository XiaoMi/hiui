import React from 'react'
import Form from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'

const FormItem = Form.Item

export const Placement = () => {
  return (
    <>
      <h1>Placement</h1>
      <div className="form-label-placement__wrap" style={{ width: 900 }}>
        <Form
          initialValues={{
            account: '',
            password: '',
          }}
          placement="horizontal"
          labelPlacement="right"
        >
          <FormItem label="账号" labelWidth="58" field="account" valueType="string">
            <Input placeholder={'请输入'} />
          </FormItem>
          <FormItem label="密码" labelWidth="58" field="password" valueType="string">
            <Input type="password" placeholder={'请输入'} />
          </FormItem>
          <FormItem field={null} valueType={null}>
            <>
              <Button>提交</Button>
            </>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
