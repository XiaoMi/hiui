import { useRef, useReducer, useCallback } from 'react'
import { useUnmountEffect } from '@hi-ui/use-unmount-effect'

export const useForceUpdate = () => {
  const unMountRef = useRef(false)
  const [trigger, dispatch] = useReducer((v) => !v, false)

  useUnmountEffect(() => {
    unMountRef.current = true
  })

  const forceUpdate = useCallback(() => {
    if (unMountRef.current) return
    dispatch()
  }, [])

  return [forceUpdate, trigger] as const
}
