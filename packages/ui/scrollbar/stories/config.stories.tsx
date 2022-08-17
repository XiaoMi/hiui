import React, { useMemo } from 'react'
import Scrollbar from '../src'

/**
 * @title 展示配置
 * @desc 可配置轴展示行为
 */
export const Config = () => {
  const scrollContent = useMemo(() => {
    return (
      <div style={{ height: 640, width: '100%' }}>
        <div style={{ height: 160, background: '#03A9F433' }} />
        <div style={{ height: 160, background: '#00968833' }} />
        <div style={{ height: 160, background: '#FF572233' }} />
        <div style={{ height: 160, background: '#E91E6333' }} />
      </div>
    )
  }, [])

  return (
    <>
      <h1>展示配置</h1>
      <h2>keepVisible</h2>
      <div className="scrollbar-config__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar keepVisible>{scrollContent}</Scrollbar>
      </div>
      <h2>onlyScrollVisible</h2>
      <div className="scrollbar-config__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar onlyScrollVisible>{scrollContent}</Scrollbar>
      </div>
    </>
  )
}
