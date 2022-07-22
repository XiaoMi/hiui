import { useMemo } from 'react'
import { v4 as uuidV4 } from 'uuid'

/**
 * Generate a uuid.
 */
export const uuid = () => uuidV4()

/**
 * A hook to generate a uuid
 */
export const useUUID = () => {
  return useMemo(() => uuid(), [])
}

class IdGenerator {
  id: number = 0
  next = () => {
    return ++this.id
  }
}

const idGenerator = new IdGenerator()

/**
 * A hook to generate a uid
 */
export const useUID = (prefix?: string) => {
  return useMemo(() => {
    return prefix + '-' + idGenerator.next()
  }, [prefix])
}
