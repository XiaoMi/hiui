import React from 'react'
import PageHeader from '../src'
import { EllipsisOutlined, PlusOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import Space from '@hi-ui/space'
import Dropdown from '@hi-ui/dropdown'

/**
 * @title 额外元素
 */
export const Extra = () => {
  return (
    <>
      <h1>Extra</h1>
      <div className="page-header-extra__wrap">
        <PageHeader
          style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
          title="页面标题"
          extra={
            <Space>
              <Dropdown
                data={[
                  { id: 'add', title: '添加' },
                  { id: 'edit', title: '编辑' },
                  { id: 'delete', title: '删除' },
                ]}
                width={80}
              >
                <Button appearance="line" icon={<EllipsisOutlined />} />
              </Dropdown>
              <Button type="primary" appearance="line">
                次要操作
              </Button>
              <Button type="primary" icon={<PlusOutlined />}>
                主操作
              </Button>
            </Space>
          }
        />
      </div>
    </>
  )
}
