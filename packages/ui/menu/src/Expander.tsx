import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

export const Expander: React.FC<ExpanderProps> = ({ children, visible, className }) => {
  const [height, setHeight] = useState(visible ? 'auto' : 0)
  const innerRef = React.useRef<HTMLDivElement>(null)
  return (
    <CSSTransition
      in={visible}
      timeout={200}
      classNames={className}
      unmountOnExit={false}
      // 参考：https://github.com/reactjs/react-transition-group/issues/918
      nodeRef={innerRef}
      onEnter={() => {
        const element = innerRef.current
        if (!element) return
        setHeight(0)
        setTimeout(() => {
          setHeight(element.scrollHeight)
        })
      }}
      onEntered={() => {
        setHeight('auto')
      }}
      onExit={() => {
        const element = innerRef.current
        if (!element) return
        setHeight(element.scrollHeight)
        setTimeout(() => {
          setHeight(0)
        })
      }}
    >
      <div style={{ height, overflow: 'hidden', transition: 'all 0.3s' }} ref={innerRef}>
        {children}
      </div>
    </CSSTransition>
  )
}

interface ExpanderProps {
  className?: string
  visible: boolean
}
