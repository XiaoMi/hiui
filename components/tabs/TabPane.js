import React from 'react'

const TabPane = ({ latestActiveIdIndex, activeIdIndex, index, prefixCls = 'hi-tabs-pane', children, show, duration, placement }) => {
  console.log(placement === 'horizontal')
  const defineAnimation = () => {
    if (latestActiveIdIndex === activeIdIndex) {
      return
    }
    if (activeIdIndex - 1 === index) {
      if (placement === 'horizontal') {
        animateClass = latestActiveIdIndex > activeIdIndex ? 'slide-right' : 'slide-left'
      } else {
        animateClass = latestActiveIdIndex > activeIdIndex ? 'slide-bottom' : 'slide-top'
      }
    }

    if (latestActiveIdIndex - 1 === index) {
      if (placement === 'horizontal') {
        animateClass = latestActiveIdIndex > activeIdIndex ? 'slide-right-leave' : 'slide-left-leave'
      } else {
        animateClass = latestActiveIdIndex > activeIdIndex ? 'slide-bottom-leave' : 'slide-top-leave'
      }
    }
    return animateClass
  }

  const style = show ? { flex: 1, position: 'relative' } : { width: index === latestActiveIdIndex - 1 ? '100%' : 0, overflow: 'hidden', opacity: 0, position: 'absolute' }

  let animateClass = duration ? defineAnimation() : ''
  return <div className={`${prefixCls} ${animateClass}`} style={style}>
    {children}
  </div>
}

export default TabPane
