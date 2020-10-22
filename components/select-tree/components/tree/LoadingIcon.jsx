import React from 'react'

const IconLoading = (props) => {
  const size = '0.8em'
  const themeColor = {
    orange: '#f63',
    cyan: '#46bc99',
    magenta: '#ff5975',
    lavender: '#b450de',
    blue: '#3da8f5',
    purple: '#8a8acb'
  }
  return (
    <i className="hi-icon hi-btn--loading--icon">
      <svg
        viewBox="0 0 18 18"
        width={size}
        height={size}
        fill={themeColor[props.theme] ? themeColor[props.theme] : '#4284F5'}
      >
        <g>
          <path
            d="m9 18c-4.9706 0-9-4.0294-9-9 0-4.9706 4.0294-9 9-9 4.9706 0 9 4.0294 9 9 0 4.9706-4.0294 9-9 9zm0-2c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7z"
            opacity=".15"
          />
          <path d="m15.547 2.8242c0.37904 0.40168 0.36068 1.0346-0.040996 1.4136-0.40168 0.37904-1.0346 0.36068-1.4136-0.040996-1.315-1.3935-3.1381-2.1969-5.0922-2.1969-3.866 0-7 3.134-7 7 0 0.55228-0.44772 1-1 1s-1-0.44772-1-1c0-4.9706 4.0294-9 9-9 2.5103 0 4.8578 1.0343 6.5468 2.8242z" />
        </g>
      </svg>
    </i>
  )
}
export default IconLoading
