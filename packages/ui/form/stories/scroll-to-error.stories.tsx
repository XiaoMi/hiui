import React from 'react'
import Form, { FormHelpers, FormRules } from '../src'
import Input from '@hi-ui/input'
import { Select } from '@hi-ui/select'
import { Cascader } from '@hi-ui/cascader'
import Radio from '@hi-ui/radio'
import Button from '@hi-ui/button'

/**
 * @title 滑动到错误字段
 * @desc 校验失败时，表单会自动滚动至第一个未通过的表单项
 */
export const ScrollToError = () => {
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
        {
          id: '红米',
          title: '红米',
          children: [
            {
              id: '红米3',
              title: '红米3',
            },
            {
              id: '红米4',
              title: '红米4',
            },
          ],
        },
      ],
    },
    {
      id: '电视',
      title: '电视',
      children: [
        {
          id: '小米电视4A',
          title: '小米电视4A',
        },
        {
          id: '小米电视4C',
          title: '小米电视4C',
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
        required: true,
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
  })

  return (
    <>
      <h1>ScrollToError</h1>
      <div
        className="form-scroll-to-error__wrap"
        style={{
          width: '100%',
          height: 240,
          padding: '20px 0',
          background: '#f5f7fa',
          boxShadow: '1px 2px 8px #ddd',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            width: 400,
          }}
        >
          <Form
            innerRef={formRef}
            rules={rules}
            scrollToFirstError
            labelWidth="80"
            labelPlacement="right"
            initialValues={{
              user: { name: '' },
              name: '',
              region: '',
              count: '',
              store: '',
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
            <FormItem label="数量" field="count" valueType="string">
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem label="门店" field="store" valueType="string">
              <Select
                data={[
                  { title: '电视', id: '3' },
                  { title: '手机', id: '2' },
                  { title: '笔记本', id: '4' },
                  { title: '生活周边', id: '5' },
                  { title: '办公', id: '6' },
                ]}
                searchable
                placeholder="请选择"
                emptyContent="无匹配数据"
                onChange={(item) => {
                  console.log('多选结果', item)
                }}
              />
            </FormItem>
            <FormItem label="品类" field="category" valueType="string">
              <Cascader
                onChange={(id) => {
                  console.log('change', id)
                }}
                data={cascaderOptions}
                style={{ width: '100%' }}
              />
            </FormItem>
            <FormItem label="地区" field="region" valueType="string">
              <RadioGroup
                data={[
                  { id: 'beijing', title: '北京' },
                  { id: 'shanghai', title: '上海' },
                  { id: 'chongqing', title: '重庆' },
                ]}
              />
            </FormItem>

            <FormItem>
              <>
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
                  type="default"
                  onClick={() => {
                    formRef.current?.reset()
                  }}
                >
                  重置
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
      </div>
    </>
  )
}
