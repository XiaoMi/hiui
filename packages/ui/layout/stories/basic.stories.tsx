import React from 'react'
import Layout, { Sider, Content } from '../src'

/**
 * @title 基础布局
 */
export const Basic = () => {
  // 侧边栏导航是否折叠
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <>
      <h1>Basic</h1>
      <div className="layout-basic__wrap" style={{ width: 800, height: 600 }}>
        <Layout style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
          <Sider
            style={{ backgroundColor: '#edf2ff' }}
            collapsed={collapsed}
            onCollapse={setCollapsed}
          ></Sider>
          <Content>
            <div
              style={{
                flex: 1,
                marginTop: 16,
                marginBottom: 16,
                borderRadius: 12,
                backgroundColor: '#fff',
                boxShadow: '0 0 4px rgba(92, 94, 102, 0.06)',
              }}
            ></div>
          </Content>
        </Layout>
      </div>
    </>
  )
}
