import React from 'react'
import Skeleton from '../src'

/**
 * @title 不同尺寸
 * @desc 通过 size 属性控制骨架屏的尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size 尺寸</h1>
      <h2>text 文本骨架尺寸</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ marginBottom: 8, color: '#666' }}>sm</p>
          <Skeleton type="text" size="sm" width={'60%'} />
        </div>
        <div>
          <p style={{ marginBottom: 8, color: '#666' }}>md</p>
          <Skeleton type="text" size="md" width={'60%'} />
        </div>
        <div>
          <p style={{ marginBottom: 8, color: '#666' }}>lg</p>
          <Skeleton type="text" size="lg" width={'60%'} />
        </div>
      </div>

      <h2>avatar 头像骨架尺寸</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <Skeleton type="avatar" size="sm" />
          <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>sm (32px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Skeleton type="avatar" size="md" />
          <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>md (40px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Skeleton type="avatar" size="lg" />
          <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>lg (48px)</p>
        </div>
      </div>

      <h2>icon 图标骨架尺寸</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <Skeleton type="icon" size="sm" />
          <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>sm (40px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Skeleton type="icon" size="md" />
          <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>md (48px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Skeleton type="icon" size="lg" />
          <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>lg (56px)</p>
        </div>
      </div>

      <h2>image 图像骨架</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>
        image 类型的骨架屏尺寸由父容器或 width/height 参数决定，不受 size 属性影响
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 100, height: 100 }}>
          <Skeleton type="image" />
        </div>
        <div style={{ width: 150, height: 100 }}>
          <Skeleton type="image" />
        </div>
        <div style={{ width: 200, height: 150 }}>
          <Skeleton type="image" />
        </div>
      </div>
    </>
  )
}
