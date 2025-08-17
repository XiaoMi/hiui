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
        <Layout style={{ height: '100%' }}>
          <Sider
            style={{ backgroundColor: '#f2f4f7' }}
            collapsed={collapsed}
            onCollapse={setCollapsed}
          ></Sider>
          <Content style={{ backgroundColor: '#f7f9fc' }}>
            <div style={{ height: 32, margin: '14px 0', backgroundColor: '#f2f4f7' }}></div>
            <div style={{ flex: 1, marginBottom: 16, backgroundColor: '#f2f4f7' }}></div>
          </Content>
        </Layout>
      </div>
    </>
  )
}
