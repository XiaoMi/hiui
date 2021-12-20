import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

export const WithAPI = () => {
  return (
    <>
      <h1>WithAPI</h1>
      <div className="modal-with-api__wrap">
        <Button
          type="primary"
          onClick={() =>
            Modal.confirm({
              type: 'error',
              title: '错误',
              content: <div style={{ lineHeight: '48px' }}>操作失败，请联系管理员！</div>,
              cancelText: null,
              confirmText: '我知道了',
            })
          }
        >
          打开错误提示
        </Button>
        <Button
          type="primary"
          onClick={() =>
            Modal.confirm({
              type: 'warning',
              title: '警告',
              content: (
                <div style={{ lineHeight: '48px' }}>执行该操作后将无法撤销，是否确定继续？</div>
              ),
              cancelText: null,
              confirmText: '确定',
            })
          }
        >
          打开警告提示
        </Button>
      </div>
    </>
  )
}
