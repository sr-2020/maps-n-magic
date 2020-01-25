import React from 'react';
import './TimeoutInput.css';

import classNames from 'classnames';

// import { TimeoutInputPropTypes } from '../../types';

export function TimeoutInput(props) {
  const {
    t, value, onChange, onIncrement, onDecrement, inputId, incrementKey, decrementKey,
  } = props;

  const common = 'w-33p font-bold py-2 px-4 focus:outline-none focus:shadow-outline';
  const selectedButton = 'bg-blue-500 hover:bg-blue-700 text-white';
  return (
    <div className="TimeoutInput flex">
      <input
        className="flex-auto min-w-0 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={inputId}
        type="number"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className={classNames(common, selectedButton, 'ml-2 flex-auto')}
        onClick={onDecrement}
      >
        {t(decrementKey)}
      </button>
      <button
        type="button"
        className={classNames(common, selectedButton, 'ml-2 flex-auto')}
        onClick={onIncrement}
      >
        {t(incrementKey)}
      </button>
    </div>
  );
}

// TimeoutInput.propTypes = TimeoutInputPropTypes;
