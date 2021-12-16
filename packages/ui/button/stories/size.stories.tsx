import React from 'react'
import Button from '../src'

export const Size = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>不同尺寸</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" size="small">
            小号按钮
          </Button>
          <Button type="primary">正常按钮</Button>
          <Button type="primary" size="large">
            大号按钮
          </Button>
          <Button type="primary" size="x-large">
            超大号按钮
          </Button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" size="small" appearance="line">
            小号按钮
          </Button>
          <Button type="primary" appearance="line">
            正常按钮
          </Button>
          <Button type="primary" size="large" appearance="line">
            大号按钮
          </Button>
          <Button type="primary" size="x-large" appearance="line">
            超大号按钮
          </Button>
        </div>
        <div>
          <Button type="primary" size="small" appearance="link">
            小号按钮
          </Button>
          <Button type="primary" appearance="link">
            正常按钮
          </Button>
          <Button type="primary" size="large" appearance="link">
            大号按钮
          </Button>
          <Button type="primary" size="x-large" appearance="link">
            超大号按钮
          </Button>
        </div>
      </div>
    </>
  )
}
