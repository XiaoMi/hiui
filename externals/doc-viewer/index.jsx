import React from 'react'
import { LiveProvider, LiveError, LivePreview } from 'react-live'
import withLive from './components/withLive'
import Button from '@hi-ui/hiui/es/button'
import './index.scss'
import theme from './theme'
import isEqual from 'lodash/isEqual'
import EditorWrapper from './components/EditorWrapper'

const importRegx = /import\s+([\w*{}\n, ])+.*;?/gm

const EditorWithLive = withLive(EditorWrapper)
export default class DocViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      leftOption: (this.props.leftOptions && this.props.leftOptions[0]) || '',
      rightOption: (this.props.rightOptions && this.props.rightOptions[0]) || '',
    }
    this.editorRef = React.createRef()
  }

  componentDidMount() {
    const descBar = document.getElementsByClassName(`${this.props.prefix}-desc-bar`)[0]
    this.setState({ descBarHeight: descBar.clientHeight })
  }

  render() {
    const { code, scope, desc, leftOptions, rightOptions, prefix } = this.props
    const { leftOption, rightOption, innerHeight, descBarHeight } = this.state
    const codeToShow = Array.isArray(code)
      ? code.find((c) =>
          isEqual(
            c.opt,
            [leftOption, rightOption].filter((item) => !!item)
          )
        ).code
      : code
    return (
      <div className="doc-viewer">
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
                        leftOption: opt,
                      })
                      this.editorRef.current.setInnerHeight()
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
                            rightOption: opt,
                          })
                          this.editorRef.current.setInnerHeight()
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
          transformCode={(code) => {
            return code.replace(importRegx, '')
          }}
        >
          <div style={{ border: '1px solid #e6e7e8', borderRadius: '2px' }}>
            <div
              style={{
                padding: 20,
                borderBottom: '1px dashed #e6e7e8',
              }}
            >
              <LivePreview />
              <LiveError />
            </div>
            <EditorWithLive
              ref={(node) => (this.editorLive = node)}
              desc={desc}
              prefix={prefix}
              innerHeight={innerHeight}
              descBarHeight={descBarHeight}
              setInnerHeight={this.setInnerHeight}
              refer={this.editorRef}
            />
          </div>
        </LiveProvider>
      </div>
    )
  }
}
