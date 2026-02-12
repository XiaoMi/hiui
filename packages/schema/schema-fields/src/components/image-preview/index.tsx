import React from 'react'
import Preview from '@hi-ui/preview'
import Space from '@hi-ui/space'

type ImagePreviewProps = {
  images: string[]
}

export function ImagePreview(props: ImagePreviewProps) {
  const { images } = props

  const [visible, setVisible] = React.useState(false)
  const [current, setCurrent] = React.useState(0)

  return (
    <div className="image-preview">
      <Preview
        title={`${current + 1}/${images.length}`}
        src={images}
        current={current}
        onPreviewChange={setCurrent}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      />

      <Space>
        {images.map((url, index) => {
          return (
            <div key={index} className="image-preview__item-wrapper">
              <img
                src={url}
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => {
                  setCurrent(index)
                  setVisible(true)
                }}
              />
            </div>
          )
        })}
      </Space>
    </div>
  )
}
