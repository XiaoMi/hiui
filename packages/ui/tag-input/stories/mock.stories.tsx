import { DownOutlined } from '@hi-ui/icons'
import React from 'react'
import { TagInputMock } from '../src'

export const Mock = () => {
  const [value] = React.useState(['1', '2', '不存在的测试', '11', '12', '13', '14'])
  const [data] = React.useState([
    {
      id: '1',
      title: 'title1',
    },
    {
      id: '2',
      title: '二锅头',
    },
    {
      id: '3',
      title: '梦幻3',
    },
    {
      id: '4',
      title: '老四',
    },
    {
      id: '11',
      title: '1title1',
    },
    {
      id: '12',
      title: '1二锅头',
    },
    {
      id: '13',
      title: '1梦幻3',
    },
    {
      id: '14',
      title: '1老四',
    },
  ])

  return (
    <>
      <h1>Mock</h1>
      <div className="tag-input-basic__wrap">
        <TagInputMock
          clearable
          suffix={<DownOutlined />}
          // style={{ width: 380 }}
          // wrap={false}
          // disabled
          value={value}
          data={data}
        />

        <div>
          <h2>Outline</h2>
          <TagInputMock
            appearance="line"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="sm"
            appearance="line"
            clearable
            placeholder="请输入"
            value={value}
            data={data}
            suffix={<DownOutlined />}
          />
          <br />
          <br />
          <TagInputMock
            size="sm"
            focused
            appearance="line"
            clearable
            placeholder="请输入"
            value={value}
            data={data}
            suffix={<DownOutlined />}
          />
          <br />
          <br />
          <TagInputMock
            size="md"
            appearance="line"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            invalid
            appearance="line"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            invalid
            focused
            appearance="line"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            appearance="line"
            disabled
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
        </div>

        <div>
          <h2>Filled</h2>
          <TagInputMock
            appearance="filled"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="sm"
            appearance="filled"
            clearable
            placeholder="请输入"
            value={value}
            data={data}
            suffix={<DownOutlined />}
          />
          <br />
          <br />
          <TagInputMock
            size="sm"
            focused
            appearance="filled"
            clearable
            placeholder="请输入"
            value={value}
            data={data}
            suffix={<DownOutlined />}
          />
          <br />
          <br />
          <TagInputMock
            size="md"
            appearance="filled"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            invalid
            appearance="filled"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            invalid
            focused
            appearance="filled"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            appearance="filled"
            disabled
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
        </div>

        <div>
          <h2>Unset</h2>
          <TagInputMock
            appearance="unset"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="sm"
            appearance="unset"
            clearable
            placeholder="请输入"
            value={value}
            data={data}
            suffix={<DownOutlined />}
          />
          <br />
          <br />
          <TagInputMock
            size="sm"
            appearance="unset"
            focused
            clearable
            placeholder="请输入"
            value={value}
            data={data}
            suffix={<DownOutlined />}
          />
          <br />
          <br />
          <TagInputMock
            size="md"
            appearance="unset"
            focused
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            invalid
            appearance="unset"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            invalid
            focused
            appearance="unset"
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
          <TagInputMock
            size="lg"
            appearance="unset"
            disabled
            placeholder="请输入"
            suffix={<DownOutlined />}
          ></TagInputMock>
          <br />
          <br />
        </div>
      </div>
    </>
  )
}
