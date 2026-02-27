import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import CheckCascader, { CheckCascaderSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 CheckCascader 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 menuList/menu/option）
 */
export const Semantic = () => {
  const [data] = React.useState(() => [
    {
      id: '手机',
      title: '手机',
      children: [
        {
          id: '小米',
          title: '小米',
          children: [
            { id: '小米3', title: '小米3' },
            { id: '小米4', title: '小米4' },
          ],
        },
        {
          id: '红米',
          title: '红米',
          children: [
            { id: '红米3', title: '红米3' },
            { id: '红米4', title: '红米4' },
          ],
        },
      ],
    },
    {
      id: '电视',
      title: '电视',
      children: [
        { id: '小米电视4A', title: '小米电视4A' },
        { id: '小米电视4C', title: '小米电视4C' },
      ],
    },
  ])

  const [selected, setSelected] = useState<CheckCascaderSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="check-cascader-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <CheckCascader
              searchable
              data={data}
              classNames={{
                root: 'my-check-cascader__root',
                container: 'my-check-cascader__container',
                panel: 'my-check-cascader__panel',
                header: 'my-check-cascader__header',
                search: 'my-check-cascader__search',
                body: 'my-check-cascader__body',
                footer: 'my-check-cascader__footer',
                menuList: 'my-check-cascader__menu-list',
                menu: 'my-check-cascader__menu',
                option: 'my-check-cascader__option',
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
                  onMouseEnter={() => setSelected(dataItem.title as CheckCascaderSemanticName)}
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
