import { describe, it, expect } from 'vitest'
import { mergeFieldsValue } from '../src/ref'

describe('mergeFieldsValue', () => {
  describe('空值处理', () => {
    it('当之前的值为 null 时，应返回新值', () => {
      const beforeValue = null
      const incomingValue = { name: 'test' }
      expect(mergeFieldsValue(beforeValue, incomingValue)).toBe(incomingValue)
    })

    it('当之前的值为 undefined 时，应返回新值', () => {
      const beforeValue = undefined
      const incomingValue = { name: 'test' }
      expect(mergeFieldsValue(beforeValue, incomingValue)).toBe(incomingValue)
    })

    it('当新值为 null 时，应返回 null', () => {
      const beforeValue = { name: 'test' }
      const incomingValue = null
      expect(mergeFieldsValue(beforeValue, incomingValue)).toBe(incomingValue)
    })

    it('当新值为 undefined 时，应返回之前字段值', () => {
      const beforeValue = { name: 'test' }
      const incomingValue = undefined
      expect(mergeFieldsValue(beforeValue, incomingValue)).toBe(beforeValue)
    })
  })

  describe('数组处理', () => {
    it('当两个值都是数组时，应使用 mergeList 合并', () => {
      const beforeValue = /*  */ [{ id: 1, name: 'a' }]
      const incomingValue = /**/ [{ /*  */ name: 'b' }]
      const result = mergeFieldsValue(beforeValue, incomingValue)

      expect(result).toEqual([{ id: 1, name: 'b' }])
    })

    it('当一个值是数组，另一个不是时，应返回新值', () => {
      const beforeValue = [{ id: 1 }]
      const incomingValue = { id: 2 }

      expect(mergeFieldsValue(beforeValue, incomingValue)).toEqual(incomingValue)
    })

    // 当两个数组长度不同时
    it('当两个数组长度不同时，应合并数组', () => {
      const beforeValue = [{ id: 1 }, { id: 2 }, { id: 3 }]
      // eslint-disable-next-line no-sparse-arrays
      const incomingValue = [, , { id: 4, name: 'b' }]

      const result = mergeFieldsValue(beforeValue, incomingValue)
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 4, name: 'b' }])
    })
  })

  describe('对象处理', () => {
    it('当两个值都是对象时，应递归合并所有属性', () => {
      const beforeValue = {
        id: 1,
        meta: {
          author: 'John',
        },
      }
      const incomingValue = {
        name: 'test',
        meta: {
          author: 'Jane',
          date: '2023-01-01',
        },
      }

      expect(mergeFieldsValue(beforeValue, incomingValue)).toEqual({
        id: 1,
        name: 'test',
        meta: {
          author: 'Jane',
          date: '2023-01-01',
        },
      })
    })

    it('当对象包含嵌套对象时，应递归合并嵌套对象', () => {
      const beforeValue = {
        user: { id: 1, profile: { name: 'John', age: 30 } },
      }
      const incomingValue = {
        user: { profile: { name: 'Jane', height: 170 } },
      }

      expect(mergeFieldsValue(beforeValue, incomingValue)).toEqual({
        user: {
          id: 1,
          profile: {
            name: 'Jane',
            age: 30,
            height: 170,
          },
        },
      })
    })

    it('当对象属性中包含数组时，应使用 mergeList 合并数组', () => {
      const beforeValue = {
        id: 1,
        items: [{ id: 1, name: 'item1' }],
      }
      const incomingValue = {
        name: 'test',
        items: [{ id: 1, price: 100 }],
      }

      const result = mergeFieldsValue(beforeValue, incomingValue)
      expect(result).toEqual({
        id: 1,
        name: 'test',
        items: [{ id: 1, name: 'item1', price: 100 }],
      })
    })
  })

  describe('其他类型处理', () => {
    it('当之前值是对象，新值是原始类型时，应返回新值', () => {
      const beforeValue = { id: 1 }
      const incomingValue = 'test'

      expect(mergeFieldsValue(beforeValue, incomingValue)).toBe('test')
    })

    it('当之前值是原始类型，新值是对象时，应返回新值', () => {
      const beforeValue = 'test'
      const incomingValue = { id: 1 }

      expect(mergeFieldsValue(beforeValue, incomingValue)).toBe(incomingValue)
    })

    it('当两个值都是原始类型时，应返回新值', () => {
      const beforeValue = 'old'
      const incomingValue = 'new'

      expect(mergeFieldsValue(beforeValue, incomingValue)).toBe('new')
    })
  })

  describe('复杂类型处理', () => {
    it('当两个值都是复杂类型时，应递归合并所有属性', () => {
      const beforeValue = {
        dockCapacity: [
          {
            // eslint-disable-next-line no-sparse-arrays
            jobCapacity: [, [{ a: 1 }]],
          },
        ],
      }
      const incomingValue = {
        dockCapacity: [
          {
            // eslint-disable-next-line no-sparse-arrays
            jobCapacity: [, , [{ b: 2 }]],
          },
        ],
      }

      const result = mergeFieldsValue(beforeValue, incomingValue)
      expect(result).toEqual({
        dockCapacity: [
          {
            // eslint-disable-next-line no-sparse-arrays
            jobCapacity: [, [{ a: 1 }], [{ b: 2 }]],
          },
        ],
      })
    })
  })
})
