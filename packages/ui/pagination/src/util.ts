/**
 * 计算页数
 */
export const calculatePage = (total: number, pageSize: number): number => {
  return Math.ceil(total / pageSize)
}
