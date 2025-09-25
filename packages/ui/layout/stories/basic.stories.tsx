import React from 'react'
import Layout, { Header, Sider, Content, Footer } from '../src'

/**
 * @title 基础布局
 */
export const Basic = () => {
  // 侧边栏导航是否折叠
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <>
      <h1>Basic</h1>
      <div className="layout-basic__wrap" style={{ width: 800 }}>
        <div>
          <div style={{ height: 300, marginBottom: 16 }}>
            <Layout direction="column" style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
              <Header
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#74a2ff',
                }}
              >
                <div>Header</div>
              </Header>
              <Content
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#2660ff',
                }}
              >
                Content
              </Content>
              <Footer
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#74a2ff',
                }}
              >
                Footer
              </Footer>
            </Layout>
          </div>
          <div style={{ height: 300, marginBottom: 16 }}>
            <Layout direction="column" style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
              <Header
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#74a2ff',
                }}
              >
                <div>Header</div>
              </Header>
              <Layout direction="row">
                <Sider
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#4d82ff',
                    boxShadow: 'none',
                  }}
                  resizable={false}
                  collapsed={collapsed}
                  onCollapse={setCollapsed}
                >
                  Sider
                </Sider>
                <Content
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2660ff',
                  }}
                >
                  Content
                </Content>
              </Layout>
              <Footer
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#74a2ff',
                }}
              >
                Footer
              </Footer>
            </Layout>
          </div>
          <div style={{ height: 300, marginBottom: 16 }}>
            <Layout direction="column" style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
              <Header
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#74a2ff',
                }}
              >
                <div>Header</div>
              </Header>
              <Layout direction="row">
                <Content
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2660ff',
                  }}
                >
                  Content
                </Content>
                <Sider
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#4d82ff',
                    boxShadow: 'none',
                  }}
                  resizable={false}
                  collapsed={collapsed}
                  onCollapse={setCollapsed}
                >
                  Sider
                </Sider>
              </Layout>
              <Footer
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#74a2ff',
                }}
              >
                Footer
              </Footer>
            </Layout>
          </div>
          <div style={{ height: 300, marginBottom: 16 }}>
            <Layout style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
              <Sider
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#4d82ff',
                  boxShadow: 'none',
                }}
                resizable={false}
                collapsed={collapsed}
                onCollapse={setCollapsed}
              >
                Sider
              </Sider>
              <Layout direction="column">
                <Header
                  style={{
                    height: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#74a2ff',
                  }}
                >
                  <div>Header</div>
                </Header>
                <Content
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2660ff',
                  }}
                >
                  Content
                </Content>
                <Footer
                  style={{
                    height: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#74a2ff',
                  }}
                >
                  Footer
                </Footer>
              </Layout>
            </Layout>
          </div>
        </div>
      </div>
    </>
  )
}
