import { useCallback, useState } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'

const isEqual = Object.is

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

  const tryChangeState = useCallback(
    (newState: T, ...args: any[]) => {
      if (stateIsEqualLatest(newState, state)) return

      if (uncontrolled) {
        setInternalState(newState)
      }
      onChangeLatest(newState, ...args)
    },
    [uncontrolled, state, onChangeLatest, stateIsEqualLatest]
  )

  return [state, tryChangeState] as const
}
