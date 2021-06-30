import React, { createRef, forwardRef } from 'react'
import { render, unmountComponentAtNode, createPortal } from 'react-dom'
import * as Container from '@hi-ui/container'
import { _prefix, Loading, LoadingProps } from './Loading'
import { __DEV__ } from '@hi-ui/env'

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

type LoadingFullProps = {
  label?: string
}

type LoadingApiProps = LoadingFullProps & {
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
