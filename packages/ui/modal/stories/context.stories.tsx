import React, { useContext, useState } from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title Context 访问
 * @desc 可通过 Modal.useModal 在使用 api 式调用时，访问外层 Context
 */
export const Context = () => {
  const [ThemeContext] = useState(() => React.createContext<string>('light'))
  const ThemeConsumer = () => {
    const theme = useContext(ThemeContext)
    return <span>当前主题: {theme}</span>
  }

  const [modal, contextHolder] = Modal.useModal()

  return (
    <ThemeContext.Provider value="dark">
      <div>
        <h1>Context 访问</h1>
        <p>将 contextHolder 放在 ThemeContext.Provider 内，模态窗内容区域可正常获取外部 Context</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          <Button
            type="primary"
            onClick={() =>
              modal.confirm({
                title: 'useModal 可访问 Context',
                content: (
                  <div>
                    <ThemeConsumer />
                    <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                      将显示默认值「当前主题: dark」
                    </p>
                  </div>
                ),
                cancelText: '取消',
                confirmText: '确定',
                closeable: false,
              })
            }
          >
            使用 useModal
          </Button>
          <Button
            type="secondary"
            appearance="line"
            onClick={() =>
              Modal.confirm({
                title: '静态 API 无法访问 Context',
                content: (
                  <div>
                    <ThemeConsumer />
                    <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                      将显示默认值，因为创建了新 React 根
                    </p>
                  </div>
                ),
                cancelText: '取消',
                confirmText: '确定',
                closeable: false,
              })
            }
          >
            使用 Modal.confirm
          </Button>
        </div>
        {contextHolder}
      </div>
    </ThemeContext.Provider>
  )
}
