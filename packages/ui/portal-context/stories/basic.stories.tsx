import React, { useContext } from 'react'
import { PortalContext } from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  useContext(PortalContext)

  return (
    <>
      <h1>Basic</h1>
      <div className="portal-context-basic__wrap"></div>
    </>
  )
}
