import React from 'react'
import Upload, { UploadFileItem } from '../src'

/**
 * @title 受控用法
 */
export const Controlled = () => {
  const [fileList, setFileList] = React.useState<UploadFileItem[]>([])

  return (
    <>
      <h1>Controlled</h1>
      <div className="upload-controlled__wrap">
        <Upload
          type="default"
          content="上传文件"
          // uploadAction="https://jsonplaceholder.typicode.com/posts/"
          uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          multiple
          headers={{ name: 'mi' }}
          data={[]}
          fileList={fileList}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
            setFileList(fileList)
          }}
          onRemove={(file, fileList) => {
            console.log('remove callback', file, fileList)
            setFileList([...fileList.filter((item) => item.fileId !== file.fileId)])
            return true
          }}
          disabled={false}
          name={'files[]'}
        />
      </div>
    </>
  )
}
