import React, { ChangeEventHandler } from 'react';
import './TimeoutInput.css';
import { useTranslation } from "react-i18next";
import { SRTKey } from "sr2020-mm-client-core";

import classNames from 'classnames';

interface TimeoutInputProps {
  inputId: string;
  value: number;
  incrementKey: SRTKey;
  decrementKey: SRTKey;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function TimeoutInput(props: TimeoutInputProps) {
  const {
    value, onChange, onIncrement, onDecrement, inputId, incrementKey, decrementKey,
  } = props;
  const { t } = useTranslation();

  const common = 'tw-w-1/3 tw-font-bold tw-py-2 tw-px-4 focus:tw-outline-none focus:tw-shadow-outline';
  const selectedButton = 'tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white';
  return (
    <div className="TimeoutInput tw-flex">
      <input
        className="tw-flex-auto tw-min-w-0 tw-shadow
          tw-appearance-none tw-border tw-rounded
          tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight
          focus:tw-outline-none focus:tw-shadow-outline"
        id={inputId}
        type="number"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className={classNames(common, selectedButton, 'tw-ml-2 tw-flex-auto')}
        onClick={onDecrement}
      >
        {t(decrementKey)}
      </button>
      <button
        type="button"
        className={classNames(common, selectedButton, 'tw-ml-2 tw-flex-auto')}
        onClick={onIncrement}
      >
        {t(incrementKey)}
      </button>
    </div>
  );
}
