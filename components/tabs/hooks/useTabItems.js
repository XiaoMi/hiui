import React, { useState, useEffect } from 'react'

const useTabItems = ({ children, max, type, placement, canScroll }) => {
  const [showTabItems, setShowTabItems] = useState([])
  const [hiddenTabItems, setHiddenTabItems] = useState([])

  useEffect(() => {
    const show = []
    const hidden = []
    React.Children.map(children, (child) => {
      if (child) {
        const { tabTitle, tabId, tabDesc, disabled, closeable = true, animation } = child.props
        const item = {
          tabTitle,
          tabId,
          tabDesc,
          disabled,
          closeable,
          animation
        }

        if ((type === 'card' || type === 'line') && placement === 'horizontal' && show.length >= max && !canScroll) {
          // 卡片式标签超过max时，其余标签的隐藏
          hidden.push(item)
        } else {
          show.push(item)
        }
      }
    })
    setHiddenTabItems(hidden)
    setShowTabItems(show)
  }, [children, max])

  return { showTabItems, hiddenTabItems, setShowTabItems, setHiddenTabItems }
}

export default useTabItems
