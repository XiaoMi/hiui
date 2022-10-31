import { isString } from '@hi-ui/type-assertion'

export const isValidAnchorId = (id?: string) => {
  if (!isString(id)) return false

  id = id.trim()

  if (!id) return false

  return id[0] === '#' && id.length > 1
}

export const trimElementId = (id?: string) => {
  if (isString(id)) {
    id = id.trim()
    if (id.startsWith('#')) return id.slice(1)
    return id
  }
  return ''
}
