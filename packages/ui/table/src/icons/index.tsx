import React from 'react'
import { CaretDownFilled } from '@hi-ui/icons'
import { Spinner } from '@hi-ui/spinner'

export const defaultCollapseIcon = (
  <CaretDownFilled style={{ transition: 'transform 0.3s', transform: 'rotate(-90deg)' }} />
)
export const defaultExpandIcon = (
  <CaretDownFilled style={{ transition: 'transform 0.3s', transform: 'rotate(0)' }} />
)
export const defaultLeafIcon = <span style={{ display: 'inline-block', width: 16 }} />

export const defaultLoadingIcon = <Spinner />

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
