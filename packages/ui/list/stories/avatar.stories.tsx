import React from 'react'
import List from '../src'
import Avatar from '@hi-ui/avatar'

/**
 * @title 自定义头像
 */
export const CustomAvatar = () => {
  return (
    <>
      <h1>CustomAvatar</h1>
      <div className="list-custom-avatar__wrap">
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
            console.log('dataItem', dataItem)

            return (
              <List.Item
                {...dataItem}
                avatar={<Avatar size={'lg'} shape={'square'} src={dataItem.avatar as string} />}
              />
            )
          }}
        />
      </div>
    </>
  )
}
