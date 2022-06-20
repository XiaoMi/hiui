import { useState, useEffect, useCallback, useRef } from 'react'

const useSelect = ({ defaultSelectedId, selectedId, onSelect, selectable }) => {
  const [_selectedId, setSelectedId] = useState((selectable && selectedId) || (selectable && defaultSelectedId) || null)

  useEffect(() => {
    if (selectable && selectedId) {
      setSelectedId(selectedId)
    }
  }, [selectedId, selectable])

  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  const onSelectNode = useCallback(
    (selectedNode) => {
      if (!selectable) return
      // 兼容老版本：全局开启了 selectable，子节点默认都支持 selectable
      if (selectedNode.selectable === false) return

      if (selectedNode !== undefined && !selectedId) {
        setSelectedId(selectedNode.id)
      }
      const onSelect = onSelectRef.current
      if (onSelect) {
        onSelect(selectedNode)
      }
    },
    [selectedId, selectable]
  )
  return [_selectedId, onSelectNode]
}

export default useSelect
