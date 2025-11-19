import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title 询问式弹窗
 * @desc 用户在界面交互过程中的行为确认，适合轻量简单的场景
 */
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
              cancelText: '取消',
              confirmText: '我知道了',
            })
          }
        >
          打开错误提示
        </Button>
        <Button
          type="default"
          appearance="solid"
          onClick={() =>
            Modal.confirm({
              type: 'warning',
              title: '警告',
              content: '执行该操作后将无法撤销，是否确定继续？',
              cancelText: '取消',
              confirmText: '确定',
              closeOnEsc: false,
              maskClosable: false,
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
              cancelText: '取消',
              confirmText: '确定',
            })
          }
        >
          打开成功提示
        </Button>

        <Button
          type="primary"
          onClick={() =>
            Modal.confirm({
              type: 'info',
              title: '普通',
              content:
                '这是信息提示对话框的描述，这是信息提示对话框的描述，这是信息提示对话框的描述',
              cancelText: '取消',
              confirmText: '确定',
            })
          }
        >
          打开普通提示
        </Button>

        <Button
          type="secondary"
          onClick={() =>
            Modal.confirm({
              type: 'info',
              title: '普通',
              content:
                '这是信息提示对话框的描述，这是信息提示对话框的描述，这是信息提示对话框的描述',
              cancelText: '取消',
              confirmText: '确定',
              onConfirm: async () => {
                return new Promise((resolve) => setTimeout(resolve, 1000))
              },
              // onConfirm: () => {
              //   console.log('onConfirm')
              // },
            })
          }
        >
          异步确认关闭
        </Button>
      </div>
    </>
  )
}
