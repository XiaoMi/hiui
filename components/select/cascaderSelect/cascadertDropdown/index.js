import React from 'react'

import './index.scss'
/**
 * @prop  {array} 渲染列表数据
 * [
 *  {
 *    id:     string  渲染id，唯一标识
 *    name:   string  显示内容
 *    level:  number  层级，索引从0开始
 *  }
 * ]
 */
class CascaderDropDown extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedTrace: [],
      trace: []
    }
  }

  renderList (current, index) {
    let {
      selectedTrace,
      trace
    } = this.state
    let {
      changeValue,
      hideDrop
    } = this.props

    index = index === undefined ? 0 : index + 1

    return (
      <ul className='cascader__list' key={index}>
        {
          current.map((v, i) => {
            return (
              <li
                className={`${trace[index] === i ? 'active' : ''} ${v.disabled ? 'disabled' : ''}`}
                key={i}
                title={v.name}
                onClick={e => {
                  e.stopPropagation()

                  if (v.disabled) {
                    return
                  }

                  selectedTrace[index] = {
                    id: v.id,
                    name: v.name
                  }

                  if (+v.level <= trace.length - 1) {
                    trace.length = v.level
                  }
                  trace.push(i)
                  this.setState({trace})

                  if (!v.children) {
                    changeValue(selectedTrace)
                    hideDrop(e)
                  }
                }}
              >
                {v.name}
              </li>
            )
          })
        }
      </ul>
    )
  }

  renderLists (list) {
    const {
      trace
    } = this.state
    let current = list

    return (
      <React.Fragment>
        {
          !trace.length
            ? (
              this.renderList(list)
            )
            : (
              trace.map((v, i) => {
                current = current[v].children
                if (i === trace.length - 1 && current) {
                  return this.renderList(current, i)
                }
              })
            )
        }
      </React.Fragment>
    )
  }

  render () {
    let {
      list
    } = this.props
    let {
      trace
    } = this.state
    let current = list

    return (
      <div className='cascader__dropdown-container'
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <ul className={`cascader__dropdown-tab`}>
          {
            trace.map((v, i) => {
              const item = current[v]
              current = current[v].children

              return (
                <li
                  key={i}
                  onClick={e => {
                    e.stopPropagation()

                    if (+item.level <= trace.length) {
                      trace.length = item.level
                    }

                    this.setState({trace})
                  }}
                >
                  {item.name}
                </li>
              )
            })
          }
          <li
            key={-1}
            className='unique'
            onClick={e => {
              e.stopPropagation()
            }}
          >
            请选择
          </li>
        </ul>
        {
          this.renderLists(list)
        }
      </div>
    )
  }
}

export default CascaderDropDown
