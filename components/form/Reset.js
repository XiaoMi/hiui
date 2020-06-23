import React, { useContext } from 'react'

import { FormContext } from './Form'
import Button from '../button'

const Reset = props => {
  const { children = 'reset', onClick, fields } = props
  const { resetValidates } = useContext(FormContext)
  const submit = () => {
    onClick && resetValidates(onClick, fields)
  }
  return (
    <Button {...props} onClick={submit}>
      {children}
    </Button>
  )
}
export default Reset
