import fetch from 'isomorphic-fetch';

export async function getUserTokenData(login: string, password: string) {
  return await fetch('https://gateway.evarun.ru/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      login,
      password,
      "rememberMe": false
    })
  });
}