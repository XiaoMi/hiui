import React from 'react'
import List from '../src'

/**
 * @title 不带分割线
 */
export const NoSplit = () => {
  return (
    <>
      <h1>不带分割线</h1>
      <div className="list-basic__wrap">
        <List
          split={false}
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
      </div>
    </>
  )
}
