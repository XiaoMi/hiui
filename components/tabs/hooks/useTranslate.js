import React, { useCallback } from 'react'
import Icon from '../../icon'

const useTranslate = ({ elementRef, canScroll, prefixCls }) => {
  // 左移
  const translateLeft = useCallback(() => {
    const container = elementRef.current
    const width = container.scrollWidth
    let transX = Number(document.defaultView.getComputedStyle(container, null).transform.split(',')[4])
    if (Math.abs(transX) > width / 3) {
      transX += width / 3
    } else {
      transX += Math.abs(transX)
    }
    container.style.transform = 'translateX(' + transX + 'px)'
  }, [elementRef.current])

  // 右移
  const translateRight = useCallback(() => {
    const container = elementRef.current
    const width = container.scrollWidth
    const clientWidth = container.clientWidth
    let transX = Number(document.defaultView.getComputedStyle(container, null).transform.split(',')[4])

    let srcollWidth
    if (width / 3 > width - clientWidth) {
      srcollWidth = width - clientWidth
    } else {
      srcollWidth = width / 3
    }
    if (Math.abs(transX) + clientWidth + srcollWidth > width) {
      transX = width - clientWidth - Math.abs(transX) + Math.abs(transX)
    } else {
      transX = Math.abs(transX - srcollWidth)
    }

    container.style.transform = 'translateX(-' + transX + 'px)'
  }, [elementRef.current])

  return {
    leftBtn: canScroll && <Icon name="left" className={`${prefixCls}__scroll__icon`} onClick={translateLeft} />,
    rightBtn: canScroll && <Icon name="right" className={`${prefixCls}__scroll__icon`} onClick={translateRight} />
  }
}

export default useTranslate
