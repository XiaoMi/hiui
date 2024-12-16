import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'
import Provider from '@hi-ui/provider'

/**
 * @title 局部容器抽屉
 * @desc `container` 自定义渲染抽屉的容器
 */
export const Container = () => {
  const [visible, setVisible] = React.useState(false)
  const [container, setContainer] = React.useState<any>(null)
  return (
    <>
      <h1>Container</h1>
      <div
        ref={setContainer}
        className="drawer-container__wrap"
        style={{
          width: '100%',
          minWidth: 660,
          height: 420,
          background: '#f5f7fa',
          boxShadow: '1px 2px 8px #ddd',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          // Need add for it
          position: 'relative',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <Provider container={document.body}>
          <Button type="primary" onClick={() => setVisible(!visible)}>
            open
          </Button>
          <Drawer
            title="抽屉标题"
            style={{ position: 'absolute' }}
            container={container}
            visible={visible}
            closeable={false}
            onClose={() => setVisible(false)}
          >
            我是一段文字，也可以是表单、表格、步骤条等等
          </Drawer>
        </Provider>
      </div>
    </>
  )
}
