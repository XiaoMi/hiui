import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import Picker, { PickerSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 Picker 各元素进行细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<PickerSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="picker-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Picker
              visible
              searchable
              creatableInSearch
              trigger={<Button>打开选择器</Button>}
              header="头部内容"
              footer="底部内容"
              classNames={{
                root: 'my-picker__root',
                container: 'my-picker__container',
                panel: 'my-picker__panel',
                header: 'my-picker__header',
                search: 'my-picker__search',
                body: 'my-picker__body',
                footer: 'my-picker__footer',
                loading: 'my-picker__loading',
                empty: 'my-picker__empty',
                creator: 'my-picker__creator',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              <div>选项内容</div>
            </Picker>
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
                { title: 'loading', description: '加载中' },
                { title: 'empty', description: '空状态' },
                { title: 'creator', description: '创建选项' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as PickerSemanticName)}
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
