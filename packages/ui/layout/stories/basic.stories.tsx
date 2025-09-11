import React from 'react'
import Layout, { Sider, Content } from '../src'
import Button from '@hi-ui/button'

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
            {/* <div
              style={{
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 500, color: '#161a2d' }}>标题</div>
              <div style={{}}>
                <Button type="primary">操作按钮</Button>
              </div>
            </div> */}
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
