import React from 'react'
import { CaretDownOutlined } from '@hi-ui/icons'

export const defaultCollapseIcon = (
  <CaretDownOutlined style={{ transition: 'transform 0.3s', transform: 'rotate(-90deg)' }} />
)
export const defaultExpandIcon = (
  <CaretDownOutlined style={{ transition: 'transform 0.3s', transform: 'rotate(0)' }} />
)
export const defaultLeafIcon = <span style={{ display: 'inline-block', width: 16 }} />

export const defaultLoadingIcon = (
  <svg
    style={{ display: 'inline-block', width: 16 }}
    className="hi-v4-tree--icon-loading"
    viewBox="0 0 18 18"
    width="0.8em"
    height="0.8em"
    fill="#4284F5"
  >
    <g>
      <path
        d="m9 18c-4.9706 0-9-4.0294-9-9 0-4.9706 4.0294-9 9-9 4.9706 0 9 4.0294 9 9 0 4.9706-4.0294 9-9 9zm0-2c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7z"
        opacity=".15"
      />
      <path d="m15.547 2.8242c0.37904 0.40168 0.36068 1.0346-0.040996 1.4136-0.40168 0.37904-1.0346 0.36068-1.4136-0.040996-1.315-1.3935-3.1381-2.1969-5.0922-2.1969-3.866 0-7 3.134-7 7 0 0.55228-0.44772 1-1 1s-1-0.44772-1-1c0-4.9706 4.0294-9 9-9 2.5103 0 4.8578 1.0343 6.5468 2.8242z" />
    </g>
  </svg>
)

export const defaultActionIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-894.000000, -2134.000000)" fill="currentColor" fillRule="nonzero">
        <g transform="translate(40.000000, 1548.000000)">
          <g transform="translate(640.000000, 444.000000)">
            <g transform="translate(0.000000, 50.000000)">
              <g transform="translate(0.000000, 84.000000)">
                <g transform="translate(194.000000, 8.000000)">
                  <g transform="translate(20.000000, 0.000000)">
                    <path d="M4.5,6.5 L4.5,9.5 L1.5,9.5 L1.5,6.5 L4.5,6.5 Z M9.5,6.5 L9.5,9.5 L6.5,9.5 L6.5,6.5 L9.5,6.5 Z M14.5,6.5 L14.5,9.5 L11.5,9.5 L11.5,6.5 L14.5,6.5 Z"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)
