import type { GetDataSourceParamsType } from '@hi-ui/schema-core'

type QueryFilterItem = {
  id?: string
  value?: unknown
}

export type PagedResponse<T> = {
  list: T[]
  total: number
  current: number
  pageSize: number
}

export function getKeywordValue(params: GetDataSourceParamsType) {
  const keywordFilter = ((params.filters ?? []) as QueryFilterItem[]).find((item) => item.id === 'keyword')
  return keywordFilter?.value != null ? String(keywordFilter.value).trim().toLowerCase() : ''
}

export function getParamsWithoutKeyword(params: GetDataSourceParamsType): GetDataSourceParamsType {
  return {
    ...params,
    filters: ((params.filters ?? []) as QueryFilterItem[]).filter((item) => item.id !== 'keyword'),
  }
}

export function filterListByKeyword<T>(
  list: T[],
  keyword: string,
  selectors: Array<(item: T) => unknown>
) {
  if (!keyword) return list

  return list.filter((item) =>
    selectors.some((selector) =>
      String(selector(item) ?? '')
        .toLowerCase()
        .includes(keyword)
    )
  )
}

export function paginateList<T>(
  list: T[],
  params: GetDataSourceParamsType
): PagedResponse<T> {
  const current = params.pagination?.current ?? 1
  const pageSize = params.pagination?.pageSize ?? 20
  const start = (current - 1) * pageSize

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    current,
    pageSize,
  }
}

export function countTreeNodes<T extends { children?: T[] }>(list: T[]): number {
  return list.reduce((count, item) => count + 1 + countTreeNodes(item.children ?? []), 0)
}
