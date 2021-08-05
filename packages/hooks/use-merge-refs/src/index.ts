import React, { useMemo } from 'react'

type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>

/**
 * Merges multiple refs into a single function ref.
 *
 * @param refs
 */
export const useMergeRefs = <T>(...refs: (ReactRef<T> | null)[]) => {
  return useMemo(() => {
    // Empty check
    if (refs.some((ref) => ref) === false) return null

    return (value: T) => {
      refs.forEach((ref) => {
        setRef(ref, value)
      })
    }
    // every ref will be dependent
  }, refs)
}

function setRef<T>(ref: ReactRef<T> | null, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}
