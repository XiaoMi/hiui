import React from 'react'
const Indent = ({ times }) => {
  let indents = []
  for (let i = 0; i <= times; i++) {
    indents.push(<span className='power-table__indent' key={Math.random()} />)
  }
  return indents
}

export default Indent
