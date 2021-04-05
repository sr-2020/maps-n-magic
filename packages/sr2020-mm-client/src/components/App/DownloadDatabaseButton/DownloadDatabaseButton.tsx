import React, { Component } from 'react';
import './DownloadDatabaseButton.css';

import Dropdown from 'react-bootstrap/Dropdown';
import { WithTranslation } from 'react-i18next';

interface DownloadDatabaseButtonProps extends WithTranslation {
  onClick: (e: React.MouseEvent) => void;
};

export function DownloadDatabaseButton(props: DownloadDatabaseButtonProps) {
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
