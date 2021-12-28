import { DownOutlined } from '@hi-ui/icons'
import React from 'react'
import { MockInput } from '../src/MockInput'

export const Mock = () => {
  return (
    <>
      <h1>Mock</h1>
      <div className="input-mock__wrap">
        <p>支持自定义渲染输入框内容，暂时仅供内部 Picker 类组件使用</p>

        <div>
          <h2>Outline</h2>
          <MockInput
            appearance="outline"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="sm"
            appearance="outline"
            clearable
            placeholder="请输入"
            defaultValue={1}
            suffix={<DownOutlined />}
            data={[
              {
                id: 1,
                title: '标题1',
              },
              {
                id: 2,
                title: '标题2',
              },
            ]}
          />
          <br />
          <br />
          <MockInput
            size="md"
            appearance="outline"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            invalid
            appearance="outline"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            invalid
            focused
            appearance="outline"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            appearance="outline"
            disabled
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
        </div>

        <div>
          <h2>Filled</h2>
          <MockInput appearance="filled" placeholder="请输入" suffix={<DownOutlined />}></MockInput>
          <br />
          <br />
          <MockInput
            size="sm"
            appearance="filled"
            clearable
            placeholder="请输入"
            defaultValue={1}
            suffix={<DownOutlined />}
            data={[
              {
                id: 1,
                title: '标题1',
              },
              {
                id: 2,
                title: '标题2',
              },
            ]}
          />
          <br />
          <br />
          <MockInput
            size="md"
            appearance="filled"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            invalid
            appearance="filled"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            invalid
            focused
            appearance="filled"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            appearance="filled"
            disabled
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
        </div>

        <div>
          <h2>Unset</h2>
          <MockInput appearance="unset" placeholder="请输入" suffix={<DownOutlined />}></MockInput>
          <br />
          <br />
          <MockInput
            size="sm"
            appearance="unset"
            clearable
            placeholder="请输入"
            defaultValue={1}
            suffix={<DownOutlined />}
            data={[
              {
                id: 1,
                title: '标题1',
              },
              {
                id: 2,
                title: '标题2',
              },
            ]}
          />
          <br />
          <br />
          <MockInput
            size="md"
            appearance="unset"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            invalid
            appearance="unset"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            invalid
            focused
            appearance="unset"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            appearance="unset"
            disabled
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
        </div>
      </div>
    </>
  )
}
