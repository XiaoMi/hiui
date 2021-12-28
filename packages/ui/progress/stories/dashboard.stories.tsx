import React from 'react'
import { DashboardProgress } from '../src'
import { CheckOutlined, CloseOutlined, ExclamationOutlined } from '@hi-ui/icons'

export const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="progress-dashboard__wrap">
        <DashboardProgress content="成功" percent={80} />

        <DashboardProgress
          type="success"
          content={<CheckOutlined style={{ fontSize: '20px' }} />}
          percent={100}
        />

        <DashboardProgress
          type="warning"
          content={<CloseOutlined style={{ fontSize: '20px' }} />}
          percent={50}
        />

        <DashboardProgress
          type="danger"
          content={<ExclamationOutlined style={{ fontSize: '20px' }} />}
          percent={20}
        />
        <DashboardProgress percent={75} />
      </div>
    </>
  )
}
