import React from 'react'
import { DashboardProgress } from '../src'
import { CheckOutlined, CloseOutlined, ExclamationOutlined } from '@hi-ui/icons'

/**
 * @title 仪表盘用法
 * @desc 设置组件和进度条的配合使用
 */
export const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <div
        className="progress-dashboard__wrap"
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}
      >
        <DashboardProgress content="成功" percent={80} />

        <DashboardProgress
          type="success"
          content={<CheckOutlined style={{ fontSize: '20px' }} />}
          percent={100}
        />

        <DashboardProgress
          type="warning"
          content={<ExclamationOutlined style={{ fontSize: '20px' }} />}
          percent={50}
        />

        <DashboardProgress
          type="error"
          content={<CloseOutlined style={{ fontSize: '20px' }} />}
          percent={20}
        />
        <DashboardProgress percent={75} />
      </div>
    </>
  )
}
