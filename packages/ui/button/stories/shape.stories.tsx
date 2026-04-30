import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

/**
 * @title 不同形状
 */
export const Shape = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>不同形状</h1>
      <div className="button-basic__wrap">
        <h2>square</h2>
        <Button type="primary" size="xs">
          超小号按钮
        </Button>
        <Button type="primary" icon={<PlusOutlined />} size="xs" />
        <Button type="primary" size="sm">
          小号按钮
        </Button>
        <Button type="primary" icon={<PlusOutlined />} size="sm" />
        <Button type="primary">正常按钮</Button>
        <Button type="primary" icon={<PlusOutlined />} />
        <Button type="primary" size="lg">
          大号按钮
        </Button>
        <Button type="primary" icon={<PlusOutlined />} size="lg" />

        <h2>round</h2>
        <Button type="primary" shape="round" size="xs">
          超小号按钮
        </Button>
        <Button type="primary" shape="round" icon={<PlusOutlined />} size="xs" />
        <Button type="primary" shape="round" size="sm">
          小号按钮
        </Button>
        <Button type="primary" shape="round" icon={<PlusOutlined />} size="sm" />
        <Button type="primary" shape="round">
          正常按钮
        </Button>
        <Button type="primary" shape="round" icon={<PlusOutlined />} />
        <Button type="primary" shape="round" size="lg">
          大号按钮
        </Button>
        <Button type="primary" shape="round" icon={<PlusOutlined />} size="lg" />
      </div>
    </>
  )
}
