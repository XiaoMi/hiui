import React, { FC } from 'react';
// import classNames from 'classnames'
// import './style/index.scss'

// const PREFIX = 'hix-avatar'

const Avatar: FC = () => {
  return <div className="hix-avatar">
    <img src='' />
    <div className="hix-avatar__description">
      <div className="description__text">''</div>
      <div className="description__secondary-text">''</div>
    </div>
  </div>
}





interface AlertProps {
  type?: 'info' | 'error' | 'success' | 'warning';
  onClose?: () => void;
  content?: React.ReactNode;
  title?: React.ReactNode;
  closeable?: boolean;
  duration?: number | null;
  prefixCls?: string;
  theme?: string;
}
interface AlertState {
  visible: boolean
}

export default Avatar
