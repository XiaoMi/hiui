import React from 'react'
import { MenuDataItem, MenuSearch, MenuSearchHelper } from '../src'
import { AppStoreOutlined, UserOutlined, SunOutlined, PadOutlined } from '@hi-ui/icons'
import Popper from '@hi-ui/popper'
import Button from '@hi-ui/button'

/**
 * @title 菜单搜索
 * @desc 当导航的菜单项和层级较多时适用，可收起
 */
export const MenuSearchDemo = () => {
  const [data] = React.useState<MenuDataItem[]>([
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
    {
      title: '超长超长超长字符超长超长超长字符',
      id: 4,
      icon: <PadOutlined />,
    },
  ])

  const [visible, setVisible] = React.useState(false)
  const [value, setValue] = React.useState('')
  const ref = React.useRef<HTMLButtonElement>(null)
  const searchRef = React.useRef<MenuSearchHelper>(null)

  return (
    <>
      <h1>MenuSearch</h1>
      <div
        className="menu-search__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
      >
        <h2>内联式</h2>
        <MenuSearch data={data} placeholder="搜索" onSelect={(id, item) => console.log(id, item)} />
        <br />
        <br />
        <h2>弹出式</h2>
        <Button
          ref={ref}
          onClick={() => {
            setVisible(true)
          }}
        >
          打开
        </Button>
        <Popper
          styles={{
            container: {
              borderRadius: 8,
            },
          }}
          visible={visible}
          attachEl={ref.current}
          gutterGap={-32}
          unmountOnClose={false}
          onOutsideClick={() => {
            setVisible(false)
          }}
          onEntered={() => {
            if (visible) {
              searchRef.current?.focus()

              if (value) {
                searchRef.current?.show()
              }
            }
          }}
        >
          <MenuSearch
            innerRef={searchRef}
            width={360}
            value={value}
            onChange={setValue}
            data={data}
            placeholder="搜索"
            onSelect={(id, item) => {
              console.log('select', id, item)
              setVisible(false)
            }}
            onClear={() => {
              setValue('')
            }}
            onClose={() => {
              setVisible(false)
            }}
            onEsc={() => {
              setVisible(false)
            }}
          />
        </Popper>
      </div>
    </>
  )
}
