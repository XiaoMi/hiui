import React from 'react'
import List from '../src'
import AvatarComp from '@hi-ui/avatar'

/**
 * @title 自定义头像
 */
export const Avatar = () => {
  return (
    <>
      <h1>Avatar</h1>
      <div className="list-avatar__wrap">
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

            const { avatar, ...rest } = dataItem

            return (
              <List.Item
                {...rest}
                avatar={<AvatarComp size={'lg'} shape={'square'} src={avatar as string} />}
              />
            )
          }}
        />
      </div>
    </>
  )
}
