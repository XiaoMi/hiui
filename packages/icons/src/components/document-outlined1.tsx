import React, { forwardRef } from "react";
import { cx, getPrefixCls } from "@hi-ui/classname";
import { __DEV__ } from "@hi-ui/env";
import { IconProps } from "../@types/props";

const _role = "icon-document-outlined1";
const _prefix = getPrefixCls(_role);

export const DocumentOutlined1 = forwardRef<SVGSVGElement | null, IconProps>(
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
        <path d="M872 952a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h704c4.42 0 8 5.208 8 11.63V952zM792 144H232v736h560V144zM336 280h352a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8zM336 472h352a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8zM336 664h192a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-192a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8z" />
      </svg>
    );
  }
);

if (__DEV__) {
  DocumentOutlined1.displayName = "DocumentOutlined1";
}
