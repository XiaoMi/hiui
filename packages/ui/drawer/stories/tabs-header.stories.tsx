import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'
import { TabList } from '@hi-ui/tabs'

/**
 * @title 标签页头部
 */
export const TabsHeader = () => {
  const [visible, setVisible] = React.useState(false)
  const [activeId, setActiveId] = React.useState<React.ReactText>('1')

  const Content1 = () => {
    return <div>内容1</div>
  }

  const Content2 = () => {
    return <div>内容2</div>
  }

  const Content3 = () => {
    return <div>内容3</div>
  }

  return (
    <>
      <h1>TabsHeader</h1>
      <div className="drawer-tabs-header__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer
          styles={{
            header: {
              padding: '0 16px',
              fontWeight: 400,
            },
          }}
          title={
            <TabList
              size="md"
              activeId={activeId}
              onChange={setActiveId}
              data={[
                { tabId: '1', tabTitle: '标签1' },
                { tabId: '2', tabTitle: '标签2' },
                { tabId: '3', tabTitle: '标签3' },
              ]}
            />
          }
          visible={visible}
          onClose={() => setVisible(false)}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button type="default" appearance="line" key={1} onClick={() => console.log(2)}>
                取消
              </Button>
              <Button type="primary" key={0} onClick={() => console.log(1)}>
                确认
              </Button>
            </div>
          }
        >
          {(() => {
            if (activeId === '1') {
              return <Content1 />
            }

            if (activeId === '2') {
              return <Content2 />
            }

            if (activeId === '3') {
              return <Content3 />
            }

            return null
          })()}
        </Drawer>
      </div>
    </>
  )
}
