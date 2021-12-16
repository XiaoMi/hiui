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
          <Button type="primary" appearance="line" size="small">
            小号按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} size="small" />
          <Button type="primary" appearance="line">
            正常按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} />
          <Button type="primary" appearance="line" size="large">
            大号按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} size="large" />
          <Button type="primary" appearance="line" size="x-large">
            超大号按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} size="x-large" />
        </div>
        <div>
          <Button type="primary" appearance="link" size="small">
            小号按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} size="small" />
          <Button type="primary" appearance="link">
            正常按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} />
          <Button type="primary" appearance="link" size="large">
            大号按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} size="large" />
          <Button type="primary" appearance="link" size="x-large">
            超大号按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} size="x-large" />
        </div>
      </div>
    </>
  )
}
