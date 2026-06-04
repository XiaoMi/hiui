describe('@hi-ui/hiui-cli', () => {
  it('exports CLI program factory', () => {
    const { createProgram } = require('../lib/index')
    expect(createProgram).toBeDefined()
    expect(typeof createProgram).toBe('function')
  })

  it('returns package version', () => {
    const { getCliVersionInfo } = require('../lib/version')
    const pkg = require('../package.json')
    expect(getCliVersionInfo()).toEqual({
      name: pkg.name,
      version: pkg.version,
    })
  })
})
