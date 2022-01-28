/* eslint-disable node/no-callback-literal */
import React from 'react'
import Form, { FormHelpers } from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import { Select } from '@hi-ui/select'
import Grid from '@hi-ui/grid'

const { Row, Col } = Grid
const FormItem = Form.Item
const FormSubmit = Form.Submit
const FormReset = Form.Reset

export const SetValues = () => {
  const formRef = React.useRef<FormHelpers>(null)

  const [singleList] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
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
          <Row>
            <Col>
              <FormItem
                label="Input"
                field="phone"
                valueType="string"
                rules={[
                  {
                    trigger: 'onChange',
                    type: 'number',
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
            </Col>
            <Col>
              <a href="#Props" style={{ margin: '0 8px', lineHeight: '32px' }}>
                Help?
              </a>
            </Col>
          </Row>
          <FormItem label="Select" field="select" required={true} valueType="string">
            <Select
              clearable={false}
              style={{ width: 200 }}
              data={singleList}
              onChange={(ids) => {
                console.log('select ids', ids)
              }}
            />
          </FormItem>
          <FormItem field={null} valueType={null}>
            <>
              <FormSubmit
                type="primary"
                onClick={(values, errors) => {
                  console.log('Get form value:', values, errors)
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
              <Button
                type="primary"
                appearance="link"
                onClick={() => {
                  console.log('填充表单')
                  formRef.current.setFieldsValue({
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
