import { stringify, parse, isValidField, mergeValues, getEmptyValueByType } from './utils'
import React, { useCallback, useMemo, useReducer, useRef } from 'react'
import scrollIntoView, {
  StandardBehaviorOptions as ScrollOptions,
} from 'scroll-into-view-if-needed'
import {
  FormAction,
  FormState,
  FormFieldCollection,
  FormErrors,
  FormRuleModel,
  FormFieldPath,
  FormErrorMessage,
  FormSetState,
} from './types'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { isArray, isObjectLike, isFunction } from '@hi-ui/type-assertion'
import { callAllFuncs } from '@hi-ui/func-utils'
import { setNested, getNested } from '@hi-ui/object-utils'
import { stopEvent } from '@hi-ui/dom-utils'

const EMPTY_RULES = {}
const EMPTY_ERRORS = {} as any
const EMPTY_TOUCHED = {}
const DEFAULT_VALIDATE_TRIGGER = ['onChange', 'onBlur']

const EMPTY_FUNC = () => {}

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
  validateAfterTouched = false,
  validateTrigger: validateTriggerProp = DEFAULT_VALIDATE_TRIGGER,
  scrollToFirstError,
  ...rest
}: UseFormProps<Values>) => {
  /**
   * 处理校验触发器，保证 memo 依赖的是数组每个项，避免无效重渲染
   */
  const validateTrigger = isArray(validateTriggerProp) ? validateTriggerProp : [validateTriggerProp]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateTriggersMemo = useMemo(() => validateTrigger, validateTrigger)

  const formItemsMp = useMemo(() => new Map(), [])
  const formItemsRef = useRef(formItemsMp)

  /**
   * 收集 Field 的校验器注册表
   */
  const [getValidation, registerField, unregisterField, getRegisteredKeys] = useCollection<
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

  // const getFieldNames = useCallback(() => Object.keys(formStateRef.current.values as any), [
  //   formStateRef,
  // ])

  const getFormItemNode = useCallback((fieldName: FormFieldPath) => {
    return formItemsRef.current.get(fieldName.toString())
  }, [])

  const scrollToNode = useCallback(
    (fieldName: FormFieldPath, options: ScrollOptions = {}) => {
      scrollIntoView(getFormItemNode(fieldName), {
        scrollMode: 'if-needed',
        block: 'nearest',
        ...options,
      })
    },
    [getFormItemNode]
  )

  const getFieldValue = useCallback(
    (fieldName: FormFieldPath) => getNested(formStateRef.current.values, fieldName),
    [formStateRef]
  )

  const getFieldsValue = useCallback(() => formStateRef.current.values as any, [formStateRef])

  const getFieldError = useCallback(
    (fieldName: FormFieldPath) => getNested(formStateRef.current.errors, fieldName),
    [formStateRef]
  )

  const getFieldsError = useCallback(() => formStateRef.current.errors as any, [formStateRef])

  const setFieldError = useCallback(
    (field: FormFieldPath, errorMessage: FormErrorMessage | undefined) => {
      formDispatch({
        type: 'SET_FIELD_ERROR',
        // @ts-ignore
        payload: { field, value: errorMessage },
      })
    },
    []
  )

  const setFieldTouched = useCallback((field: FormFieldPath, touched = false) => {
    formDispatch({
      type: 'SET_FIELD_TOUCHED',
      // @ts-ignore
      payload: { field, value: touched },
    })
  }, [])

  /**
   * 使用单个 Field 规则对给定值进行校验
   */
  const validateField = useCallback(
    async (field: FormFieldPath, value: unknown) => {
      const fieldValidation = getValidation(field)
      if (!fieldValidation) return

      formDispatch({ type: 'SET_VALIDATING', payload: true })

      const errorResultAsPromise = fieldValidation.validate(value)

      return errorResultAsPromise.then(
        (result) => {
          formDispatch({ type: 'SET_VALIDATING', payload: false })
          setFieldError(field, '')

          return setNested({}, field, value)
        },
        (errorMsg: Error) => {
          formDispatch({ type: 'SET_VALIDATING', payload: false })
          // @ts-ignore
          setFieldError(field, errorMsg.fields[stringify(field)]?.[0]?.message ?? '')

          throw errorMsg
        }
      )
    },
    [getValidation, setFieldError]
  )

  /**
   * 校验单个 Field 及其当前值
   */
  const validateFieldState = useCallback(
    (field: FormFieldPath) => {
      const value = getFieldValue(field)
      return validateField(field, value)
    },
    [validateField, getFieldValue]
  )

  /**
   * 检验所有字段
   */
  const validateAll = useCallback(() => {
    const fieldNames = getRegisteredKeys()
    formDispatch({ type: 'SET_VALIDATING', payload: true })

    let firstError = false

    return Promise.all(
      fieldNames.map((fieldName) => {
        const value = getFieldValue(fieldName)
        const fieldValidation = getValidation(fieldName)

        if (!fieldValidation) {
          return Promise.resolve(null)
        }

        // catch 错误，保证检验所有表单项
        return fieldValidation.validate(value).catch((error) => {
          if (scrollToFirstError && !firstError) {
            firstError = true
            scrollToNode(
              fieldName,
              typeof scrollToFirstError === 'object' ? scrollToFirstError : {}
            )
          }

          // 第一个出错，即退出校验
          if (lazyValidate) {
            throw error
          }

          return error
        })
      })
    )
      .then((result) => {
        // 合并错误，批量更新并返回
        const combinedError = result.reduce((prev, cur, index) => {
          const fieldName = fieldNames[index]
          let errorMsg
          if (cur instanceof Error) {
            // @ts-ignore
            errorMsg = cur.fields[stringify(fieldName)]?.[0]?.message || ''
            if (typeof errorMsg === 'string' && !!errorMsg) {
              return setNested(prev, fieldName, errorMsg)
            }
          }
          return prev
        }, {} as Record<string, any>)

        formDispatch({ type: 'SET_VALIDATING', payload: false })
        formDispatch({
          type: 'SET_ERRORS',
          payload: combinedError,
        })

        return combinedError
      })
      .catch((error) => {
        const fieldNameStrings = fieldNames.map((item) => stringify(item))
        // @ts-ignore
        const fieldNameString = Object.keys(error.fields).find((item) =>
          fieldNameStrings.includes(item)
        )

        let combinedError = {}

        if (!fieldNameString) {
          formDispatch({ type: 'SET_VALIDATING', payload: false })
          return error
        }

        let errorMsg

        if (error instanceof Error) {
          // @ts-ignore
          errorMsg = error.fields[fieldNameString]?.[0]?.message || ''
        }

        const fieldName = parse(fieldNameString)

        if (typeof errorMsg === 'string' && !!errorMsg) {
          combinedError = setNested(combinedError, fieldName, errorMsg)
        }

        formDispatch({ type: 'SET_VALIDATING', payload: false })
        formDispatch({
          type: 'SET_ERRORS',
          payload: combinedError,
        })

        return combinedError
      })
  }, [
    getFieldValue,
    getRegisteredKeys,
    getValidation,
    lazyValidate,
    scrollToFirstError,
    scrollToNode,
  ])

  /**
   * 控件值更新策略
   */
  const setFieldValue = useCallback(
    (field: FormFieldPath, value: unknown, shouldValidate?: boolean) => {
      formDispatch({ type: 'SET_FIELD_VALUE', payload: { field, value } })

      // touched 给外部控制展示，而不是当做参数暴露
      const shouldValidateField = validateAfterTouched
        ? getNested(formState.touched, field) && shouldValidate
        : shouldValidate

      if (shouldValidateField) {
        validateField(field, value).catch(EMPTY_FUNC)
      }
    },
    [validateField, validateAfterTouched, formState]
  )

  const setFieldsValue = useCallback((fieldsState: Record<string, any> | Function) => {
    formDispatch({
      type: 'SET_VALUES',
      payload: (prevState: any) => {
        return isFunction(fieldsState)
          ? fieldsState(prevState)
          : mergeValues(prevState, fieldsState as any)
      },
    })
  }, [])

  const normalizeValueFromChange = useCallback(
    (eventOrValue: React.ChangeEvent<any>, valuePropName: string) => {
      let nextValue = eventOrValue

      if (isObjectLike(eventOrValue) && eventOrValue.target) {
        const event = eventOrValue as React.ChangeEvent<any>

        // @see https://reactjs.org/docs/events.html#event-pooling
        if (isFunction(event.persist)) {
          event.persist()
        }

        const target = event.target || event.currentTarget

        // if (hasOwnProp(target, valuePropName)) {
        //   nextValue = target[valuePropName]
        // }

        // TODO: support all native html field
        if (/checkbox/.test(target.type)) {
          nextValue = target.checked
        } else {
          nextValue = target.value
        }
      }

      return nextValue
    },
    []
  )

  const handleFieldChange = useCallback(
    (
      fieldName: FormFieldPath,
      valuePropName: string,
      valueDispatchTransform: any,
      shouldValidate?: boolean
    ) => (evt: React.ChangeEvent<any>, ...args: any[]) => {
      const nextValue = isFunction(valueDispatchTransform)
        ? valueDispatchTransform(evt, ...args)
        : normalizeValueFromChange(evt, valuePropName)

      setFieldValue(fieldName, nextValue, shouldValidate)

      const changedValues: any = setNested({}, fieldName, nextValue)
      const allValues = setNested({ ...(formState.values as any) }, fieldName, nextValue)
      onValuesChange?.(changedValues, allValues)
    },
    [setFieldValue, onValuesChange, formState.values, normalizeValueFromChange]
  )

  /**
   * 控件失焦策略
   */
  const handleFieldBlur = useCallback(
    (fieldName: FormFieldPath, shouldValidate?: boolean) => (evt?: any) => {
      if (shouldValidate) {
        validateFieldState(fieldName).catch(EMPTY_FUNC)
      }
      setFieldTouched(fieldName, true)
    },
    [setFieldTouched, validateFieldState]
  )

  const handleFieldTrigger = useCallback(
    (fieldName: FormFieldPath) => (evt?: any) => {
      validateFieldState(fieldName).catch(EMPTY_FUNC)
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
      let values = nextState && nextState.values ? nextState.values : initialValuesRef.current
      const errors = nextState && nextState.errors ? nextState.errors : initialErrorsRef.current
      const touched = nextState && nextState.touched ? nextState.touched : initialTouchedRef.current
      const registeredKeys = getRegisteredKeys()
      const formValues = formState.values

      // 处理缺失的字段：如果 registeredKeys 中的字段在 values 中不存在，
      // 则根据 formValues 中对应字段的类型设置对应的空值
      if (registeredKeys.length > 0) {
        // 确保 values 是一个对象
        if (!values || typeof values !== 'object' || isArray(values)) {
          values = {}
        } else {
          // 浅拷贝 values 避免修改原始对象
          values = { ...values }
        }

        registeredKeys.forEach((field) => {
          // 检查字段是否存在于 values 中
          const valueInReset = getNested(values, field)
          // 如果字段不存在（undefined），则根据 formValues 中的类型设置空值
          if (valueInReset === undefined) {
            const currentValue = getNested(formValues, field)
            // 如果当前值存在（包括 null），根据其类型设置对应的空值
            if (currentValue !== undefined) {
              const emptyValue = getEmptyValueByType(currentValue)
              // setNested 返回新对象，需要重新赋值
              values = setNested(values, field, emptyValue)
            }
          }
        })
      }

      initialValuesRef.current = values
      // @ts-ignore
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
        // @ts-ignore
        await onResetLatestRef.current(formState.values)
        dispatchFn()
      } else {
        dispatchFn()
      }
    },
    [formState.values, getRegisteredKeys, onResetLatestRef]
  )

  /**
   * 表单提交
   */
  const submitForm = useCallback(async () => {
    formDispatch({ type: 'SUBMIT_ATTEMPT' })

    return validateAll().then(
      (combinedErrors: FormErrors<any>) => {
        const isInstanceOfError = combinedErrors instanceof Error
        const isActuallyValid =
          !!combinedErrors && !isInstanceOfError && Object.keys(combinedErrors).length === 0

        if (isActuallyValid) {
          let promiseOrUndefined
          try {
            // @ts-ignore
            promiseOrUndefined = onSubmit?.(formStateRef.current.values)
          } catch (error) {
            formDispatch({ type: 'SUBMIT_DONE' })

            throw error
          }

          if (promiseOrUndefined === undefined) {
            formDispatch({ type: 'SUBMIT_DONE' })
            // return combinedErrors
            return formStateRef.current.values
          }

          return Promise.resolve(promiseOrUndefined)
            .then((result) => {
              formDispatch({ type: 'SUBMIT_DONE' })
              // return result
              // TODO: 满足promise 如果既给到values 又给到 errors
              return formStateRef.current.values
            })
            .catch((_errors) => {
              formDispatch({ type: 'SUBMIT_DONE' })
              throw _errors
            })
        } else {
          formDispatch({ type: 'SUBMIT_DONE' })

          if (isInstanceOfError) {
            throw combinedErrors
          } else {
            throw new TypeError('Validation Error')
          }
        }
      },
      (error) => {
        formDispatch({ type: 'SUBMIT_DONE' })
        throw error
      }
    )
  }, [formStateRef, onSubmit, validateAll])

  const handleSubmit = useCallback(
    (evt?: React.FormEvent<HTMLFormElement>) => {
      stopEvent(evt as any)
      return submitForm()
    },
    [submitForm]
  )

  const handleReset = useCallback(
    (evt?: React.FormEvent<HTMLFormElement>) => {
      stopEvent(evt as any)
      resetForm()
    },
    [resetForm]
  )

  const resetErrors = useCallback(() => {
    formDispatch({
      type: 'SET_ERRORS',
      payload: {},
    })
  }, [])

  const resetFieldError = useCallback(
    (field: FormFieldPath) => {
      setFieldError(field, '')
    },
    [setFieldError]
  )

  const setFormState = React.useCallback((stateOrFunc: FormSetState<Values>): void => {
    // @ts-ignore
    formDispatch({ type: 'SET_STATE', payload: stateOrFunc })
  }, [])

  const getRootProps = useLatestCallback(() => {
    return {
      ...rest,
      onSubmit: handleSubmit,
      onReset: handleReset,
    }
  })

  const getFieldProps = useCallback(
    (props = {}) => {
      const {
        field,
        valuePropName = 'value',
        valueChangeFuncPropName = 'onChange',
        valueDispatchTransform,
        valueConnectTransform,
        validateTrigger: validateTriggerProp = validateTriggersMemo,
        children,
      } = props

      // field 未设置，不进行收集管理
      if (!isValidField(field)) return {}

      // 控件的 props
      const controlProps = (children && children.props) || {}

      const validateTrigger = (isArray(validateTriggerProp)
        ? validateTriggerProp
        : [validateTriggerProp]) as string[]

      const validateOnCollect = validateTrigger.includes(valueChangeFuncPropName)
      const validateOnBlur = validateTrigger.includes('onBlur')

      const controlledValue = getNested(formState.values, field)

      const returnProps: any = {
        [valuePropName]: isFunction(valueConnectTransform)
          ? valueConnectTransform(controlledValue)
          : controlledValue,
        // 字段 change 时校验
        [valueChangeFuncPropName]: callAllFuncs(
          controlProps[valueChangeFuncPropName],
          handleFieldChange(field, valuePropName, valueDispatchTransform, validateOnCollect)
        ),
        onBlur: callAllFuncs(controlProps.onBlur, handleFieldBlur(field, validateOnBlur)),
        invalid: getFieldError(field),
      }

      validateTrigger.forEach((triggerName: string) => {
        if ([valueChangeFuncPropName, 'onBlur'].indexOf(triggerName) === -1) {
          returnProps[triggerName] = callAllFuncs(
            controlProps[triggerName],
            handleFieldTrigger(field)
          )
        }
      })

      return returnProps
    },
    [
      formState,
      handleFieldChange,
      handleFieldBlur,
      validateTriggersMemo,
      handleFieldTrigger,
      getFieldError,
    ]
  )

  const getFieldRules = useCallback(
    (fieldName: FormFieldPath) => {
      return getNested(rules, fieldName)
    },
    [rules]
  )

  return {
    ...formState,
    setFormState,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    getFieldValue,
    getFieldError,
    getFieldRules,
    getRootProps,
    getFieldProps,
    registerField,
    unregisterField,
    submitForm,
    resetForm,
    resetErrors,
    resetFieldError,
    validateFieldState,
    validateValue: validateField,
    getFieldsValue,
    setFieldsValue,
    getFieldsError,
    formItemsRef,
  }
}

export interface UseFormProps<T = Record<string, any>> {
  /**
   * 初始化表单值，只在初始化以及重置时生效；该值是不受控的，和表单中的 defaultValue 的作用类似
   */
  initialValues: T
  /**
   * 初始化表单错误
   */
  initialErrors?: Record<keyof T, string>
  /**
   * 初始化是否已被触碰。暂不对外暴露
   * @private
   */
  initialTouched?: Record<string, boolean>
  /**
   * 校验规则，设置字段的校验逻辑
   */
  rules?: Record<string, FormRuleModel[]>
  /**
   * 设置统一的表单校验时机
   */
  validateTrigger?: string | string[]
  /**
   * 在触摸控件之后才开启校验。暂不对外暴露
   * @private
   */
  validateAfterTouched?: boolean
  /**
   * 开启惰性校验，发现第一个检验失败的表单控件，就停止向下继续校验。暂不对外暴露
   * @private
   */
  lazyValidate?: boolean
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
  /**
   * 提交失败自动滚动到第一个错误字段，配置参考：https://github.com/scroll-into-view/scroll-into-view-if-needed?tab=readme-ov-file#options
   */
  scrollToFirstError?: boolean | ScrollOptions
}

export type UseFormReturn = ReturnType<typeof useForm>

function formReducer<T>(state: FormState<T>, action: FormAction<T>) {
  switch (action.type) {
    case 'SET_STATE':
      const nextState = isFunction(action.payload) ? action.payload(state) : action.payload
      return { ...state, ...nextState }
    case 'SET_VALUES':
      const nextValues = isFunction(action.payload) ? action.payload(state.values) : action.payload
      return { ...state, values: nextValues }
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
        values: setNested(state.values, action.payload.field, action.payload.value),
      }
    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        touched: setNested(state.touched, action.payload.field, action.payload.value),
      }
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: setNested(state.errors, action.payload.field, action.payload.value),
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

  const register = useCallback((keyOrKeys: FormFieldPath, value: T) => {
    collectionRef.current.set(stringify(keyOrKeys), value)
  }, [])

  const unregister = useCallback((keyOrKeys: FormFieldPath) => {
    collectionRef.current.delete(stringify(keyOrKeys))
  }, [])

  const getCollection = useCallback((keyOrKeys: FormFieldPath) => {
    const key = stringify(keyOrKeys)
    if (collectionRef.current.has(key)) {
      return collectionRef.current.get(key)
    }
    return null
  }, [])

  const getRegisteredKeys = useCallback(() => {
    const keys = [] as FormFieldPath[]
    collectionRef.current.forEach((_, key) => {
      keys.push(parse(key))
    })
    return keys
  }, [])

  return [getCollection, register, unregister, getRegisteredKeys] as const
}
