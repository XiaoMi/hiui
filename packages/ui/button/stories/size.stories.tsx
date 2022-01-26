import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

export const Size = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>不同尺寸</h1>
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
          <Button type="primary" appearance="line" size="sm">
            小号按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} size="sm" />
          <Button type="primary" appearance="line">
            正常按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} />
          <Button type="primary" appearance="line" size="lg">
            大号按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} size="lg" />
          <Button type="primary" appearance="line" size="xl">
            超大号按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} size="xl" />
        </div>
        <div>
          <Button type="primary" appearance="link" size="sm">
            小号按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} size="sm" />
          <Button type="primary" appearance="link">
            正常按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} />
          <Button type="primary" appearance="link" size="lg">
            大号按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} size="lg" />
          <Button type="primary" appearance="link" size="xl">
            超大号按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} size="xl" />
        </div>
      </div>
    </>
  )
}
