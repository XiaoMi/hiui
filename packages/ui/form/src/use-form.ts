import React, { useCallback, useMemo, useReducer, useRef } from 'react'
import { FormAction, FormState, FormFieldCollection, FormErrors } from './types'
import { setProp } from './utils'
import { useLatestRef } from '@hi-ui/use-latest'
import { isFunction } from '@hi-ui/type-assertion'

const EMPTY_ERRORS = {}
const EMPTY_TOUCHED = {}
const EMPTY_RULES = {} as any

export const useForm = ({
  initialValues,
  initialErrors = EMPTY_ERRORS,
  initialTouched = EMPTY_TOUCHED,
  rules = EMPTY_RULES,
  validateOnBlur = true,
  validateOnChange = true,
  validateAfterTouched = true,
  onValuesChange,
  onSubmit,
  onReset,
}: UseFormProps) => {
  const [fieldValidationCollectionRef, registerField, unregisterField] = useCollection<
    FormFieldCollection
  >()

  const [formState, formDispatch] = useReducer(formReducer, {
    values: initialValues,
    errors: initialErrors,
    touched: initialTouched,
    validating: false,
    submitting: false,
  })

  const setFieldError = useCallback((field: string, errorMessage: string | undefined) => {
    formDispatch({
      type: 'SET_FIELD_ERROR',
      payload: { field, value: errorMessage },
    })
  }, [])

  const setFieldTouched = useCallback((field: string, touched = false) => {
    formDispatch({
      type: 'SET_FIELD_TOUCHED',
      payload: { field, value: touched },
    })
  }, [])

  const formStateRef = useLatestRef(formState)

  const getFieldNames = useCallback(() => {
    return Object.keys(formStateRef.current.values)
  }, [formStateRef])

  const getFieldValue = useCallback(
    (fieldName: string) => {
      return formStateRef.current.values[fieldName]
    },
    [formStateRef]
  )

  const getFieldError = useCallback(
    (fieldName: string) => {
      return formStateRef.current.errors[fieldName]
    },
    [formStateRef]
  )

  const validateField = useCallback(
    async (field: string, value: unknown) => {
      const fieldValidation = fieldValidationCollectionRef.current.get(field)
      if (fieldValidation) {
        const error = fieldValidation.validate(value)
        console.log('validateField', error, value)

        const errorMsg = await Promise.resolve(error)
        setFieldError(field, errorMsg)
        return errorMsg
      }
    },
    [fieldValidationCollectionRef, setFieldError]
  )

  const validateFieldState = useCallback(
    (field: string) => {
      const value = getFieldValue(field)
      return validateField(field, value)
    },
    [validateField, getFieldValue]
  )

  const setFieldValue = useCallback(
    (field: string, value: unknown, shouldValidate?: boolean) => {
      formDispatch({
        type: 'SET_FIELD_VALUE',
        payload: { field, value },
      })

      const shouldValidateField =
        shouldValidate ??
        ((validateAfterTouched ? formState.touched[field] : true) && validateOnChange)

      if (shouldValidateField) {
        validateField(field, value)
      }
    },
    [validateField, validateAfterTouched, validateOnChange, formState]
  )

  const handleFieldChange = useCallback(
    (fieldName: string, callback: Function) => (evt: React.ChangeEvent<any>) => {
      // TODO: handle correct value
      const nextValue = evt.target.value

      // TODO: callAllMethods for callback
      setFieldValue(fieldName, nextValue, validateOnChange)
      callback?.(evt)
      onValuesChange?.({ ...formState.values, [fieldName]: nextValue }, formState.values)
    },
    [setFieldValue, validateOnChange, onValuesChange, formState.values]
  )

  const handleBlur = useCallback(
    (fieldName: string) => {
      if (validateOnBlur) {
        validateFieldState(fieldName)
      }
      setFieldTouched(fieldName, true)
    },
    [validateOnBlur, validateFieldState, setFieldTouched]
  )

  const handleFieldBlur = useCallback(
    (fieldName: string, callback: Function) => (evt?: any) => {
      if (evt.persist) {
        evt.persist()
      }

      handleBlur(fieldName)
      callback?.(evt)
    },
    [handleBlur]
  )

  const validateAll = useCallback(() => {
    const fieldNames = getFieldNames()
    return Promise.all(fieldNames.map((fieldName) => validateFieldState(fieldName)))
  }, [getFieldNames, validateFieldState])

  const onResetLatestRef = useLatestRef(onReset)

  const initialValuesRef = useRef(initialValues)
  const initialErrorsRef = useRef(initialErrors)
  const initialTouchedRef = useRef(initialTouched)

  const resetForm = useCallback(
    async (nextState?: Partial<FormState<any>>) => {
      const values = nextState && nextState.values ? nextState.values : initialValuesRef.current
      const errors = nextState && nextState.errors ? nextState.errors : initialErrorsRef.current
      const touched = nextState && nextState.touched ? nextState.touched : initialTouchedRef.current
      initialValuesRef.current = values
      initialErrorsRef.current = errors
      initialTouchedRef.current = touched

      const submitting = !!(nextState && nextState.submitting)
      const validating = !!(nextState && nextState.validating)

      const dispatchFn = () => {
        formDispatch({
          type: 'SET_FORM',
          payload: {
            submitting,
            validating,
            errors,
            touched,
            values,
          },
        })
      }

      if (onResetLatestRef.current) {
        await onResetLatestRef.current(formState.values)
        dispatchFn()
      } else {
        dispatchFn()
      }
    },
    [onResetLatestRef, formState.values]
  )

  const submitForm = useCallback(async () => {
    formDispatch({ type: 'SUBMIT_ATTEMPT' })
    return validateAll().then((combinedErrors: FormErrors<any>) => {
      const isInstanceOfError = combinedErrors instanceof Error
      const isActuallyValid = !isInstanceOfError && Object.keys(combinedErrors).length === 0

      if (isActuallyValid) {
        let promiseOrUndefined
        try {
          promiseOrUndefined = onSubmit?.(formState.values)
        } catch (error) {
          // throw error
        }

        if (promiseOrUndefined === undefined) return

        return Promise.resolve(promiseOrUndefined)
          .then((result) => {
            formDispatch({ type: 'SUBMIT_DONE' })
            return result
          })
          .catch((_errors) => {
            formDispatch({ type: 'SUBMIT_DONE' })
            throw _errors
          })
      } else {
        formDispatch({ type: 'SUBMIT_DONE' })

        if (isInstanceOfError) {
          throw combinedErrors
        }
      }
    })
  }, [formState, onSubmit, validateAll])

  const handleSubmit = useCallback(
    (evt?: React.FormEvent<HTMLFormElement>) => {
      if (evt && evt.preventDefault && isFunction(evt.preventDefault)) {
        evt.preventDefault()
      }

      if (evt && evt.stopPropagation && isFunction(evt.stopPropagation)) {
        evt.stopPropagation()
      }

      submitForm().catch(console.error)
    },
    [submitForm]
  )

  const resetValidations = useCallback(() => {}, [])

  const clearErrors = useCallback(() => {
    formDispatch({
      // TODO: reset errorMsg
      type: 'SET_ERRORS',
      payload: {},
    })
  }, [])

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
    getFieldError,
    getFieldRules,
    getFieldProps,
    registerField,
    unregisterField,
  }
}

export interface FormRule {
  name?: string
  strategy?: any
  message?: string
  validate?: (v: any) => boolean
}

export interface UseFormProps<T = { [Key: string]: any }> {
  initialValues: T
  initialErrors?: { [Key: string]: string }
  initialTouched?: { [Key: string]: boolean }
  rules?: { [Key: string]: FormRule[] }
  validateOnBlur?: boolean
  validateOnChange?: boolean
  validateAfterTouched?: boolean
  onValuesChange?: (changedValue: T, allValues: T) => void
  onSubmit?: (values: T) => void
  onReset?: (values: T) => void | Promise<any>
}

export type UseFormReturn = ReturnType<typeof useForm>

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
