const { getNested, setNested } = require('../src')

describe('@hi-ui/func-utils', () => {
  it('Get correct value using getNested', () => {
    const obj = {
      a: {
        b: [1, { c: 33 }],
      },
    }

    expect(getNested(obj, ['a', 'b', '1', 'c'])).toEqual(33)
  })

  it('Return undefined when not found using getNested', () => {
    const obj = {
      a: {
        b: [1, { c: 33 }],
      },
    }

    expect(getNested(obj, ['a', 'b', '2'])).toEqual(undefined)
  })

  it('Set nested value using setNested', () => {
    const obj = {
      a: {
        b: [1, { c: 33 }],
      },
    }

    expect(setNested(obj, ['a', 'b', '2'], 22)).toEqual({
      a: {
        b: [1, { c: 33 }, 22],
      },
    })
  })

  it('Set array value when path is number using setNested', () => {
    const obj = {
      a: {
        b: [1, { c: 33 }],
      },
    }

    expect(setNested(obj, ['a', 'b', '2', 0], 22)).toEqual({
      a: {
        b: [1, { c: 33 }, [22]],
      },
    })
  })
})
