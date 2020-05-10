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
      className="tw-py-3 tw-text-lg"
    >
      {t('downloadDatabase')}
    </Dropdown.Item>
  );
}
