import { useCallback, useReducer, useRef } from 'react'
import { FormAction, FormState, FormFieldCollection } from './types'
import { setProp } from './utils'

const EMPTY_ERRORS = {}
const EMPTY_TOUCHED = {}

const basicRulesTable = []

export const useForm = ({
  initialValues,
  initialErrors,
  initialTouched,
  onValuesChange,
  onSubmit,
  onReset,
  rules,
  validateOnBlur,
  validateOnChange,
}) => {
  const [formState, formDispatch] = useReducer(formReducer, {
    values: initialValues,
    errors: initialErrors || EMPTY_ERRORS,
    touched: initialTouched || EMPTY_TOUCHED,
    isValidating: false,
  })

  const setFieldValue = useCallback(() => {}, [])
  const setFieldError = useCallback(() => {}, [])
  const setFieldTouched = useCallback(() => {}, [])

  // const onValuesChange = useCallback(() => {}, [])

  const handleFieldChange = useCallback(() => {}, [])
  const handleFieldBlur = useCallback(() => {}, [])

  const resetForm = useCallback(() => {}, [])

  const resetValidations = useCallback(() => {}, [])

  const validateField = useCallback(() => {}, [])

  const validateAll = useCallback(() => {}, [])

  const getFieldProps = useCallback(() => {}, [])

  // fields 收集器
  const fieldCollectionRef = useRef<FormFieldCollection>({})

  const registerField = useCallback((fieldName: string, { validate, rules }: any) => {
    fieldCollectionRef.current[fieldName] = {
      validate,
    }
  }, [])

  const unregisterField = useCallback((fieldName: string) => {
    delete fieldCollectionRef.current[fieldName]
  }, [])

  const getFieldRules = useCallback(
    (fieldName: string) => {
      return rules[fieldName]
    },
    [rules]
  )

  return {
    ...formState,
    getFieldRules,
    getFieldProps,
    registerField,
    unregisterField,
  }
}

function formReducer<T>(state: FormState<T>, msg: FormAction<T>) {
  switch (msg.type) {
    case 'SET_VALUES':
      return { ...state, values: msg.payload }
    case 'SET_TOUCHED':
      return { ...state, touched: msg.payload }
    case 'SET_ERRORS':
      return { ...state, errors: msg.payload }
    case 'SET_STATUS':
      return { ...state, status: msg.payload }
    case 'SET_ISSUBMITTING':
      return { ...state, isSubmitting: msg.payload }
    case 'SET_ISVALIDATING':
      return { ...state, isValidating: msg.payload }
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        values: setProp(state.values, msg.payload.field, msg.payload.value),
      }
    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        touched: setProp(state.touched, msg.payload.field, msg.payload.value),
      }
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: setProp(state.errors, msg.payload.field, msg.payload.value),
      }
    case 'RESET_FORM':
      return { ...state, ...msg.payload }
    case 'SET_FORMIK_STATE':
      return msg.payload(state)
    // case 'SUBMIT_ATTEMPT':
    //   return {
    //     ...state,
    //     touched: setNestedObjectValues<FormikTouched<Values>>(state.values, true),
    //     isSubmitting: true,
    //     submitCount: state.submitCount + 1,
    //   }
    case 'SUBMIT_FAILURE':
      return {
        ...state,
        isSubmitting: false,
      }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
      }
    default:
      return state
  }
}
