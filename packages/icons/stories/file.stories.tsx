import React from 'react'
import * as Icons from '../src'
import message from '@hi-ui/message'

/**
 * @title 文件
 */
export const File = () => {
  const icons = React.useMemo(() => {
    return [
      {
        id: 'filled',
        title: '面型',
        children: [
          { component: Icons.FileFilled, tagName: 'FileFilled' },
          { component: Icons.FileExcelFilled, tagName: 'FileExcelFilled' },
          { component: Icons.FileExeFilled, tagName: 'FileExeFilled' },
          { component: Icons.FileJpgFilled, tagName: 'FileJpgFilled' },
          { component: Icons.FileKeynoteFilled, tagName: 'FileKeynoteFilled' },
          { component: Icons.FileMusicFilled, tagName: 'FileMusicFilled' },
          { component: Icons.FilePdfFilled, tagName: 'FilePdfFilled' },
          { component: Icons.FilePptFilled, tagName: 'FilePptFilled' },
          { component: Icons.FileQuestionFilled, tagName: 'FileQuestionFilled' },
          { component: Icons.FileTxtFilled, tagName: 'FileTxtFilled' },
          { component: Icons.FileVideoFilled, tagName: 'FileVideoFilled' },
          { component: Icons.FileWordFilled, tagName: 'FileWordFilled' },
          { component: Icons.FileZipFilled, tagName: 'FileZipFilled' },
        ],
      },
      {
        id: 'outlined',
        title: '线型',
        children: [
          { component: Icons.FileOutlined, tagName: 'FileOutlined' },
          { component: Icons.FileExcelOutlined, tagName: 'FileExcelOutlined' },
          { component: Icons.FileExeOutlined, tagName: 'FileExeOutlined' },
          { component: Icons.FileJpgOutlined, tagName: 'FileJpgOutlined' },
          { component: Icons.FileKeynoteOutlined, tagName: 'FileKeynoteOutlined' },
          { component: Icons.FileMusicOutlined, tagName: 'FileMusicOutlined' },
          { component: Icons.FilePdfOutlined, tagName: 'FilePdfOutlined' },
          { component: Icons.FilePptOutlined, tagName: 'FilePptOutlined' },
          { component: Icons.FileQuestionOutlined, tagName: 'FileQuestionOutlined' },
          { component: Icons.FileTxtOutlined, tagName: 'FileTxtOutlined' },
          { component: Icons.FileVideoOutlined, tagName: 'FileVideoOutlined' },
          { component: Icons.FileWordOutlined, tagName: 'FileWordOutlined' },
          { component: Icons.FileZipOutlined, tagName: 'FileZipOutlined' },
        ],
      },
      {
        id: 'colorful',
        title: '多色型',
        children: [
          { component: Icons.ExcelColorful, tagName: 'ExcelColorful' },
          { component: Icons.ExeColorful, tagName: 'ExeColorful' },
          { component: Icons.JpgColorful, tagName: 'JpgColorful' },
          { component: Icons.MusicColorful, tagName: 'MusicColorful' },
          { component: Icons.PdfColorful, tagName: 'PdfColorful' },
          { component: Icons.PptColorful, tagName: 'PptColorful' },
          { component: Icons.QuestionColorful, tagName: 'QuestionColorful' },
          { component: Icons.WordColorful, tagName: 'WordColorful' },
          { component: Icons.ZipColorful, tagName: 'ZipColorful' },
        ],
      },
    ]
  }, [])

  const renderIcon = React.useCallback(({ component: Component, tagName }) => {
    return (
      <div
        key={tagName}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
          borderRadius: '8px',
        }}
        onMouseEnter={(evt) => {
          evt.currentTarget.style.backgroundColor = '#f2f4f7'
          evt.currentTarget.style.cursor = 'pointer'
        }}
        onMouseLeave={(evt) => {
          evt.currentTarget.style.backgroundColor = 'transparent'
          evt.currentTarget.style.cursor = 'default'
        }}
        onClick={() => {
          try {
            const textArea = document.createElement('textarea')
            textArea.value = `<${tagName} />`
            textArea.style.position = 'fixed'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            message.open({
              title: `复制成功：\n<${tagName} />`,
              type: 'success',
            })
          } catch (err) {
            console.error('复制失败:', err)
            message.open({
              title: '复制失败',
              type: 'error',
            })
          }
        }}
      >
        <Component style={{ fontSize: '32px' }} />
        <div style={{ marginTop: '16px', fontSize: '12px' }}>{tagName}</div>
      </div>
    )
  }, [])

  return (
    <>
      <h1>文件</h1>
      <div className="icons-file__wrap">
        {icons.map((typeItem) => (
          <React.Fragment key={typeItem.id}>
            <div style={{ lineHeight: '22px', fontSize: '16px', margin: '8px 0' }}>
              {typeItem.title}
            </div>
            <div
              style={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              }}
            >
              {typeItem.children.map(renderIcon)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}
