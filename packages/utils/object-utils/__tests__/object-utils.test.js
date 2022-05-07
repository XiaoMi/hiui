import { merge, object2Paths } from '../src'

describe('@hi-ui/object-utils', () => {
  it('object2Paths tests', () => {
    const result = object2Paths({ a: [{ 9: 'bb' }, { ccc: ['dddd1', 'dddd2'] }] })

    expect(result).toEqual([
      ['a', 0, '9', 'bb'],
      ['a', 1, 'ccc', 0, 'dddd1'],
      ['a', 1, 'ccc', 1, 'dddd2'],
    ])
  })

  it('merge tests', () => {
    const result = merge(
      { a: [{ 9: 'bb' }, { ccc: ['dddd1', 'dddd2'] }] },
      { a: [{ 9: 'bbs' }, { ccc: ['eeee'] }] }
    )

    expect(result).toEqual({ a: [{ 9: 'bbs' }, { ccc: ['eeee', 'dddd2'] }] })
  })
})
