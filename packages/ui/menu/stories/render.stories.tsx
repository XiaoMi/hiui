import React from 'react'
import Menu, { MenuDataItem } from '../src'
import {
  RightOutlined,
  AppStoreOutlined,
  UserOutlined,
  SunOutlined,
  PadOutlined,
  SearchOutlined,
} from '@hi-ui/icons'
import Popper from '@hi-ui/popper'
import Search from '@hi-ui/search'

/**
 * @title 自定义渲染
 */
export const Render = () => {
  const menuData = [
    {
      title: '首页',
      id: 1,
      icon: <AppStoreOutlined />,
    },
    {
      title: '小米MIX',
      id: 2,
      icon: <UserOutlined />,
    },
    {
      title: '手机',
      id: 3,
      icon: <SunOutlined />,
    },
    {
      title: '电脑',
      id: 4,
      icon: <PadOutlined />,
    },
  ]

  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const [currentMenu, setCurrentMenu] = React.useState<MenuDataItem>(menuData[0])
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Render</h1>
      <div
        className="menu-render__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
      >
        <Menu
          ref={menuRef}
          showCollapse
          extraHeader={
            <div style={{ padding: '10px 0' }}>
              <Search prefix={<SearchOutlined />} append={null} />
            </div>
          }
          defaultExpandedIds={[3]}
          render={(item) => {
            return (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                {item.title}
                <RightOutlined style={{ marginLeft: 4 }} />
              </div>
            )
          }}
          onClick={(id, data) => {
            console.log('click', id, data)

            setCurrentMenu(data)
            setVisible(true)
          }}
          data={menuData}
        />
        {/* 如果不需要阴影，可以设置 className 去覆盖样式 */}
        <Popper
          className="menu-render__popper"
          visible={visible}
          attachEl={menuRef.current}
          placement="right"
          gutterGap={0}
          flip={false}
          animationType="scaleX"
          onClose={() => {
            setVisible(false)
          }}
          onOutsideClick={() => console.log('onOutsideClick')}
        >
          <div
            style={{
              width: 200,
              height: menuRef.current?.getBoundingClientRect().height,
              padding: 10,
              boxSizing: 'border-box',
            }}
          >
            菜单：{currentMenu.title}
          </div>
        </Popper>
      </div>
    </>
  )
}
