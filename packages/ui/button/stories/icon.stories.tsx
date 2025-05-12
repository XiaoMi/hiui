import React from 'react'
import Button from '../src'
import { PlusOutlined, MinusOutlined } from '@hi-ui/icons'

/**
 * @title 带图标
 * @desc 图标能够明确表达按钮的动作含义，成组使用，与文字搭配，突出按钮的重要性
 */
export const Icon = () => {
  return (
    <>
      <h1>带图标</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}>
            面性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} />
          <Button type="secondary" icon={<PlusOutlined />}>
            面性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} />
          <Button icon={[null, <MinusOutlined key="2" />]}>面性按钮</Button>
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
          <Button
            type="primary"
            icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
            appearance="line"
          >
            线性按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" />
          <Button type="secondary" icon={<PlusOutlined />} appearance="line">
            线性按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="line" />
          <Button icon={[null, <MinusOutlined key="2" />]} appearance="line">
            线性按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="line" />
          <Button type="danger" icon={<PlusOutlined />} appearance="line">
            线性按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="line" />
          <Button type="success" icon={<PlusOutlined />} appearance="line">
            线性按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="line" />
        </div>
        <div>
          <Button
            type="primary"
            icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
            appearance="link"
          >
            链接按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" />
          <Button type="secondary" icon={<PlusOutlined />} appearance="link">
            链接按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="link" />
          <Button icon={[null, <MinusOutlined key="2" />]} appearance="link">
            链接按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="link" />
          <Button type="danger" icon={<PlusOutlined />} appearance="link">
            链接按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="link" />
          <Button type="success" icon={<PlusOutlined />} appearance="link">
            链接按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="link" />
        </div>
        {/* <div>
          <Button type="primary" icon={<PlusOutlined />} appearance="unset">
            链接按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="unset" />
          <Button type="secondary" icon={<PlusOutlined />} appearance="unset">
            链接按钮
          </Button>
          <Button type="secondary" icon={<PlusOutlined />} appearance="unset" />
          <Button icon={<PlusOutlined />} appearance="unset">
            链接按钮
          </Button>
          <Button icon={<PlusOutlined />} appearance="unset" />
          <Button type="danger" icon={<PlusOutlined />} appearance="unset">
            链接按钮
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="unset" />
          <Button type="success" icon={<PlusOutlined />} appearance="unset">
            链接按钮
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="unset" />
        </div> */}
      </div>
    </>
  )
}
