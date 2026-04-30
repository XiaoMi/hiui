import React from 'react'
import Form, { FormHelpers } from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import { Select } from '@hi-ui/select'
import Grid from '@hi-ui/grid'

/**
 * @title 设置表单值
 * @desc 控制表单项的值
 */
export const SetValues = () => {
  const { Row, Col } = Grid
  const FormItem = Form.Item
  const FormSubmit = Form.Submit
  const FormReset = Form.Reset

  const formRef = React.useRef<FormHelpers>(null)

  const [singleList] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
  ])

  return (
    <>
      <h1>填充表单</h1>
      <div className="form-set-values__wrap" style={{ width: 400 }}>
        <Form
          labelWidth="80"
          labelPlacement="right"
          innerRef={formRef}
          initialValues={{
            phone: '',
            select: '3',
          }}
        >
          <Row gutter>
            <Col>
              <FormItem label="Input" field="phone" valueType="string">
                <Input placeholder="请输入手机号" style={{ width: 200 }} />
              </FormItem>
            </Col>
            <Col>
              <Button type="secondary">Help?</Button>
            </Col>
          </Row>
          <FormItem label="Select" field="select" required={true} valueType="string">
            <Select clearable={false} style={{ width: 200 }} data={singleList} />
          </FormItem>
          <FormItem field={undefined} valueType={undefined}>
            <>
              <FormReset>重置</FormReset>
              <FormSubmit type="primary">提交</FormSubmit>
              <Button
                type="primary"
                appearance="link"
                onClick={() => {
                  console.log('填充表单')
                  formRef.current?.setFieldsValue({
                    phone: '15688888888',
                    select: '2',
                  })
                }}
              >
                fill Form
              </Button>
            </>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
