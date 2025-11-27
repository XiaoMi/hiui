import React from 'react'
import Skeleton from '../src'
import Avatar from '@hi-ui/avatar'
import Button from '@hi-ui/button'

/**
 * @title 骨架屏组
 * @desc 使用 Skeleton.Group 组织多个骨架屏元素，统一控制加载状态、动画效果和布局方向。通过 content prop 区分骨架屏模板和实际内容。
 */
export const Group = () => {
  const [visible1, setVisible1] = React.useState(true)
  // const [visible2, setVisible2] = React.useState(true)
  const [visible3, setVisible3] = React.useState(true)

  return (
    <>
      <h1>骨架屏组</h1>
      <div className="skeleton-group__wrap">
        <h2>Usage 用法</h2>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <h3>用法1: 属性式（使用content prop传递内容）</h3>
          <Skeleton.Group
            direction="column"
            gap={12}
            visible={visible1}
            content={
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>这是实际的标题</h3>
                <p style={{ margin: '0 0 8px 0' }}>这是第一段实际内容，已经从服务器加载完成。</p>
                <p style={{ margin: 0 }}>这是第二段实际内容，包含更多信息。</p>
              </div>
            }
            animation="wave"
          >
            <Skeleton height={24} width={'60%'} />
            <Skeleton />
            <Skeleton width={'80%'} />
          </Skeleton.Group>

          <h3>用法2: 包覆式（children 传递内容）</h3>
          <Skeleton.Group direction="column" gap={12} visible={visible1} animation="wave">
            <Skeleton height={24} width={'60%'}>
              <h3 style={{ margin: '0 0 8px 0' }}>这是实际的标题</h3>
            </Skeleton>
            <Skeleton>
              <p style={{ margin: 0 }}>这是第一段实际内容，已经从服务器加载完成。</p>
            </Skeleton>
            <Skeleton width={'80%'}>
              <p style={{ margin: 0 }}>这是第二段实际内容，包含更多信息。</p>
            </Skeleton>
          </Skeleton.Group>

          <h3>用法3: 独立式（内容放在组件外）</h3>
          {visible1 ? (
            <Skeleton.Group direction="column" gap={12} visible={visible1} animation="wave">
              <Skeleton height={24} width={'60%'} />
              <Skeleton />
              <Skeleton width={'80%'} />
            </Skeleton.Group>
          ) : (
            <div>
              <h3 style={{ margin: '0 0 8px 0' }}>这是实际的标题</h3>
              <p style={{ margin: '0 0 8px 0' }}>这是第一段实际内容，已经从服务器加载完成。</p>
              <p style={{ margin: 0 }}>这是第二段实际内容，包含更多信息。</p>
            </div>
          )}
          <Button
            onClick={() => setVisible1(!visible1)}
            style={{ marginTop: 16, padding: '8px 16px' }}
          >
            {visible1 ? 'Hide Skeleton' : 'Show Skeleton'}
          </Button>
        </div>

        <h2>垂直布局（默认）</h2>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <Skeleton.Group direction="column">
            <Skeleton width={'80%'} />
            <Skeleton width={'60%'} />
            <Skeleton width={'70%'} />
          </Skeleton.Group>
        </div>

        <h2>水平布局</h2>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <Skeleton.Group direction="row">
            <Skeleton type="avatar" />
            <Skeleton.Group direction="column" style={{ flex: 1 }}>
              <Skeleton type="text" width={'60%'} />
              <Skeleton type="text" width={'40%'} />
            </Skeleton.Group>
          </Skeleton.Group>
        </div>

        <h2>混合复杂布局</h2>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <Skeleton.Group
            direction="column"
            gap={16}
            visible={visible3}
            animation="wave"
            content={
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '100%' }}>
                  {/* 头部 */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      marginBottom: 6,
                    }}
                  >
                    <Avatar />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0' }}>写代码是一门艺术</h4>
                      <p style={{ margin: 0, fontSize: 14, color: '#999' }}>孔子 · 2025年11月3日</p>
                    </div>
                  </div>
                  {/* 内容 */}
                  <div>
                    <h4 style={{ margin: '0 0 4px 0' }}>学而时习之，不亦说乎？</h4>
                    <h5 style={{ margin: '0 0 6px 0' }}>有朋自远方来，不亦乐乎？</h5>
                    <p style={{ fontSize: 14, margin: 0 }}>
                      【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”
                    </p>
                  </div>
                </div>
                {/* 图片 */}
                <img
                  src={
                    'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
                  }
                  alt="content"
                  style={{
                    width: '65%',
                    height: 190,
                    objectFit: 'cover',
                    borderRadius: 6,
                  }}
                />
              </div>
            }
          >
            <Skeleton.Group direction="row" gap={16} alignItems="start">
              {/* 左侧 */}
              <Skeleton.Group direction="column" gap={12}>
                {/* 头部 */}
                <Skeleton.Group direction="row" gap={12}>
                  <Skeleton type="avatar" />
                  <Skeleton.Group direction="column" gap={6} style={{ flex: 1 }}>
                    <Skeleton width={'40%'} />
                    <Skeleton width={'30%'} />
                  </Skeleton.Group>
                </Skeleton.Group>
                {/* 内容 */}
                <Skeleton.Group direction="column" gap={6}>
                  <Skeleton size="lg" width={'60%'} />
                  <Skeleton size="lg" width={'40%'} />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </Skeleton.Group>
              </Skeleton.Group>

              {/* 右侧图片 */}
              <Skeleton type="image" width={'65%'} height={190} />
            </Skeleton.Group>
          </Skeleton.Group>
          <Button
            onClick={() => setVisible3(!visible3)}
            style={{ marginTop: 16, padding: '8px 16px' }}
          >
            {visible3 ? 'Hide Skeleton' : 'Show Skeleton'}
          </Button>
        </div>

        <h2>自定义间距</h2>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <Skeleton.Group direction="column" gap={24}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Skeleton.Group>
        </div>

        <h2>统一控制动画效果</h2>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <h4>Pulse 动画</h4>
          <Skeleton.Group direction="column" animation="pulse">
            <Skeleton />
            <Skeleton width={'80%'} />
            <Skeleton width={'60%'} />
          </Skeleton.Group>

          <h4 style={{ marginTop: 24 }}>Wave 动画</h4>
          <Skeleton.Group direction="column" animation="wave">
            <Skeleton />
            <Skeleton width={'80%'} />
            <Skeleton width={'60%'} />
          </Skeleton.Group>
        </div>

        <h2>列表骨架屏示例</h2>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <Skeleton.Group direction="column" gap={20} animation="wave">
            {[1, 2, 3].map((item) => (
              <Skeleton.Group key={item} direction="row" gap={12}>
                <Skeleton type="avatar" />
                <Skeleton.Group direction="column" gap={8} style={{ flex: 1 }}>
                  <Skeleton width={'100%'} />
                  <Skeleton width={'50%'} />
                </Skeleton.Group>
              </Skeleton.Group>
            ))}
          </Skeleton.Group>
        </div>
      </div>
    </>
  )
}
