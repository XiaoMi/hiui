import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import prifix from '../prefix'
// import {scrollTop, scrollLeft} from '../tool'

class HeaderMenu extends Component {
  render () {
    let {highlighCol, freezeCol, hideCol, index, freeze, canHideCol, localeDatas} = this.props
    return (
      <div className={prifix('table-header-menu')}>
        <p onClick={(e) => highlighCol(index)} >{localeDatas.table.highlight}</p>
        {freeze && <p onClick={(e) => freezeCol(index)} >{localeDatas.table.freeze}</p>}
        {canHideCol && <p onClick={(e) => hideCol(index)}>{localeDatas.table.hide}</p>}
      </div>
    )
  }
}

let div

const hide = () => {
  if (div) {
    ReactDOM.unmountComponentAtNode(div)
    document.body.removeChild(div)
    div = null
  }
}

document.addEventListener('click', () => {
  setTimeout(hide, 0)
})
export default {
  show (e, cbs, key, freeze, size = 'normal', canHideCol, localeDatas) {
    div && hide()
    div = document.createElement('div')
    div.className = 'hi-table-header-menu-' + size
    div.style.zIndex = '99999'
    ReactDOM.render(<HeaderMenu {...cbs} canHideCol={canHideCol} index={key} freeze={freeze} localeDatas={localeDatas} />, div)
    div.style.position = 'absolute'
    div.style.left = e.pageX + 'px'
    div.style.top = e.pageY + 'px'
    document.body.appendChild(div)
  }
}
