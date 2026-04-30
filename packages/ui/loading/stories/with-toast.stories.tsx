import React from 'react'
import Button from '@hi-ui/button'
import message from '@hi-ui/message'
import Spinner from '@hi-ui/spinner'

/**
 * @title 加载提示
 * @desc 与 Message 结合使用
 */
export const WithToast = () => {
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }

  return (
    <>
      <h1>With Toast</h1>
      <div className="loading-with-toast__wrap" style={{ position: 'relative' }}>
        <Button
          type="primary"
          loading={loading}
          onClick={() => {
            handleSubmit()
            message.open({
              duration: 5000,
              icon: <Spinner size="sm" />,
              title: '数据提交中，请勿关闭页面',
            })
          }}
        >
          Submit
        </Button>
      </div>
    </>
  )
}
