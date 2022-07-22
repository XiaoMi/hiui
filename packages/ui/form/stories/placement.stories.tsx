import React from 'react'
import Form from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'

/**
 * @title 横向表单
 * @desc 适用于筛选或查询数据的场景，和表格配合使用
 */
export const Placement = () => {
  const FormItem = Form.Item

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
          <FormItem>
            <Button>提交</Button>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
