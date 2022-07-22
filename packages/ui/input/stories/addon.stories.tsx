import React from 'react'
import Input from '../src'
import { ExpressionOutlined, AudioOutlined, SearchOutlined, MessageOutlined } from '@hi-ui/icons'

/**
 * @title 前后外置元素
 * @desc 将输入框与外置的其他元素组合使用
 */
export const Addon = () => {
  return (
    <>
      <h1>Addon for Input</h1>
      <div className="input-addon__wrap">
        <h2>prefix or suffix</h2>
        <Input placeholder="请输入" prefix="http://" suffix=".com"></Input>
        <br />
        <br />
        <Input
          clearable
          clearableTrigger="always"
          placeholder="请输入"
          suffix={<SearchOutlined />}
        ></Input>
        <br />
        <br />
        <Input placeholder="请输入" prefix={<ExpressionOutlined />}></Input>
        <br />
        <br />
        <Input
          placeholder="请输入"
          prefix={<MessageOutlined />}
          suffix={
            <>
              <AudioOutlined style={{ marginRight: 4 }} />
              <ExpressionOutlined />
            </>
          }
        ></Input>
      </div>
      <br />
      <div className="input-addon__wrap">
        <h2>prepend or append</h2>
        <Input placeholder="请输入" prepend="http://" append=".com"></Input>
        <br />
        <br />
        <Input
          clearable
          clearableTrigger="always"
          placeholder="请输入"
          append={<SearchOutlined />}
        ></Input>
        <br />
        <br />
        <Input placeholder="请输入" prepend={<ExpressionOutlined />}></Input>
        <br />
        <br />
        <Input
          placeholder="请输入"
          prepend={<MessageOutlined />}
          append={
            <>
              <AudioOutlined style={{ marginRight: 4 }} />
              <ExpressionOutlined />
            </>
          }
        ></Input>
      </div>
      <div className="input-addon__wrap">
        <h2>mixin addon</h2>
        <Input
          size="md"
          clearable
          placeholder="请输入"
          prepend={<ExpressionOutlined />}
          suffix={<AudioOutlined />}
          append={<div>Send</div>}
        ></Input>
      </div>
    </>
  )
}
