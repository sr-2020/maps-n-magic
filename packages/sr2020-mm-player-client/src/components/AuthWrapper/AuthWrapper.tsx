import React, { PropsWithChildren } from 'react';
import { WithLoginState } from '../../hocs';
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

  if (loginState.status === 'error') {
    return (
      <>
        <div>Ошибка при подключении к серверу</div>
        <Button 
          onClick={loginManager.slowUpdateLoginState}
        >
          Повторить попытку
        </Button>
      </>
    );
  }
  
  if (loginState.status === 'unknown') {
    loginManager.updateLoginState();
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
  
  if (loginState.status === 'userUnlogged') {
    return <LoginPage updateLoginState={loginManager.updateLoginState} />
  }

  return children;
}



