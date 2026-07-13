import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button, Message, Popover } from '@hi-ui/hiui'
import { CopyOutlined } from '@hi-ui/icons'

const floatingWrapperStyle: CSSProperties = {
  position: 'fixed',
  right: 32,
  bottom: 64,
  zIndex: 1100,
}

const contentStyle: CSSProperties = {
  width: 520,
  maxWidth: 'calc(100vw - 64px)',
}

const promptTextStyle: CSSProperties = {
  maxHeight: 360,
  margin: 0,
  padding: 12,
  overflow: 'auto',
  border: '1px solid #edeff2',
  borderRadius: 6,
  background: '#f8f9fb',
  color: '#1a1d26',
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  fontSize: 12,
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}

const actionStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 12,
}

const floatingButtonStyle: CSSProperties = {
  boxShadow: '0 8px 24px rgba(26, 29, 38, 0.16)',
}

// Demo-gallery tooling only. Generated typical pages must not import this helper.
async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.insetInlineStart = '-9999px'
  textarea.style.top = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
}

export function PromptCopyFloatingButton({ prompt }: { prompt: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
  }, [prompt])

  const handleCopy = async () => {
    try {
      await copyText(prompt)
      Message.open({ type: 'success', title: '提示词已复制' })
    } catch {
      Message.open({ type: 'error', title: '复制失败，请手动选择提示词' })
    }
  }

  return (
    <div style={floatingWrapperStyle}>
      <Popover
        title="当前页面提示词"
        content={
          <div style={contentStyle}>
            <pre style={promptTextStyle}>{prompt}</pre>
            <div style={actionStyle}>
              <Button type="primary" icon={<CopyOutlined />} onClick={handleCopy}>
                一键复制
              </Button>
            </div>
          </div>
        }
        visible={visible}
        trigger="click"
        placement="top-end"
        gutterGap={12}
        showTitleDivider
        closeOnOutsideClick
        onOpen={() => setVisible(true)}
        onClose={() => setVisible(false)}
      >
        <Button
          type="default"
          appearance="line"
          size="lg"
          shape="round"
          icon={<CopyOutlined />}
          style={floatingButtonStyle}
          aria-label="查看并复制当前页面提示词"
        />
      </Popover>
    </div>
  )
}
