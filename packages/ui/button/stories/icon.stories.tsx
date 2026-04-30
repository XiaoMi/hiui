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
            Solid
          </Button>
          <Button type="primary" icon={<PlusOutlined />} />
          <Button icon={[null, <MinusOutlined key="2" />]}>Solid</Button>
          <Button icon={<PlusOutlined />} />
          <Button type="danger" icon={<PlusOutlined />}>
            Solid
          </Button>
          <Button type="danger" icon={<PlusOutlined />} />
          <Button type="success" icon={<PlusOutlined />}>
            Solid
          </Button>
          <Button type="success" icon={<PlusOutlined />} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            appearance="filled"
            icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
          >
            Filled
          </Button>
          <Button type="primary" appearance="filled" icon={<PlusOutlined />} />
          <Button appearance="filled" icon={[null, <MinusOutlined key="2" />]}>
            Solid
          </Button>
          <Button appearance="filled" icon={<PlusOutlined />} />
          <Button type="danger" appearance="filled" icon={<PlusOutlined />}>
            Filled
          </Button>
          <Button type="danger" appearance="filled" icon={<PlusOutlined />} />
          <Button type="success" appearance="filled" icon={<PlusOutlined />}>
            Filled
          </Button>
          <Button type="success" appearance="filled" icon={<PlusOutlined />} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
            appearance="line"
          >
            Line
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="line" />
          <Button icon={[null, <MinusOutlined key="2" />]} appearance="line">
            Line
          </Button>
          <Button icon={<PlusOutlined />} appearance="line" />
          <Button type="danger" icon={<PlusOutlined />} appearance="line">
            Line
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="line" />
          <Button type="success" icon={<PlusOutlined />} appearance="line">
            Line
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="line" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
            appearance="text"
          >
            Text
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="text" />
          <Button icon={[null, <MinusOutlined key="2" />]} appearance="text">
            Text
          </Button>
          <Button icon={<PlusOutlined />} appearance="text" />
          <Button type="danger" icon={<PlusOutlined />} appearance="text">
            Text
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="text" />
          <Button type="success" icon={<PlusOutlined />} appearance="text">
            Text
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="text" />
        </div>

        <div>
          <Button
            type="primary"
            icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
            appearance="link"
          >
            Link
          </Button>
          <Button type="primary" icon={<PlusOutlined />} appearance="link" />
          <Button icon={[null, <MinusOutlined key="2" />]} appearance="link">
            Link
          </Button>
          <Button icon={<PlusOutlined />} appearance="link" />
          <Button type="danger" icon={<PlusOutlined />} appearance="link">
            Link
          </Button>
          <Button type="danger" icon={<PlusOutlined />} appearance="link" />
          <Button type="success" icon={<PlusOutlined />} appearance="link">
            Link
          </Button>
          <Button type="success" icon={<PlusOutlined />} appearance="link" />
        </div>
      </div>
    </>
  )
}
