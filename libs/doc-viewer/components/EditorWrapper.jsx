import React from 'react'
import { Editor } from 'react-live'
import Icon from '../../../components/icon'
import Tooltip from '../../../components/tooltip'
import Clipboard from 'clipboard'
export default class EditorWrapper extends React.Component {
  state = {
    collapse: false,
    copyed: false,
    innerHeight: 0,
    descBarHeight: 40
  }
  componentDidMount () {
    const descBar = document.getElementsByClassName(
      `${this.props.prefix}-desc-bar`
    )[0]
    this.setState({ descBarHeight: descBar.clientHeight })
    this.setInnerHeight()
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
    this.setInnerHeight()
  }
  setInnerHeight = () => {
    const codeViewer = document.getElementsByClassName(
      `${this.props.prefix}-editor-inner`
    )[0]
    this.setState({
      innerHeight: codeViewer.clientHeight
    })
  }
  componentDidUpdate (prevProps) {
    if (prevProps.live.code !== this.props.live.code) {
      this.setInnerHeight()
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
    const { copyed, innerHeight, descBarHeight } = this.state
    const {
      live: { theme, code, language },
      desc,
      prefix
    } = this.props

    return (
      <div
        className='editor-wrapper'
        style={{
          height: this.state.collapse
            ? innerHeight + descBarHeight
            : descBarHeight,
          overflow: 'hidden'
        }}
      >
        <div
          className={`${prefix}-desc-bar`}
          style={{
            minHeight: 40,
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 20px',
            boxSizing: 'border-box',
            borderBottom: this.state.collapse ? '1px dashed #e6e7e8' : 'none'
          }}
        >
          <div style={{ flex: 1 }}>
            {Array.isArray(desc) ? desc.map(d => <div>{d}</div>) : desc}
          </div>
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
                {this.state.collapse ? (
                  <Icon name='api' />
                ) : (
                  <Icon name='noapi' />
                )}
              </span>
            </Tooltip>
            {copyed ? (
              <Tooltip
                title='复制成功'
                style={{ margin: '0 8px', cursor: 'pointer' }}
              >
                <span>
                  <Icon name='check' />
                </span>
              </Tooltip>
            ) : (
              <Tooltip
                title='复制代码'
                style={{ margin: '0 8px', cursor: 'pointer' }}
              >
                <span
                  className={`${this.props.prefix}-copy-btn`}
                  data-clipboard-target={`.${prefix}-editor-inner .npm__react-simple-code-editor__textarea`}
                >
                  <Icon name='copy' />
                </span>
              </Tooltip>
            )}
            <Tooltip
              title='重置代码'
              style={{ margin: '0 8px', cursor: 'pointer' }}
            >
              <span
                onClick={() => {
                  this.editor.updateContent(code)
                }}
              >
                <Icon name='reset' />
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
            disabled={!this.state.collapse}
            onChange={this.onCodeChange}
          />
        </div>
      </div>
    )
  }
}
