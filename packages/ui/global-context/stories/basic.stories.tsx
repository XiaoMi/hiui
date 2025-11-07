import React, { useContext } from 'react'
import { GlobalContext } from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  useContext(GlobalContext)

  return (
    <>
      <h1>Basic</h1>
      <div className="global-context-basic__wrap"></div>
    </>
  )
}
