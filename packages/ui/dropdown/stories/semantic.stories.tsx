import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Dropdown, { DropdownSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<DropdownSemanticName>()
  const [list] = React.useState([
    {
      id: 0,
      title: '小米商城',
      href: 'https://www.mi.com',
    },
    {
      id: 1,
      title: '菜单二',
    },
    {
      id: 2,
      title: '菜单三',
    },
    {
      id: 3,
      title: '菜单四',
    },
    {
      id: 4,
      title: '菜单五',
    },
  ])

  return (
    <>
      <h1>Semantic</h1>
      <div className="dropdown-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Dropdown
              data={list}
              title="鼠标点击"
              trigger="click"
              onClick={console.log}
              classNames={{
                root: 'my-dropdown__root',
                trigger: 'my-dropdown__trigger',
                menu: 'my-dropdown__menu',
                menuItem: 'my-dropdown__menuItem',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              // @ts-ignore
              overlay={{ flip: false }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                {
                  title: 'root',
                  description: '根元素',
                },
                {
                  title: 'trigger',
                  description: '触发按钮',
                },
                {
                  title: 'menu',
                  description: '下拉菜单',
                },
                {
                  title: 'menuItem',
                  description: '菜单项',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as DropdownSemanticName)
                    }}
                    onMouseLeave={() => {
                      setSelected(undefined)
                    }}
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
