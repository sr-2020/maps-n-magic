import React, { PropsWithChildren } from 'react';
import { WithTranslation } from 'react-i18next';

import { WithLoginState } from '../../dataHOCs';
import { LoginManager } from '../../utils';
import { LoginPage } from '../LoginPage';
import './AuthWrapper.css';

import Spinner from "react-bootstrap/Spinner";

type AuthWrapperProps = PropsWithChildren<WithLoginState & WithTranslation & {
  loginManager: LoginManager;
}>;

export function AuthWrapper(props: AuthWrapperProps) {
  const { loginState, loginManager, children, t } = props;
 
  if (loginState.status === 'unknown') {
    loginManager.updateLoginState(true);
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">{t('loading')}</span>
      </Spinner>
    );
  }
  
  if (loginState.status === 'loading') {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">{t('loading')}</span>
      </Spinner>
    );
  }
  
  if (loginState.status === 'error' || loginState.status === 'userUnlogged') {
    return <LoginPage loginManager={loginManager} />
  }

  return children;
}



