import React, { useEffect, useRef, forwardRef } from 'react'
import Provider from '../../context'
import Form from '../Form'
import FormItem from '../Item'
const FormWrapper = Provider(Form)

const useFormInstance = ({ formProps, _types }) => {
  const formRef = useRef()
  let FormInstance
  useEffect(() => {
    FormInstance = formRef.current
  }, [formProps])
  const FormWrappers = forwardRef((props, formRef) => {
    return <FormWrapper {...props} ref={formRef} />
  })
  return [FormWrappers, FormItem, FormInstance]
}
export default useFormInstance
