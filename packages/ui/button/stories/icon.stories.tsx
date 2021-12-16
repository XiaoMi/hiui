import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

export const Icon = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>带图标</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />}>
            面性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} />
          <Button type="secondary" icon={<PlusOutlined />}>
            面性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} />
          <Button icon={<PlusOutlined />}>面性按钮</Button>
          <Button icon={<PlusOutlined />} />
          <Button type="danger" icon={<PlusOutlined />}>
            面性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} />
          <Button type="success" icon={<PlusOutlined />}>
            面性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} appearance="line">
            面性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" />
          <Button type="secondary" icon={<PlusOutlined />} appearance="line">
            面性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="line" />
          <Button icon={<PlusOutlined />} appearance="line">
            面性按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="line" />
          <Button type="danger" icon={<PlusOutlined />} appearance="line">
            面性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="line" />
          <Button type="success" icon={<PlusOutlined />} appearance="line">
            面性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="line" />
        </div>
        <div>
          <Button type="primary" icon={<PlusOutlined />} appearance="link">
            面性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" />
          <Button type="secondary" icon={<PlusOutlined />} appearance="link">
            面性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="link" />
          <Button icon={<PlusOutlined />} appearance="link">
            面性按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="link" />
          <Button type="danger" icon={<PlusOutlined />} appearance="link">
            面性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="link" />
          <Button type="success" icon={<PlusOutlined />} appearance="link">
            面性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="link" />
        </div>
      </div>
    </>
  )
}
