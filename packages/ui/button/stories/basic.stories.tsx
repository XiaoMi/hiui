import React from 'react'
import Button from '../src'

export const Basic = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button loading />
        <Button loading appearance="link">
          取消
        </Button>
        <Button ref={btnRef}>提交</Button>
      </div>
    </>
  )
}
