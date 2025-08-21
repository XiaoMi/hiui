import React from 'react'
import Input from '../src'
import { ExpressionOutlined, AudioOutlined, MessageOutlined } from '@hi-ui/icons'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性、无UI三种
 */
export const Appearance = () => {
  return (
    <>
      <h1>Appearance for Input</h1>
      <div className="input-appearance__wrap">
        <h2>outline</h2>
        <Input size="md" appearance="line" placeholder="请输入内容"></Input>
        <br />
        <br />
        <Input
          size="md"
          clearable
          placeholder="请输入"
          prepend={<ExpressionOutlined />}
          prefix={<MessageOutlined />}
          suffix={<AudioOutlined />}
          append={<div>Send</div>}
        ></Input>
        <br />
        <br />
        <h2>unset</h2>
        <Input size="md" appearance="unset" placeholder="请输入内容"></Input>
        <br />
        <br />
        <Input
          appearance="unset"
          size="md"
          clearable
          placeholder="请输入"
          prepend={<ExpressionOutlined />}
          prefix={<MessageOutlined />}
          suffix={<AudioOutlined />}
          append={<div>Send</div>}
        ></Input>
        <br />
        <br />
        <h2>borderless</h2>
        <Input size="md" appearance="borderless" placeholder="请输入内容"></Input>
        <br />
        <br />
        <Input
          appearance="borderless"
          size="md"
          clearable
          placeholder="请输入"
          prepend={<ExpressionOutlined />}
          prefix={<MessageOutlined />}
          suffix={<AudioOutlined />}
          append={<div>Send</div>}
        ></Input>
        <br />
        <br />
        <h2>underline</h2>
        <Input size="md" appearance="underline" placeholder="请输入内容"></Input>
        <br />
        <br />
        <Input
          appearance="underline"
          size="md"
          clearable
          placeholder="请输入"
          prepend={<ExpressionOutlined />}
          prefix={<MessageOutlined />}
          suffix={<AudioOutlined />}
          append={<div>Send</div>}
        ></Input>
        <br />
        <br />
      </div>
    </>
  )
}
