import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

export const WithAPI = () => {
  return (
    <>
      <h1>WithAPI</h1>
      <div className="modal-with-api__wrap">
        <Button
          type="danger"
          onClick={() =>
            Modal.confirm({
              type: 'error',
              title: '错误',
              content: '操作失败，请联系管理员！',
              cancelText: null,
              confirmText: '我知道了',
            })
          }
        >
          打开错误提示
        </Button>
        <Button
          type="default"
          onClick={() =>
            Modal.confirm({
              type: 'warning',
              title: '警告',
              content: '执行该操作后将无法撤销，是否确定继续？',
              cancelText: null,
              confirmText: '确定',
            })
          }
        >
          打开警告提示
        </Button>

        <Button
          type="success"
          onClick={() =>
            Modal.confirm({
              type: 'success',
              title: '成功',
              content:
                '这是信息提示对话框的描述，这是信息提示对话框的描述，这是信息提示对话框的描述',
              cancelText: null,
              confirmText: '确定',
            })
          }
        >
          打开成功提示
        </Button>

        <Button
          type="secondary"
          onClick={() =>
            Modal.confirm({
              type: 'info',
              title: '普通',
              content:
                '这是信息提示对话框的描述，这是信息提示对话框的描述，这是信息提示对话框的描述',
              cancelText: null,
              confirmText: '确定',
            })
          }
        >
          打开普通提示
        </Button>
      </div>
    </>
  )
}
