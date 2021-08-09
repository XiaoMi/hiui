import { useCallback, useState } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'

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
  onChange?: (next: T, ...args: any[]) => void
) {
  const onChangeLatest = useLatestCallback(onChange)

  const [internalState, setInternalState] = useState<T>(defaultState)
  const uncontrolled = controlledState === undefined
  const state = uncontrolled ? internalState : (controlledState as T)

  const tryChangeState = useCallback(
    (newState: T, ...args: any[]) => {
      if (uncontrolled) {
        setInternalState(newState)
      }
      onChangeLatest(newState, ...args)
    },
    [uncontrolled, onChangeLatest]
  )

  return [state, tryChangeState] as const
}
