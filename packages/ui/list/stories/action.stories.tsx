import React from 'react'
import List from '../src'

export const Action = () => {
  return (
    <>
      <h1>带操作</h1>
      <div className="list-basic__wrap">
        <List
          style={{ marginBottom: 20 }}
          data={[
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
              avatar: 'http://infra.mioffice.cn/hiui/static/img/logo.png',
              action: '编辑',
            },
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
              avatar: 'http://infra.mioffice.cn/hiui/static/img/logo.png',
              action: '编辑',
            },
          ]}
          render={(dataItem) => {
            return <List.Item {...dataItem} />
          }}
        />
        <List
          style={{ marginBottom: 20 }}
          data={[
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
              avatar: 'http://infra.mioffice.cn/hiui/static/img/logo.png',
              action: '编辑',
            },
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
              avatar: 'http://infra.mioffice.cn/hiui/static/img/logo.png',
              action: '编辑',
            },
          ]}
          render={(dataItem) => {
            return <List.Item {...dataItem} actionPlacement={'top'} />
          }}
        />
        <List
          data={[
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
              avatar: 'http://infra.mioffice.cn/hiui/static/img/logo.png',
              action: '编辑',
            },
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
              avatar: 'http://infra.mioffice.cn/hiui/static/img/logo.png',
              action: '编辑',
            },
          ]}
          render={(dataItem) => {
            return <List.Item {...dataItem} actionPlacement={'bottom'} />
          }}
        />
      </div>
    </>
  )
}
