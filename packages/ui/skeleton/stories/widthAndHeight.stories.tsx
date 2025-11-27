import React from 'react'
import Skeleton from '../src'

/**
 * @title 自定义宽高
 * @desc 通过 style 属性自定义骨架屏的宽度和高度，支持像素值、百分比等 CSS 单位
 */
export const WidthAndHeight = () => {
  return (
    <>
      <h1>自定义宽高</h1>
      <div className="skeleton-width-height__wrap">
        <h2>Text 文本 - 自定义宽度</h2>
        <div
          style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
            使用 style 属性设置不同宽度的文本骨架屏
          </p>
          <Skeleton.Group direction="column" gap={12} animation="wave">
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 100%</p>
              <Skeleton type="text" width="100%" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 80%</p>
              <Skeleton type="text" width="80%" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 60%</p>
              <Skeleton type="text" width="60%" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 40%</p>
              <Skeleton type="text" width="40%" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 200px</p>
              <Skeleton type="text" width={200} />
            </div>
          </Skeleton.Group>
        </div>

        <h2>Text 文本 - 自定义高度</h2>
        <div
          style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
            通过设置 height 可以模拟不同字体大小的文本
          </p>
          <Skeleton.Group direction="column" gap={16} animation="wave">
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                height: 12px (小号文本)
              </p>
              <Skeleton type="text" width="70%" height={12} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                height: 14px (默认文本)
              </p>
              <Skeleton type="text" width="70%" height={14} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                height: 18px (中号标题)
              </p>
              <Skeleton type="text" width="70%" height={18} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                height: 24px (大号标题)
              </p>
              <Skeleton type="text" width="60%" height={24} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                height: 32px (超大标题)
              </p>
              <Skeleton type="text" width="50%" height={32} />
            </div>
          </Skeleton.Group>
        </div>

        <h2>Avatar 头像 - 自定义尺寸</h2>
        <div
          style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
            自定义头像骨架屏的尺寸，适配不同大小的头像
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="avatar" width={24} height={24} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>24x24</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="avatar" width={32} height={32} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>32x32</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="avatar" width={40} height={40} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>40x40 (默认)</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="avatar" width={56} height={56} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>56x56</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="avatar" width={72} height={72} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>72x72</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="avatar" width={96} height={96} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>96x96</p>
            </div>
          </div>
        </div>

        <h2>Image 图片 - 自定义尺寸</h2>
        <div
          style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
            自定义图片骨架屏的宽高，支持各种比例
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>正方形 100x100</p>
              <Skeleton type="image" width={100} height={100} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>正方形 150x150</p>
              <Skeleton type="image" width={150} height={150} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>横向 16:9 (240x135)</p>
              <Skeleton type="image" width={240} height={135} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>横向 4:3 (200x150)</p>
              <Skeleton type="image" width={200} height={150} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>竖向 3:4 (150x200)</p>
              <Skeleton type="image" width={150} height={200} />
            </div>
          </div>
        </div>

        <h2>Icon 图标 - 自定义尺寸</h2>
        <div
          style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>自定义图标骨架屏的尺寸</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="icon" width={32} height={32} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>32x32</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="icon" width={48} height={48} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>48x48 (默认)</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="icon" width={64} height={64} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>64x64</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Skeleton type="icon" width={80} height={80} />
              <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>80x80</p>
            </div>
          </div>
        </div>

        <h2>使用 CSS 单位</h2>
        <div
          style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
            支持各种 CSS 单位：px、%、rem、em、vw 等
          </p>
          <Skeleton.Group direction="column" gap={12} animation="wave">
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                width: &apos;50%&apos; (百分比)
              </p>
              <Skeleton type="text" width="50%" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                width: 300 (数字，转为 300px)
              </p>
              <Skeleton type="text" width={300} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                width: &apos;20rem&apos; (rem 单位)
              </p>
              <Skeleton type="text" width="20rem" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                width: &apos;30vw&apos; (视口宽度)
              </p>
              <Skeleton type="text" width="30vw" />
            </div>
          </Skeleton.Group>
        </div>

        <h2>组合使用示例 - 卡片骨架屏</h2>
        <div
          style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
            组合使用自定义宽高，构建真实的卡片骨架屏
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {/* 文章卡片 */}
            <div
              style={{
                flex: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <Skeleton.Group direction="column" gap={12} animation="wave">
                <Skeleton type="image" width="100%" height={180} />
                <Skeleton type="text" width="80%" height={20} />
                <Skeleton type="text" width="100%" height={14} />
                <Skeleton type="text" width="90%" height={14} />
                <Skeleton.Group direction="row" gap={8}>
                  <Skeleton type="avatar" width={24} height={24} />
                  <Skeleton type="text" width={100} height={12} />
                </Skeleton.Group>
              </Skeleton.Group>
            </div>

            {/* 用户卡片 */}
            <div
              style={{
                flex: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <Skeleton.Group direction="column" gap={16} animation="wave">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Skeleton type="avatar" width={80} height={80} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Skeleton type="text" width={120} height={18} style={{ margin: '0 auto 8px' }} />
                  <Skeleton type="text" width={180} height={14} style={{ margin: '0 auto' }} />
                </div>
                <Skeleton.Group direction="row" gap={8}>
                  <Skeleton type="text" height={32} style={{ flex: 1 }} />
                  <Skeleton type="text" height={32} style={{ flex: 1 }} />
                </Skeleton.Group>
              </Skeleton.Group>
            </div>

            {/* 产品卡片 */}
            <div
              style={{
                flex: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <Skeleton.Group direction="column" gap={0} animation="wave">
                <Skeleton type="image" width="100%" height={200} />
                <Skeleton.Group direction="column" gap={0} style={{ padding: 16 }}>
                  <Skeleton type="text" width="70%" height={16} style={{ marginBottom: 8 }} />
                  <Skeleton type="text" width="40%" height={24} style={{ marginBottom: 12 }} />
                  <Skeleton type="text" width="100%" height={40} />
                </Skeleton.Group>
              </Skeleton.Group>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
