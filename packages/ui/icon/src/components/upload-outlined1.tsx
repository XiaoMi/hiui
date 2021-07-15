import React, { forwardRef } from "react";
import { cx, getPrefixCls } from "@hi-ui/classname";
import { __DEV__ } from "@hi-ui/env";
import { IconProps } from "../@types/props";

const _role = "icon-upload-outlined1";
const _prefix = getPrefixCls(_role);

export const UploadOutlined1 = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style }, ref) => {
    const cls = cx(prefixCls, className);

    return (
      <svg
        className={cls}
        ref={ref}
        role={role}
        style={style}
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M184 654a8 8 0 0 1 8 8v168h640v-168a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v240a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V662a8 8 0 0 1 8-8h64zM517.656 111.382l214.96 214.96a8 8 0 0 1 0 11.314l-45.254 45.256a8 8 0 0 1-11.314 0L552 258.864V738a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V258.864l-124.048 124.048a8 8 0 0 1-11.314 0l-45.256-45.256a8 8 0 0 1 0-11.312l214.96-214.96a8 8 0 0 1 11.314 0z" />
      </svg>
    );
  }
);

if (__DEV__) {
  UploadOutlined1.displayName = "UploadOutlined1";
}
