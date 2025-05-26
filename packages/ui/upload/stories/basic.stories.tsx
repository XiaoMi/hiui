import React from 'react'
import Upload from '../src'

/**
 * @title 基础用法
 * @desc 突出上传附件的操作入口，节省页面空间
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="upload-basic__wrap">
        <Upload
          type="default"
          content="上传文件"
          // uploadAction="https://jsonplaceholder.typicode.com/posts/"
          uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          headers={{ name: 'mi' }}
          data={[]}
          defaultFileList={[
            {
              name: 'a.png',
              fileId: '1',
              fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
              uploadState: 'loading', // 上传状态，可取值success, error
              progressNumber: 50,
              url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
            },
            {
              name: 'b.png',
              fileId: '2',
              fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
              uploadState: 'success', // 上传状态，可取值success, error
              url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
            },
            {
              name: 'c.png',
              fileId: '3',
              fileType: 'img',
              uploadState: 'error',
              url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
            },
          ]}
          name={'files[]'}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
            // if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
          }}
          disabled={false}
        />
      </div>
    </>
  )
}
