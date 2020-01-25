import React from 'react';
import './TimeoutInput.css';

import classNames from 'classnames';

// import { TimeoutInputPropTypes } from '../../types';

export function TimeoutInput(props) {
  const {
    t, value, onChange, onIncrement, onDecrement, inputId,
  } = props;

  const common = 'w-33p font-bold py-2 px-4 focus:outline-none focus:shadow-outline';
  const selectedButton = 'bg-blue-500 hover:bg-blue-700 text-white';
  return (
    <div className="TimeoutInput flex">
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={inputId}
        type="number"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className={classNames(common, selectedButton, 'ml-2')}
        onClick={onDecrement}
      >
        {t('decrementSoundTimeout')}
      </button>
      <button
        type="button"
        className={classNames(common, selectedButton, 'ml-2')}
        onClick={onIncrement}
      >
        {t('incrementSoundTimeout')}
      </button>
    </div>
  );
}

// TimeoutInput.propTypes = TimeoutInputPropTypes;
