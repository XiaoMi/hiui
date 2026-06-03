describe('@hi-ui/hiui-cli', () => {
  it('exports CLI program factory', () => {
    const { createProgram } = require('../lib/index')
    expect(createProgram).toBeDefined()
    expect(typeof createProgram).toBe('function')
  })
})
