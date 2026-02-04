import { useEffect, useRef } from 'react'
import { useLatest } from 'ahooks'

export function useIsFirstMount() {
  const isFirstMountRef = useRef(true)

  useEffect(() => {
    isFirstMountRef.current = false
  }, [])

  // 换一个新的 ref 再返回
  // 避免紧跟着的 useEffect 中，isFirstMountRef 已经被修改
  return useLatest(isFirstMountRef.current)
}
