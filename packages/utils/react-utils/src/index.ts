import React, {
  createContext as createContextDefault,
  useContext as useContextDefault,
} from 'react'
import { isUndef } from '@hi-ui/type-assertion'
import { invariant, __DEV__ } from '@hi-ui/env'

export type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>

/**
 * Merge default Prop
 */
export const withDefaultProp = <T, P>(prop?: T, defaultProp?: P) => {
  return isUndef(prop) ? defaultProp : prop
}

/**
 * Merge defaultProps into props
 */
export const withDefaultProps = <DP extends Record<string, any>, ECP extends Partial<DP>>(
  props: ECP | undefined,
  defaultProps?: DP
): Omit<ECP, keyof DP> & Required<Pick<ECP, keyof DP>> => {
  if (!defaultProps) return (props || {}) as any

  const mergedProps = { ...props }
  let propName

  for (propName in defaultProps) {
    if (mergedProps[propName] === undefined) {
      // @ts-ignore
      mergedProps[propName] = defaultProps[propName]
    }
  }

  return mergedProps as any
}

/**
 * Set ref into a React element.
 */
export function setRef<T>(ref: ReactRef<T> | null, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

/**
 * Merges multiple refs into a single function ref.
 */
export const mergeRefs = <T>(...refs: (ReactRef<T> | null)[]) => {
  // Empty check
  if (refs.some((ref) => ref) === false) return null

  return (value: T) => {
    refs.forEach((ref) => {
      setRef(ref, value)
    })
  }
}

export type RecordName = string | number | symbol

/**
 * Filtering props
 */
export const filterProps = <T extends Record<RecordName, any>, R extends RecordName[]>(
  props: T,
  omitProps: R
): Pick<T, Exclude<keyof T, R[number]>> => {
  return Object.keys(props)
    .filter((key) => !omitProps.includes(key))
    .reduce((filteredObj, key) => {
      filteredObj[key] = props[key]
      return filteredObj
    }, {} as any)
}

const DEFAULT_CREATE_CONTEXT_PROPS = {}

/**
 * Create a valid context with errorMessage tip based on createContext in React
 */
export const createContext = <T>({
  optional = false,
  displayName,
}: CreateContextProps = DEFAULT_CREATE_CONTEXT_PROPS) => {
  const Context = createContextDefault<T | null>(null)

  if (__DEV__) {
    Context.displayName = displayName
  }

  function useContext() {
    const context = useContextDefault(Context)

    if (!optional && !context) {
      invariant(
        false,
        `The ${displayName}Context context should be wrapped  within ${displayName} as Provider.`
      )
    }

    // TODO: 根据 optional 类型推导为 T 或者 T | null
    return context
  }

  return [Context.Provider, useContext, Context] as const
}

export interface CreateContextProps {
  displayName?: string
  optional?: boolean
}

export type CreateContextReturn = ReturnType<typeof createContext>
