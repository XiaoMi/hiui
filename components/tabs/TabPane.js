import React from 'react'

const TabPane = ({ latestActiveIdIndex, activeIdIndex, index, prefixCls = 'hi-tabs-pane', children, show, animation, placement }) => {
  const defineAnimation = () => {
    if (latestActiveIdIndex === activeIdIndex) {
      return
    }
    if (activeIdIndex - 1 === index) {
      if (placement === 'horizontal') {
        animateClass = `${prefixCls}__` + (Number(latestActiveIdIndex) > Number(activeIdIndex) ? 'slide-right' : 'slide-left')
      } else {
        animateClass = `${prefixCls}__` + (Number(latestActiveIdIndex) > Number(activeIdIndex) ? 'slide-bottom' : 'slide-top')
      }
    }
    if (latestActiveIdIndex - 1 === index) {
      if (placement === 'horizontal') {
        animateClass = `${prefixCls}__` + (Number(latestActiveIdIndex) > Number(activeIdIndex) ? 'slide-right-leave' : 'slide-left-leave')
      } else {
        animateClass = `${prefixCls}__` + (Number(latestActiveIdIndex) > Number(activeIdIndex) ? 'slide-bottom-leave' : 'slide-top-leave')
      }
    }
    return animateClass
  }

  const style = show ? { flex: 1, position: 'relative' } : { width: index === latestActiveIdIndex - 1 ? '100%' : 0, overflow: 'hidden', opacity: 0, position: 'absolute' }

  let animateClass = animation ? defineAnimation() : ''
  return <div className={`${prefixCls} ${animateClass}`} style={style}>
    {children}
  </div>
}

export default TabPane
