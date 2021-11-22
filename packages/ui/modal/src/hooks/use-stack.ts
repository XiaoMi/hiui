import { Ref, useEffect } from 'react'

export const useStackManager = (ref: Ref<Element>, open: boolean) => {
  useEffect(() => {
    if (open) {
      stackManager.add(ref)
    }
    return () => {
      stackManager.remove(ref)
    }
  }, [open, ref])
}

let caches: Ref<Element>[] = []

/**
 * Handle the order of the elements.
 */
export const stackManager = {
  add: (newElm: Ref<Element>) => {
    caches.push(newElm)
  },

  remove: (oldElm: Ref<Element>) => {
    caches = caches.filter((elm) => elm !== oldElm)
  },

  isTop: (elm: Ref<Element>) => {
    return caches.length > 0 && caches[caches.length - 1] === elm
  },
}
