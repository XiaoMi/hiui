import React from 'react'
import Button from '../src'
import { PlusOutlined } from '@hi-ui/icons'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>不同尺寸</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
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
        </div>

        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
          <Button type="primary" appearance="line" size="xs">
            超小号按钮
          </Button>
          <Button type="primary" appearance="line" icon={<PlusOutlined />} size="xs" />
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
        </div>

        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
          <Button type="primary" appearance="link" size="xs">
            超小号按钮
          </Button>
          <Button type="primary" appearance="link" icon={<PlusOutlined />} size="xs" />
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button type="primary" appearance="text" size="xs">
            超小号按钮
          </Button>
          <Button type="primary" appearance="text" icon={<PlusOutlined />} size="xs" />
          <Button type="primary" appearance="text" size="sm">
            小号按钮
          </Button>
          <Button type="primary" appearance="text" icon={<PlusOutlined />} size="sm" />
          <Button type="primary" appearance="text">
            正常按钮
          </Button>
          <Button type="primary" appearance="text" icon={<PlusOutlined />} />
          <Button type="primary" appearance="text" size="lg">
            大号按钮
          </Button>
          <Button type="primary" appearance="text" icon={<PlusOutlined />} size="lg" />
        </div>
      </div>
    </>
  )
}
