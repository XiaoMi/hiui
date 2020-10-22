import React from 'react'
const Indent = ({ times }) => {
  const indents = []
  for (let i = 0; i <= times; i++) {
    indents.push(<span className="hi-table__indent" key={Math.random()} />)
  }
  return indents
}

export default Indent
