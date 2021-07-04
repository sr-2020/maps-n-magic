import React from 'react';
import './UploadDatabaseButton.css';

import Dropdown from 'react-bootstrap/Dropdown';

// @ts-ignore
function uploadDatabaseFile(evt) {
  const input = evt.target.querySelector('input');
  if (input) {
    input.value = '';
    input.click();
  }
}

// @ts-ignore
export function UploadDatabaseButton(props) {
  const { t, onChange } = props;

  return (
    <Dropdown.Item
      as="button"
      type="button"
      data-original-title=""
      title={t('uploadDatabase')}
      onClick={uploadDatabaseFile}
      className="tw-py-3 tw-text-lg"
    >
      <input
        type="file"
        className="tw-hidden"
        tabIndex={-1}
        onChange={onChange}
      />
      {t('uploadDatabase')}
    </Dropdown.Item>
  );
}
