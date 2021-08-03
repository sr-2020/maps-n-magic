import React from 'react';
import './StatusIcon.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';


interface StatusIconProps {
  status: 'valid' | 'invalid' | 'unknown';
  className?: string;
}

export function StatusIcon(props: StatusIconProps) {
  const { status, className } = props;

  if (status === 'valid') {
    return (
      <FontAwesomeIcon
        className={classNames("StatusIcon", "tw-text-green-700", className)}
        icon={faCheckCircle}
      />
    );
  }

  if (status === 'invalid') {
    return (
      <FontAwesomeIcon
        className={classNames("StatusIcon", "tw-text-red-700", className)}
        icon={faTimesCircle}
      />
    );
  }

  return (
    <FontAwesomeIcon
      className={classNames("StatusIcon", "tw-text-transparent", className)}
      icon={faCheckCircle}
    />
  );
}



