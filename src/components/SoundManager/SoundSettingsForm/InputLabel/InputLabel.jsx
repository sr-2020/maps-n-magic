import React from 'react';
import './InputLabel.css';

// import { InputLabelPropTypes } from '../../types';

export function InputLabel(props) {
  const { t, translationKey, htmlFor } = props;

  return (
    <label
      className="InputLabel block text-gray-700 text-sm font-bold mb-2"
      htmlFor={htmlFor}
    >
      {t(translationKey)}
    </label>
  );
}

// InputLabel.propTypes = InputLabelPropTypes;
