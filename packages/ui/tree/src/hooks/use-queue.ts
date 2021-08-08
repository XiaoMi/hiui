import { useState, useCallback } from 'react'

export const useQueue = <T>(initialValue: T[] = []) => {
  const [queue, setQueue] = useState(initialValue)

  const enqueue = useCallback((value: T) => {
    setQueue((prevQueue) => [...prevQueue, value])
  }, [])

  const dequeue = useCallback(() => {
    setQueue(([_, ...nextQueue]) => nextQueue)
  }, [])

  return {
    enqueue,
    dequeue,
    get top() {
      return queue[0]
    },
    get empty() {
      return queue.length === 0
    },
  }
}
