import ReactDOM from 'react-dom'

function createLegacyRoot(container) {
  return {
    render(element) {
      ReactDOM.render(element, container)
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container)
    },
  }
}

export function createRoot(container) {
  return createLegacyRoot(container)
}

export function hydrateRoot(container, element) {
  ReactDOM.hydrate(element, container)
  return createLegacyRoot(container)
}

export default {
  createRoot,
  hydrateRoot,
}
