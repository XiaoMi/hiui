import React from 'react'
import { DashboardProgress } from '../src'

/**
 * @title 仪表盘不同尺寸
 */
export const DashboardSize = () => {
  return (
    <>
      <h1>仪表盘不同尺寸</h1>
      <div
        className="progress-dashboard-size__wrap"
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}
      >
        <DashboardProgress percent={75} size="sm" />
        <DashboardProgress percent={75} />
        <DashboardProgress percent={75} size="lg" />
      </div>
    </>
  )
}
