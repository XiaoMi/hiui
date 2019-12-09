import jsdom from 'jsdom'
const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
global.fetch = require('jest-fetch-mock')

const { JSDOM } = jsdom
if (typeof document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>')
  global.window = dom.window
  global.document = global.window.document
  global.navigator = global.window.navigator
  console.log(global)
}
enzyme.configure({ adapter: new Adapter() })
