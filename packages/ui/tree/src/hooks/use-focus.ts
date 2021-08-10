import React, { useCallback, useState } from 'react'
import { TreeNodeEventData, TreeNodeRequiredProps, FlattedTreeNodeData } from '../types'
import { getTreeNodeEventData } from '../utils'

export const useFocus = (
  getTreeNodeRequiredProps: (id: React.ReactText) => TreeNodeRequiredProps,
  transitionData: FlattedTreeNodeData[],
  selectedId: React.ReactText | null,
  onSwitch: (node: TreeNodeEventData, shouldExpanded: boolean) => Promise<void>,
  onSelect: (selectedNode: TreeNodeEventData) => void,
  onNodeCheck: (checkedNode: TreeNodeEventData, checked: boolean) => void
) => {
  const getFocusedNodeIndex = useCallback(
    (initialFocusedId?: React.ReactText) => {
      let index: number

      if (
        initialFocusedId &&
        (index = transitionData.findIndex(({ id }) => id === initialFocusedId)) !== -1
      ) {
        return index
      }

      if ((index = transitionData.findIndex(({ id }) => id === selectedId)) !== -1) {
        return index
      }

      return -1
    },
    [transitionData, selectedId]
  )

  const [focusedId, setFocusedId] = useState<React.ReactText | undefined>()

  const offsetFocus = useCallback(
    (focusedIndex: number, offset: number) => {
      const startIndex = focusedIndex
      let index = startIndex

      index = (index + offset + transitionData.length) % transitionData.length
      setFocusedId(transitionData[index].id)

      // 跳过 disabled
      // do {
      //   index = (index + offset + transitionData.length) % transitionData.length

      //   if (!transitionData[index].disabled) {
      //     setFocusedId(transitionData[index].id)
      //     return
      //   }
      // } while (index !== startIndex)
    },
    [transitionData]
  )

  const onKeyDown = (evt: React.KeyboardEvent<HTMLUListElement>) => {
    evt.stopPropagation()

    if (transitionData.length < 0) return

    const focusedIndex = getFocusedNodeIndex(focusedId)
    console.log(transitionData, focusedId, focusedIndex)

    switch (evt.keyCode) {
      // Up: 选中界面的上一个节点
      case 38: {
        evt.preventDefault()
        offsetFocus(focusedIndex === -1 ? 0 : focusedIndex, -1)
        break
      }
      // Down: 选中界面的下一个节点
      case 40: {
        evt.preventDefault()
        offsetFocus(focusedIndex, 1)
        break
      }
      case 37:
      case 39:
      case 13:
      case 32: {
        if (focusedIndex === -1) {
          setFocusedId(0)
          return
        }
      }
    }

    const focusNode = transitionData[focusedIndex]
    const eventNode = getTreeNodeEventData(focusNode, getTreeNodeRequiredProps(focusNode.id))

    switch (evt.keyCode) {
      // Left: 选中界面上一层节点，如果展开，则收起
      case 37: {
        evt.preventDefault()

        if (eventNode.expanded) {
          onSwitch(eventNode, false)
        } else {
          if (focusNode.parent) {
            setFocusedId(focusNode.parent.id)
          }
          // 跳过 disabled
          // if (focusNode.ancestors) {
          //   const nextFocusNode = focusNode.ancestors.find((child) => {
          //     return !child.disabled
          //   })
          //   if (nextFocusNode) {
          //     setFocusedId(nextFocusNode.id)
          //   }
          // }
        }

        break
      }
      // Right: 选中界面下一层节点，如果收起，则展开
      case 39: {
        evt.preventDefault()

        const focusNode = transitionData[focusedIndex]
        const eventNode = getTreeNodeEventData(focusNode, getTreeNodeRequiredProps(focusNode.id))

        if (!eventNode.expanded) {
          onSwitch(eventNode, true)
        } else {
          if (focusNode.children && focusNode.children.length > 0) {
            setFocusedId(focusNode.children[0].id)
            // 跳过 disabled
            // const nextFocusNode = focusNode.children.find((child) => {
            //   return !child.disabled
            // })

            // if (nextFocusNode) {
            //   setFocusedId(nextFocusNode.id)
            // }
          }
        }

        break
      }
      // Enter: 单选当前节点
      case 13: {
        evt.preventDefault()

        onSelect(eventNode)
        break
      }
      // Space: 复现当前节点
      case 32: {
        evt.preventDefault()
        onNodeCheck(eventNode, !eventNode.checked)
        break
      }
    }
  }

  const onBlur = useCallback((evt) => {
    console.log(evt)

    setFocusedId(undefined)
  }, [])

  const onFocus = useCallback((node: TreeNodeEventData) => {
    if (node.disabled) return
    setFocusedId(node.id)
  }, [])

  return [focusedId, onKeyDown, onBlur, onFocus] as const
}
