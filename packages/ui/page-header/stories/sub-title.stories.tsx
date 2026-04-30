import React from 'react'
import PageHeader from '../src'
import { InfoCircleOutlined } from '@hi-ui/icons'
import Space from '@hi-ui/space'
import Tag from '@hi-ui/tag'
import Tooltip from '@hi-ui/tooltip'

/**
 * @title 副标题
 */
export const SubTitle = () => {
  return (
    <>
      <h1>SubTitle</h1>
      <div className="page-header-sub-title__wrap">
        <PageHeader
          style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
          title="页面标题"
          subTitle={
            <Tooltip title="提示信息">
              <InfoCircleOutlined />
            </Tooltip>
          }
        />
        <br />
        <br />
        <PageHeader
          style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
          title="页面标题"
          subTitle={
            <Space size="sm">
              <Tag size="sm" type="primary">
                标签
              </Tag>
              <Tag size="sm" type="primary">
                标签
              </Tag>
            </Space>
          }
        />
      </div>
    </>
  )
}
