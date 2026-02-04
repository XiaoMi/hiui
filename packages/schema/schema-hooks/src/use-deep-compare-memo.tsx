import { useMemo, useRef, type DependencyList } from 'react'
import { depsEqual } from 'ahooks/es/utils/depsEqual'

// inspired by https://ahooks.js.org/zh-CN/hooks/use-deep-compare-effect
// https://github.com/alibaba/hooks/blob/master/packages/hooks/src/createDeepCompareEffect/index.ts
export function useDeepCompareMemo<T>(factory: () => T, deps?: DependencyList) {
  const depsRef = useRef<DependencyList>()
  const signalRef = useRef<number>(0)

  if (deps === undefined || !depsEqual(deps, depsRef.current)) {
    depsRef.current = deps
    signalRef.current += 1
  }

  const hook = useMemo // 规避 eslint 警告用的
  return hook(factory, [signalRef.current])
}

export function useDeepCompareFlag(deps?: DependencyList) {
  const flagRef = useRef(0)

  function deepCompareFlagFactory() {
    return ++flagRef.current
  }

  return useDeepCompareMemo(deepCompareFlagFactory, deps)
}
