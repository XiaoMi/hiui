import React from 'react'
import Upload, { UploadFileItem } from '../src'

/**
 * @title 自定义上传
 * @desc 完全自定义上传逻辑，适合复杂上传逻辑场景
 */
export const CustomUpload = () => {
  const [fileList, setFileList] = React.useState<UploadFileItem[]>([
    {
      name: 'a.png',
      fileId: '1',
      fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
      uploadState: 'success', // 上传状态，可取值success, error
    },
    {
      name: 'b.png',
      fileId: '2',
      fileType: 'img',
      uploadState: 'error',
    },
  ])

  return (
    <>
      <h1>CustomUpload</h1>
      <div className="upload-custom-upload__wrap">
        <Upload
          type="default"
          customUpload={(files) => {
            const nextFileList = fileList.concat({
              name: files?.[0]?.name,
              fileId: '3',
              fileType: files?.[0]?.name
                ?.slice(files?.[0]?.name?.lastIndexOf('.') + 1)
                .toLowerCase(),
              uploadState: 'success',
            })

            setFileList(nextFileList)
          }}
          content="上传文件"
          fileList={fileList}
        />
      </div>
    </>
  )
}
