import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Form, { FormSemanticName } from '../src'
import Input from '@hi-ui/input'

/**
 * @title 自定义样式
 * @desc Form 传入的 label/content 会作为所有 Form.Item 的默认样式；Form.Item 单独传入 label/content 时以 Form.Item 为准（覆盖 Form）
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<FormSemanticName | undefined>()

  const FormItem = Form.Item
  const highlightOutline = { outline: '2px solid #ffbe0a' }

  return (
    <>
      <h1>Semantic</h1>
      <div className="form-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Form
              initialValues={{ name: '', email: '' }}
              labelWidth={80}
              classNames={{
                root: 'my-form__root',
                label: 'form-default__label',
                content: 'form-default__content',
              }}
              styles={{
                root: selected === 'root' ? highlightOutline : undefined,
                label: selected === 'label' ? highlightOutline : undefined,
                content: selected === 'content' ? highlightOutline : undefined,
              }}
            >
              {/* 未传 label/content：使用 Form 下发的默认样式 */}
              <FormItem field="name" label="用户名">
                <Input placeholder="请输入" />
              </FormItem>
              {/* 传入 label/content：以 Form.Item 为准，覆盖 Form 默认 */}
              <FormItem
                field="email"
                label="邮箱"
                classNames={{
                  root: 'my-form-item__root',
                  label: 'my-form-item__label',
                  content: 'my-form-item__content',
                }}
                styles={{
                  root: selected === 'root' ? highlightOutline : undefined,
                  label: selected === 'label' ? highlightOutline : undefined,
                  content: selected === 'content' ? highlightOutline : undefined,
                }}
              >
                <Input placeholder="请输入邮箱" />
              </FormItem>
            </Form>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: 'Form 根元素（表单容器）' },
                { title: 'label', description: 'Form.Item 标签（label）' },
                { title: 'content', description: 'Form.Item 控件区域（content）' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as FormSemanticName)
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
