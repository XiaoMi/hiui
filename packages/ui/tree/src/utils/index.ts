export * from './tree'

/**
 * 生成 uuid
 *
 * @returns unique id
 */
export const uuid = () => Math.random().toString(36).substring(5).split('').join('.')
