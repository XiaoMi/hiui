import { DownOutlined } from '@hi-ui/icons'
import React from 'react'
import { MockInput } from '../src'

export const Mock = () => {
  return (
    <>
      <h1>Mock</h1>
      <div className="input-mock__wrap">
        <p>支持自定义渲染输入框内容，暂仅供内部 Picker 类组件使用</p>

        <div>
          <h2>Outline</h2>
          <MockInput
            size="xs"
            appearance="line"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="sm"
            appearance="line"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="md"
            appearance="line"
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
            size="lg"
            appearance="line"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="md"
            disabled
            appearance="line"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
        </div>

        <div>
          <h2>Filled</h2>
          <MockInput
            size="xs"
            appearance="filled"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
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
            appearance="filled"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="md"
            invalid
            appearance="filled"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput size="md" disabled appearance="filled" placeholder="请输入"></MockInput>
        </div>

        <div>
          <h2>Unset</h2>
          <MockInput
            size="xs"
            appearance="unset"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="sm"
            appearance="unset"
            clearable
            placeholder="请输入"
            // defaultValue={1}
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
            appearance="unset"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="md"
            invalid
            appearance="unset"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="md"
            disabled
            appearance="unset"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
        </div>

        <div>
          <h2>Contained</h2>
          <MockInput
            size="xs"
            appearance="contained"
            label="服务类型"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="sm"
            appearance="contained"
            clearable
            label="服务类型"
            // defaultValue={1}
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
            appearance="contained"
            focused
            label="服务类型"
            defaultValue={'安装'}
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="lg"
            appearance="contained"
            focused
            label="服务类型"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="md"
            invalid
            appearance="contained"
            label="服务类型"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
          <MockInput
            size="md"
            disabled
            appearance="contained"
            label="服务类型"
            suffix={<DownOutlined />}
          ></MockInput>
          <br />
          <br />
        </div>
      </div>
    </>
  )
}
