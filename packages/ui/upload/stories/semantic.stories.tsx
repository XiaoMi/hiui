import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Upload from '../src'
import type { UploadSemanticName, UploadFileItem } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 对各子组件内部结构进行细粒度样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<UploadSemanticName>()

  const fileList = [
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
  ]

  return (
    <>
      <h1>Semantic</h1>
      <div className="upload-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Upload
              type="default"
              content="上传文件"
              uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
              tips="仅支持 jpg/png 文件，且不超过 500kb"
              accept="image/png,image/jpg"
              headers={{ name: 'mi' }}
              data={[]}
              defaultFileList={fileList as UploadFileItem[]}
              classNames={{
                root: 'my-upload__root',
                normalUpload: 'my-upload__normal',
                normalUploadTrigger: 'my-upload__normal-trigger',
                normalUploadTips: 'my-upload__normal-tips',
                normalUploadList: 'my-upload__normal-list',
              }}
              styles={{
                [selected as string]: { outline: '1px solid #ffbe0a' },
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'normalUpload', description: '普通上传' },
                { title: 'normalUploadTrigger', description: '普通上传按钮' },
                { title: 'normalUploadTips', description: '普通上传提示' },
                { title: 'normalUploadList', description: '普通上传文件列表' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={18}>
            <Upload
              type="drag"
              content="上传文件"
              uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
              tips="仅支持 jpg/png 文件，且不超过 500kb"
              accept="image/png,image/jpg"
              headers={{ name: 'mi' }}
              data={[]}
              defaultFileList={fileList as UploadFileItem[]}
              classNames={{
                root: 'my-upload__root',
                dragUpload: 'my-upload__drag',
                dragUploadDropArea: 'my-upload__drag-area',
                dragUploadDropDesc: 'my-upload__drag-desc',
                dragUploadDropTitle: 'my-upload__drag-title',
                dragUploadTips: 'my-upload__drag-tips',
                dragUploadList: 'my-upload__drag-list',
              }}
              styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'dragUpload', description: '拖拽上传' },
                { title: 'dragUploadDropArea', description: '拖拽上传区域' },
                { title: 'dragUploadDropDesc', description: '拖拽上传描述' },
                { title: 'dragUploadDropTitle', description: '拖拽上传标题' },
                { title: 'dragUploadTips', description: '拖拽上传提示' },
                { title: 'dragUploadList', description: '拖拽上传列表' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={18}>
            <Upload
              type="pictureCard"
              content="上传文件"
              uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
              tips="仅支持 jpg/png 文件，且不超过 500kb"
              accept="image/png,image/jpg"
              headers={{ name: 'mi' }}
              data={[]}
              defaultFileList={fileList as UploadFileItem[]}
              classNames={{
                root: 'my-upload__root',
                pictureListUpload: 'my-upload__picture-list',
                pictureListUploadTrigger: 'my-upload__picture-list-trigger',
                pictureListUploadTips: 'my-upload__picture-list-tips',
                pictureListUploadList: 'my-upload__picture-list-list',
              }}
              styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'pictureListUpload', description: '图片列表上传' },
                { title: 'pictureListUploadTrigger', description: '图片列表上传按钮' },
                { title: 'pictureListUploadTips', description: '图片列表上传提示' },
                { title: 'pictureListUploadList', description: '图片列表上传列表' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={18}>
            <Upload
              type="photo"
              content="上传文件"
              uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
              tips="仅支持 jpg/png 文件，且不超过 500kb"
              accept="image/png,image/jpg"
              headers={{ name: 'mi' }}
              data={[]}
              defaultFileList={fileList as UploadFileItem[]}
              classNames={{
                root: 'my-upload__root',
                pictureUpload: 'my-upload__picture',
                pictureUploadList: 'my-upload__picture-list',
                pictureUploadItem: 'my-upload__picture-item',
                pictureUploadUploadTrigger: 'my-upload__picture-trigger',
              }}
              styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'pictureUpload', description: '图片上传' },
                { title: 'pictureUploadList', description: '图片列表上传' },
                { title: 'pictureUploadItem', description: '图片上传项' },
                { title: 'pictureUploadUploadTrigger', description: '图片上传按钮' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={18}>
            <Upload
              type="avatar"
              content="上传文件"
              uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
              tips="仅支持 jpg/png 文件，且不超过 500kb"
              accept="image/png,image/jpg"
              headers={{ name: 'mi' }}
              data={[]}
              classNames={{
                root: 'my-upload__root',
                avatarUpload: 'my-upload__avatar',
                avatarUploadList: 'my-upload__avatar-list',
                avatarUploadItem: 'my-upload__avatar-item',
                avatarUploadUploadTrigger: 'my-upload__avatar-trigger',
              }}
              styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'avatarUpload', description: '头像上传' },
                { title: 'avatarUploadList', description: '头像列表上传' },
                { title: 'avatarUploadItem', description: '头像上传项' },
                { title: 'avatarUploadUploadTrigger', description: '头像上传按钮' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
