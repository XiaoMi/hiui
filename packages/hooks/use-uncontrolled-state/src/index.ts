import { useCallback, useState } from 'react'

/**
 * if `controlledState` is `undefined` will be uncontrolled using the defaultState
 *
 * @param defaultState
 * @param controlledState
 * @param onChange
 */
export function useUncontrolledState<T>(
  defaultState: T,
  controlledState?: T,
  onChange?: (next: T, ...args: any[]) => void
) {
  const [internalState, setInternalState] = useState<T>(defaultState)
  const uncontrolled = controlledState === undefined
  const _state = uncontrolled ? internalState : (controlledState as T)

  const tryChange = useCallback(
    (newState: T, ...args: any[]) => {
      if (uncontrolled) {
        setInternalState(newState)
      }
      onChange?.(newState, ...args)
    },
    [uncontrolled, onChange]
  )

  return [_state, tryChange] as const
}
