import React from 'react'
import Input from '../src'
import { ExpressionOutlined, AudioOutlined } from '@hi-ui/icons'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size for Input</h1>
      <div className="input-size__wrap">
        <Input
          size="sm"
          placeholder="sm"
          prefix={<ExpressionOutlined />}
          suffix={<AudioOutlined style={{ marginRight: 4 }} />}
        ></Input>
        <br />
        <br />
        <Input
          size="md"
          placeholder="md"
          prefix={<ExpressionOutlined />}
          suffix={<AudioOutlined style={{ marginRight: 4 }} />}
        ></Input>
        <br />
        <br />
        <Input
          size="lg"
          placeholder="lg"
          prefix={<ExpressionOutlined />}
          suffix={<AudioOutlined style={{ marginRight: 4 }} />}
        ></Input>
      </div>
    </>
  )
}
