import React from 'react'
import { isFunction } from 'lodash-es'
import { useControllableValue, useMemoizedFn } from 'ahooks'
import type { StandardProps as aHooksStandardProps } from 'ahooks/es/useControllableValue'
import { mergeValues } from '@hi-ui/schema-utils'
import type { PatchType } from '@hi-ui/schema-utils'

export type StandardProps<T extends AnyObject = AnyObject> = Partial<aHooksStandardProps<T>>

export function useControllableSetState<T extends AnyObject = AnyObject>(props: StandardProps<T>) {
  const [state, setState] = useControllableValue<T>(props)

  const setMergeState = useMemoizedFn(function setMergeState(
    patch: React.SetStateAction<PatchType<T>>
  ) {
    const nextValue = isFunction(patch) ? patch(state as unknown as PatchType<T>) : patch
    const mergeValue = mergeValues(state, nextValue as T)
    setState(mergeValue)
  })

  return {
    state,
    setState,
    setMergeState,
  }
}
