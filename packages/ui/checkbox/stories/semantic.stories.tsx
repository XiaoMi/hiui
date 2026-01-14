import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Checkbox, { CheckboxGroup } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<'root' | 'input' | 'icon' | 'text'>()
  const [selectedList, setSelectedList] = React.useState<React.ReactText[]>(['Phone'])

  return (
    <>
      <h1>Semantic</h1>
      <div className="checkbox-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <h2>普通用法</h2>
            <Checkbox
              classNames={{
                root: 'my-checkbox__root',
                icon: 'my-checkbox__icon',
                text: 'my-checkbox__text',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              复选框
            </Checkbox>
            <h2>成组用法</h2>
            <CheckboxGroup
              data={[
                {
                  title: '手机',
                  id: 'Phone',
                },
                {
                  title: '电脑',
                  id: 'Computer',
                },
                {
                  title: '智能',
                  id: 'Intelli',
                },
                {
                  title: '出行',
                  id: 'Transfer',
                  disabled: true,
                },
              ]}
              checkboxClassNames={{
                root: 'my-checkbox-group__item',
                icon: 'my-checkbox-group__item-icon',
                text: 'my-checkbox-group__item-text',
              }}
              checkboxStyles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              value={selectedList}
              onChange={(value) => {
                setSelectedList(value)
              }}
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
                  title: 'icon',
                  description: '图标元素',
                },
                {
                  title: 'text',
                  description: '文本元素',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as any)
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
