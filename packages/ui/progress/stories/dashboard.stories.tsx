import React from 'react'
import { DashboardProgress } from '../src'

export const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="progress-dashboard__wrap">
        <DashboardProgress radius={48} percent={70}></DashboardProgress>
      </div>
    </>
  )
}
