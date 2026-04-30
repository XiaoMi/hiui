import React from 'react'
import Form, { FormHelpers, FormProps } from '../src'
import Input from '@hi-ui/input'
import Radio from '@hi-ui/radio'

/**
 * @title 对齐方式
 * @desc 表单项较少，对应标题字数易对齐工整
 */
export const LabelPlacement = () => {
  const FormItem = Form.Item
  const FormSubmit = Form.Submit
  const RadioGroup = Radio.Group

  const formRef = React.useRef<FormHelpers>(null)

  const [labelPlacement, setLabelPlacement] = React.useState<FormProps['labelPlacement']>('left')

  return (
    <>
      <h1>LabelPlacement</h1>
      <div className="form-label-placement__wrap">
        <RadioGroup
          style={{ marginBottom: 24 }}
          data={[
            { title: '左对齐', id: 'left' },
            { title: '右对齐', id: 'right' },
            { title: '顶对齐', id: 'top' },
          ]}
          value={labelPlacement}
          onChange={(value) => setLabelPlacement(value as FormProps['labelPlacement'])}
        />

        <Form
          innerRef={formRef}
          initialValues={{ productCode: '', productName: '' }}
          labelWidth="100"
          labelPlacement={labelPlacement}
        >
          <FormItem required={true} label="编码" field="productCode" valueType="string">
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem required={true} label="产品名称" field="productName" valueType="string">
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem label="" field="productName" valueType="string">
            <FormSubmit type="primary">提交</FormSubmit>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
