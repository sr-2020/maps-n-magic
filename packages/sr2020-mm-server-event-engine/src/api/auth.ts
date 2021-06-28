import fetch from 'isomorphic-fetch';
import { playerServerConstants } from './constants';

export async function getUserTokenData(login: string, password: string) {
  return await fetch(playerServerConstants().loginUrl, {
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