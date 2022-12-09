import React from 'react'
import Form, { FormListHelper } from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'

/**
 * @title 动态表单组
 * @desc 动态 Form 删减表单组
 */
export const List = () => {
  const FormItem = Form.Item
  const FormList = Form.List

  const formListRef = React.useRef<FormListHelper>(null)

  return (
    <>
      <h1>List</h1>
      <div className="form-list__wrap">
        <div style={{ textAlign: 'right', marginBottom: '1em' }}>
          <Button onClick={() => formListRef.current?.add({ username: '', password: '' })}>
            动态添加成组表单
          </Button>
        </div>
        <Form
          initialValues={{ testInput: 'testInput', testInput2: 'testInput2' }}
          labelWidth={110}
          rules={{
            testInput: [
              {
                // name: 'max',
                // strategy: 10,
                max: 10,
                message: 'max is 10',
              },
            ],
            testInput2: [
              {
                // name: 'required',
                // strategy: true,
                required: true,
                message: 'testInput2 is required',
              },
            ],
          }}
        >
          <FormItem field="testInput" valueType="string" label="供应商">
            <Input />
          </FormItem>
          <FormItem field="testInput2" valueType="string" label="供应渠道">
            <Input />
          </FormItem>
          <FormList name="testList" innerRef={formListRef}>
            {(fields, { add, remove, insertBefore, swap, move }) => {
              return (
                <div>
                  {fields.map((field, index) => {
                    return (
                      <div key={index}>
                        <FormItem
                          field={['testList', index, 'username']}
                          valueType="string"
                          label={`材料名称${index + 1}`}
                          required
                          rules={[
                            {
                              required: true,
                              message: '请输入',
                            },
                          ]}
                        >
                          <Input />
                        </FormItem>
                        <FormItem
                          field={['testList', index, 'password']}
                          valueType="string"
                          label={`材料颜色${index + 1}`}
                        >
                          <Input />
                        </FormItem>
                        <FormItem field={null} valueType={null}>
                          <div>
                            <Button size="sm" type="danger" onClick={() => remove(index)}>
                              删除
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => insertBefore(index, { username: '', password: '' })}
                            >
                              在该组之前插入
                            </Button>
                            <Button size="sm" onClick={() => move(index, 0)}>
                              移到数组索引 0 位置
                            </Button>
                            <Button size="sm" onClick={() => swap(index, 0)}>
                              和第一个置换值
                            </Button>
                          </div>
                        </FormItem>
                      </div>
                    )
                  })}
                  <Button onClick={() => add({ username: '', password: '' })}>
                    动态添加成组表单
                  </Button>
                </div>
              )
            }}
          </FormList>
        </Form>
      </div>
    </>
  )
}
