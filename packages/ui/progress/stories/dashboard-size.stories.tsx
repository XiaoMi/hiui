import React from 'react'
import { DashboardProgress } from '../src'

/**
 * @title 仪表盘不同尺寸
 */
export const DashboardSize = () => {
  return (
    <>
      <h1>仪表盘不同尺寸</h1>
      <div className="progress-dashboard-size__wrap">
        <div className="progress-basic__wrap">
          <DashboardProgress percent={75} size="sm" />
          <br />
          <DashboardProgress percent={75} />
          <br />
          <DashboardProgress percent={75} size="lg" />
        </div>
      </div>
    </>
  )
}
