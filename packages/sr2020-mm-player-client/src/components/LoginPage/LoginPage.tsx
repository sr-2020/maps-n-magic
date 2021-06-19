import React, { useState, FormEvent } from 'react';
import './LoginPage.css';
import { callSecureApi, loginUser } from "../../api";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

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
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Логин</p>
          <input type="text" onChange={e => {
            setUserName(e.target.value);
            setErrorMsg('');
          }}/>
        </label>
        <label>
          <p>Пароль</p>
          <input type="password" onChange={e => {
            setPassword(e.target.value);
            setErrorMsg('');
          }}/>
        </label>
        <div>
          <button type="submit">Войти</button>
        </div>
        {
          errorMsg !== '' && (
            <Alert className="tw-ml-8" variant="warning">
              {errorMsg}
            </Alert>
          )
        }
      </form>
      <Button 
        onClick={callSecureApi}
      >
        Запрос на защищенный эндпоинт
      </Button>
    </div>
  );
}



