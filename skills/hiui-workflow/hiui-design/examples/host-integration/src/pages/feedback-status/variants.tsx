import loadFailIndicatorUrl from './assets/load-fail-indicator.svg'
import networkErrorIndicatorUrl from './assets/network-error-indicator.svg'
import noPermissionBadgeUrl from './assets/no-permission-badge.svg'
import noPermissionMainUrl from './assets/no-permission-main.svg'
import pageNotFoundIndicatorUrl from './assets/page-not-found-indicator.svg'
import intranetOfflineBadgeUrl from './assets/intranet-offline-badge.svg'
import intranetOfflineBadgeSlashUrl from './assets/intranet-offline-badge-slash.svg'
import intranetOfflineBaseUrl from './assets/intranet-offline-base.svg'
import intranetOfflineGlobeUrl from './assets/intranet-offline-globe.svg'
import underConstructionLine1Url from './assets/under-construction-line-1.svg'
import underConstructionLine2Url from './assets/under-construction-line-2.svg'
import underConstructionLine3Url from './assets/under-construction-line-3.svg'
import underConstructionMainUrl from './assets/under-construction-main.svg'
import { feedbackStatusVariantIds } from './types'
import type { FeedbackStatusVariant, FeedbackStatusVariantId } from './types'

const indicatorWrapStyle = {
  position: 'relative' as const,
  width: 100,
  height: 100,
}

const centeredIndicatorWrapStyle = {
  width: 100,
  height: 100,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
}

function LoadFailIndicator() {
  return (
    <div style={centeredIndicatorWrapStyle}>
      <img
        src={loadFailIndicatorUrl}
        alt=""
        aria-hidden="true"
        style={{ width: 73.75, height: 77.47, display: 'block' }}
      />
    </div>
  )
}

function PageNotFoundIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img
        src={pageNotFoundIndicatorUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 12.84,
          left: '50%',
          width: 73.75,
          height: 77.373,
          transform: 'translateX(-50%)',
          display: 'block',
        }}
      />
    </div>
  )
}

function NetworkErrorIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img
        src={networkErrorIndicatorUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 13.13,
          top: 13.33,
          width: 73.75,
          height: 76.875,
          display: 'block',
        }}
      />
    </div>
  )
}

function NoPermissionIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img
        src={noPermissionMainUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 13.07,
          top: 13.13,
          width: 75.804,
          height: 80.1834,
          display: 'block',
        }}
      />
      <img
        src={noPermissionBadgeUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 61.25,
          top: 64.58,
          width: 20.833,
          height: 20.834,
          display: 'block',
        }}
      />
    </div>
  )
}

function UnderConstructionIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img
        src={underConstructionMainUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 13.13,
          top: 26.46,
          width: 73.75,
          height: 63.75,
          display: 'block',
        }}
      />
      <img
        src={underConstructionLine1Url}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 87.67,
          top: 19.17,
          width: 7.98,
          height: 3.35,
          display: 'block',
          transform: 'scaleX(-1) rotate(-12.65deg) skewX(0.99deg)',
          transformOrigin: 'center',
        }}
      />
      <img
        src={underConstructionLine2Url}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 82.67,
          top: 10.83,
          width: 6.71,
          height: 7.28,
          display: 'block',
          transform: 'scaleX(-1) rotate(-12.65deg) skewX(0.99deg)',
          transformOrigin: 'center',
        }}
      />
      <img
        src={underConstructionLine3Url}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 75.17,
          top: 11.67,
          width: 2.17,
          height: 5.69,
          display: 'block',
          transform: 'scaleX(-1) rotate(-12.65deg) skewX(0.99deg)',
          transformOrigin: 'center',
        }}
      />
    </div>
  )
}

function IntranetOfflineIndicator() {
  return (
    <div style={indicatorWrapStyle}>
      <img
        src={intranetOfflineBaseUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 13.13,
          top: 13.33,
          width: 73.528,
          height: 75.22,
          display: 'block',
        }}
      />
      <img
        src={intranetOfflineGlobeUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 29.35,
          top: 42.66,
          width: 34.625,
          height: 30.882,
          display: 'block',
        }}
      />
      <img
        src={intranetOfflineBadgeUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 56.46,
          top: 59.99,
          width: 30.417,
          height: 30.223,
          display: 'block',
        }}
      />
      <img
        src={intranetOfflineBadgeSlashUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 63.89,
          top: 67.22,
          width: 15.67,
          height: 15.56,
          display: 'block',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 63.33,
          top: 66.67,
          width: 16.5,
          height: 16.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 1.67,
            height: 21.67,
            borderRadius: 5,
            background: '#DBDDE0',
            border: '1px solid #FFFFFF',
            boxSizing: 'border-box',
            transform: 'rotate(135deg)',
            transformOrigin: 'center',
          }}
        />
      </div>
    </div>
  )
}

export const feedbackStatusVariants: Record<FeedbackStatusVariantId, FeedbackStatusVariant> = {
  'empty-state': {
    id: 'empty-state',
    title: '暂无数据',
    description: {
      leadingText: '请先进行数据的添加和新建，或者',
      accentText: '查看说明文档',
    },
    primaryActionLabel: '立即创建',
  },
  'load-fail': {
    id: 'load-fail',
    title: '加载失败',
    description: {
      leadingText: '请先进行数据的添加和新建，或者',
      accentText: '联系管理员',
    },
    primaryActionLabel: '立即重试',
    indicator: <LoadFailIndicator />,
  },
  'page-not-found': {
    id: 'page-not-found',
    title: '页面不存在',
    description: {
      leadingText: '请先进行数据的添加和新建，或者',
      accentText: '联系管理员',
    },
    primaryActionLabel: '返回首页',
    indicator: <PageNotFoundIndicator />,
  },
  'no-permission': {
    id: 'no-permission',
    title: '暂无权限',
    description: {
      leadingText: '抱歉，您没有当前模块的访问权限，请',
      accentText: '联系管理员',
    },
    primaryActionLabel: '立即申请',
    indicator: <NoPermissionIndicator />,
  },
  'under-construction': {
    id: 'under-construction',
    title: '页面建设中',
    description: {
      leadingText: '抱歉，当前页面建设中，详情请',
      accentText: '联系管理员',
    },
    primaryActionLabel: '返回首页',
    indicator: <UnderConstructionIndicator />,
  },
  'network-error': {
    id: 'network-error',
    title: '网络异常',
    description: {
      leadingText: '抱歉，网络连接中断，请稍后再试！，或',
      accentText: '联系管理员',
    },
    primaryActionLabel: '刷新页面',
    indicator: <NetworkErrorIndicator />,
  },
  'intranet-offline': {
    id: 'intranet-offline',
    title: '未连接内网',
    description: {
      leadingText: '抱歉，网络连接中断，请稍后再试！，或',
      accentText: '联系管理员',
    },
    primaryActionLabel: '刷新页面',
    indicator: <IntranetOfflineIndicator />,
  },
}

export function resolveFeedbackStatusVariant(variantId: FeedbackStatusVariantId = 'empty-state') {
  return feedbackStatusVariants[variantId]
}

export { feedbackStatusVariantIds }
