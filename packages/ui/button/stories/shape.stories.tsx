import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

export const Shape = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>不同形状</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 24 }}>
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
          <Button type="primary" size="xl">
            超大号按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="xl" />
        </div>
        <div style={{ marginBottom: 24 }}>
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
          <Button type="primary" shape="round" size="xl">
            超大号按钮
          </Button>
          <Button type="primary" shape="round" icon={<PlusOutlined />} size="xl" />
        </div>
      </div>
    </>
  )
}
