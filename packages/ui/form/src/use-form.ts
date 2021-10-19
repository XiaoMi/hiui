import React, { useCallback, useMemo, useReducer, useRef } from 'react'
import { FormAction, FormState, FormFieldCollection } from './types'
import { setProp } from './utils'

const EMPTY_ERRORS = {}
const EMPTY_TOUCHED = {}
const EMPTY_RULES = {} as any

const basicRulesTable = []

export const useForm = ({
  initialValues,
  initialErrors = EMPTY_ERRORS,
  initialTouched = EMPTY_TOUCHED,
  rules = EMPTY_RULES,
  validateOnBlur = false,
  validateOnChange = false,
  validateAfterTouched = true,
  onValuesChange,
  onSubmit,
  onReset,
}) => {
  const [fieldValidationCollectionRef, registerField, unregisterField] = useCollection<
    FormFieldCollection
  >()

  const validateField = useCallback(
    (field: string, value: unknown) => {
      const fieldValidation = fieldValidationCollectionRef.current.get(field)
      if (fieldValidation) {
        fieldValidation.validate(value)
      }
    },
    [fieldValidationCollectionRef]
  )

  const [formState, formDispatch] = useReducer(formReducer, {
    values: initialValues,
    errors: initialErrors,
    touched: initialTouched,
    isValidating: false,
  })

  const setFieldValue = useCallback(
    (field, value, shouldValidate?: boolean) => {
      formDispatch({
        type: 'SET_FIELD_VALUE',
        payload: {
          field,
          value,
        },
      })

      if (shouldValidate) {
        validateField(field, value)
      }
    },
    [validateField]
  )

  const setFieldError = useCallback((field: string, value: string | undefined) => {
    formDispatch({
      type: 'SET_FIELD_ERROR',
      payload: { field, value },
    })
  }, [])

  const setFieldTouched = useCallback(() => {}, [])

  // const onValuesChange = useCallback(() => {}, [])

  const handleFieldChange = useCallback(
    (fieldName: string, callback: Function) => (evt: React.ChangeEvent<any>) => {
      const nextValue = evt.target.value
      // TODO: callAllMethods for callback
      setFieldValue(fieldName, nextValue)
      callback?.(evt)
    },
    [setFieldValue]
  )

  const handleFieldBlur = useCallback((fieldName: string, callback: Function) => {}, [])

  const resetForm = useCallback(() => {
    //
  }, [])

  const resetValidations = useCallback(() => {}, [])

  const validateAll = useCallback(() => {}, [])

  const clearErrors = useCallback(() => {}, [])

  const getFieldProps = useCallback(
    (props: any, ref: any) => {
      const { field, rules, valuePropName, valueTrigger, onChange, onBlur, ...rest } = props

      return {
        ...rest,
        ref,
        value: formState.values[field],
        onChange: handleFieldChange(field, onChange),
        onBlur: handleFieldBlur(field, onBlur),
      }
    },
    [formState, handleFieldChange, handleFieldBlur]
  )

  const getFieldRules = useCallback(
    (fieldName: string) => {
      return rules[fieldName]
    },
    [rules]
  )

  return {
    ...formState,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    getFieldRules,
    getFieldProps,
    registerField,
    unregisterField,
  }
}

function formReducer<T>(state: FormState<T>, action: FormAction<T>) {
  switch (action.type) {
    case 'SET_VALUES':
      return { ...state, values: action.payload }
    case 'SET_ERRORS':
      return { ...state, errors: action.payload }
    case 'SET_TOUCHED':
      return { ...state, touched: action.payload }
    case 'SET_SUBMITTING':
      return { ...state, submitting: action.payload }
    case 'SET_VALIDATING':
      return { ...state, validating: action.payload }
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        values: setProp(state.values, action.payload.field, action.payload.value),
      }
    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        touched: setProp(state.touched, action.payload.field, action.payload.value),
      }
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: setProp(state.errors, action.payload.field, action.payload.value),
      }
    case 'SET_FORM':
      return { ...state, ...action.payload }
    case 'SUBMIT_DONE':
      return {
        ...state,
        submitting: false,
      }
    default:
      return state
  }
}

/**
 * 一个注册表的收集器
 */
const useCollection = <T>() => {
  const collectionMp = useMemo(() => new Map(), [])
  const collectionRef = useRef<Map<string, T>>(collectionMp)

  const register = useCallback((key: string, value: T) => {
    collectionRef.current.set(key, value)
  }, [])

  const unregister = useCallback((key: string) => {
    collectionRef.current.delete(key)
  }, [])
  return [collectionRef, register, unregister] as const
}
