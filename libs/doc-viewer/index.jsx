import React from 'react'
import { LiveProvider, LiveError, LivePreview, withLive, Editor } from 'react-live'
import Icon from '../../components/icon'
import Tooltip from '../../components/tooltip'
import Button from '../../components/button'
import './index.scss'
import Clipboard from 'clipboard'
import theme from './theme'
import isEqual from 'lodash/isEqual'

const importRegx = /import\s+([\w*{}\n, ])+.*;?/gm

class EditorWrapper extends React.Component {
  state = {
    collapse: false,
    copyed: false
    // innerHeight: 0,
    // descBarHeight: 40
  }
  componentDidMount () {
    // const codeViewer = document.getElementsByClassName(`${this.props.prefix}-editor-inner`)[0]
    // const descBar = document.getElementsByClassName(`${this.props.prefix}-desc-bar`)[0]
    // console.log('barHeight', this.props.prefix, descBar.clientHeight)
    // this.setState({ innerHeight: codeViewer.clientHeight, descBarHeight: descBar.clientHeight })
    // this.props.setInnerHeight()
    const clipboard = new Clipboard(`.${this.props.prefix}-copy-btn`)
    const _this = this
    clipboard.on('success', function (e) {
      _this.setState({
        copyed: true
      })
      _this.resetCopy()
      e.clearSelection()
    })
  }
  onCodeChange = code => {
    this.props.live.onChange(code)
    this.props.setInnerHeight()
  }
  componentDidUpdate (prevProps) {
    if (prevProps.live.code !== this.props.live.code) {
      this.props.setInnerHeight()
    }
  }
  resetCopy = () => {
    setTimeout(() => {
      this.setState({
        copyed: false
      })
    }, 2000)
  }
  render () {
    const { copyed } = this.state
    const {
      live: { theme, code, language, disabled },
      desc,
      prefix,
      innerHeight,
      descBarHeight
    } = this.props

    return (
      <div
        className='doc-viewer'
        style={{
          height: this.state.collapse ? innerHeight + descBarHeight : descBarHeight,
          overflow: 'hidden'
        }}
      >
        <div
          className={`${prefix}-desc-bar`}
          style={{
            minHeight: 40,
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: 20,
            paddingRight: 20,
            alignItems: 'center',
            borderBottom: this.state.collapse ? '1px dashed #e6e7e8' : 'none'
          }}
        >
          <div style={{ maxWidth: 720, paddingTop: 10, paddingBottom: 10 }}>{desc}</div>
          <div>
            <Tooltip
              title={this.state.collapse ? '收起代码' : '展开代码'}
              style={{ margin: '0 8px', cursor: 'pointer' }}
            >
              <span
                onClick={() => {
                  this.setState({
                    collapse: !this.state.collapse
                  })
                }}
              >
                {this.state.collapse ? <Icon name='shrink' /> : <Icon name='expand-alt' />}
              </span>
            </Tooltip>
            {copyed ? (
              <Tooltip title='复制成功' style={{ margin: '0 8px', cursor: 'pointer' }}>
                <span>
                  <Icon name='check' />
                </span>
              </Tooltip>
            ) : (
              <Tooltip title='复制代码' style={{ margin: '0 8px', cursor: 'pointer' }}>
                <span
                  className={`${this.props.prefix}-copy-btn`}
                  data-clipboard-target={`.${prefix}-editor-inner .npm__react-simple-code-editor__textarea`}
                >
                  <Icon name='copy' />
                </span>
              </Tooltip>
            )}
            <Tooltip title='重置代码' style={{ margin: '0 8px', cursor: 'pointer' }}>
              <span
                onClick={() => {
                  this.editor.updateContent(code)
                }}
              >
                <Icon name='synchronize' />
              </span>
            </Tooltip>
          </div>
        </div>
        <div
          className={`${prefix}-editor-inner`}
          style={{ background: 'rgba(246, 246, 246, 0.5967)' }}
        >
          <Editor
            ref={node => (this.editor = node)}
            theme={theme}
            code={code}
            language={language}
            disabled={disabled}
            onChange={this.onCodeChange}
          />
        </div>
      </div>
    )
  }
}
const EditorWithLive = withLive(EditorWrapper)
export default class DocViewer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      leftOption: (this.props.leftOptions && this.props.leftOptions[0]) || '',
      rightOption: (this.props.rightOptions && this.props.rightOptions[0]) || '',
      innerHeight: 0,
      descBarHeight: 40
    }
  }
  componentDidMount () {
    this.setInnerHeight()
    const descBar = document.getElementsByClassName(`${this.props.prefix}-desc-bar`)[0]
    this.setState({ descBarHeight: descBar.clientHeight })
  }
  setInnerHeight = () => {
    const codeViewer = document.getElementsByClassName(`${this.props.prefix}-editor-inner`)[0]
    this.setState({
      innerHeight: codeViewer.clientHeight
    })
  }
  render () {
    const { code, scope, desc, leftOptions, rightOptions, prefix } = this.props
    const { leftOption, rightOption, innerHeight, descBarHeight } = this.state
    const codeToShow = Array.isArray(code)
      ? code.find(c => isEqual(c.opt, [leftOption, rightOption].filter(item => !!item))).code
      : code
    return (
      <div style={{ marginBottom: 40 }}>
        {(leftOptions || rightOptions) && (
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
            {leftOptions && leftOptions.length > 0 && (
              <Button.Group>
                {leftOptions.map((opt, index) => (
                  <Button
                    type={opt === leftOption ? 'line' : 'default'}
                    key={index}
                    onClick={() => {
                      this.setState({
                        leftOption: opt
                      })
                      this.setInnerHeight()
                    }}
                  >
                    {opt}
                  </Button>
                ))}
              </Button.Group>
            )}
            {rightOptions && rightOptions.length > 0 && (
              <Button.Group>
                {rightOptions && rightOptions.length > 0 && (
                  <Button.Group>
                    {rightOptions.map((opt, index) => (
                      <Button
                        type={opt === rightOption ? 'line' : 'default'}
                        key={index}
                        onClick={() => {
                          this.setState({
                            rightOption: opt
                          })
                          this.setInnerHeight()
                        }}
                      >
                        {opt}
                      </Button>
                    ))}
                  </Button.Group>
                )}
              </Button.Group>
            )}
          </div>
        )}

        <LiveProvider
          code={codeToShow}
          scope={scope}
          theme={theme}
          transformCode={code => {
            return code.replace(importRegx, '')
          }}
        >
          <div style={{ border: '1px solid #e6e7e8', borderRadius: '2px' }}>
            <div
              style={{
                padding: 20,
                borderBottom: '1px dashed #e6e7e8'
              }}
            >
              <LivePreview />
              <LiveError />
            </div>
            <EditorWithLive
              desc={desc}
              prefix={prefix}
              innerHeight={innerHeight}
              descBarHeight={descBarHeight}
              setInnerHeight={this.setInnerHeight}
            />
          </div>
        </LiveProvider>
      </div>
    )
  }
}
