import React, { useContext, useState, useEffect, useCallback } from 'react'

import { FormContext } from './Form'
import Button from '../button'
const prefixCls = 'hi-form'

const Submit = props => {
  const { children = 'submit', onClick } = props
  const {
    updateFieldValue,
    formProps,
    removeField,
    initFields,
    fields
  } = useContext(FormContext)
  return (
    <div className={`${prefixCls}-submit`}>
      <Button
        {...props}
        onClick={() => {
          console.log(fields)
          onClick && onClick('12')
        }}
      >
        {children}
      </Button>
    </div>
  )
}
export default Submit
