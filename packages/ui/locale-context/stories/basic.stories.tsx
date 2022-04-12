import React, { useContext } from 'react'
import { LocaleContext } from '../src'

export const Basic = () => {
  const i18n = useContext(LocaleContext)

  return (
    <>
      <h1>Basic</h1>
      <div className="locale-context-basic__wrap">{i18n.get('datePicker.ok')}</div>
    </>
  )
}
