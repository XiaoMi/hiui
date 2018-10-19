import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import marked from 'marked'
import { transform } from 'babel-standalone'
import Prism from 'prismjs'

class Demo extends Component {
  constructor (props) {
    super(props)

    this.playerId = `${parseInt(Math.random() * 1e9).toString(36)}`
    this.document = this.props.children.match(/([^]*)\n?(```[^]+```)/)
    this.description = marked(this.document[1])
    this.source = this.document[2].match(/```(.*)\n([^]+)```/)
    // parseType 为 'run' 时，仅仅执行代码，不进行展示。其他簪用 'demo' 字符串代替
    this.parseType = this.source[1]

    this.state = {
      showCode: false
    }
  }

  static code
  static pre
  static desc

  static defaultProps = {
    theme: 'default',
    locale: 'zh-CN'
  }

  static propTypes = {
    locale: PropTypes.string
  }

  componentDidMount () {
    this.parseType && this.renderSource(this.source[2])
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.theme !== nextProps.theme) {
      setTimeout(() => this.renderSource(this.source[2]), 0)
    }
  }

  blockControl () {
    this.setState({
      showBlock: !this.state.showBlock
    })
  }
  renderSource (value) {
    const { locale, theme } = this.props
    import('../../components')
      .then(Element => {
        const args = ['context', 'React', 'ReactDOM']
        const argv = [this, React, ReactDOM]

        for (const key in Element) {
          args.push(key)
          argv.push(Element[key])
        }

        return { args, argv }
      })
      .then(({ args, argv }) => {
        const code = transform(
          `class Demo extends React.Component {
          ${value}
        }

        ReactDOM.render(
          <ThemeContext.Provider value='${theme}'>
            <LocaleContext.Provider value='${locale}'>
              <Demo {...context.props}/>
            </LocaleContext.Provider>
          </ThemeContext.Provider>
          , document.getElementById('${this.playerId}'))
        `,
          {
            presets: ['es2015', 'react']
          }
        ).code

        args.push(code)

        var Fn = Function
        new Fn(...args).apply(null, argv)
      })
      .catch(err => {
        if (process.env.NODE_ENV !== 'production') {
          throw err
        }
      })
  }

  render () {
    const showCode = this.state.showCode

    return (
      <div className={`demo-box demo-box-${this.props.name}`}>
        <div className={`run-demo${this.parseType === 'run' ? 'parseType-run' : ''}`} id={this.playerId} />
        {
          this.parseType !== 'run'
            ? (
              <div className={`code-demo ${showCode ? '' : 'none'}`}>
                <div className='code' ref={(arg) => { this.code = arg }}>
                  <div
                    className='description-box'
                    ref={arg => { this.desc = arg }}
                  >
                    {this.description && (
                      <div
                        ref='description'
                        className='description'
                        dangerouslySetInnerHTML={{ __html: this.description }}
                      />
                    )}
                    <span
                      className='code-copy'
                      onClick={() => {
                        var text = this.pre

                        if (document.body.createTextRange) {
                          var range = document.body.createTextRange()
                          range.moveToElementText(text)
                          range.select()
                        } else if (window.getSelection) {
                          var selection = window.getSelection()
                          range = document.createRange()
                          range.selectNodeContents(text)
                          selection.removeAllRanges()
                          selection.addRange(range)
                        }

                        document.execCommand('Copy', 'false', null)
                      }}
                    >
                      复制代码
                    </span>
                  </div>

                  <pre
                    className='language-js'
                    ref={(arg) => { this.pre = arg }}
                  >
                    <code
                      className='language-js'
                      ref={arg => { this.languages = arg }}
                      dangerouslySetInnerHTML={{
                        __html: Prism.highlight(
                          this.source[2],
                          Prism.languages.javascript
                        )
                      }}
                    />
                  </pre>
                </div>
                <div
                  className='code-ctrl'
                  onClick={() => {
                    let height = 0

                    if (!showCode) {
                      if (typeof this.state.height === 'number') {
                        height = this.state.height

                        this.setState({ showCode: !showCode })
                      } else {
                        const preStyles = window.getComputedStyle(this.pre)
                        const descStyles = window.getComputedStyle(this.desc)

                        height = parseInt(preStyles.height) + parseInt(preStyles.paddingTop) * 2 + parseInt(preStyles.marginTop) + parseInt(descStyles.marginTop) * 2 + parseInt(descStyles.paddingTop) * 2 + parseInt(descStyles.height) + 'px'

                        this.setState({ showCode: !showCode, height })
                      }
                    } else {
                      this.setState({ showCode: !showCode })
                    }

                    this.code.style.height = height
                  }}
                >
                  <div
                    className='code-ctrl-text'
                  >
                    {showCode ? '收起代码' : '显示代码'}
                  </div>

                </div>
              </div>
            ) : ''
        }
      </div>
    )
  }
}

export default Demo
