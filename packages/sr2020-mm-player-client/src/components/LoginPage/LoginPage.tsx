import React, { useState, FormEvent } from 'react';
import './LoginPage.css';
import { callSecureApi, loginUser } from "../../api";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface LoginPageProps {
  updateLoginState: () => void;
}

export function LoginPage(props: LoginPageProps) {
  const { updateLoginState } = props;
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const token = 
    const res = await loginUser({
      username,
      password
    });
    if (res.status === 200) {
      updateLoginState();
    } else {
      setErrorMsg(`${res.status} ${res.text}`);
    }
  }

  return (
    <div className="LoginPage">
      <img alt="logo" src="logo-sr.png" className="tw-my-8"></img>
      <div className="tw-flex tw-flex-col tw-w-full tw-px-8">

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicLogin">
            <Form.Label>Логин</Form.Label>
            <Form.Control type="text" onChange={e => {
              setUserName(e.target.value);
              setErrorMsg('');
            }}/>
            <Form.Text className="text-muted">
              id профиля JoinRPG
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" onChange={e => {
              setPassword(e.target.value);
              setErrorMsg('');
            }}/>
            <Form.Text className="text-muted">
              пин код из заявки / пароль мастера
            </Form.Text>
          </Form.Group>
          {
            errorMsg !== '' && (
              <Alert className="tw-ml-8" variant="warning">
                {errorMsg}
              </Alert>
            )
          }
          <Button variant="primary" type="submit" className="tw-w-full">
            Войти
          </Button>
        </Form>
      </div>

      {/* <Button 
        onClick={callSecureApi}
      >
        Запрос на защищенный эндпоинт
      </Button> */}
    </div>
  );
}



