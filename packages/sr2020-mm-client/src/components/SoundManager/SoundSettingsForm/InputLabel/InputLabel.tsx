import React from 'react';
import './InputLabel.css';
import { useTranslation } from "react-i18next";
import { SRTKey } from "sr2020-mm-client-core";

interface InputLabelProps {
  htmlFor: string;
  translationKey: SRTKey;
}

export function InputLabel(props: InputLabelProps) {
  const { translationKey, htmlFor } = props;
  const { t } = useTranslation();

  return (
    <label
      className="InputLabel tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
      htmlFor={htmlFor}
    >
      {t(translationKey)}
    </label>
  );
}
