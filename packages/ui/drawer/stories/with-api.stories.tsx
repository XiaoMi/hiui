import React from 'react'
import Button from '@hi-ui/button'
import Drawer from '../src'

/**
 * @title 命令式 API
 * @desc 通过 Drawer.open / Drawer.close 以命令方式打开和关闭抽屉；支持 confirm/cancel；若需在抽屉内容中访问 React Context，请使用 Drawer.useDrawer
 */
export const WithAPI = () => {
  return (
    <>
      <h1>命令式 API</h1>
      <div className="drawer-with-api__wrap" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button
          type="secondary"
          onClick={() => {
            Drawer.open({
              title: '抽屉标题',
              content: '这是通过 Drawer.open 打开的抽屉内容',
              placement: 'right',
            })
          }}
        >
          打开抽屉
        </Button>

        <Button
          type="secondary"
          onClick={() =>
            Drawer.open({
              title: '带确定/取消',
              content: '执行该操作后将无法撤销，是否确定继续？',
              placement: 'right',
              cancelText: '取消',
              confirmText: '确定',
              closeable: false,
            })
          }
        >
          带确定/取消
        </Button>

        <Button
          type="secondary"
          onClick={() =>
            Drawer.open({
              title: '异步确认关闭',
              content: '点击确定后将延迟 1 秒再关闭',
              placement: 'right',
              cancelText: '取消',
              confirmText: '确定',
              onConfirm: async () => {
                return new Promise((resolve) => setTimeout(resolve, 1000))
              },
              closeable: false,
            })
          }
        >
          异步确认关闭
        </Button>
      </div>
    </>
  )
}
