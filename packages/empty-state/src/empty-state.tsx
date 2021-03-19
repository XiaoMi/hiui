import React, { forwardRef } from 'react';
import cx from 'classnames';
import __DEV__ from './env';

const componentName = 'empty-state';
export const _prefix = 'hi4-empty-state';

export const EmptyState = forwardRef<null, EmptyStateProps>(
  (
    { prefixCls = _prefix, className, children, role = componentName, indicator, title, content, ...restProps },
    ref
  ) => {
    const cls = cx(prefixCls, className);
    const imageCls = '';
    const titleCls = '';

    return (
      <div ref={ref} role={role} className={cls} {...restProps}>
        <div className={`${prefixCls}__icon-wrapper`}>
          <div className={imageCls} />
        </div>
        {title ? <span className={titleCls}>{title}</span> : null}
      </div>
    );
  }
);

export interface EmptyStateProps {
  prefixCls?: string;
  role?: string;
  className?: string;
  style?: React.CSSProperties;
  indicator?: React.ReactNode;
  title?: React.ReactNode;
  content?: React.ReactNode;
}

if (__DEV__) {
  EmptyState.displayName = 'EmptyState';
}

export default EmptyState;
