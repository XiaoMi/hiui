import React from 'react'
import Input from '../src'
import { ExpressionOutlined, AudioOutlined, MessageOutlined } from '@hi-ui/icons'

export const Appearance = () => {
  return (
    <>
      <h1>Appearance for Input</h1>
      <div className="input-appearance__wrap">
        <h2>outline</h2>
        <Input size="md" appearance="outline" placeholder="请输入内容"></Input>
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
        <h2>unset</h2>
        <Input size="md" appearance="unset" placeholder="请输入内容"></Input>
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
        <h2>filled</h2>
        <Input size="md" appearance="filled" placeholder="请输入内容"></Input>
        <br />
        <Input
          appearance="filled"
          size="md"
          clearable
          placeholder="请输入"
          prepend={<ExpressionOutlined />}
          prefix={<MessageOutlined />}
          suffix={<AudioOutlined />}
          append={<div>Send</div>}
        ></Input>
        <br />
        <h2>underline</h2>
        <Input size="md" appearance="underline" placeholder="请输入内容"></Input>
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
      </div>
    </>
  )
}
