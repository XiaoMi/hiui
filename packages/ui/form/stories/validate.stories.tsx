import React from 'react'
import Form, { FormHelpers, FormRules } from '../src'
import {
  Input,
  NumberInput,
  Select,
  Cascader,
  Radio,
  Button,
  DatePicker,
  TimePicker,
} from '@hi-ui/hiui'

/**
 * @title 表单校验
 * @desc 可在Form中配置全部Item的rules,也可在Form.Item中使用rules校验单个表单项
 */
export const Validate = () => {
  const FormItem = Form.Item
  const RadioGroup = Radio.Group

  const formRef = React.useRef<FormHelpers>(null)

  const [cascaderOptions] = React.useState([
    {
      id: '手机',
      title: '手机',
      children: [
        {
          id: '小米',
          title: '小米',
          children: [
            {
              id: '小米3',
              title: '小米3',
            },
            {
              id: '小米4',
              title: '小米4',
            },
          ],
        },
      ],
    },
  ])

  const [rules] = React.useState<FormRules>({
    region: [
      {
        required: true,
        message: '请选择区域',
      },
    ],
    store: [
      {
        required: true,
        message: '请选择门店',
      },
    ],
    count: [
      {
        validator: (rule, value, cb) => {
          const count = +value
          if (isNaN(count)) {
            cb(new Error('请输入数字'))
          } else if (count <= 0) {
            cb(new Error('必须是正数'))
          } else {
            cb()
          }
        },
      },
    ],
    count2: [
      {
        required: true,
        message: '请输入数量',
      },
    ],
  })

  return (
    <>
      <h1>Validate</h1>
      <div className="form-validate__wrap" style={{ width: 400 }}>
        <Form
          innerRef={formRef}
          rules={rules}
          labelWidth="80"
          labelPlacement="right"
          initialValues={{
            user: { name: '' },
            name: '',
            region: '',
            count: '',
            count2: null,
            store: '',
            date: new Date(),
            time: '12:00:00',
          }}
        >
          <FormItem
            label="名称"
            field={['user', 'name']}
            valueType="string"
            validateTrigger={['onBlur', 'onChange']}
            rules={[
              {
                required: true,
                message: '请输入名称',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem label="数量" field="count" valueType="number">
            <Input placeholder="请输入" />
          </FormItem>
          {/* 注意：使用 NumberInput 组件时，需要设置 validateTrigger 为 ['onChange'] */}
          <FormItem validateTrigger={['onChange']} label="数量" field="count2" valueType="number">
            <NumberInput placeholder="请输入" />
          </FormItem>
          <FormItem label="门店" field="store" valueType="string">
            <Select
              data={[
                { title: '电视', id: '3' },
                { title: '手机', id: '2' },
              ]}
            />
          </FormItem>
          <FormItem label="品类" field="category" valueType="string">
            <Cascader data={cascaderOptions} />
          </FormItem>
          <FormItem label="地区" field="region" valueType="string">
            <RadioGroup
              data={[
                { id: 'beijing', title: '北京' },
                { id: 'shanghai', title: '上海' },
              ]}
            />
          </FormItem>
          <FormItem
            label="日期"
            field="date"
            valueType="date"
            rules={[
              {
                required: true,
                message: '请选择日期',
              },
            ]}
          >
            <DatePicker />
          </FormItem>

          <FormItem
            label="时间"
            field="time"
            valueType="string"
            rules={[
              {
                required: true,
                message: '请选择时间',
              },
            ]}
          >
            <TimePicker />
          </FormItem>

          <FormItem>
            <>
              <Button
                type="default"
                appearance="line"
                onClick={() => {
                  formRef.current?.reset()
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  console.log(formRef.current?.getFieldsValue())

                  formRef.current
                    ?.validate()
                    .then((values) => {
                      console.log('values', values)
                    })
                    .catch((errors) => {
                      console.log('error', errors)
                    })
                }}
              >
                提交
              </Button>
              <Button
                type="danger"
                onClick={() => {
                  formRef.current?.clearValidates()
                }}
              >
                清除校验信息
              </Button>
            </>
          </FormItem>
        </Form>
      </div>
    </>
  )
}
