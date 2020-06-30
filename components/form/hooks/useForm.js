import { useRef, useEffect, useState } from 'react'
import useFormInstance from './useFormInstance'
const useForm = props => {
  const [formProps, setformProps] = useState({
    ...props
  })
  const [FormWrapper, FormItem, FormInstance] = useFormInstance(formProps)
  console.log('FormInstance', FormInstance)
  return { FormWrapper, FormInstance }
}
export default useForm
