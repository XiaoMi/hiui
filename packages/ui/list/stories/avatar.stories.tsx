import React from 'react'
import Button from '@hi-ui/button'
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
              title: '当前这里是标题信息',
              description:
                '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              avatar: 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
              action: (
                <Button type="primary" appearance="link">
                  操作
                </Button>
              ),
            },
            {
              title: '当前这里是标题信息',
              description:
                '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              avatar: 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
              action: (
                <Button type="primary" appearance="link">
                  操作
                </Button>
              ),
            },
            {
              title: '当前这里是标题信息',
              description:
                '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              avatar: 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
              action: (
                <Button type="primary" appearance="link">
                  操作
                </Button>
              ),
            },
          ]}
          render={(dataItem) => (
            <List.Item
              {...dataItem}
              avatar={
                <img style={{ maxHeight: 84, borderRadius: 8 }} src={dataItem.avatar as string} />
              }
              extra={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginInlineEnd: 8,
                      paddingInlineEnd: 8,
                      borderRight: '1px solid #e6e8eb',
                    }}
                  >
                    <Avatar size={20} />
                    李小米
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginInlineEnd: 8,
                      paddingInlineEnd: 8,
                      borderRight: '1px solid #e6e8eb',
                    }}
                  >
                    2025年10月28日
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      paddingInlineEnd: 8,
                    }}
                  >
                    <Avatar.Group>
                      <Avatar size={22} />
                      <Avatar size={22} />
                      <Avatar size={22} />
                    </Avatar.Group>
                    21 人点赞
                  </div>
                </div>
              }
            />
          )}
        />
      </div>
    </>
  )
}
