import React, { useCallback, useMemo, useReducer, useRef } from 'react'
import {
  FormAction,
  FormState,
  FormFieldCollection,
  FormErrors,
  FormRuleModel,
  FormFieldPath,
  FormErrorMessage,
} from './types'
import { setProp } from './utils'
import { useLatestRef } from '@hi-ui/use-latest'
import { isArray, isFunction } from '@hi-ui/type-assertion'
import { callAllFuncs } from '@hi-ui/func-utils'
import { stopEvent } from '@hi-ui/dom-utils'
import { FormSetState } from '.'

const EMPTY_RULES = {}
const EMPTY_ERRORS = {}
const EMPTY_TOUCHED = {}
const DEFAULT_VALIDATE_TRIGGER = ['onChange', 'onBlur']

export const useForm = <Values = Record<string, any>>({
  initialValues,
  initialErrors = EMPTY_ERRORS,
  initialTouched = EMPTY_TOUCHED,
  lazyValidate = false,
  onValuesChange,
  onReset,
  onSubmit,
  // 以下为 Field 同名属性，用于统一配置，优先级低于个体 Item 的设置
  rules = EMPTY_RULES,
  validateAfterTouched = true,
  validateTrigger: validateTriggerProp = DEFAULT_VALIDATE_TRIGGER,
}: UseFormProps<Values>) => {
  /**
   * 处理校验触发器，保证 memo 依赖的是数组每个项，避免无效重渲染
   */
  const validateTrigger = isArray(validateTriggerProp) ? validateTriggerProp : [validateTriggerProp]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateTriggersMemo = useMemo(() => validateTrigger, validateTrigger)

  /**
   * 收集 Field 的校验器注册表
   */
  const [getValidation, registerField, unregisterField] = useCollection<
    FormFieldCollection<Values>
  >()

  /**
   * form 数据管理中心
   */
  const [formState, formDispatch] = useReducer(formReducer, {
    values: initialValues,
    errors: initialErrors,
    touched: initialTouched,
    validating: false,
    submitting: false,
  })

  // 使用 latest ref 维护，保证每次主动拿取的 formState 都是最新的
  const formStateRef = useLatestRef(formState)

  const getFieldNames = useCallback(() => Object.keys(formStateRef.current.values), [formStateRef])

  const getFieldValue = useCallback((fieldName: string) => formStateRef.current.values[fieldName], [
    formStateRef,
  ])

  const getFieldError = useCallback((fieldName: string) => formStateRef.current.errors[fieldName], [
    formStateRef,
  ])

  const setFieldError = useCallback(
    (field: FormFieldPath, errorMessage: FormErrorMessage | undefined) => {
      formDispatch({
        type: 'SET_FIELD_ERROR',
        payload: { field, value: errorMessage },
      })
    },
    []
  )

  const setFieldTouched = useCallback((field: FormFieldPath, touched = false) => {
    formDispatch({
      type: 'SET_FIELD_TOUCHED',
      payload: { field, value: touched },
    })
  }, [])

  /**
   * 使用单个 Field 规则对给定值进行校验
   */
  const validateField = useCallback(
    async (field: string, value: unknown) => {
      const fieldValidation = getValidation(field)
      if (!fieldValidation) return

      formDispatch({ type: 'SET_VALIDATING', payload: true })

      const errorResultAsPromise = fieldValidation.validate(value)

      console.log('validate', errorResultAsPromise)

      errorResultAsPromise
        .then((result) => {
          console.log('result', result)
          formDispatch({ type: 'SET_VALIDATING', payload: false })
          setFieldError(field, '')
        })
        .catch((errorMsg: Error) => {
          // @ts-ignore
          setFieldError(field, errorMsg.fields[field][0].message)
        })
        .finally(() => {
          formDispatch({ type: 'SET_VALIDATING', payload: false })
        })
    },
    [getValidation, setFieldError]
  )

  /**
   * 校验单个 Field 及其当前值
   */
  const validateFieldState = useCallback(
    (field: string) => {
      const value = getFieldValue(field)
      return validateField(field, value)
    },
    [validateField, getFieldValue]
  )

  /**
   * 检验所有字段
   */
  const validateAll = useCallback(() => {
    const fieldNames = getFieldNames()
    return Promise.all(fieldNames.map((fieldName) => validateFieldState(fieldName)))
  }, [getFieldNames, validateFieldState])

  /**
   * 控件值更新策略
   */
  const setFieldValue = useCallback(
    (field: string, value: unknown, shouldValidate?: boolean) => {
      formDispatch({ type: 'SET_FIELD_VALUE', payload: { field, value } })

      const shouldValidateField =
        shouldValidate ?? (validateAfterTouched ? formState.touched[field] : true)

      if (shouldValidateField) {
        validateField(field, value)
      }
    },
    [validateField, validateAfterTouched, formState]
  )

  const normalizeValueFromChange = useCallback((eventOrValue: React.ChangeEvent<any>) => {
    // TODO: handle correct value
    return eventOrValue.target.value
  }, [])

  const handleFieldChange = useCallback(
    (fieldName: string, valueCollectPipe: any, shouldValidate?: boolean) => (
      evt: React.ChangeEvent<any>
    ) => {
      // TODO: 传递 onChange 其它参数
      const nextValue = isFunction(valueCollectPipe)
        ? valueCollectPipe(evt)
        : normalizeValueFromChange(evt)

      setFieldValue(fieldName, nextValue, shouldValidate)
      onValuesChange?.({ ...formState.values, [fieldName]: nextValue }, formState.values)
    },
    [setFieldValue, onValuesChange, formState.values, normalizeValueFromChange]
  )

  /**
   * 控件失焦策略
   */
  const handleFieldBlur = useCallback(
    (fieldName: string, shouldValidate?: boolean) => (evt?: any) => {
      if (shouldValidate) {
        validateFieldState(fieldName)
      }
      setFieldTouched(fieldName, true)
    },
    [setFieldTouched, validateFieldState]
  )

  const handleFieldTrigger = useCallback(
    (fieldName: string) => (evt?: any) => {
      validateFieldState(fieldName)
    },
    [validateFieldState]
  )

  /**
   * 表单重置，永远使用第一次的初始值
   */
  const initialValuesRef = useRef(initialValues)
  const initialErrorsRef = useRef(initialErrors)
  const initialTouchedRef = useRef(initialTouched)

  const onResetLatestRef = useLatestRef(onReset)

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

  /**
   * 表单提交
   */
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
      stopEvent(evt)
      submitForm().catch(console.error)
    },
    [submitForm]
  )

  const handleReset = useCallback(
    (evt?: React.FormEvent<HTMLFormElement>) => {
      stopEvent(evt)
      resetForm()
    },
    [resetForm]
  )

  const resetValidations = useCallback(() => {}, [])

  const clearErrors = useCallback(() => {
    formDispatch({
      // TODO: reset errorMsg
      type: 'SET_ERRORS',
      payload: {},
    })
  }, [])

  const setFormState = React.useCallback((stateOrFunc: FormSetState<Values>): void => {
    // @ts-ignore
    formDispatch({ type: 'SET_STATE', payload: stateOrFunc })
  }, [])

  const getRootProps = useCallback(() => {
    return {
      onSubmit: handleSubmit,
      onReset: handleReset,
    }
  }, [handleReset, handleSubmit])

  const getFieldProps = useCallback(
    (props = {}, ref = null) => {
      const {
        field,
        rules,
        valuePropName = 'value',
        valueCollectPropName = 'onChange',
        valueCollectPipe,
        validateTrigger: validateTriggerProp = validateTriggersMemo,
        onBlur,
      } = props

      const validateTrigger = isArray(validateTriggerProp)
        ? validateTriggerProp
        : [validateTriggerProp]

      const validateOnCollect = validateTrigger.includes(valueCollectPropName)
      const validateOnBlur = validateTrigger.includes('onChange')

      const returnProps = {
        ref,
        [valuePropName]: formState.values[field],
        // 字段 change 时校验
        [valueCollectPropName]: callAllFuncs(
          props[valueCollectPropName],
          handleFieldChange(field, valueCollectPipe, validateOnCollect)
        ),
        onBlur: callAllFuncs(onBlur, handleFieldBlur(field, validateOnBlur)),
        invalid: getFieldError(field),
      }

      validateTrigger
        .filter((triggerName) => [valueCollectPropName, 'onBlur'].indexOf(triggerName) === -1)
        .forEach((triggerName: string) => {
          returnProps[triggerName] = callAllFuncs(props[triggerName], handleFieldTrigger(field))
        })

      return returnProps
    },
    [formState, handleFieldChange, handleFieldBlur, validateTriggersMemo, handleFieldTrigger]
  )

  const getFieldRules = useCallback(
    (fieldName: string) => {
      return rules[fieldName]
    },
    [rules]
  )

  console.log('formState', formState)

  return {
    ...formState,
    setFormState,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    getFieldError,
    getFieldRules,
    getRootProps,
    getFieldProps,
    registerField,
    unregisterField,
    submitForm,
    resetForm,
  }
}

export interface UseFormProps<T = Record<string, any>> {
  /**
   * 初始化表单值
   */
  initialValues: T
  /**
   * 初始化表单错误
   */
  initialErrors?: Record<keyof T, string>
  /**
   * 初始化是否已被触碰
   */
  initialTouched?: Record<string, boolean>
  /**
   * 校验规则，设置字段的校验逻辑
   */
  rules?: Record<string, FormRuleModel[]>
  /**
   * 开启在 onBlur 时触发校验
   */
  // validateOnBlur?: boolean
  /**
   * 开启在 onChange 时触发校验
   */
  // validateOnChange?: boolean
  /**
   * 设置统一的表单校验时机
   */
  validateTrigger?: string | string[]
  /**
   * 在触摸控件之后才开启校验
   */
  validateAfterTouched?: boolean
  /**
   * 开启惰性校验，发现第一个检验失败的表单控件，就停止向下继续校验
   */
  lazyValidate?: boolean
  // /**
  //  * 重置时使用最新传入的 initialValues
  //  */
  // useLatestInitialValuesOnReset?: boolean
  /**
   * 字段值更新时触发回调事件：changedValues: 改变的表单对象，allValues: 所有表单项对象
   */
  onValuesChange?: (changedValue: T, allValues: T) => void
  /**
   * 提交时回调
   */
  onSubmit?: (values: T) => void
  /**
   * 重置时回调
   */
  onReset?: (values: T) => void | Promise<any>
}

export type UseFormReturn = ReturnType<typeof useForm>

// TODO: field 支持数组
function formReducer<T>(state: FormState<T>, action: FormAction<T>) {
  switch (action.type) {
    case 'SET_STATE':
      const nextState = isFunction(action.payload) ? action.payload(state) : action.payload
      return { ...state, ...nextState }
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

  const getCollection = useCallback((key: string) => {
    if (collectionRef.current.has(key)) {
      return collectionRef.current.get(key)
    }
    return null
  }, [])

  return [getCollection, register, unregister] as const
}
