import React from 'react'

export type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>

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
