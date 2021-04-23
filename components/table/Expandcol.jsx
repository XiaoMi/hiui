import React, { useState, useEffect } from 'react'

const Expandcol = ({ rowData, index, expandedRender, setExpanded }) => {
  const [customNode, setCustomNode] = useState()
  useEffect(() => {
    const node = expandedRender(rowData, index)
    if (node.toString() === '[object Promise]') {
      setExpanded('loading')
      node
        .then((jsxElement) => {
          setCustomNode(jsxElement)
          setExpanded(true)
        })
        .catch((err) => {
          setCustomNode(err)
          setExpanded(true)
        })
    } else {
      setCustomNode(node)
      setExpanded(true)
    }
  }, [rowData, index, expandedRender])

  return <>{customNode}</>
}
export default Expandcol
