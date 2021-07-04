import React from 'react';
import './ErrorAlert.css';

import Alert from "react-bootstrap/Alert";

import { ErrorResponse } from 'sr2020-mm-event-engine';
import classNames from 'classnames';

interface ErrorAlertProps {
  errorResponse: ErrorResponse;
  className?: string;
}

export function ErrorAlert(props: ErrorAlertProps) {
  const { errorResponse, className } = props;

  return (
    <Alert className={classNames("ErrorAlert", className)} variant="warning">
      <div className="tw-font-bold tw-break-all">{errorResponse.errorTitle}</div>
      <div className="tw-break-all">{errorResponse.errorSubtitle}</div>
    </Alert>
  );
}
