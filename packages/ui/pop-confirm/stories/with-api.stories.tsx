import React from 'react'
import PopConfirm from '../src'
import Button from '@hi-ui/button'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input'

/**
 * @title API 方式调用
 */
export const WithApi = () => {
  const FormItem = Form.Item
  const key = 'my_key'

  const Content = () => {
    return (
      <div style={{ width: 300, marginTop: 16 }}>
        <Form
          initialValues={{ testInput: 1, testInput2: 'testInput2' }}
          labelWidth={80}
          labelPlacement="top"
          rules={{
            testInput: [
              {
                required: true,
                message: 'testInput1 is required',
              },
            ],
            testInput2: [
              {
                required: true,
                type: 'string',
                message: 'testInput2 is required',
              },
            ],
          }}
        >
          <FormItem field="testInput" valueType="number" label="用户名" required>
            <Input onChange={console.log} />
          </FormItem>
          <FormItem field="testInput2" valueType="string" label="密码" required>
            <Input />
          </FormItem>
        </Form>
      </div>
    )
  }
  return (
    <>
      <h1>WithApi</h1>
      <div className="pop-confirm-basic__wrap">
        <h4>此处展示多个操作使用同一个容器，即 API 调用时，将 key 设置为同一个</h4>
        <Button
          onClick={(e) => {
            PopConfirm.open(e.target as HTMLElement, {
              key: key,
              title: <div style={{ whiteSpace: 'normal' }}>标题1</div>,
              icon: null,
              content: <Content />,
              arrow: false,
              crossGap: 0,
              placement: 'bottom-start',
              disabledPortal: true,
              zIndex: 99,
            })
          }}
        >
          trigger 1
        </Button>
        <Button
          onClick={(e) => {
            PopConfirm.open(e.target as HTMLElement, {
              key: key,
              title: <div style={{ whiteSpace: 'normal' }}>标题2</div>,
              icon: null,
              content: <Content />,
              arrow: false,
              crossGap: 0,
              placement: 'bottom-start',
              disabledPortal: true,
              zIndex: 99,
            })
          }}
        >
          trigger 2
        </Button>
      </div>
    </>
  )
}
