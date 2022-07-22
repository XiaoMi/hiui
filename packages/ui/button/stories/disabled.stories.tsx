import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

/**
 * @title 禁用状态
 * @desc 暂不可操作的状态
 */
export const Disabled = () => {
  return (
    <>
      <h1>禁用</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} disabled>
            面性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} disabled />
          <Button type="secondary" icon={<PlusOutlined />} disabled>
            面性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} disabled />
          <Button icon={<PlusOutlined />} disabled>
            面性按钮
          </Button>
          <Button icon={<PlusOutlined />} disabled />
          <Button type="danger" icon={<PlusOutlined />} disabled>
            面性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} disabled />
          <Button type="success" icon={<PlusOutlined />} disabled>
            面性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} disabled />
        </div>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" disabled>
            线性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" disabled />
          <Button type="secondary" icon={<PlusOutlined />} appearance="line" disabled>
            线性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="line" disabled />
          <Button icon={<PlusOutlined />} appearance="line" disabled>
            线性按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="line" disabled />
          <Button type="danger" icon={<PlusOutlined />} appearance="line" disabled>
            线性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="line" disabled />
          <Button type="success" icon={<PlusOutlined />} appearance="line" disabled>
            线性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="line" disabled />
        </div>
        <div>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" disabled>
            链接按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" disabled />
          <Button type="secondary" icon={<PlusOutlined />} appearance="link" disabled>
            链接按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="link" disabled />
          <Button icon={<PlusOutlined />} appearance="link" disabled>
            链接按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="link" disabled />
          <Button type="danger" icon={<PlusOutlined />} appearance="link" disabled>
            链接按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="link" disabled />
          <Button type="success" icon={<PlusOutlined />} appearance="link" disabled>
            链接按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="link" disabled />
        </div>
        {/* <div>
          <Button type="primary" icon={<PlusOutlined />} appearance="unset" disabled>
            无样式按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="unset" disabled />
          <Button type="secondary" icon={<PlusOutlined />} appearance="unset" disabled>
            无样式按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="unset" disabled />
          <Button icon={<PlusOutlined />} appearance="unset" disabled>
            无样式按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="unset" disabled />
          <Button type="danger" icon={<PlusOutlined />} appearance="unset" disabled>
            无样式按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="unset" disabled />
          <Button type="success" icon={<PlusOutlined />} appearance="unset" disabled>
            无样式按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="unset" disabled />
        </div> */}
      </div>
    </>
  )
}
