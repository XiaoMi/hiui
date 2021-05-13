// 测试 scss
import './styles/index.scss'

// 测试多文件导出
export * from './Hello'
export { default } from './Hello'

const styleInject = require('../../../node_modules/style-inject/dist/style-inject.es.js')
console.log(styleInject)
