export function getTextWidth (text) {
  var clientWidth = 0
  var span = document.createElement('span')
  span.innerText = text
  span.style.display = 'inline-block'
  span.style.position = 'fixed'
  span.style.top = '-100px'
  document.body.appendChild(span)
  clientWidth = span.clientWidth + 5
  document.body.removeChild(span)
  return clientWidth
}
