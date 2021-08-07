import React from 'react'
import Button from '../src'
import * as Icon from '@hi-ui/icons'

export const Flat = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button type="primary" size="large">
          大号按钮
        </Button>
        <Button type="primary" size="default">
          中号按钮
        </Button>
        <Button type="primary" size="small">
          小号按钮
        </Button>
        <Button type="primary">点击</Button>
        <Button type="primary" loading>
          点击
        </Button>
        <Button type="success">安全按钮</Button>
        <Button type="success" loading>
          安全按钮
        </Button>
        <Button type="danger">危险按钮</Button>
        <Button type="danger" loading>
          危险按钮
        </Button>
        <Button type="default">普通按钮</Button>
        <Button type="default" loading>
          普通按钮
        </Button>
        <Button type="primary">
          <Icon.PlusOutlined />
          创建客户
        </Button>
        <Button type="default">
          <Icon.PlusOutlined />
        </Button>
      </div>
    </>
  )
}
