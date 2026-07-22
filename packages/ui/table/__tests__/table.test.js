const Table = require('../src')
const { getVirtualColWidths } = require('../src/hooks/use-col-width')

describe('@hi-ui/table', () => {
  it('needs tests', () => {})

  it('keeps resized virtual column widths when columns rerender', () => {
    const columns = [
      { dataKey: 'name', width: 100 },
      { dataKey: 'age', width: 100 },
    ]

    expect(getVirtualColWidths(columns, 300, [180, 120])).toEqual([180, 120])
  })
})
