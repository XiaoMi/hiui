import React from 'react'
import {
  Result,
  IconSucceed,
  IconFailed,
  IconProcessed,
  IconNetError,
  IconNoComment,
  IconNoContent,
  IconNoPermission,
  IconNoCollection,
  IconNotFound,
  IconServerError,
} from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>基础功能</h1>
      <div className="result-basic__wrap" style={{ width: '760px' }}>
        <Result type="info" title="这是一条常规信息" content="这是对常规信息的说明文案">
          <Button type="primary">返回</Button>
        </Result>
        <Result type="success" title="这是一条成功信息" content="这是对成功信息的说明文案">
          {[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        </Result>
        <Result
          type="warning"
          title="这是一条警示信息"
          content="这是对警示信息的说明文案"
          children={<Button type="primary">返回</Button>}
        />
        <Result
          type="error"
          title="这是一条错误信息"
          content="这是对错误信息的说明文案"
          children={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<IconSucceed />}
          title="操作成功"
          content="这是对操作成功的说明文案"
          children={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<IconFailed />}
          title="操作失败"
          content="这是对操作失败的说明文案"
          children={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<IconProcessed />}
          title="处理完成"
          content="这是对处理完成的说明文案"
          children={<Button type="primary">返回</Button>}
        />
        <Result
          image={<IconNetError />}
          title="网络连接失败"
          content="这是对网络连接失败的说明文案"
          children={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<IconNoContent />}
          title="暂无内容"
          content="这是对暂无内容的说明文案"
          children={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<IconNoComment />}
          title="暂无评论"
          content="这是对暂无评论的说明文案"
          children={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<IconNoPermission />}
          title="暂无权限"
          content="这是对暂无权限的说明文案"
          children={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<IconNoCollection />}
          title="暂无收藏"
          content="这是对暂无收藏的说明文案"
          children={[
            <Button key="refresh">重试</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<IconNotFound />}
          title="404"
          content="抱歉，服务器开小差了！"
          children={<Button type="primary">立即申请</Button>}
        />
        <Result
          image={<IconServerError />}
          title="500"
          content="抱歉，服务器开小差了！"
          children={<Button type="primary">立即申请</Button>}
        />
      </div>
    </>
  )
}
