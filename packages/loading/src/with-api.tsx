import React, { createRef, forwardRef } from 'react'
import { render, unmountComponentAtNode, createPortal } from 'react-dom'
import Container from './container'
import Loading from './loading'
import __DEV__ from './env'
import { _prefix } from './loading'

const prefixCls = _prefix
const loadingInstanceCache = {}
const wrapperCls = `.${prefixCls}-wrapper`

const open = ({ key, text }: LoadingApiProps = {}) => {
  const ref = createRef()
  let mountNode: HTMLDivElement | null = document.createElement('div')
  render(<LoadingFull ref={ref} text={text} />, mountNode)

  const close = () => {
    if (ref.current) {
      ref.current.close()
    }

    setTimeout(() => {
      unmountComponentAtNode(mountNode as Element)
      mountNode = null
      Container.remove(wrapperCls)
    }, 300)
  }

  if (key) {
    loadingInstanceCache[key] = close
  }

  return { close }
}

const close = (key: string) => {
  if (typeof loadingInstanceCache[key] === 'function') {
    loadingInstanceCache[key]()
  }

  delete loadingInstanceCache[key]
}

interface LoadingFullProps {
  text?: string
}

interface LoadingApiProps extends LoadingFullProps {
  key?: string
}

const LoadingFull = forwardRef<React.FC, LoadingFullProps>(({ text }, ref) => {
  const wrapper = Container.get(wrapperCls) as HTMLElement
  const children = <Loading ref={ref} full text={text} />

  return createPortal(children, wrapper)
})

if (__DEV__) {
  LoadingFull.displayName = 'LoadingFull'
}

function withLoading(instance: typeof Loading) {
  return Object.assign(instance, { open, close })
}

export default withLoading
