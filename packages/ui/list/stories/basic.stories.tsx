import React from 'react'
import List from '../src'

/**
 * @title 基础用法
 * @desc 常用在数据管理、信息展示等领域
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="list-basic__wrap">
        <List
          data={[
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
              avatar:
                'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/logo.png',
              action: '编辑',
            },
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
              avatar:
                'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/logo.png',
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
