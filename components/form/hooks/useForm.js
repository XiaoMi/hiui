import { useCallback } from 'react'
import useFormInstance from './useFormInstance'

const useForm = () => {
  const { FormWrapper, FormInstance: formRef, FormItem } = useFormInstance()
  const { current } = formRef
  const validate = useCallback(
    (cb, validate) => {
      const { validate: formValidate } = formRef.current
      formValidate(cb, validate)
    },
    [current]
  )
  const resetValidates = useCallback(
    (cb, resetNames, toDefault) => {
      const { resetValidates } = formRef.current

      resetValidates(cb, resetNames, toDefault)
    },
    [current]
  )
  const setFieldsValue = useCallback(
    values => {
      formRef.current.setFieldsValue(values)
    },
    [current]
  )
  const validateField = useCallback(
    (field, cb) => {
      formRef.current.validateField(field, cb)
    },
    [current]
  )
  return {
    FormWrapper,
    FormItem,
    FormInstance: { validate, setFieldsValue, resetValidates, validateField }
  }
}
export default useForm
