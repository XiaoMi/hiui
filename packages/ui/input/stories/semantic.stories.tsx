// AIGC START
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Input from '../src'
import type { InputSemanticName } from '../src/Input'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<InputSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="input-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Input
              placeholder="请输入内容"
              prefix="前缀"
              suffix="后缀"
              prepend="前置"
              append="后置"
              clearable
              classNames={{
                root: 'my-input__root',
                outer: 'my-input__outer',
                inner: 'my-input__inner',
                input: 'my-input__input',
                prefix: 'my-input__prefix',
                suffix: 'my-input__suffix',
                prepend: 'my-input__prepend',
                append: 'my-input__append',
                clear: 'my-input__clear',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
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
                  title: 'outer',
                  description: '外层容器',
                },
                {
                  title: 'inner',
                  description: '内层容器',
                },
                {
                  title: 'input',
                  description: '输入框元素',
                },
                {
                  title: 'prefix',
                  description: '前缀元素',
                },
                {
                  title: 'suffix',
                  description: '后缀元素',
                },
                {
                  title: 'prepend',
                  description: '前置外部内容',
                },
                {
                  title: 'append',
                  description: '后置外部内容',
                },
                {
                  title: 'clear',
                  description: '清除按钮',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as InputSemanticName)
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
// AIGC END
