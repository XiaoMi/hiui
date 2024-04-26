import React from 'react'
import Form from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import Card from '@hi-ui/card'

/**
 * @title 是否显示校验提示
 * @desc 适用于无需展示校验提示的场景
 */
export const ValidateMessage = () => {
  const FormItem = Form.Item

  return (
    <>
      <h1>ValidateMessage</h1>
      <div className="form-validate-message__wrap" style={{ width: 900 }}>
        <Card>
          <Form placement="horizontal" labelPlacement="right" showValidateMessage={false}>
            <FormItem label="商品ID" labelWidth="100" valueType="string">
              <Input placeholder={'请输入'} />
            </FormItem>
            <FormItem label="商品分类" labelWidth="100" valueType="string">
              <Input placeholder={'请输入'} />
            </FormItem>
            <FormItem showValidateMessage={false}>
              <Button>查询</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </>
  )
}
