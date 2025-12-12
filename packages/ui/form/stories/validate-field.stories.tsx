import React from 'react'
import Form, { FormHelpers } from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import Grid from '@hi-ui/grid'

/**
 * @title 校验指定表单项
 * @desc 针对单个表单控件值进行校验
 */
export const ValidateField = () => {
  const { Row, Col } = Grid
  const FormItem = Form.Item
  const FormReset = Form.Reset
  const FormSubmit = Form.Submit

  const formRef = React.useRef<FormHelpers>(null)

  const [formData, setFormData] = React.useState<any>({
    phone: '',
    passwordConfirm: '',
    password: '',
    code: '',
  })

  const [countDown, setCountDown] = React.useState(60)
  const [codeDisabled, setCodeDisabled] = React.useState(false)

  const getCode = () => {
    const countDownTimer = setInterval(() => {
      if (countDown - 1 <= 0) {
        clearInterval(countDownTimer)
        setCountDown(60)
        setCodeDisabled(false)
        return
      }

      setCountDown((prev) => prev - 1)
    }, 1000)
  }

  return (
    <>
      <h1>ValidateField</h1>
      <div className="form-validate-field__wrap" style={{ width: 400 }}>
        <Form
          labelWidth="100"
          labelPlacement="right"
          innerRef={formRef}
          initialValues={formData}
          onValuesChange={(changedValues, allValues) => {
            setFormData(allValues)
          }}
        >
          <FormItem
            label="手机号"
            field="phone"
            valueType="number"
            validateTrigger="onChange"
            rules={[
              {
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
            <Input placeholder="请输入手机号" style={{ width: 240 }} />
          </FormItem>
          <Row gutter={20}>
            <Col span={14}>
              <FormItem
                label="验证码"
                field="code"
                valueType="string"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码',
                  },
                ]}
              >
                <Input placeholder="请输入验证码" style={{ width: 130 }} />
              </FormItem>
            </Col>
            <Col span={10}>
              <Button
                type="primary"
                disabled={codeDisabled && countDown <= 60 && countDown >= 0}
                onClick={() => {
                  formRef.current?.validateField('phone').then((values) => {
                    console.log('values', values)
                    setCodeDisabled(true)
                    getCode()
                  })
                }}
              >
                {countDown < 60 && countDown >= 0 ? `获取中(${countDown})` : '获取验证码'}
              </Button>
            </Col>
          </Row>

          <FormItem valueType={undefined} field={undefined}>
            <>
              <FormReset type="default" appearance="line">
                重置
              </FormReset>
              <FormSubmit type="primary">提交</FormSubmit>
            </>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
