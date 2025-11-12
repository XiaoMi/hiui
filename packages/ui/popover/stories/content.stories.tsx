import React from 'react'
import Popover from '../src'
import Button from '@hi-ui/button'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input'
import { CloseOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'

/**
 * @title 自定义内容
 */
export const Content = () => {
  const FormItem = Form.Item

  const [visible, setVisible] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const popoverVisibleRef = React.useRef<boolean>(false)

  const title = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 20,
      }}
    >
      <span>文字标题</span>
    </div>
  )

  const content = (
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
      <div style={{ textAlign: 'right' }}>
        <Button
          appearance="line"
          onClick={() => {
            setVisible(false)
            popoverVisibleRef.current = false
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={() => {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              setVisible(false)
              popoverVisibleRef.current = false
            }, 1000)
          }}
        >
          保存
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <h1>Content</h1>
      <div className="popover-basic__wrap">
        <Popover
          title={title}
          content={content}
          trigger="click"
          visible={visible}
          arrow={false}
          crossGap={0}
          placement={'bottom-start'}
          showTitleDivider
          disabledPortal
        >
          <Button
            onClick={() => {
              if (!popoverVisibleRef.current) {
                setVisible(true)
                popoverVisibleRef.current = true
              } else {
                setVisible(false)
                popoverVisibleRef.current = false
              }
            }}
          >
            trigger
          </Button>
        </Popover>
      </div>
    </>
  )
}
