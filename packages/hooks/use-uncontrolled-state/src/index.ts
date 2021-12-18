import React, { useCallback, useState } from 'react'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { isFunction } from '@hi-ui/type-assertion'

// const isEqual = Object.is
const isEqual: any = () => false

/**
 * if `controlledState` is `undefined` will be uncontrolled using the defaultState
 *
 * @param defaultState
 * @param controlledState
 * @param onChange
 */
export function useUncontrolledState<T>(
  defaultState: T | (() => T),
  controlledState?: T,
  onChange?: (next: T, ...args: any[]) => void,
  stateIsEqual = isEqual
) {
  const [internalState, setInternalState] = useState<T>(defaultState)

  const uncontrolled = controlledState === undefined
  const state = uncontrolled ? internalState : (controlledState as T)

  const onChangeLatest = useLatestCallback(onChange)
  const stateIsEqualLatest = useLatestCallback(stateIsEqual)
  const stateLatestRef = useLatestRef(state)

  const tryChangeState = useCallback(
    (stateOrFunction: React.SetStateAction<T>, ...args: any[]) => {
      const state = stateLatestRef.current
      const nextState = isFunction(stateOrFunction) ? stateOrFunction(state) : stateOrFunction

      if (stateIsEqualLatest(nextState, state)) return

      if (uncontrolled) {
        setInternalState(nextState)
      }
      onChangeLatest(nextState, ...args)
    },
    [uncontrolled, stateLatestRef, onChangeLatest, stateIsEqualLatest]
  )

  return [state, tryChangeState, uncontrolled] as const
}
