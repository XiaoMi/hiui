import React, { useRef, forwardRef } from 'react'
import Provider from '../../context'
import Form from '../Form'
import FormItem from '../Item'
const FormComponent = Provider(Form)

const useFormInstance = () => {
  const formRef = useRef()
  let FormInstance = formRef

  const FormWrapper = forwardRef((props, ref) => {
    return <FormComponent {...props} ref={formRef} />
  })
  return { FormWrapper, FormInstance, FormItem }
}
export default useFormInstance
