import React from 'react'
import PageHeader from '../src'
import Space from '@hi-ui/space'
import Dropdown from '@hi-ui/dropdown'
import Button from '@hi-ui/button'
import { EllipsisOutlined, PlusOutlined } from '@hi-ui/icons'

/**
 * @title 带面包屑
 */
export const Breadcrumb = () => {
  return (
    <>
      <h1>Breadcrumb</h1>
      <div className="page-header-breadcrumb__wrap">
        <PageHeader
          style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
          title="页面标题"
          breadcrumb={{
            data: [
              {
                title: '首页',
                href: '/',
              },
              {
                title: '列表',
                href: '/',
              },
              {
                title: '手机详情',
                href: '/',
              },
            ],
            // separator: '/',
            onClick: (evt, item) => {
              console.log('get item: ', item)
            },
          }}
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
