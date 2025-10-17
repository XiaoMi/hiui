import type React from 'react'
import ReactDOM from 'react-dom'

const MARK = '__hi_react_root__'

type Root = {
  render: (node: React.ReactElement) => void
  unmount: () => void
}

type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root
}

type CreateRootFn = (container: ContainerType) => Root

type MockReactDOM = typeof ReactDOM & {
  createRoot?: CreateRootFn
}

// 引用原始 ReactDOM 对象，但不修改
const clonedReactDOM = { ...ReactDOM } as MockReactDOM

const { version, render: reactLegacyRender, unmountComponentAtNode } = clonedReactDOM

let createRoot: CreateRootFn | undefined
try {
  const mainVersion = Number((version || '').split('.')[0])
  if (mainVersion >= 18) {
    ;({ createRoot } = clonedReactDOM)
  }
} catch (e) {
  // Do nothing;
}

function ignoreWarning(skip: boolean) {
  // @ts-expect-error ReactDOM 的私有属性
  const { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } = clonedReactDOM

  if (
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED &&
    typeof __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === 'object'
  ) {
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = skip
  }
}

function modernRender(node: React.ReactElement, container: ContainerType) {
  ignoreWarning(true)
  const root = container[MARK] || createRoot!(container)
  ignoreWarning(false)

  root.render(node)

  container[MARK] = root
}

function legacyRender(node: React.ReactElement, container: ContainerType) {
  reactLegacyRender?.(node, container)
}

export function render(node: React.ReactElement, container: ContainerType) {
  if (createRoot) {
    modernRender(node, container)
    return
  }

  legacyRender(node, container)
}

function modernUnmount(container: ContainerType) {
  // 避免 React18 的 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount()

    delete container[MARK]
  })
}

function legacyUnmount(container: ContainerType) {
  unmountComponentAtNode(container)
}

export function unmount(container: ContainerType) {
  if (createRoot !== undefined) {
    // 避免 React18 的 sync warning
    return modernUnmount(container)
  }

  legacyUnmount(container)
  return Promise.resolve() // 保持接口签名一致
}
