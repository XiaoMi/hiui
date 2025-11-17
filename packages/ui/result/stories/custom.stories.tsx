import React from 'react'
import Result from '../src'
import Button from '@hi-ui/button'
import {
  EMPTY_STATE_IMAGE_NO_NETWORK,
  EMPTY_STATE_IMAGE_NO_ACCESS,
  EMPTY_STATE_IMAGE_404,
  EMPTY_STATE_IMAGE_SERVICE_ERROR,
} from '@hi-ui/empty-state'

/**
 * @title 自定义指示器
 * @desc 通过 `image` 完全自定义指示器，可以是 img 标签
 */
export const Custom = () => {
  return (
    <>
      <h1>自定义指示器</h1>
      <div className="result-basic__wrap">
        <Result
          image={<img src={EMPTY_STATE_IMAGE_NO_NETWORK} />}
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
          image={<img src={EMPTY_STATE_IMAGE_NO_ACCESS} />}
          title="暂无权限"
          content="这是对暂无权限的说明文案"
          children={[
            <Button key="refresh">立即申请</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={<img src={EMPTY_STATE_IMAGE_404} />}
          title="404"
          content="抱歉，请求资源不存在！"
          children={<Button type="primary">返回首页</Button>}
        />
        <Result
          image={<img src={EMPTY_STATE_IMAGE_SERVICE_ERROR} />}
          title="500"
          content="抱歉，服务器开小差了！"
          children={<Button type="primary">刷新</Button>}
        />
      </div>
    </>
  )
}
