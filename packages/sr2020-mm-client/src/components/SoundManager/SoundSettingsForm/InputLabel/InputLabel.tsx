import React from 'react';
import './InputLabel.css';

// import { InputLabelPropTypes } from '../../types';

export function InputLabel(props) {
  const { t, translationKey, htmlFor } = props;

  return (
    <label
      className="InputLabel tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
      htmlFor={htmlFor}
    >
      {t(translationKey)}
    </label>
  );
}

// InputLabel.propTypes = InputLabelPropTypes;
