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
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    className="hi-v4-tree--icon-loading"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-365.000000, -6110.000000)" fill="currentColor" fillRule="nonzero">
        <g transform="translate(40.000000, 5974.000000)">
          <g transform="translate(320.000000, 74.000000)">
            <g transform="translate(0.000000, 50.000000)">
              <g transform="translate(0.000000, 4.000000)">
                <g transform="translate(5.000000, 4.000000)">
                  <g transform="translate(0.000000, 4.000000)">
                    <g transform="translate(1.000000, 1.000000)">
                      <path
                        d="M7,14 C10.8659932,14 14,10.8659932 14,7 C14,3.13400675 10.8659932,0 7,0 C3.13400675,0 0,3.13400675 0,7 C0,10.8659932 3.13400675,14 7,14 Z M7,12 C4.23857625,12 2,9.76142375 2,7 C2,4.23857625 4.23857625,2 7,2 C9.76142375,2 12,4.23857625 12,7 C12,9.76142375 9.76142375,12 7,12 Z"
                        fillOpacity="0.2"
                      ></path>
                      <path d="M1.7016758,2.42516242 C0.611099326,3.68724484 0,5.29767398 0,7 C0,10.8659932 3.13400675,14 7,14 C7.55228475,14 8,13.5522847 8,13 C8,12.4477153 7.55228475,12 7,12 C4.23857625,12 2,9.76142375 2,7 C2,5.78244469 2.43544044,4.63492915 3.21496813,3.73281158 C3.57606547,3.31492744 3.53003068,2.68343818 3.11214655,2.32234084 C2.69426241,1.96124349 2.06277315,2.00727828 1.7016758,2.42516242 Z"></path>
                    </g>
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
