export const MIN_PAGE = 1

/**
 * 计算页数
 */
export const calculatePage = (total: number, pageSize: number): number => {
  return Math.ceil(total / pageSize)
}

export const calculateCurrentPageSize = (
  current: number,
  total: number,
  pageSize: number
): number => {
  const pageCount = calculatePage(total, pageSize)

  if (current < MIN_PAGE || current > pageCount) return 0

  if (current < pageCount) return pageSize

  return Math.ceil(total % pageSize)
}
