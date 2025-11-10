import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

/**
 * @title 加载中状态
 * @desc 请求服务器发生延迟时或缓冲状态，使用加载中进行状态说明
 */
export const Loading = () => {
  return (
    <>
      <h1>加载中</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} loading>
            Solid
          </Button>
          <Button type="primary" icon={<PlusOutlined />} loading />
          <Button icon={<PlusOutlined />} loading>
            Solid
          </Button>
          <Button icon={<PlusOutlined />} loading />
          <Button type="danger" icon={<PlusOutlined />} loading>
            Solid
          </Button>
          <Button type="danger" icon={<PlusOutlined />} loading />
          <Button type="success" icon={<PlusOutlined />} loading>
            Solid
          </Button>
          <Button type="success" icon={<PlusOutlined />} loading />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Button type="primary" appearance="filled" icon={<PlusOutlined />} loading>
            Filled
          </Button>
          <Button type="primary" appearance="filled" icon={<PlusOutlined />} loading />
          <Button appearance="filled" icon={<PlusOutlined />} loading>
            Filled
          </Button>
          <Button appearance="filled" icon={<PlusOutlined />} loading />
          <Button type="danger" appearance="filled" icon={<PlusOutlined />} loading>
            Filled
          </Button>
          <Button type="danger" appearance="filled" icon={<PlusOutlined />} loading />
          <Button type="success" appearance="filled" icon={<PlusOutlined />} loading>
            Filled
          </Button>
          <Button type="success" appearance="filled" icon={<PlusOutlined />} loading />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" loading>
            Line
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" loading />
          <Button icon={<PlusOutlined />} appearance="line" loading>
            Line
          </Button>
          <Button icon={<PlusOutlined />} appearance="line" loading />
          <Button type="danger" icon={<PlusOutlined />} appearance="line" loading>
            Line
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="line" loading />
          <Button type="success" icon={<PlusOutlined />} appearance="line" loading>
            Line
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="line" loading />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} appearance="text" loading>
            Text
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="text" loading />
          <Button icon={<PlusOutlined />} appearance="text" loading>
            Text
          </Button>
          <Button icon={<PlusOutlined />} appearance="text" loading />
          <Button type="danger" icon={<PlusOutlined />} appearance="text" loading>
            Text
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="text" loading />
          <Button type="success" icon={<PlusOutlined />} appearance="text" loading>
            Text
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="text" loading />
        </div>

        <div>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" loading>
            Link
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" loading />
          <Button icon={<PlusOutlined />} appearance="link" loading>
            Link
          </Button>
          <Button icon={<PlusOutlined />} appearance="link" loading />
          <Button type="danger" icon={<PlusOutlined />} appearance="link" loading>
            Link
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="link" loading />
          <Button type="success" icon={<PlusOutlined />} appearance="link" loading>
            Link
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="link" loading />
        </div>
      </div>
    </>
  )
}
