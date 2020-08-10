import React, { useRef, forwardRef } from 'react'
import Provider from '../../context'
import Form from '../Form'
import FormItem from '../Item'
import FormReset from '../Reset'
import FormSubmit from '../Submit'
const FormComponent = Provider(Form)

const useFormInstance = () => {
  const formRef = useRef()
  let FormInstance = formRef
  const FormWrapper = forwardRef((props, ref) => {
    return <FormComponent {...props} ref={formRef} />
  })
  return { FormWrapper, FormInstance, FormItem, FormReset, FormSubmit }
}
export default useFormInstance
