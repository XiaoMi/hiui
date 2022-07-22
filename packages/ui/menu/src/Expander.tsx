import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

export const Expander: React.FC<ExpanderProps> = ({ children, visible, className }) => {
  const [height, setHeight] = useState(visible ? 'auto' : 0)
  return (
    <CSSTransition
      in={visible}
      timeout={200}
      classNames={className}
      unmountOnExit={false}
      onEnter={(element: HTMLElement) => {
        setHeight(0)
        setTimeout(() => {
          setHeight(element.scrollHeight)
        })
      }}
      onEntered={() => {
        setHeight('auto')
      }}
      onExit={(element: HTMLElement) => {
        setHeight(element.scrollHeight)
        setTimeout(() => {
          setHeight(0)
        })
      }}
    >
      <div style={{ height, overflow: 'hidden', transition: 'all 0.3s' }}>{children}</div>
    </CSSTransition>
  )
}

interface ExpanderProps {
  className?: string
  visible: boolean
}
