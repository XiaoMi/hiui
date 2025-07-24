import { HiBaseSizeEnum } from 'packages/core/core/lib/types'
import React from 'react'

interface UserIconProps {
  size?: HiBaseSizeEnum | 'xs' | 'xl' | number
}

export const UserIcon: React.FC<UserIconProps> = ({ size = 40 }) => {
  // 基准值：容器 60px，SVG 宽度 44px，margin-top 14px
  const baseContainerSize = 60
  const baseSvgWidth = 44
  const baseMarginTop = 14

  if (typeof size !== 'number') {
    // xs: 24, sm: 32, md: 40, lg: 48, xl: 60
    const sizeMap = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 60,
    }
    size = sizeMap[size] || 40
  }

  // 计算比例
  const scale = size / baseContainerSize
  const svgWidth = baseSvgWidth * scale
  const marginTop = baseMarginTop * scale

  return (
    <svg
      style={{
        width: svgWidth,
        marginTop: marginTop,
      }}
      viewBox="0 0 44 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.4902 24C11.085 24 5.49687 28.3473 3.9209 34.5557L0 50H44L40.0791 34.5557C38.5031 28.3473 32.915 24 26.5098 24H17.4902ZM22 0C16.4772 0 12 4.47715 12 10C12 15.5228 16.4772 20 22 20C27.5228 20 32 15.5228 32 10C32 4.47715 27.5228 0 22 0Z"
        fill="url(#paint0_linear_36479_92555)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_36479_92555"
          x1="22"
          y1="0.72502"
          x2="22"
          y2="49.6006"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.75" />
          <stop offset="1" stopColor="white" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  )
}
