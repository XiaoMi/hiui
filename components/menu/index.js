import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
class Menu extends Component {
  static defaultProps = {
    mode: 'vertical'
  }
  static propTypes = {
    // list: PropTypes.oneOfType([
    //   PropTypes.string,
    //   PropTypes.shape({
    //     text: PropTypes.string.isRequired,
    //     value: PropTypes.oneOfType([
    //       PropTypes.string,
    //       PropTypes.number
    //     ]),
    //     children: PropTypes.array
    //   })
    // ]),
    list: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        children: PropTypes.array
      })
    ])),
    mode: PropTypes.oneOf(['horizontal', 'vertical']),
    onSelect: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
  }
  render () {
    const {list, mode} = this.props
    const cls = classnames('hi-menu', `hi-menu-${mode}`)
    return <ul className={cls}>
      {
        list.map((item, index) => {
          return <li key={index}>
            {item.title}
          </li>
        })
      }
    </ul>
  }
}
export default Menu
