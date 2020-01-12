import React, { Component } from 'react';
import './DownloadDatabaseButton.css';

import Dropdown from 'react-bootstrap/Dropdown';

// import { DownloadDatabaseButtonPropTypes } from '../../types';

export function DownloadDatabaseButton(props) {
  const {
    t, onClick,
  } = props;
  return (
    <Dropdown.Item
      as="button"
      type="button"
      data-original-title=""
      onClick={onClick}
      title={t('downloadDatabase')}
      className="py-3 text-xl"
    >
      {t('downloadDatabase')}
    </Dropdown.Item>
  );
}
