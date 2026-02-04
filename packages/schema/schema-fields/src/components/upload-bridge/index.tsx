import React, { useEffect, useMemo } from 'react'
import { omit } from 'lodash-es'
import { useControllableValue } from 'ahooks'
import { message } from '@hi-ui/message'
import { useReadonlyRef } from '@hi-ui/schema-hooks'
import { mergeProps } from '@hi-ui/schema-utils'
import type { UploadProps } from '@hi-ui/upload'
import { toFileList, sliceToMaxCount, genFileIdentifier } from './utils'
import type { UploadFileType, UploadBridgeProps } from './type'

export { UploadBridgeProps }

const noopOnChange = () => {
  // noopOnChange
}

function normalizeProps(props: UploadBridgeProps): UploadBridgeProps {
  const { value } = props

  // value 为字符传时转换为数组；undefined 保持 undefined
  const nextValue = Array.isArray(value) ? value : typeof value === 'string' ? [value] : undefined
  // 存在 request 方法时，默认使用 json 模式
  const nextMode = props.mode || (props.request ? 'json' : 'formData')
  // maxCount 大于 1 时，默认使用 multiple 模式
  const nextMultiple = props.multiple || (props.maxCount || 0) > 1
  // 没开启 multiple，也没传 maxCount，则默认限制为 1
  const nextMaxCount = props.maxCount || (!props.multiple ? 1 : undefined)

  return {
    ...props,
    value: nextValue,
    mode: nextMode,
    multiple: nextMultiple,
    maxCount: nextMaxCount,
  }
}

export function UploadBridge(props: React.PropsWithChildren<UploadBridgeProps>) {
  const { children, ...restProps } = props
  const normalizedProps = normalizeProps(restProps)

  const [value = [], _setValue] = useControllableValue<UploadFileType[]>(normalizedProps)
  const { fileList, fileIdSet } = useMemo(() => toFileList(value), [value])
  const setValue = (value: UploadFileType[]) => {
    // 只保留<maxCount>个文件
    const sliced = sliceToMaxCount(value, normalizedProps.maxCount, 0)

    const transformed = sliced.map((file) => {
      if (typeof file === 'string') return { url: file, fileId: file, name: '' }
      else return file
    })

    _setValue(transformed)
  }

  // 此处的 Set 是给组件卸载的清理阶段有的
  const fileUrlSetRef = useReadonlyRef(() => new Set<string | undefined>())
  if (normalizedProps.mode === 'formData') {
    fileList?.forEach(({ url }) => fileUrlSetRef.current.add(url))
  }
  useEffect(() => {
    return () => {
      // 组件卸载时清理所有创建的URL
      // 此处忽略掉这条规则，因为就是需要最新的 fileUrlSetRef
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fileUrlSetRef.current.forEach((url) => {
        if (url) {
          // url 预期是 blob 协议的本地文件地址
          // 若是外部传入的 http 协议的文件也没事
          // revokeObjectURL 会直接忽略
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [fileUrlSetRef])

  const customUpload: NonNullable<UploadProps['customUpload']> = async (fileList) => {
    if (!fileList) return
    const files = Array.from(fileList)

    // 1. 文件去重
    // 直接使用已计算的fileList中的fileId
    const uniqueFiles = files.filter((file) => !fileIdSet?.has(genFileIdentifier(file)))

    if (uniqueFiles.length === 0) {
      message.open({ type: 'warning', title: '所选文件已存在' })
      return
    }

    // 2. 检查文件大小 (maxSize单位为KB，需要转换为bytes进行比较)
    const maxSize = normalizedProps.maxSize || Infinity
    const maxSizeInBytes = maxSize * 1024
    const oversizedFiles = uniqueFiles.filter((file) => file.size > maxSizeInBytes)

    if (oversizedFiles.length > 0) {
      message.open({ type: 'warning', title: `文件大小超出${maxSize}KB限制` })
      return
    }

    try {
      // 3. 根据mode处理文件
      if (normalizedProps.mode === 'json') {
        if (!normalizedProps.request) {
          throw new Error('JSON 模式下必须提供 request 方法')
        }

        // 只保留<maxCount - curLength>个文件
        const sliced = sliceToMaxCount(uniqueFiles, normalizedProps.maxCount, value.length)
        // 上传文件并获取URL
        const urls = await normalizedProps.request(sliced)
        if (!urls || urls.length === 0) return

        const nextFiles = urls.map((url, index) => {
          const fileId = genFileIdentifier(uniqueFiles[index])
          if (typeof url === 'string') return { url, fileId, name: '' }
          else return { ...url, fileId }
        })

        // 更新value
        setValue([...(value || []), ...nextFiles])
      }
      // 默认的 formData 模式
      else {
        // formData模式直接返回File数组
        setValue([...(value || []), ...uniqueFiles])
      }
    } catch (error) {
      console.log('UploadBridge customUpload request', error)
      const msg = '文件上传失败: ' + (error instanceof Error ? error.message : '未知错误')
      message.open({ type: 'error', title: msg })
    }
  }

  const handleRemove: NonNullable<UploadProps['onRemove']> = (_1, _2, index) => {
    // 获取要删除的文件的URL
    const fileToRemove = fileList?.[index]
    if (fileToRemove?.url) URL.revokeObjectURL(fileToRemove.url)

    setValue(value.filter((_, idx) => idx !== index))
    return true
  }

  const finalProps = mergeProps(
    { type: 'default' },
    omit(normalizedProps, [
      // 移除无关的属性
      'value',
      'defaultValue',
      'onChange',
      'mode',
      'request',
    ])
  )

  return React.cloneElement(children as React.ReactElement<UploadProps>, {
    ...finalProps,
    customUpload,
    fileList,
    onChange: noopOnChange,
    onRemove: handleRemove,
  })
}
