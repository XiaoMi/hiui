import React from 'react'
import EmptyState from '../src'

export const Basic = () => {
  return (
    <>
      <h1>EmptyState</h1>
      <div className="empty-state-basic__wrap">
        <EmptyState title="No Data" subtitle="description..." />
      </div>
    </>
  )
}
