export type OnChangeFnCtxType<TState> = {
  rawState: TState
}

/**
 * 确保状态字段完整性，为被清空的字段添加默认值
 * @param state 变化前的状态
 * @param newState 变化后的状态
 * @param stateKey 要设置默认值的字段名
 * @param defaultValue 字段被清空时的默认值
 * @returns 处理后的状态
 */
export function ensureStateFields<
  TState extends { id: string },
  TKey extends keyof TState,
  TValue extends TState[TKey]
>(state: TState[], newState: TState[], stateKey: TKey, defaultValue: TValue | undefined): TState[] {
  // 如果没有前一个状态，直接返回新状态
  if (!state || state.length === 0) return newState

  // 创建新状态的 id 集合
  const newStateIds = new Set(newState.map((item) => item.id))

  // 找出被删除的字段，为它们添加默认值
  const missingItems = state
    .filter((item) => !newStateIds.has(item.id))
    .map((item) => ({ id: item.id, [stateKey]: defaultValue } as TState))

  // 合并新状态和缺失字段的默认值
  return [...newState, ...missingItems]
}
