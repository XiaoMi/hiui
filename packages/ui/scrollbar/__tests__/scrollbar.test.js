const React = require('react')
const ReactDOM = require('react-dom')
const { act } = require('react-dom/test-utils')
const { Scrollbar } = require('../src')

describe('@hi-ui/scrollbar', () => {
  const originalResizeObserver = global.ResizeObserver
  let container
  let innerRef
  let addEventListener
  let removeEventListener

  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      disconnect() {}
    }
  })

  afterAll(() => {
    global.ResizeObserver = originalResizeObserver
  })

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    innerRef = React.createRef()
    addEventListener = jest.spyOn(document, 'addEventListener')
    removeEventListener = jest.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container)
    })
    container.remove()
    jest.restoreAllMocks()
  })

  const render = (props = {}) => {
    act(() => {
      ReactDOM.render(React.createElement(Scrollbar, { innerRef, ...props }), container)
    })
    return innerRef.current.instance
  }

  const keydownListeners = (spy) =>
    spy.mock.calls.filter(([event]) => event === 'keydown').map(([, listener]) => listener)

  it('removes document listeners after each mount and unmount', () => {
    for (let index = 0; index < 3; index++) {
      const instance = render()
      expect(instance.isAlive).toBe(true)
      expect(keydownListeners(addEventListener)).toHaveLength(index + 1)

      act(() => {
        ReactDOM.unmountComponentAtNode(container)
      })

      expect(keydownListeners(removeEventListener)).toEqual(keydownListeners(addEventListener))
      expect(instance.isAlive).toBe(false)
      expect(instance.element).toBeNull()
    }
  })

  it('destroys the previous instance when zIndex recreates the scrollbar', () => {
    const previous = render({ zIndex: 10 })
    const instance = render({ zIndex: 20 })

    expect(instance).not.toBe(previous)
    expect(previous.isAlive).toBe(false)
    expect(instance.isAlive).toBe(true)
    expect(keydownListeners(addEventListener)).toHaveLength(2)
    expect(keydownListeners(removeEventListener)).toEqual([keydownListeners(addEventListener)[0]])
    expect(container.querySelectorAll('.ps__rail-x, .ps__rail-y')).toHaveLength(2)
    expect(instance.element.style.getPropertyValue('--scrollbar-zIndex')).toBe('20')
  })

  it('keeps the current instance alive for updates that do not recreate it', () => {
    const previous = render({ zIndex: 10, axes: 'both' })
    const instance = render({ zIndex: 10, axes: 'y' })

    expect(instance).toBe(previous)
    expect(instance.isAlive).toBe(true)
    expect(instance.settings.suppressScrollX).toBe(true)
    expect(instance.settings.suppressScrollY).toBe(false)
    expect(keydownListeners(addEventListener)).toHaveLength(1)
    expect(keydownListeners(removeEventListener)).toHaveLength(0)
  })
})
