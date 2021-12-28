import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

export const Loading = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>加载中</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} loading>
            面性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} loading />
          <Button type="secondary" icon={<PlusOutlined />} loading>
            面性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} loading />
          <Button icon={<PlusOutlined />} loading>
            面性按钮
          </Button>
          <Button icon={<PlusOutlined />} loading />
          <Button type="danger" icon={<PlusOutlined />} loading>
            面性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} loading />
          <Button type="success" icon={<PlusOutlined />} loading>
            面性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} loading />
        </div>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" loading>
            面性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" loading />
          <Button type="secondary" icon={<PlusOutlined />} appearance="line" loading>
            面性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="line" loading />
          <Button icon={<PlusOutlined />} appearance="line" loading>
            面性按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="line" loading />
          <Button type="danger" icon={<PlusOutlined />} appearance="line" loading>
            面性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="line" loading />
          <Button type="success" icon={<PlusOutlined />} appearance="line" loading>
            面性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="line" loading />
        </div>
        <div>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" loading>
            面性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" loading />
          <Button type="secondary" icon={<PlusOutlined />} appearance="link" loading>
            面性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="link" loading />
          <Button icon={<PlusOutlined />} appearance="link" loading>
            面性按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="link" loading />
          <Button type="danger" icon={<PlusOutlined />} appearance="link" loading>
            面性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="link" loading />
          <Button type="success" icon={<PlusOutlined />} appearance="link" loading>
            面性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="link" loading />
        </div>
      </div>
    </>
  )
}
