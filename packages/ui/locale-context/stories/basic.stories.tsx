import React, { useContext } from 'react'
import { LocaleContext } from '../src'

export const Basic = () => {
  const { datePicker } = useContext(LocaleContext)
  return (
    <>
      <h1>Basic</h1>
      <div className="locale-context-basic__wrap">{datePicker.ok}</div>
    </>
  )
}
