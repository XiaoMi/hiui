import { useCallback, useState } from 'react'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'

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
  stateIsEqual = Object.is
) {
  const [internalState, setInternalState] = useState<T>(defaultState)

  const uncontrolled = controlledState === undefined
  const state = uncontrolled ? internalState : (controlledState as T)

  const stateLatest = useLatestRef(state)

  const onChangeLatest = useLatestCallback(onChange)
  const stateIsEqualLatest = useLatestCallback(stateIsEqual)

  const tryChangeState = useCallback(
    (newState: T, ...args: any[]) => {
      if (stateIsEqualLatest(newState, stateLatest.current)) return

      if (uncontrolled) {
        setInternalState(newState)
      }
      onChangeLatest(newState, ...args)
    },
    [uncontrolled, stateLatest, onChangeLatest, stateIsEqualLatest]
  )

  return [state, tryChangeState] as const
}
