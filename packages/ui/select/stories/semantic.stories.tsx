import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Select, { SelectSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 Select 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 option/optionGroup）
 */
export const Semantic = () => {
  const [data] = React.useState([
    {
      groupId: 'redmi',
      groupTitle: '红米手机',
      children: [
        { title: '红米 5A', id: '3' },
        { title: '红米 6A', id: '2' },
        { title: '红米 note', id: '4' },
        { title: '红米 note8', id: '5' },
      ],
    },
    {
      groupId: 'mi',
      groupTitle: '小米电视',
      children: [
        { title: '小米电视4A 60寸', id: '10' },
        { title: '小米电视E55A', id: '11' },
        { title: '小米电视E65A', id: '12' },
        { title: '小米电视4S', id: '13' },
        { title: '小米电视4C', id: '14' },
      ],
    },
  ])

  const [selected, setSelected] = useState<SelectSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="select-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Select
              style={{ width: 240 }}
              searchable
              visible
              data={data}
              classNames={{
                root: 'my-select__root',
                container: 'my-select__container',
                panel: 'my-select__panel',
                header: 'my-select__header',
                search: 'my-select__search',
                body: 'my-select__body',
                footer: 'my-select__footer',
                option: 'my-select__option',
                optionGroup: 'my-select__option-group',
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
                { title: 'option', description: '选项' },
                { title: 'optionGroup', description: '选项组' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as SelectSemanticName)}
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
