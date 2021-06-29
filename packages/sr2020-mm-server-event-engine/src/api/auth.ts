import fetch from 'isomorphic-fetch';
import { genericServerConstants } from './constants';

export async function getUserTokenData(login: string, password: string) {
  return await fetch(genericServerConstants().loginUrl, {
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