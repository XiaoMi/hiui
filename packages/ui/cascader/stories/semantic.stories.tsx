import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Cascader, { CascaderSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 Cascader 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 menuList/menu/option）
 */
export const Semantic = () => {
  const [data] = React.useState([
    {
      id: '手机',
      title: '手机t',
      children: [
        {
          id: '小米',
          title: '小米t',
          children: [
            {
              id: '小米3',
              title: '小米3t',
            },
            {
              id: '小米4',
              title: '小米4t',
            },
          ],
        },
        {
          id: '红米',
          title: '红米t',
          children: [
            {
              id: '红米3',
              title: '红米3t',
            },
            {
              id: '红米4',
              title: '红米4t',
            },
          ],
        },
      ],
    },
    {
      id: '电视',
      title: '电视t',
      children: [
        {
          id: '小米电视4A',
          title: '小米电视4At',
        },
        {
          id: '小米电视4C',
          title: '小米电视4Ct',
        },
      ],
    },
  ])

  const [selected, setSelected] = useState<CascaderSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="cascader-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Cascader
              visible
              searchable
              data={data}
              classNames={{
                root: 'my-cascader__root',
                container: 'my-cascader__container',
                panel: 'my-cascader__panel',
                header: 'my-cascader__header',
                search: 'my-cascader__search',
                body: 'my-cascader__body',
                footer: 'my-cascader__footer',
                menuList: 'my-cascader__menu-list',
                menu: 'my-cascader__menu',
                option: 'my-cascader__option',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
                panel: {
                  overflow: 'unset',
                  ...(selected === 'panel'
                    ? {
                        outline: '1px solid #ffbe0a',
                      }
                    : {}),
                },
                body: {
                  overflow: 'unset',
                  ...(selected === 'body'
                    ? {
                        outline: '1px solid #ffbe0a',
                      }
                    : {}),
                },
                menuList: {
                  overflow: 'unset',
                  ...(selected === 'menuList'
                    ? {
                        outline: '1px solid #ffbe0a',
                      }
                    : {}),
                },
              }}
              renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
              renderExtraFooter={() => 'custom footer'}
              // @ts-ignore
              overlay={{ flip: false }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'container', description: '下拉容器' },
                { title: 'panel', description: '下拉面板' },
                { title: 'header', description: '头部' },
                { title: 'search', description: '搜索区' },
                { title: 'body', description: '内容区' },
                { title: 'footer', description: '底部' },
                { title: 'menuList', description: '菜单列表容器' },
                { title: 'menu', description: '单列菜单' },
                { title: 'option', description: '选项' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as CascaderSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
