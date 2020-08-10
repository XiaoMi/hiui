import { useState, useEffect, useCallback } from 'react'

const useSelect = ({ defaultSelectedId, selectedId, onSelect, selectable }) => {
  const [_selectedId, setSelectedId] = useState((selectable && selectedId) || (selectable && defaultSelectedId) || null)

  useEffect(() => {
    if (selectable && selectedId) {
      setSelectedId(selectedId)
    }
  }, [selectedId, selectable])

  const onSelectNode = useCallback(
    (selectedNode) => {
      if (selectable) {
        if (selectedNode !== undefined && !selectedId) {
          setSelectedId(selectedNode.id)
        }
        if (onSelect) {
          onSelect(selectedNode)
        }
      }
    },
    [selectedId, selectable]
  )
  return [_selectedId, onSelectNode]
}

export default useSelect
