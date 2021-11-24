import React, { useState, useMemo, useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestCallback } from '@hi-ui/use-latest'

export type UseToggleAction = {
  set: React.Dispatch<React.SetStateAction<boolean>>
  on: () => void
  off: () => void
  not: () => void
}

/**
 * Handles Boolean switching by `on`, `off`, `not`
 *
 * @param initialState
 */
export function useToggle(initialState: boolean | (() => boolean) = false) {
  const [bool, setBool] = useState(initialState)

  const toggle = useMemo(
    () => ({
      set: setBool,
      on: () => {
        setBool(true)
      },
      off: () => {
        setBool(false)
      },
      not: () => {
        setBool((prev) => !prev)
      },
    }),
    []
  )

  return [bool, toggle] as const
}

interface UseUncontrolledToggleProps {
  defaultVisible?: boolean | (() => boolean)
  visible?: boolean
  onClose?: () => void
  onOpen?: () => void
  isEqual?: (prev: boolean, next: boolean) => boolean
}

/**
 * Handles uncontrolled boolean switching by `on`, `off`, `not`
 */
export function useUncontrolledToggle({
  defaultVisible = false,
  visible: visibleProp,
  onClose,
  onOpen,
  isEqual,
}: UseUncontrolledToggleProps) {
  const onCloseLatest = useLatestCallback(onClose)
  const onOpenLatest = useLatestCallback(onOpen)

  const onVisibleChange = useCallback(
    (nextVisible: boolean) => {
      const callback = nextVisible ? onOpenLatest : onCloseLatest
      callback()
    },
    [onCloseLatest, onOpenLatest]
  )

  const [bool, setBool] = useUncontrolledState(
    defaultVisible,
    visibleProp,
    onVisibleChange,
    isEqual
  )

  const toggle = useMemo(
    () => ({
      set: setBool,
      on: () => {
        setBool(true)
      },
      off: () => {
        setBool(false)
      },
      not: () => {
        setBool((prev) => !prev)
      },
    }),
    [setBool]
  )

  return [bool, toggle] as const
}
