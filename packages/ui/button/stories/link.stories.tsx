import React from 'react'
import Button from '../src'

export const Link = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button type="primary" appearance="link">
          主要按钮
        </Button>
        <Button type="secondary" appearance="link">
          次要按钮
        </Button>
        <Button type="default" appearance="link">
          中性按钮
        </Button>
        <Button type="danger" appearance="link">
          危险按钮
        </Button>
        <Button type="success" appearance="link">
          成功按钮
        </Button>
      </div>
    </>
  )
}
