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
            线性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" loading />
          <Button type="secondary" icon={<PlusOutlined />} appearance="line" loading>
            线性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="line" loading />
          <Button icon={<PlusOutlined />} appearance="line" loading>
            线性按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="line" loading />
          <Button type="danger" icon={<PlusOutlined />} appearance="line" loading>
            线性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="line" loading />
          <Button type="success" icon={<PlusOutlined />} appearance="line" loading>
            线性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="line" loading />
        </div>
        <div>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" loading>
            链接按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" loading />
          <Button type="secondary" icon={<PlusOutlined />} appearance="link" loading>
            链接按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="link" loading />
          <Button icon={<PlusOutlined />} appearance="link" loading>
            链接按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="link" loading />
          <Button type="danger" icon={<PlusOutlined />} appearance="link" loading>
            链接按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="link" loading />
          <Button type="success" icon={<PlusOutlined />} appearance="link" loading>
            链接按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="link" loading />
        </div>
        {/* <div>
          <Button type="primary" icon={<PlusOutlined />} appearance="unset" loading>
            链接按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="unset" loading />
          <Button type="secondary" icon={<PlusOutlined />} appearance="unset" loading>
            链接按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="unset" loading />
          <Button icon={<PlusOutlined />} appearance="unset" loading>
            链接按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="unset" loading />
          <Button type="danger" icon={<PlusOutlined />} appearance="unset" loading>
            链接按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="unset" loading />
          <Button type="success" icon={<PlusOutlined />} appearance="unset" loading>
            链接按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="unset" loading />
        </div> */}
      </div>
    </>
  )
}
