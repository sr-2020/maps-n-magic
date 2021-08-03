import React, { useState, FormEvent } from 'react';
import './LoginPage.css';
import { loginUser } from "../../api";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ErrorResponse, isErrorResponse } from 'sr2020-mm-event-engine';

import { ErrorAlert } from "../ErrorAlert";
import { LoginManager } from '../../utils';

interface LoginPageProps {
  loginManager: LoginManager;
}

export function LoginPage(props: LoginPageProps) {
  const { loginManager } = props;
  const { loginState } = loginManager;
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<ErrorResponse | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await loginUser({
      username,
      password
    });
    if (isErrorResponse(res)) {
      setErrorMsg(res);
    } else {
      loginManager.updateLoginState();
    }
  }

  return (
    <div className="LoginPage tw-flex tw-flex-col tw-items-center tw-mx-auto">
      <img alt="logo" src="logo-sr.png" className="tw-my-8"></img>
      <div className="tw-flex tw-flex-col tw-w-full tw-px-8">

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicLogin">
            <Form.Label>Логин</Form.Label>
            <Form.Control type="text" onChange={e => {
              setUserName(e.target.value);
              setErrorMsg(null);
            }}/>
            <Form.Text className="text-muted">
              id профиля JoinRPG
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" onChange={e => {
              setPassword(e.target.value);
              setErrorMsg(null);
            }}/>
            <Form.Text className="text-muted">
              пин код из заявки / пароль мастера
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" className="tw-w-full">
            Войти
          </Button>
        </Form>
      </div>
      {
        errorMsg !== null && (
          <ErrorAlert className="tw-m-4" errorResponse={errorMsg} />
        )
      }
      {
        loginState.status === 'error' && (
          <ErrorAlert className="tw-m-4" errorResponse={loginState.errorResponse} />
        )
      }

      {/* <Button 
        onClick={callSecureApi}
      >
        Запрос на защищенный эндпоинт
      </Button> */}
    </div>
  );
}



