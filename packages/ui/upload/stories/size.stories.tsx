import React from 'react'
import Upload, { UploadFileItem } from '../src'

/**
 * @title 大小
 * @desc 上传文件列表的大小
 */
export const Size = () => {
  const defaultFileList: UploadFileItem[] = [
    {
      name: 'a.png',
      fileId: '1',
      fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
      uploadState: 'loading', // 上传状态，可取值success, error
      progressNumber: 50,
      size: 1435417,
      url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
    },
    {
      name: 'b.png',
      fileId: '2',
      fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
      uploadState: 'success', // 上传状态，可取值success, error
      size: 1435417,
      url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
    },
    {
      name: 'c.png',
      fileId: '3',
      fileType: 'img',
      uploadState: 'error',
      size: 1435417,
      url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
    },
  ]

  return (
    <>
      <h1>Size</h1>
      <div className="upload-size__wrap">
        <h2>xs</h2>
        <Upload
          type="default"
          size="xs"
          // uploadAction="https://jsonplaceholder.typicode.com/posts/"
          uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          headers={{ name: 'mi' }}
          data={[]}
          defaultFileList={defaultFileList}
          name={'files[]'}
          disabled={false}
        />
        <h2>md</h2>
        <Upload
          type="default"
          size="md"
          // uploadAction="https://jsonplaceholder.typicode.com/posts/"
          uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          headers={{ name: 'mi' }}
          data={[]}
          defaultFileList={defaultFileList}
          name={'files[]'}
          disabled={false}
        />
        <h2>lg</h2>
        <Upload
          type="default"
          size="lg"
          // uploadAction="https://jsonplaceholder.typicode.com/posts/"
          uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          headers={{ name: 'mi' }}
          data={[]}
          defaultFileList={defaultFileList}
          name={'files[]'}
          disabled={false}
        />
      </div>
    </>
  )
}
