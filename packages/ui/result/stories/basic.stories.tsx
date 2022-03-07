import React from 'react'
import Result from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>基础功能</h1>
      <div className="result-basic__wrap" style={{ width: '760px' }}>
        <Result
          type="info"
          title="这是一条常规信息"
          subTitle="这是对常规信息的说明文案"
          extra={<Button type="primary">返回</Button>}
        />
        <Result
          type="success"
          title="这是一条成功信息"
          subTitle="这是对成功信息的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          type="warn"
          title="这是一条警示信息"
          subTitle="这是对警示信息的说明文案"
          extra={<Button type="primary">返回</Button>}
        />
        <Result
          type="error"
          title="这是一条错误信息"
          subTitle="这是对错误信息的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          type="operation-succeed"
          title="操作成功"
          subTitle="这是对操作成功的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          type="operation-failed"
          title="操作失败"
          subTitle="这是对操作失败的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          type="processed"
          title="处理完成"
          subTitle="这是对处理完成的说明文案"
          extra={<Button type="primary">返回</Button>}
        />
        <Result
          type="net-error"
          title="网络连接失败"
          subTitle="这是对网络连接失败的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          type="no-content"
          title="暂无内容"
          subTitle="这是对暂无内容的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          type="no-comment"
          title="暂无评论"
          subTitle="这是对暂无评论的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          type="no-permission"
          title="暂无权限"
          subTitle="这是对暂无权限的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          type="no-collection"
          title="暂无收藏"
          subTitle="这是对暂无收藏的说明文案"
          extra={[
            <Button key="refresh">重试</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
      </div>
    </>
  )
}
