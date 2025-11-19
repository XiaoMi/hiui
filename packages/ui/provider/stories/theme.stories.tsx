import React from 'react'
import Provider, { DesignSystemProps } from '../src'
import Pagination from '@hi-ui/pagination'
import Button from '@hi-ui/button'
import Radio from '@hi-ui/radio'
import Space from '@hi-ui/space'

/**
 * @title 主题定制
 */
export const Theme = () => {
  const [theme, setTheme] = React.useState('default')

  const customTheme: DesignSystemProps = {
    color: {
      primary: {
        50: '#eaf3fa',
        100: '#cde2f5',
        200: '#9fcaeb',
        300: '#73b2e0',
        400: '#4899d6',
        // 主要颜色
        500: '#1d81cc',
        600: '#176ba8',
        700: '#125585',
        800: '#0e4061',
        900: '#09293c',
      },
      gray: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      danger: {
        50: '#ffeaea',
        100: '#ffbaba',
        200: '#ff8a8a',
        300: '#ff5959',
        400: '#ff2929',
        500: '#e60000',
        600: '#b80000',
        700: '#8a0000',
        800: '#5c0000',
        900: '#2e0000',
      },
      success: {
        50: '#e6f9eb',
        100: '#c6f0d4',
        200: '#93e0b5',
        300: '#52c483',
        400: '#21a35d',
        500: '#008046',
        600: '#006639',
        700: '#004d2c',
        800: '#00331e',
        900: '#001a0f',
      },
    },
    text: {
      size: {
        xxl: '24px',
        xl: '22px',
        lg: '18px',
        md: '16px',
        sm: '14px',
      },
    },
    height: {
      '1': '6px',
      '2': '12px',
      '3': '18px',
      '4': '24px',
      '5': '30px',
      '6': '36px',
      '7': '42px',
      '8': '48px',
    },
    spacing: {
      '1': '1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '5': '5px',
      '6': '6px',
      '7': '7px',
      '8': '8px',
    },
    border: {
      radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      size: {
        none: 0,
        normal: '1px dashed',
        semibold: '2px dashed',
        bold: '4px dashed',
      },
    },
  }

  return (
    <>
      <h1>主题定制</h1>
      <div className="provider-basic__wrap">
        <Provider theme={theme === 'default' ? undefined : customTheme}>
          <div style={{ marginBottom: 24 }}>
            <Radio.Group
              data={[
                {
                  id: 'default',
                  title: '默认主题',
                },
                {
                  id: 'customized',
                  title: '定制主题',
                },
              ]}
              value={theme}
              onChange={(value) => setTheme(value as string)}
            />
          </div>

          <Space direction="column" size="lg" style={{ marginBottom: 24 }}>
            <div>
              <Button type="primary" appearance="solid">
                Solid
              </Button>
              <Button type="default" appearance="solid">
                Solid
              </Button>
              <Button type="danger" appearance="solid">
                Solid
              </Button>
              <Button type="success" appearance="solid">
                Solid
              </Button>
            </div>
            <div>
              <Button type="primary" appearance="filled">
                Filled
              </Button>
              <Button type="default" appearance="filled">
                Filled
              </Button>
              <Button type="danger" appearance="filled">
                Filled
              </Button>
              <Button type="success" appearance="filled">
                Filled
              </Button>
            </div>
            <div>
              <Button type="primary" appearance="line">
                Line
              </Button>
              <Button type="default" appearance="line">
                Line
              </Button>
              <Button type="danger" appearance="line">
                Line
              </Button>
              <Button type="success" appearance="line">
                Line
              </Button>
            </div>
          </Space>
          <Pagination
            style={{ marginBottom: 24 }}
            total={200}
            pageSize={10}
            showTotal
            showJumper
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </Provider>
      </div>
    </>
  )
}
