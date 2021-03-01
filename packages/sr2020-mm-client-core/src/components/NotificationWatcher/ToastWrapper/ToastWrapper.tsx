import React, { useState } from 'react';
import './ToastWrapper.css';
import moment from 'moment';
import classNames from 'classnames';

import Toast from 'react-bootstrap/Toast';

// import { ToastWrapperPropTypes } from '../../types';

function kindToColor(kind) {
  switch (kind) {
  case 'error': return 'tw-border-red-500';
  case 'success': return 'tw-border-green-500';
  case 'info': return 'tw-border-blue-500';
  case 'warning': return 'tw-border-yellow-500';
  default:
    return 'white';
  }
}

export function ToastWrapper(props) {
  const { notification, onClearNotification } = props;
  const [showA, setShowA] = useState(true);
  // const toggleShowA = () => setShowA(!showA);
  const toggleShowA = () => onClearNotification(notification);

  return (
    <Toast
      show={showA}
      onClose={toggleShowA}
      className={classNames('tw-border-l-4 tw-border-r-0 tw-border-t-0 tw-border-b-0 tw-rounded-none tw-bg-white',
        kindToColor(notification.kind))}
    >
      <Toast.Header>
        {/* <img
          src="holder.js/20x20?text=%20"
          className="rounded mr-2"
          alt=""
        /> */}
        <strong className="tw-mr-auto">{notification.title}</strong>

      </Toast.Header>
      <Toast.Body style={{ padding: '0.5rem 0.75rem' }}>{notification.message}</Toast.Body>
      <div style={{ padding: '0.5rem 0.75rem' }}>
        <small>{moment(new Date()).format('D MMM YYYY HH:mm:ss')}</small>
      </div>
    </Toast>
  );
}

// ToastWrapper.propTypes = ToastWrapperPropTypes;
