import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input'
import { CloseOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'

/**
 * @title API 方式调用
 */
export const WithApi = () => {
  const FormItem = Form.Item
  const key1 = 'key1'

  const Title = ({ title }) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 20,
        }}
      >
        <span>{title}</span>
        <IconButton effect icon={<CloseOutlined />} onClick={() => Popover.close(key1)} />
      </div>
    )
  }

  const Content = () => {
    const [loading, setLoading] = React.useState<boolean>(false)

    return (
      <div style={{ width: 344 }}>
        <div style={{}}>
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
        <div style={{ display: 'flex' }}>
          <Button style={{ flex: 1 }} onClick={() => Popover.close(key1)}>
            取消
          </Button>
          <Button
            style={{ flex: 1 }}
            type="primary"
            loading={loading}
            onClick={() => {
              setLoading(true)
              setTimeout(() => {
                setLoading(false)
                Popover.close(key1)
              }, 1000)
            }}
          >
            保存
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <h1>WithApi</h1>
      <div className="popover-basic__wrap">
        <h4>此处展示多个操作使用同一个容器，即 API 调用时，将 key 设置为同一个</h4>
        <Button
          onClick={(e) => {
            Popover.open(e.target as HTMLElement, {
              key: key1,
              title: <Title title="文字标题" />,
              content: <Content />,
              arrow: false,
              crossGap: 0,
              placement: 'bottom-start',
              showTitleDivider: true,
              disabledPortal: true,
              zIndex: 99,
            })
          }}
        >
          trigger 1
        </Button>
        <Button
          onClick={(e) => {
            Popover.open(e.target as HTMLElement, {
              key: key1,
              title: <Title title="文字标题 2" />,
              content: <Content />,
              arrow: false,
              crossGap: 0,
              placement: 'bottom-start',
              showTitleDivider: true,
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
