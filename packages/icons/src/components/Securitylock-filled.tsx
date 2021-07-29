import React, { forwardRef } from "react";
import { cx, getPrefixCls } from "@hi-ui/classname";
import { __DEV__ } from "@hi-ui/env";
import { IconProps } from "../@types/props";

const _role = "icon-Securitylock-filled";
const _prefix = getPrefixCls(_role);

export const SecuritylockFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
        <path d="M514.21 66.536l371.826 97.894A8 8 0 0 1 892 172.166v551.22a8 8 0 0 1-3.992 6.926L516.042 945.68a8 8 0 0 1-8.016 0L135.992 730.31A8 8 0 0 1 132 723.388V172.168a8 8 0 0 1 5.964-7.736L510.14 66.536a8 8 0 0 1 4.072 0zM513 338c-39.212 0-71 31.788-71 71 0 23.94 11.848 45.112 30 57.972V596a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-127.662c19.278-12.696 32-34.53 32-59.338 0-39.212-31.788-71-71-71z" />
      </svg>
    );
  }
);

if (__DEV__) {
  SecuritylockFilled.displayName = "SecuritylockFilled";
}
