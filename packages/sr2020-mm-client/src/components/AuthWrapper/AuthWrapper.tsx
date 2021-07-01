import React, { PropsWithChildren } from 'react';
import { WithLoginState } from '../../dataHOCs';
import { LoginManager } from '../../utils';
import { LoginPage } from '../LoginPage';
import './AuthWrapper.css';

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

type AuthWrapperProps = PropsWithChildren<WithLoginState & {
  loginManager: LoginManager;
}>;

export function AuthWrapper(props: AuthWrapperProps) {
  const { loginState, loginManager, children } = props;

 
  if (loginState.status === 'unknown') {
    loginManager.updateLoginState(true);
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Загрузка...</span>
      </Spinner>
    );
  }
  
  if (loginState.status === 'loading') {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Загрузка...</span>
      </Spinner>
    );
  }
  
  if (loginState.status === 'error' || loginState.status === 'userUnlogged') {
    return <LoginPage loginManager={loginManager} />
  }

  return children;
}



