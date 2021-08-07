import React from 'react'
import Button from '../src'
import * as Icon from '@hi-ui/icons'

export const Link = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button type="primary" appearance="link">
          <Icon.PlusOutlined />
          点击
        </Button>
        <Button type="success" appearance="link">
          <Icon.PlusOutlined />
          安全按钮
        </Button>
        <Button type="danger" appearance="link">
          <Icon.PlusOutlined />
          危险按钮
        </Button>
        <Button type="default" appearance="link">
          <Icon.PlusOutlined />
          幽灵按钮
        </Button>
      </div>
    </>
  )
}
