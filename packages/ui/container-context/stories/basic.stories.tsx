import React, { useContext } from 'react'
import { ContainerContext } from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const container = useContext(ContainerContext)

  return (
    <>
      <h1>Basic</h1>
      <div className="locale-context-basic__wrap">{container}</div>
    </>
  )
}
