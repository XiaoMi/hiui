import React, { useContext } from 'react'
import { LocaleContext } from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const i18n = useContext(LocaleContext)

  return (
    <>
      <h1>Basic</h1>
      <div className="locale-context-basic__wrap">{i18n.get('datePicker.ok')}</div>
    </>
  )
}
