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
          <Button type="primary" size="small">
            小号按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="small" />
          <Button type="primary">正常按钮</Button>
          <Button type="primary" icon={<PlusOutlined />} />
          <Button type="primary" size="large">
            大号按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="large" />
          <Button type="primary" size="x-large">
            超大号按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="x-large" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" shape="circle" size="small">
            小号按钮
          </Button>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" />
          <Button type="primary" shape="circle">
            正常按钮
          </Button>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          <Button type="primary" shape="circle" size="large">
            大号按钮
          </Button>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large" />
          <Button type="primary" shape="circle" size="x-large">
            超大号按钮
          </Button>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} size="x-large" />
        </div>
      </div>
    </>
  )
}
