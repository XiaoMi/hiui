import React from 'react'

export const ArrowIcon = ({ color = '#1a1d26' }: { color?: string }) => {
  return (
    <svg width="24" height="6" viewBox="0 0 24 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.4383 1.99309L10.9536 4.82283C11.5105 5.44935 12.4895 5.44935 13.0464 4.82283L15.5617 1.99309C16.6886 0.725344 18.3038 0 20 0L12 0L4 0C5.69619 0 7.31142 0.725345 8.4383 1.99309Z"
        fill={color}
      />
    </svg>
  )
}
