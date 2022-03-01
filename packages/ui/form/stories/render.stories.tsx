import React from 'react'
import Form from '../src'
import Input from '@hi-ui/input'

const FormItem = Form.Item

export const Render = () => {
  return (
    <>
      <h1>Render</h1>
      <div className="form-render__wrap" style={{ width: 400 }}>
        <Form
          initialValues={{ testInput: 'testInput', testInput2: 'testInput2' }}
          // validateTrigger={['onBlur']}
          labelWidth={80}
          rules={{
            testInput: [
              {
                max: 10,
                message: 'max is 10',
              },
            ],
            testInput2: [
              {
                required: true,
                message: 'testInput2 is required',
              },
            ],
          }}
        >
          <FormItem field="testInput" valueType="string" label="用户名">
            <Input />
          </FormItem>
          <FormItem
            field="testInput2"
            valueType="string"
            label="密码"
            contentPosition="bottom"
            render={(props) => {
              return (
                <div>
                  <span>我是示例提示，请注意大小写哦</span>
                  <Input {...props} />
                </div>
              )
            }}
          />
        </Form>
      </div>
    </>
  )
}
