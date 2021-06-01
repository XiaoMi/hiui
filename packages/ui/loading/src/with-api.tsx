import React, { createRef, forwardRef } from 'react'
import { render, unmountComponentAtNode, createPortal } from 'react-dom'
import Container from './container'
import Loading from './loading'
import __DEV__ from './env'
import { _prefix, LoadingProps } from './loading';

const prefixCls = _prefix
const loadingInstanceCache: {
  [key: string]: () => void
} = {}

const wrapperCls = `.${prefixCls}-wrapper`

const open = ({ key, label }: LoadingApiProps = {}) => {
  let mountNode: HTMLDivElement | null = document.createElement('div')
  const ref = createRef<any>()

  render(<LoadingFull ref={ref} label={label} />, mountNode)

  const close = () => {
    ref.current?.$close()

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
  label?: string
}

interface LoadingApiProps extends LoadingFullProps {
  key?: string
}

const LoadingFull = forwardRef<null, LoadingProps>(({ label }, ref) => {
  const wrapper = Container.get(wrapperCls) as HTMLElement
  const children = <Loading ref={ref} full label={label} />

  return createPortal(children, wrapper)
})

if (__DEV__) {
  LoadingFull.displayName = 'LoadingFull'
}

function withLoading(instance: typeof Loading) {
  return Object.assign(instance, { open, close })
}

export default withLoading
