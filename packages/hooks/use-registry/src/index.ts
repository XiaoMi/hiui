import { useCallback, useMemo, useRef } from 'react'

/**
 * A simple registry
 */
export const useRegistry = <T>() => {
  const collectionMp = useMemo(() => new Map(), [])
  const collectionRef = useRef<Map<string, T>>(collectionMp)

  const register = useCallback((id: string, value: T) => {
    collectionRef.current.set(id, value)
  }, [])

  const unregister = useCallback((id: string) => {
    collectionRef.current.delete(id)
  }, [])

  const getCollection = useCallback((key: string) => {
    if (collectionRef.current.has(key)) {
      return collectionRef.current.get(key)
    }
    return null
  }, [])

  const getCollections = useCallback(() => {
    const keys = [] as string[]
    collectionRef.current.forEach((_, key) => {
      keys.push(key)
    })
    return keys
  }, [])

  return {
    get: getCollection,
    keys: getCollections,
    register,
    unregister,
  }
}

export type UseRegistryReturn = ReturnType<typeof useRegistry>
