import React from 'react'
import Form, { FormHelpers } from '../src'
import Button from '@hi-ui/button'
import message from '@hi-ui/message'
import Select from '@hi-ui/select'
import { Counter } from '@hi-ui/counter'
import Checkbox from '@hi-ui/checkbox'
import { DatePicker } from '@hi-ui/date-picker'
import { Cascader } from '@hi-ui/cascader'
import Radio from '@hi-ui/radio'
import { Switch } from '@hi-ui/switch'
import { Rating } from '@hi-ui/rating'
import { Upload } from '@hi-ui/upload'

/**
 * @title 表单联动
 * @desc 根据数据控制某个表单的显示隐藏或校验规则
 */
export const Cascade = () => {
  const FormItem = Form.Item
  const FormReset = Form.Reset
  const FormSubmit = Form.Submit

  const CheckboxGroup = Checkbox.Group
  const RadioGroup = Radio.Group

  const formRef = React.useRef<FormHelpers>(null)
  const [formData, setFormData] = React.useState<any>({
    controlCounter: 'show',
    select: '3',
    counter: 3,
    radio: 0,
    rating: 3,
    checkbox: [],
    switch: false,
  })

  return (
    <>
      <h1>表单联动</h1>
      <div className="form-cascade__wrap">
        <Form
          labelWidth="140"
          labelPlacement="right"
          innerRef={formRef}
          initialValues={formData}
          onValuesChange={(changedValues, allValues) => {
            console.log('changedValues,allValues', changedValues, allValues)
            setFormData(allValues)
          }}
          onReset={(values) => {
            console.log('onReset values', values)
          }}
          rules={{
            counter: [
              {
                required: true,
              },
            ],
          }}
        >
          <FormItem label="表单名称" field={null} valueType={null}>
            <>动态表单</>
          </FormItem>
          <FormItem label="控制Counter" field="controlCounter" valueType="string">
            <Select
              clearable={false}
              style={{ width: 300 }}
              data={[
                {
                  id: 'hide',
                  title: '隐藏Counter',
                },
                {
                  id: 'show',
                  title: '显示Counter',
                },
              ]}
              placeholder="控制Counter的显示隐藏"
            />
          </FormItem>

          {formData.controlCounter === 'show' ? (
            <FormItem label="Counter" field="counter" required valueType="number">
              <Counter step={1} min={-10} max={10} />
            </FormItem>
          ) : null}

          <FormItem
            label="Checkbox"
            field="checkbox"
            validateTrigger="onChange"
            rules={[
              {
                required: true,
              },
            ]}
            valueType="array"
          >
            <CheckboxGroup
              data={[
                { id: 'DatePicker', title: 'DatePicker' },
                { id: 'Cascader', title: 'Cascader' },
                { id: 'Radio', title: 'Radio' },
              ]}
            ></CheckboxGroup>
          </FormItem>

          {formData.checkbox.includes('DatePicker') && (
            <FormItem label="DatePicker" field="datePicker" required={true} valueType="array">
              <DatePicker type="daterange" />
            </FormItem>
          )}
          {formData.checkbox.includes('Cascader') && (
            <FormItem label="Cascader" field="Cascader" valueType="string">
              <Cascader
                data={[
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
                ]}
                style={{ width: 300 }}
              />
            </FormItem>
          )}
          {formData.checkbox.includes('Radio') && (
            <FormItem label="Radio" field="radio" valueType="string">
              <RadioGroup
                data={[
                  { id: 0, title: '手机类' },
                  { id: 1, title: '电脑类' },
                ]}
              ></RadioGroup>
            </FormItem>
          )}

          <FormItem label="Switch" field="switch" valueType="boolean">
            <Switch content={['ON', 'OFF']} />
          </FormItem>

          <FormItem label="Rating" field="rating" valueType="number">
            <Rating />
          </FormItem>
          <FormItem label="Upload" field="upload" valueType="string" contentPosition="top">
            <Upload
              type="photo"
              uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
              onRemove={(file, fileList, index) => {
                return new Promise((resolve) => resolve(true))
              }}
              name={'files[]'}
              defaultFileList={[
                {
                  name: 'b.png',
                  fileType: 'img',
                  uploadState: 'success',
                  url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
                },
              ]}
            />
          </FormItem>

          <FormItem field={null} valueType={null}>
            <>
              <FormReset
                onClick={() => {
                  console.log('reset form')
                }}
              >
                重置
              </FormReset>
              <FormSubmit
                type="primary"
                onClick={() => {
                  const values = formRef.current?.getFieldsValue() ?? {}
                  console.log('Get form value:', values)
                  console.log('Get form errors:', formRef.current?.getFieldsError())

                  message.open({
                    title: (
                      <div style={{ width: 400, wordBreak: 'break-all' }}>
                        {JSON.stringify(values)}
                      </div>
                    ),
                  })
                }}
              >
                提交
              </FormSubmit>

              <Button
                type="primary"
                appearance="link"
                onClick={() => {
                  console.log('填充表单')

                  formRef.current?.setFieldsValue({
                    select: '2',
                    phone: '15666666666',
                    radio: 0,
                    rating: 4,
                    counter: 0,
                    switch: false,
                    datePicker: { start: new Date(), end: new Date() },
                    checkbox: ['Phone', 'Computer'],
                    cascader: ['手机', '小米', '小米3'],
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
