import React from 'react'
import Button from '../src'
import * as Icon from '@hi-ui/icons'

export const Line = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button appearance="line" type="primary">
          点击
        </Button>
        <Button appearance="line" type="primary" loading>
          点击
        </Button>
        <Button appearance="line" type="success">
          安全按钮
        </Button>
        <Button appearance="line" type="success" loading>
          安全按钮
        </Button>
        <Button appearance="line" type="danger" loading>
          <Icon.PlusOutlined />
          危险按钮
        </Button>
        <Button appearance="line" type="default">
          <Icon.PlusOutlined />
          普通按钮
        </Button>
      </div>
    </>
  )
}
