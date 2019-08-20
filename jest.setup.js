const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
global.fetch = require('jest-fetch-mock')

enzyme.configure({ adapter: new Adapter() })
