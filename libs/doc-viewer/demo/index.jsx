import React from 'react'
import Doc from './doc.mdx'
console.log('doc', Doc)
const files = require.context('./', false, /.mdx$/)
files.keys().forEach(key => {
  console.log(key, files(key).default)
})
// console.log('files', files)
const DocWrapper = () => (
  <div className='doc-md'>
    <Doc />
  </div>
)
export default DocWrapper
