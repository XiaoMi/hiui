import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Menu, {
  GroupMenu,
  SideMenu,
  MenuSearch,
  MenuSemanticName,
  GroupMenuSemanticName,
  SideMenuSemanticName,
  MenuSearchSemanticName,
} from '../src'
import { AppStoreFilled, SunFilled } from '@hi-ui/icons'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuSemanticName>()
  const [selectedGroupMenu, setSelectedGroupMenu] = useState<GroupMenuSemanticName>()
  const [selectedSideMenu, setSelectedSideMenu] = useState<SideMenuSemanticName>()
  const [selectedMenuSearch, setSelectedMenuSearch] = useState<MenuSearchSemanticName>()
  const menuData = [
    {
      title: '首页',
      id: 1,
      icon: <AppStoreFilled />,
    },
    {
      title: '手机',
      id: 3,
      icon: <SunFilled />,
      children: [
        {
          title: '小米',
          id: 666,
          children: [
            {
              title: '小米9',
              id: 'xiaomi9',
            },
            {
              title: '小米8',
              id: 'xiaomi8',
              disabled: true,
            },
            {
              title: '小米7',
              id: 'xiaomi7',
            },
            {
              title: '小米6',
              id: 'xiaomi6',
            },
            {
              title: '小米5',
              id: 'xiaomi5',
            },
            {
              title: '小米4',
              id: 'xiaomi4',
            },
            {
              title: '小米3',
              id: 'xiaomi3',
            },
          ],
        },
        {
          title: '红米',
          id: 'hongmi',
        },
        {
          title: '小米note',
          disabled: true,
          id: 'xiaominote',

          children: [
            {
              title: '小米 note7',
              id: 'xiaomi note7',
            },
            {
              title: '小米 note6',
              id: 'xiaomi note6',
            },
            {
              title: '小米 note5',
              id: 'xiaomi note5',
            },
            {
              title: '小米 note4',
              id: 'xiaomi note4',
            },
            {
              title: '小米 note3',
              id: 'xiaomi note3',
            },
          ],
        },
      ],
    },
  ]

  return (
    <>
      <h1>Semantic</h1>
      <div
        className="menu-semantic__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 400 }}
      >
        <h2>Menu</h2>
        <Row gutter={12}>
          <Col span={18}>
            <Menu
              showCollapse
              defaultExpandAll
              data={menuData}
              classNames={{
                root: 'my-menu__root',
                wrapper: 'my-menu__wrapper',
                footer: 'my-menu__footer',
                toggle: 'my-menu__toggle',
                item: 'my-menu__item',
                itemInner: 'my-menu__item-inner',
                itemIcon: 'my-menu__item-icon',
                itemContent: 'my-menu__item-content',
                itemArrow: 'my-menu__item-arrow',
                submenu: 'my-menu__submenu',
                popmenu: 'my-menu__popmenu',
              }}
              styles={{
                ...(selectedMenu ? { [selectedMenu]: { outline: '2px solid #ffbe0a' } } : {}),
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'wrapper', description: '菜单列表容器' },
                { title: 'footer', description: '底部区域' },
                { title: 'toggle', description: '收起/展开开关' },
                { title: 'item', description: '菜单项' },
                { title: 'itemInner', description: '菜单项内层' },
                { title: 'itemIcon', description: '菜单项图标' },
                { title: 'itemContent', description: '菜单项内容' },
                { title: 'itemArrow', description: '菜单项箭头' },
                { title: 'submenu', description: '内联子菜单列表' },
                { title: 'popmenu', description: '弹出子菜单列表' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => setSelectedMenu(dataItem.title as MenuSemanticName)}
                    onMouseLeave={() => setSelectedMenu(undefined)}
                  >
                    <List.Item {...dataItem} />
                  </div>
                )
              }}
            />
          </Col>
        </Row>
        <h2>GroupMenu</h2>
        <Row gutter={12}>
          <Col span={18}>
            <GroupMenu
              style={{ width: 240, background: '#fff' }}
              classNames={{
                root: 'my-group-menu__root',
                wrapper: 'my-group-menu__wrapper',
                item: 'my-group-menu__item',
                itemContent: 'my-group-menu__item-content',
                itemIcon: 'my-group-menu__item-icon',
                itemTitle: 'my-group-menu__item-title',
              }}
              styles={{
                ...(selectedGroupMenu
                  ? { [selectedGroupMenu]: { outline: '2px solid #ffbe0a' } }
                  : {}),
              }}
              data={menuData}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'wrapper', description: '滚动区域' },
                { title: 'item', description: '菜单项' },
                { title: 'itemContent', description: '菜单项内容区' },
                { title: 'itemIcon', description: '菜单项图标' },
                { title: 'itemTitle', description: '菜单项标题' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() =>
                      setSelectedGroupMenu(dataItem.title as GroupMenuSemanticName)
                    }
                    onMouseLeave={() => setSelectedGroupMenu(undefined)}
                  >
                    <List.Item {...dataItem} />
                  </div>
                )
              }}
            />
          </Col>
        </Row>
        <h2>SideMenu</h2>
        <Row gutter={12}>
          <Col span={18}>
            <SideMenu
              data={menuData}
              style={{ width: 200, background: '#fff' }}
              classNames={{
                root: 'my-side-menu__root',
                wrapper: 'my-side-menu__wrapper',
                itemWrapper: 'my-side-menu__item-wrapper',
                item: 'my-side-menu__item',
                itemIcon: 'my-side-menu__item-icon',
                itemTitle: 'my-side-menu__item-title',
              }}
              styles={{
                ...(selectedSideMenu
                  ? { [selectedSideMenu]: { outline: '2px solid #ffbe0a' } }
                  : {}),
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'wrapper', description: '滚动区域' },
                { title: 'itemWrapper', description: '菜单项外层包裹' },
                { title: 'item', description: '菜单项' },
                { title: 'itemIcon', description: '菜单项图标' },
                { title: 'itemTitle', description: '菜单项标题' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => setSelectedSideMenu(dataItem.title as SideMenuSemanticName)}
                    onMouseLeave={() => setSelectedSideMenu(undefined)}
                  >
                    <List.Item {...dataItem} />
                  </div>
                )
              }}
            />
          </Col>
        </Row>
        <h2>MenuSearch</h2>
        <Row gutter={12}>
          <Col span={18}>
            <MenuSearch
              data={menuData}
              defaultValue="小米"
              classNames={{
                root: 'my-menu-search__root',
                inputWrapper: 'my-menu-search__input-wrapper',
                input: 'my-menu-search__input',
                inputClear: 'my-menu-search__input-clear',
                close: 'my-menu-search__close',
                content: 'my-menu-search__content',
                header: 'my-menu-search__header',
                list: 'my-menu-search__list',
                listItem: 'my-menu-search__list-item',
                listItemTitle: 'my-menu-search__list-item-title',
                empty: 'my-menu-search__empty',
                footer: 'my-menu-search__footer',
                footerItem: 'my-menu-search__footer-item',
                footerItemIcon: 'my-menu-search__footer-item-icon',
                footerItemText: 'my-menu-search__footer-item-text',
              }}
              styles={{
                ...(selectedMenuSearch
                  ? { [selectedMenuSearch]: { outline: '2px solid #ffbe0a' } }
                  : {}),
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'inputWrapper', description: '输入区外层' },
                { title: 'input', description: '输入框' },
                { title: 'inputClear', description: '清空按钮' },
                { title: 'close', description: '关闭按钮' },
                { title: 'content', description: '结果内容区' },
                { title: 'header', description: '结果标题' },
                { title: 'list', description: '结果列表' },
                { title: 'listItem', description: '结果项' },
                { title: 'listItemTitle', description: '结果项标题' },
                { title: 'empty', description: '无结果提示' },
                { title: 'footer', description: '底部快捷键区' },
                { title: 'footerItem', description: '快捷键项' },
                { title: 'footerItemIcon', description: '快捷键图标' },
                { title: 'footerItemText', description: '快捷键文案' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() =>
                      setSelectedMenuSearch(dataItem.title as MenuSearchSemanticName)
                    }
                    onMouseLeave={() => setSelectedMenuSearch(undefined)}
                  >
                    <List.Item {...dataItem} />
                  </div>
                )
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
