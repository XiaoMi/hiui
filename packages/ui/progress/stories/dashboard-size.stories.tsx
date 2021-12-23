import React from 'react'
import { DashboardProgress } from '../src'

export const DashboardSize = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="progress-dashboard__wrap">
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
