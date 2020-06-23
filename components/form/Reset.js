import React, { useContext } from 'react'

import { FormContext } from './Form'
import Button from '../button'

const Reset = props => {
  const { children = 'reset', onClick, fields: resetNames } = props
  const { resetValidates } = useContext(FormContext)
  const reset = () => {
    resetValidates(onClick, resetNames)
  }
  return (
    <Button {...props} onClick={reset}>
      {children}
    </Button>
  )
}
export default Reset
